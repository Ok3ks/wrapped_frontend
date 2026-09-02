# Plan: FPL Assistant Chat Interface (Vercel AI SDK + isolated fake server)

## Context

The `mcp-frontend` branch prepares this FPL analytics SPA to talk to a
**pydantic-ai** backend. This task builds the **frontend chat surface**: a
horizontal search bar pinned to the bottom of the page that expands into a
right-hand **sidebar** when the user asks a question.

Confirmed direction from the user:
- **Real `fetch`, not a client-side mock.** The client makes a genuine HTTP
  request; a **fake server** in its own separate file answers it during
  development. Replacing it with the real backend is then trivial.
- **No hardcoded plots/texts in the client.** All canned responses/plots live
  exclusively in the fake-server file, never intertwined with client code.
- **Client-side orchestration uses the pydantic-ai TypeScript path.**
  Pydantic-ai natively serves the **Vercel AI Data Stream** protocol
  (`VercelAIAdapter`), so the chosen client is the **Vercel AI SDK**
  (`@ai-sdk/react` `useChat`) — the most TS-first option and headless, so it
  leaves our custom bar→sidebar UI fully to us.
- **Rendering**: assistant replies render as **markdown** and must support
  **images** (`.png` visualization plots) inline, plus tables/lists.

### Why this architecture makes the swap trivial
`useChat` posts to an endpoint and parses a UI-message SSE stream. Our **fake
server** produces that *exact same stream format* using the SDK's own
`createUIMessageStream` / `createUIMessageStreamResponse` helpers — identical to
what pydantic-ai's `VercelAIAdapter` emits. Swapping = point the transport at the
real endpoint and stop injecting the fake `fetch`. Client + UI code untouched.

## Key facts from research
- Vercel AI SDK: client `import { useChat } from '@ai-sdk/react'`; transport
  `import { DefaultChatTransport } from 'ai'`. `DefaultChatTransport({ api, fetch })`
  accepts a **custom `fetch`** — our interception point.
- `useChat` returns `{ messages, sendMessage, status, error, stop, regenerate }`.
  Input is **developer-managed** (`useState`). `status ∈ submitted|streaming|ready|error`.
- Messages carry a **`parts[]`** array: `{ type:'text', text }` and
  `{ type:'file', mediaType, url, filename? }`. Image plots = a `file` part with
  `mediaType: 'image/*'` and `url` (data URL for the fake; real `.png` URL later).
- Server/fake stream helpers (`ai`): `createUIMessageStream({ execute(writer){…} })`
  + `createUIMessageStreamResponse({ stream })`. Writer chunks: `text-start` /
  `text-delta` / `text-end`, `file`, `finish`.
- Existing stack: React Router v7 SPA; global chrome in `app/root.tsx` `App()`;
  gold/dark design tokens in `app/app.css` (`bg-surface`, `text-gold`,
  `border-gold-border`, `text-text-secondary`); shadcn primitives in
  `app/components/ui/`; `cn()` in `app/lib/utils.ts`. `react-markdown` +
  `remark-gfm` already installed.

## Implementation

### 0. Dependencies
Install `ai` and `@ai-sdk/react`. (No model/provider SDK on the client — the
backend/fake server does generation.) `react-markdown` + `remark-gfm` already present.

### 1. Fake server (fully isolated) — `app/api/fakeChatServer.ts` (new)
The **only** place canned data lives. Exports `fakeChatFetch(input, init): Promise<Response>`:
- Parse the request body (the `useChat` payload → `messages`), read the latest
  user text.
- Keyword-driven canned answers (captain / rank / differentials / compare /
  default) — markdown with tables.
- Generate a plot as an SVG bar chart (gold/surface palette) → data URL, streamed
  as a **`file` part** (`mediaType:'image/svg+xml'`; real backend sends `image/png`).
- Build the response with `createUIMessageStream` (write `text-start` →
  chunked `text-delta`s to simulate token streaming → `text-end`; write the
  `file` part; `finish`) wrapped in `createUIMessageStreamResponse`.
- Small `setTimeout` delays between deltas for a realistic streaming feel.
- Header comment documenting how to delete this and point at the real
  pydantic-ai `VercelAIAdapter` endpoint.

