import { Link, useLocation } from "react-router"
import { BarChart3, FileBarChart, HelpCircle } from "lucide-react"

const navLinks = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/report", label: "Reports", icon: FileBarChart },
  { to: "/faq", label: "FAQ", icon: HelpCircle },
]

export function SiteHeader() {
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-gold-border">
      <div className="flex items-center justify-between px-3 py-2 sm:px-6 sm:py-3">
        {/* Logo / Brand */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-none bg-gold flex items-center justify-center">
            <BarChart3 size={18} className="text-surface" />
          </div>
          <span className="text-text-primary font-bold text-base tracking-wide sm:text-lg">
            FPL <span className="text-gold">Wrapped</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-sm font-medium transition-colors no-underline
                  ${isActive
                    ? "bg-gold-muted text-gold"
                    : "text-text-secondary hover:text-text-primary hover:bg-gold-subtle"
                  }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
