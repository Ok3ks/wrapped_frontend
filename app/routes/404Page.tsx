import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-5 text-center">
      {/* Animated scoreboard-style 404 */}
      <div className="relative mb-8">
        <span className="font-sans text-[8rem] sm:text-[12rem] leading-none text-gold/10 select-none">
          404
        </span>
        <span className="absolute inset-0 flex items-center justify-center font-sans text-[8rem] sm:text-[12rem] leading-none text-gold animate-pulse">
          404
        </span>
      </div>

      <h1 className="font-sans font-normal text-2xl sm:text-4xl text-text-primary mb-3 uppercase tracking-wide">
        Page Not Found
      </h1>

      <p className="font-body text-sm sm:text-base text-text-secondary max-w-md mb-8">
        Looks like this page got a red card. It's been sent off and isn't coming back.
      </p>

      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gold-muted text-gold font-mono font-medium text-sm tracking-wide border border-gold-border hover:bg-gold-subtle hover:border-gold-border-hover transition-colors no-underline"
      >
        Back to Home
      </Link>
    </div>
  );
}
