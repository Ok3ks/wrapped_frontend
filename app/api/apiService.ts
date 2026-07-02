import createClient from 'openapi-fetch'
import type { Season } from '~/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

let cachedToken: string | null = null
let tokenExpiry = 0
const TOKEN_REFRESH_BUFFER_MS = 60_000

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const res = await fetch(`${API_BASE_URL}/api/token/`)
  if (!res.ok) throw new Error('Failed to obtain API token')
  const { token, expires_in } = await res.json() as { token: string; expires_in: number }
  cachedToken = token
  tokenExpiry = Date.now() + (expires_in * 1000) - TOKEN_REFRESH_BUFFER_MS
  return token
}

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken()
  return { 'X-API-Key': token }
}

export async function handleResponse<T>(promise: Promise<any>): Promise<T> {
    const { data, error, response } = await promise
    if (!response) {
      throw new Error(error?.message || 'Network error')
    }

    if (error) {
      throw new Error(`API Error (${response.status}): ${String(error)}`)
    }
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    return data as T
  }


export const restService = {
    seasonParticipantReport: async (season: string, entryId: string) => {
      const query = `
      query Report($season: String!, $entryId: Int!) {
        seasonParticipantReport(season: $season, entryId: $entryId)
        {
          rank {
            event
            points
            totalPoints
            rank
            rankSort
            overallRank
            percentileRank
            bank
            value
            eventTransfers
            eventTransfersCost
            pointsOnBench
          }
          nTransfers
          totalPointsGained {
            totalPoints
            gw
          }
          captainPoints {
            gw
            finalCaptainGameweekScore
            captainFixture {
              gameweek
              homeGoals
              awayGoals
              home
              away
            }
            viceCaptainFixture {
              gameweek
              homeGoals
              awayGoals
              home
              away
            }
            activeChip
            captainPlayerName
            viceCaptainPlayerName
            captainGameweekScore
            viceCaptainGameweekScore
            captainMinutes
            viceCaptainMinutes
          }
          transferPointsGained {
            freehit {
              transferPointDelta
              gw
            }
            wildcard {
              transferPointDelta
              gw
            }
            bboost {
              transferPointDelta
              gw
            }
            min {
              transferPointDelta
              gw
            }
            max {
              transferPointDelta
              gw
            }
            tripleCap {
              transferPointDelta
              gw
            }
          }
          rank {
            event
            points
            totalPoints
            rank
            rankSort
            overallRank
            percentileRank
            bank
            value
            eventTransfers
            eventTransfersCost
            pointsOnBench
          }
        }
      }
    `;

      const auth = await authHeaders()
      const response = await
        fetch(`${API_BASE_URL}/graphql/`, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
            ...auth,
          },
          cache: 'reload',
          body: JSON.stringify({
              query,
                operationName:"Report",
                variables: {
                  season: season,
                  entryId: parseInt(entryId, 10),
                }
            } as Record<string, unknown>,
        )})
      
      return response
    },
}

export const apiClient = createClient({
    baseUrl: API_BASE_URL,
    fetch: (async (url: RequestInfo | URL, options?: RequestInit) => {
      const auth = await authHeaders()
      return fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...(options?.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options?.headers as Record<string, string> | undefined)),
          'Content-Type': 'application/json',
          ...auth,
        },
      })
    }) as typeof globalThis.fetch,
  })


export class ApiError extends Error {
    code?: string
    status?: number
    constructor(message: string, code?: string, status?: number) {
      super(message)
      this.code = code
      this.status = status
    }
}