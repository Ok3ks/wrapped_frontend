/**
 * Fake chat server — DEVELOPMENT ONLY.
 *
 * This is the *only* file that contains canned responses and plot data. It is
 * completely isolated from the client: it exposes `fakeChatFetch`, a drop-in for
 * the browser `fetch` that answers requests with the exact same wire format the
 * real backend will use — the Vercel AI Data Stream (UI message stream) protocol
 * that pydantic-ai emits via its `VercelAIAdapter`.
 *
 * The client (`chatClient.ts`, `chat-widget.tsx`) never imports anything from
 * here except through the transport's `fetch` hook, so replacing this with the
 * real backend is a one-line change in `chatClient.ts` — see `USE_FAKE_CHAT`.
 */
import {
    createUIMessageStream,
    createUIMessageStreamResponse,
    type UIMessage,
} from 'ai'

// ── Request parsing ──────────────────────────────────────────────────────────

function readBody(init?: RequestInit): { messages: UIMessage[] } {
    const raw = init?.body
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw)
        } catch {
            return { messages: [] }
        }
    }
    return { messages: [] }
}

function latestUserText(messages: UIMessage[]): string {
    for (let i = messages.length - 1; i >= 0; i--) {
        const m = messages[i]
        if (m.role !== 'user') continue
        return m.parts
            .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map((p) => p.text)
            .join(' ')
            .trim()
    }
    return ''
}

// ── Fake visualization plots (SVG → data URL) ────────────────────────────────
// The real backend returns `.png` URLs; here we synthesize an SVG bar chart in
// the app's gold/surface palette and stream it as an image file part.

type Bar = { label: string; value: number }

function plotDataUrl(title: string, series: Bar[]): string {
    const width = 480
    const height = 240
    const pad = 36
    const max = Math.max(...series.map((s) => s.value), 1)
    const slot = (width - pad * 2) / series.length

    const bars = series
        .map((s, i) => {
            const h = Math.round((s.value / max) * (height - pad * 2))
            const x = pad + i * slot + slot * 0.15
            const w = slot * 0.7
            const y = height - pad - h
            return `<rect x="${x.toFixed(1)}" y="${y}" width="${w.toFixed(1)}" height="${h}" fill="#ffd700" opacity="0.85" rx="2"/>
<text x="${(x + w / 2).toFixed(1)}" y="${height - pad + 15}" fill="#8b90a8" font-size="11" font-family="monospace" text-anchor="middle">${s.label}</text>
<text x="${(x + w / 2).toFixed(1)}" y="${y - 6}" fill="#f0f2ff" font-size="11" font-family="monospace" text-anchor="middle">${s.value}</text>`
        })
        .join('')

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
<rect width="${width}" height="${height}" fill="#22263a"/>
<text x="${pad}" y="24" fill="#f0f2ff" font-size="14" font-family="monospace" font-weight="700">${title}</text>
<line x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}" stroke="#ffd70044"/>
${bars}
</svg>`

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// ── Canned answers ───────────────────────────────────────────────────────────

type Answer = { markdown: string; plot?: { title: string; series: Bar[] } }

function answerFor(prompt: string): Answer {
    const q = prompt.toLowerCase()

    if (q.includes('captain')) {
        return {
            markdown: `Based on fixtures and expected points, here are the top **captaincy** picks this gameweek:

| Player | Team | xPts | Owned |
| --- | --- | ---: | ---: |
| **M. Salah** | LIV | 8.4 | 62% |
| **E. Haaland** | MCI | 7.9 | 71% |
| **C. Palmer** | CHE | 6.8 | 38% |

**Recommendation:** Salah edges it on a favourable home fixture and set-piece threat.`,
            plot: {
                title: 'Projected captain points',
                series: [
                    { label: 'Salah', value: 8.4 },
                    { label: 'Haaland', value: 7.9 },
                    { label: 'Palmer', value: 6.8 },
                    { label: 'Saka', value: 6.1 },
                ],
            },
        }
    }

    if (q.includes('rank') || q.includes('progression')) {
        return {
            markdown: `Here's your overall **rank progression** so far — lower is better 📈

You've climbed **~515k places** since GW1, driven mostly by strong captaincy and a well-timed Bench Boost.`,
            plot: {
                title: 'Overall rank (000s)',
                series: [
                    { label: 'GW1', value: 820 },
                    { label: 'GW2', value: 640 },
                    { label: 'GW3', value: 510 },
                    { label: 'GW4', value: 430 },
                    { label: 'GW5', value: 305 },
                ],
            },
        }
    }

    if (q.includes('differential') || q.includes('ownership') || q.includes('under')) {
        return {
            markdown: `Strong **differentials** (sub-10% ownership) with rising form:

- **B. Mbeumo** (BRE) — 4 attacking returns in 5, 8.1% owned
- **A. Isak** (NEW) — kind run of fixtures, 9.4% owned
- **P. Sarr** (CRY) — nailed, on set pieces, 3.2% owned

These differentiate you from the template without excessive risk.`,
        }
    }

    if (q.includes('compare') || q.includes(' vs ') || q.includes('versus')) {
        return {
            markdown: `Head-to-head over the last 6 gameweeks:

| Metric | Salah | Palmer |
| --- | ---: | ---: |
| Points | 54 | 47 |
| xGI | 5.2 | 4.6 |
| Bonus | 9 | 7 |

Salah has the higher floor and ceiling; Palmer offers similar output at lower price and ownership.`,
            plot: {
                title: 'Points, last 6 GWs',
                series: [
                    { label: 'Salah', value: 54 },
                    { label: 'Palmer', value: 47 },
                ],
            },
        }
    }

    return {
        markdown: `Here's what I found for **"${prompt}"**.

I'm the FPL assistant. Once connected to the live backend I'll answer with real data, tables and visualization plots. Try asking:

- _Who should I captain this gameweek?_
- _Show my rank progression_
- _Best differentials under 10% ownership_`,
    }
}

// ── Streaming helpers ────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

// Split into whitespace-preserving chunks (~3 tokens) to simulate token streaming.
function chunkText(text: string): string[] {
    const tokens = text.match(/\S+\s*/g) ?? [text]
    const chunks: string[] = []
    for (let i = 0; i < tokens.length; i += 3) {
        chunks.push(tokens.slice(i, i + 3).join(''))
    }
    return chunks
}

/**
 * Drop-in `fetch` that answers chat requests with a Vercel AI UI message stream.
 * Wire it into the transport in `chatClient.ts`.
 */
export const fakeChatFetch: typeof fetch = async (_input, init) => {
    const { messages } = readBody(init)
    const answer = answerFor(latestUserText(messages))

    const stream = createUIMessageStream({
        async execute({ writer }) {
            writer.write({ type: 'start' })

            const textId = 'text-1'
            writer.write({ type: 'text-start', id: textId })
            for (const delta of chunkText(answer.markdown)) {
                writer.write({ type: 'text-delta', id: textId, delta })
                await delay(24)
            }
            writer.write({ type: 'text-end', id: textId })

            if (answer.plot) {
                await delay(150)
                writer.write({
                    type: 'file',
                    // Real backend sends `image/png`; the SVG data URL is fake-only.
                    mediaType: 'image/svg+xml',
                    url: plotDataUrl(answer.plot.title, answer.plot.series),
                })
            }

            writer.write({ type: 'finish' })
        },
    })

    return createUIMessageStreamResponse({ stream })
}
