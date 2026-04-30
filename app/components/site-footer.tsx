import { Github } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-gold-border">
      <div className="flex flex-col items-center gap-3 px-3 py-4 sm:flex-row sm:justify-between sm:px-6 sm:py-5">
        <p className="text-text-secondary text-xs sm:text-sm">
          FPL Wrapped — Fantasy Premier League Dashboard
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Ok3ks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-gold transition-colors"
          >
            <Github size={18} />
          </a>
          <span className="text-text-secondary text-xs">
            Built with React Router &amp; Tailwind
          </span>
        </div>
      </div>
    </footer>
  )
}
