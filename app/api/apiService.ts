import createClient from 'openapi-fetch'
import type { Season } from '~/types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

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

      const response = await
        fetch(`${API_BASE_URL}/graphql/`, {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
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
    fetch: ((url: RequestInfo | URL, options?: RequestInit) =>
      fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...(options?.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options?.headers as Record<string, string> | undefined)),
          'Content-Type': 'application/json',
          // 'X-CSRFToken': csrftoken() ?? '',
        },
      })) as typeof globalThis.fetch,
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