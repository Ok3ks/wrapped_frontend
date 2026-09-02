/**
 * Chat transport configuration — the single swap point between the fake
 * development server and the real backend.
 *
 * The client speaks the Vercel AI Data Stream protocol via `useChat`. During
 * development we hand the transport a custom `fetch` (`fakeChatFetch`) that
 * answers locally. To go live, set `VITE_USE_FAKE_CHAT=false` and point
 * `VITE_CHAT_API_URL` at the pydantic-ai `VercelAIAdapter` endpoint — no client
 * or UI code changes.
 */
import { DefaultChatTransport } from 'ai'
import { fakeChatFetch } from './fakeChatServer'

export const CHAT_API_URL: string =
    import.meta.env.VITE_CHAT_API_URL ?? '/api/chat'

// Fake server is on unless explicitly disabled.
export const USE_FAKE_CHAT: boolean =
    import.meta.env.VITE_USE_FAKE_CHAT !== 'false'

export function createChatTransport() {
    return new DefaultChatTransport({
        api: CHAT_API_URL,
        ...(USE_FAKE_CHAT ? { fetch: fakeChatFetch } : {}),
    })
}
