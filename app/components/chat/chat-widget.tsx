import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChevronUp, RotateCcw, Send, Sparkles, X } from 'lucide-react'
import { createChatTransport } from '~/api/chatClient'
import { ChatMessage } from './chat-message'

const SUGGESTED_PROMPTS = [
    'Who should I captain this gameweek?',
    'Show my rank progression',
    'Best differentials under 10% ownership',
    'Compare Salah vs Palmer',
]

// Animated "assistant is typing" dots.
function TypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-3 py-2 w-fit bg-surface-2 border border-gold-border-subtle">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-gold typing-dot"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    )
}

type ComposerProps = {
    value: string
    onChange: (v: string) => void
    onSubmit: () => void
    busy: boolean
    autoFocus?: boolean
    className?: string
    leading?: React.ReactNode
}

function Composer({
    value,
    onChange,
    onSubmit,
    busy,
    autoFocus,
    className,
    leading,
}: ComposerProps) {
    return (
        <form
            className={`flex items-center gap-2 bg-surface border border-gold-border px-2 py-1.5 ${className ?? ''}`}
            onSubmit={(e) => {
                e.preventDefault()
                onSubmit()
            }}
        >
            {leading}
            <input
                autoFocus={autoFocus}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Ask the FPL assistant…"
                aria-label="Ask the FPL assistant"
                className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-secondary font-body"
            />
            <button
                type="submit"
                disabled={busy || value.trim() === ''}
                aria-label="Send message"
                className="shrink-0 grid place-items-center w-8 h-8 bg-gold text-surface transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-soft cursor-pointer"
            >
                <Send size={16} />
            </button>
        </form>
    )
}

export function ChatWidget() {
    const [transport] = useState(() => createChatTransport())
    const { messages, sendMessage, status, error, regenerate } = useChat({
        transport,
    })

    const [input, setInput] = useState('')
    const [open, setOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const busy = status === 'submitted' || status === 'streaming'
    // Show the typing indicator while awaiting the first assistant token.
    const awaitingReply =
        busy && messages[messages.length - 1]?.role === 'user'

    function submit(text: string) {
        const trimmed = text.trim()
        if (trimmed === '' || busy) return
        sendMessage({ text: trimmed })
        setInput('')
        setOpen(true)
    }

    // Auto-scroll to the newest content.
    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [messages, awaitingReply])

    // Escape closes the sidebar.
    useEffect(() => {
        if (!open) return
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [open])

    const hasHistory = messages.length > 0

    const emptyState = useMemo(
        () => (
            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4">
                <div className="grid place-items-center w-12 h-12 bg-gold-muted border border-gold-border">
                    <Sparkles size={22} className="text-gold" />
                </div>
                <div>
                    <h3 className="text-text-primary">FPL Assistant</h3>
                    <p className="text-text-secondary text-xs mt-1">
                        Ask about captains, transfers, ranks and differentials.
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-full">
                    {SUGGESTED_PROMPTS.map((p) => (
                        <button
                            key={p}
                            onClick={() => submit(p)}
                            className="text-left text-xs text-text-secondary bg-surface-2 border border-gold-border-subtle px-3 py-2 hover:text-text-primary hover:border-gold-border transition-colors cursor-pointer"
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        ),
        // submit is stable enough for this static list
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    )

    return (
        <>
            {/* ── Collapsed: horizontal search bar at the bottom ───────────── */}
            <div
                className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92vw] max-w-xl px-2 transition-all duration-300 ${
                    open
                        ? 'opacity-0 translate-y-4 pointer-events-none'
                        : 'opacity-100'
                }`}
            >
                <Composer
                    value={input}
                    onChange={setInput}
                    onSubmit={() => submit(input)}
                    busy={busy}
                    className="shadow-[var(--shadow-card),var(--shadow-gold)] rounded-none"
                    leading={
                        hasHistory ? (
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                aria-label="Open conversation"
                                className="shrink-0 grid place-items-center w-8 h-8 text-gold hover:bg-gold-subtle transition-colors cursor-pointer"
                            >
                                <ChevronUp size={16} />
                            </button>
                        ) : (
                            <span className="shrink-0 grid place-items-center w-8 h-8 text-gold">
                                <Sparkles size={16} />
                            </span>
                        )
                    }
                />
            </div>

            {/* ── Mobile backdrop ──────────────────────────────────────────── */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 sm:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden
                />
            )}

            {/* ── Expanded: chat sidebar ───────────────────────────────────── */}
            <aside
                aria-hidden={!open}
                className={`fixed top-0 right-0 z-[55] h-full w-full sm:w-[400px] bg-surface border-l border-gold-border flex flex-col shadow-[var(--shadow-card-hover)] transition-transform duration-300 ${
                    open ? 'translate-x-0' : 'translate-x-full pointer-events-none'
                }`}
            >
                {/* Header */}
                <header className="flex items-center justify-between px-4 py-3 border-b border-gold-border shrink-0">
                    <div className="flex items-center gap-2">
                        <Sparkles size={18} className="text-gold" />
                        <span className="text-text-primary font-sans tracking-wide">
                            FPL <span className="text-gold">Assistant</span>
                        </span>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        aria-label="Close chat"
                        className="grid place-items-center w-8 h-8 text-text-secondary hover:text-text-primary hover:bg-gold-subtle transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </header>

                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 gw-sidebar">
                    {!hasHistory ? (
                        emptyState
                    ) : (
                        <div className="flex flex-col gap-3">
                            {messages.map((m) => (
                                <ChatMessage key={m.id} message={m} />
                            ))}

                            {awaitingReply && <TypingIndicator />}

                            {error && (
                                <div className="flex flex-col items-start gap-2 px-3 py-2 bg-surface-2 border border-destructive/50">
                                    <p className="text-xs text-text-secondary">
                                        Something went wrong. Please try again.
                                    </p>
                                    <button
                                        onClick={() => regenerate()}
                                        className="inline-flex items-center gap-1.5 text-xs text-gold hover:text-gold-soft transition-colors cursor-pointer"
                                    >
                                        <RotateCcw size={13} /> Retry
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Docked composer */}
                <div className="p-3 border-t border-gold-border shrink-0">
                    <Composer
                        value={input}
                        onChange={setInput}
                        onSubmit={() => submit(input)}
                        busy={busy}
                        autoFocus={open}
                    />
                </div>
            </aside>
        </>
    )
}