### 2. Chat client/transport config — `app/api/chatClient.ts` (new)
Thin, data-free glue:
- `CHAT_API_URL` = `import.meta.env.VITE_CHAT_API_URL ?? '/api/chat'`.
- `USE_FAKE_CHAT` = `import.meta.env.VITE_USE_FAKE_CHAT !== 'false'` (default on).
- `export function createChatTransport()` → `new DefaultChatTransport({ api: CHAT_API_URL, fetch: USE_FAKE_CHAT ? fakeChatFetch : undefined })`.
- This is the single swap point; the widget imports only this.

### 3. Message renderer — `app/components/chat/chat-message.tsx` (new)
Renders one `UIMessage` by mapping `message.parts`:
- `text` → `ReactMarkdown` + `remarkGfm` with component overrides: `img`
  (`max-w-full`, bordered, rounded, lazy), `a` (new tab, gold), `table/th/td`
  (bordered, horizontally scrollable wrapper), `code/pre`, `ul/ol/p`.
- `file` with `mediaType` starting `image/` → styled `<img src={part.url}>`
  (the `.png`/plot visualizations).
- User vs assistant bubble styling (gold-tinted right vs surface left).
- Scoped `.chat-md` CSS block in `app/app.css` for list/table markers (Tailwind
  v4 preflight strips them).

### 4. Chat widget — `app/components/chat/chat-widget.tsx` (new)
Client component; the whole UX. Uses:
```ts
const { messages, sendMessage, status, error } = useChat({ transport: createChatTransport() });
const [input, setInput] = useState('');
const [open, setOpen] = useState(false);
```
- **Collapsed (default)**: horizontal pill search bar `fixed bottom-4
  left-1/2 -translate-x-1/2` (responsive width), gold border/glow, input + send.
  If a conversation exists, an expand affordance reopens the sidebar.
- **On submit**: `sendMessage({ text: input })`, `setOpen(true)`, clear input.
  `status` (`submitted`/`streaming`) drives a typing indicator; `error` renders
  an inline error bubble with a retry (`regenerate`).
- **Expanded**: right `fixed top-0 h-full w-[400px]` (full-width on mobile),
  `z-[60]`, slide-in via `transition-transform`. Header (title + close),
  auto-scrolling message list (empty state = suggested-prompt chips), input docked
  at footer. Bottom pill hides while open; mobile gets a click-catcher backdrop.
- A11y: labelled input, `aria-expanded`, Enter to send, Escape to close, autofocus on open.

### 5. Mount globally — `app/root.tsx`
Render `<ChatWidget/>` in `App()` after `<SiteFooter/>`. It's `fixed`, so it
overlays every route without disturbing layout.

### 6. Config docs — `.env.example`
Document `VITE_CHAT_API_URL` and `VITE_USE_FAKE_CHAT` (default fake on).

## Files
- New: `app/api/fakeChatServer.ts`, `app/api/chatClient.ts`,
  `app/components/chat/chat-widget.tsx`, `app/components/chat/chat-message.tsx`
- Edit: `app/root.tsx` (mount), `app/app.css` (markdown/animation CSS),
  `.env.example` (config)
- Deps: add `ai`, `@ai-sdk/react` to `package.json`

## Separation guarantee
- Client (`chat-widget`, `chat-message`, `chatClient`): zero canned text/plots —
  only rendering + a real `fetch` via the SDK transport.
- Fake data + plot generation: **only** in `fakeChatServer.ts`, behind the same
  HTTP/stream contract as the real pydantic-ai backend.

## Verification
1. `npm install`, then `npm run dev` → `localhost:5173`.
2. Horizontal search bar appears at the bottom on every route (`/`, `/report`, `/faq`).
3. Ask "Who should I captain this gameweek?" → sidebar slides in; user bubble,
   streaming/typing indicator, then an assistant reply that **streams text** and
   shows a **markdown table + an inline plot image** (file part).
4. Try "Show my rank progression" and a free-form question → plot renders; default
   guidance appears.
5. Verify empty-state prompts, auto-scroll, close/reopen (messages persist),
   Escape-to-close, mobile full-width layout.
6. Swap check: setting `VITE_USE_FAKE_CHAT=false` makes the client POST to
   `VITE_CHAT_API_URL` unchanged (confirms the fake server is cleanly removable).
7. `npm run typecheck` passes.

## Out of scope / follow-ups
- Real pydantic-ai `VercelAIAdapter` endpoint, auth, and frontend/tool calls —
  isolated to `chatClient.ts` + backend.
- Persisting chat history across reloads.
