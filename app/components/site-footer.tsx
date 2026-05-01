import { HelpCircle, Link, Mail } from "lucide-react"
import { useNavigate } from "react-router"

export function SiteFooter() {
  const navigate = useNavigate()
  return (
    <footer className="bg-surface border-t border-gold-border">
      <div className=" flex items-center justify-between sm:flex-row sm:justify-between sm:px-6 sm:py-5">
      

          <a
            href="mailto:fplbps@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-gold transition-colors"
          >
          <div className="flex items-center gap-4 underline">
            <Mail size={18} />
            <p> Email</p>
          </div>
          </a>
          
          <div className="flex items-center gap-4 underline text-text-secondary hover:text-gold transition-colors"
                onClick={() => navigate("/faq")}>
            <HelpCircle size={18} /> FAQ
          </div>


        <p className="text-text-secondary text-xs sm:text-sm">
          2026 FPLWrapped
        </p>
      </div>

    </footer>
  )
}
