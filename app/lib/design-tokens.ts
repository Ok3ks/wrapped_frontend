// ─── Design Tokens ──────────────────────────────────────────
// Mailchimp-inspired design system using gold/black palette.
// Single source of truth for all design values in the app.
// CSS custom properties are defined in app.css — these JS tokens
// are for contexts where CSS vars can't reach (e.g. Chart.js).

// ─── Colors ─────────────────────────────────────────────────
export const colors = {
  // Brand
  gold: "#ffd700",
  goldSoft: "rgba(255, 215, 0, 0.6)",
  goldMuted: "rgba(255, 215, 0, 0.15)",
  goldSubtle: "rgba(255, 215, 0, 0.08)",
  goldBorder: "rgba(255, 215, 0, 0.3)",
  goldBorderSubtle: "rgba(255, 215, 0, 0.15)",
  goldBorderHover: "rgba(255, 215, 0, 0.5)",
  goldGlow: "rgba(255, 215, 0, 0.2)",

  // Surfaces (dark theme)
  surface: "#1a1d27",
  surface2: "#22263a",
  surfaceHover: "rgba(255, 215, 0, 0.06)",

  // Text
  textPrimary: "#f0f2ff",
  textSecondary: "#8b90a8",

  // Grid / Chrome
  gridLine: "rgba(255, 255, 255, 0.04)",
  dark: "#111318",

  // Semantic — data viz accents
  emerald: "rgba(52, 211, 153, 0.8)",
  emeraldMuted: "rgba(52, 211, 153, 0.2)",
  amber: "rgba(251, 191, 36, 0.8)",
  sky: "rgba(56, 189, 248, 0.8)",
  skyMuted: "rgba(56, 189, 248, 0.2)",
  rose: "rgba(251, 113, 133, 0.8)",
  roseMuted: "rgba(251, 113, 133, 0.2)",
} as const

// ─── Typography ─────────────────────────────────────────────
export const typography = {
  fontFamily: {
    display: "'oskar-one-light', sans-serif",
    ui: "'Orbitron', sans-serif",
    body: "'Space Grotesk', sans-serif",
  },
  fontSize: {
    xs: "0.75rem",    // 12px
    sm: "0.875rem",   // 14px
    base: "1rem",     // 16px
    lg: "1.125rem",   // 18px
    xl: "1.25rem",    // 20px
    "2xl": "1.5rem",  // 24px
    "3xl": "1.875rem",// 30px
    "4xl": "2.25rem", // 36px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    base: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tight: "-0.01em",
    normal: "0",
    wide: "0.05em",
    wider: "0.08em",
  },
} as const

// ─── Spacing (6px baseline grid, 8 levels) ─────────────────
export const spacing = {
  lv1: "6px",
  lv2: "12px",
  lv3: "18px",
  lv4: "24px",
  lv5: "30px",
  lv6: "36px",
  lv7: "48px",
  lv8: "60px",
} as const

// ─── Border Radii ───────────────────────────────────────────
export const radii = {
  sm: "0",
  md: "0",
  lg: "0",
  xl: "0",
  full: "0",
} as const

// ─── Shadows ────────────────────────────────────────────────
export const shadows = {
  card: "0 4px 24px rgba(0, 0, 0, 0.35)",
  cardHover: "0 8px 40px rgba(0, 0, 0, 0.45)",
  gold: "0 4px 20px rgba(255, 215, 0, 0.06)",
  goldHover: "0 12px 40px rgba(255, 215, 0, 0.1)",
  goldRing: "0 0 0 1px rgba(255, 215, 0, 0.4)",
} as const

// ─── Transitions ────────────────────────────────────────────
export const transitions = {
  fast: "150ms ease",
  base: "300ms ease",
  slow: "500ms ease",
} as const

// ─── Chart.js shared options ────────────────────────────────
export const chartTheme = {
  plugins: {
    legend: {
      labels: {
        color: colors.textSecondary,
        font: { family: typography.fontFamily.body, size: 11 },
        boxWidth: 10,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: colors.surface2,
      titleColor: colors.gold,
      bodyColor: colors.textPrimary,
      borderColor: colors.goldBorderSubtle,
      borderWidth: 1,
      padding: 10,
      titleFont: { family: typography.fontFamily.ui, size: 12, weight: "600" as const },
      bodyFont: { family: typography.fontFamily.body, size: 11 },
    },
  },
  scales: {
    x: {
      ticks: { color: colors.textSecondary, font: { family: typography.fontFamily.body, size: 10 } },
      grid: { color: colors.gridLine },
      border: { color: colors.goldBorderSubtle },
    },
    y: {
      ticks: { color: colors.textSecondary, font: { family: typography.fontFamily.body, size: 10 } },
      grid: { color: colors.gridLine },
      border: { color: colors.goldBorderSubtle },
    },
  },
} as const
