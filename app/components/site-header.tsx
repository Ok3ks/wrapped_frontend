import { Link, useLocation } from "react-router"
import { BarChart3, MoreVertical } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { to: "/", label: "Home"},
  { to: "/report", label: "Reports" },
  { to: "/faq", label: "FAQ"},
]

export function SiteHeader() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-gold-border">
      <div className="flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-none bg-gold flex items-center justify-center">
            <BarChart3 size={18} className="text-surface" />
          </div>
          <span className="text-text-primary font-sans font-normal text-base tracking-wide sm:text-lg">
            FPL <span className="text-gold">Wrapped</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden sm:flex items-center gap-2">
          {navLinks.map(({ to, label}) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-sm font-mono font-medium tracking-wide transition-colors no-underline
                  ${isActive
                    ? "bg-gold-muted text-gold"
                    : "text-text-secondary hover:text-text-primary hover:bg-gold-subtle"
                  }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile kebab menu */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 bg-transparent border-none cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <nav className="absolute right-0 top-full mt-1 z-50 bg-surface border border-gold-border shadow-lg min-w-[140px]">
                {navLinks.map(({ to, label }) => {
                  const isActive = location.pathname === to
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-mono font-medium tracking-wide transition-colors no-underline
                        ${isActive
                          ? "bg-gold-muted text-gold"
                          : "text-text-secondary hover:text-text-primary hover:bg-gold-subtle"
                        }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </nav>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
