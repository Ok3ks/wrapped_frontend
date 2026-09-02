import type { UIMessage } from 'ai'
import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Markdown element overrides so assistant answers match the gold/dark palette.
const markdownComponents: Components = {
    a: ({ node, ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline underline-offset-2 hover:text-gold-soft"
        />
    ),
    img: ({ node, ...props }) => (
        // Inline images embedded via markdown (assistant may also send them as
        // dedicated file parts — see below).
        <img {...props} loading="lazy" className="chat-img" alt={props.alt ?? ''} />
    ),
    table: ({ node, ...props }) => (
        <div className="data-table-scroll my-2">
            <table {...props} />
        </div>
    ),
}

function MarkdownBlock({ text }: { text: string }) {
    return (
        <div className="chat-md text-sm text-text-primary">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {text}
            </ReactMarkdown>
        </div>
    )
}

export function ChatMessage({ message }: { message: UIMessage }) {
    const isUser = message.role === 'user'

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[92%] px-3 py-2 text-sm border ${
                    isUser
                        ? 'bg-gold-muted border-gold-border text-text-primary'
                        : 'bg-surface-2 border-gold-border-subtle text-text-primary'
                }`}
            >
                {message.parts.map((part, i) => {
                    if (part.type === 'text') {
                        return isUser ? (
                            <p key={i} className="whitespace-pre-wrap break-words">
                                {part.text}
                            </p>
                        ) : (
                            <MarkdownBlock key={i} text={part.text} />
                        )
                    }

                    // Visualization plots arrive as image file parts (`.png` from
                    // the real backend; SVG data URL from the fake server).
                    if (part.type === 'file' && part.mediaType?.startsWith('image/')) {
                        return (
                            <img
                                key={i}
                                src={part.url}
                                alt={part.filename ?? 'FPL visualization'}
                                loading="lazy"
                                className="chat-img mt-2"
                            />
                        )
                    }

                    return null
                })}
            </div>
        </div>
    )
}
