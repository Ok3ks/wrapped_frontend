// ── Team colours map ─────────────────────────────────────────

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { Players } from "~/types"

const GOLD        = "#ffd700"
const GOLD_MUTED  = "rgba(255,215,0,0.15)"
const GOLD_SOFT   = "rgba(255,215,0,0.6)"
const SURFACE     = "#1a1d27"
const SURFACE_2   = "#22263a"
const TEXT_PRI    = "#f0f2ff"
const TEXT_SEC    = "#8b90a8"
const EMERALD     = "rgba(52,211,153,0.8)"
const EMERALD_MUT = "rgba(52,211,153,0.2)"
const AMBER       = "rgba(251,191,36,0.8)"
const SKY         = "rgba(56,189,248,0.8)"
const SKY_MUT     = "rgba(56,189,248,0.2)"
const ROSE        = "rgba(251,113,133,0.8)"
const ROSE_MUT    = "rgba(251,113,133,0.2)"

const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: TEXT_SEC,
        font: { family: "'DM Mono', monospace", size: 11 },
        boxWidth: 10,
        padding: 16,
      },
    },
    tooltip: {
      backgroundColor: SURFACE_2,
      titleColor: GOLD,
      bodyColor: TEXT_PRI,
      borderColor: "rgba(255,215,0,0.25)",
      borderWidth: 1,
      padding: 10,
      titleFont: { family: "'DM Mono', monospace", size: 12 },
      bodyFont: { family: "'DM Mono', monospace", size: 11 },
    },
  },
  scales: {
    x: {
      ticks: { color: TEXT_SEC, font: { family: "'DM Mono', monospace", size: 10 } },
      grid:  { color: "rgba(255,255,255,0.04)" },
      border:{ color: "rgba(255,215,0,0.15)" },
    },
    y: {
      ticks: { color: TEXT_SEC, font: { family: "'DM Mono', monospace", size: 10 } },
      grid:  { color: "rgba(255,255,255,0.04)" },
      border:{ color: "rgba(255,215,0,0.15)" },
    },
  },
}

function ChartTile({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="gameweek-tile" style={{ height: "340px", padding: "20px 24px", gap: "12px" }}>
        <h2>{title}</h2>
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          {children}
        </div>
      </div>
    )
  }

const TEAM_COLORS: Record<string, string> = {
    "Arsenal":           "#EF0107",
    "Aston Villa":       "#95BFE5",
    "Bournemouth":       "#DA291C",
    "Brentford":         "#FFD700",
    "Brighton":          "#0057B8",
    "Chelsea":           "#034694",
    "Crystal Palace":    "#1B458F",
    "Everton":           "#003399",
    "Fulham":            "#CC0000",
    "Ipswich":           "#0044A9",
    "Leicester":         "#003090",
    "Liverpool":         "#C8102E",
    "Man City":          "#6CABDD",
    "Man Utd":           "#DA291C",
    "Newcastle":         "#241F20",
    "Nott'm Forest":     "#DD0000",
    "Southampton":       "#D71920",
    "Spurs":             "#132257",
    "West Ham":          "#7A263A",
    "Wolves":            "#FDB913",
  }
  
  function getTeamColor(team: string, alpha = 1): string {
    const hex = TEAM_COLORS[team] ?? "#8b90a8"
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  
  // ── 1. Total Points per Team — Horizontal Bar ────────────────
  export function TeamPointsChart({ data }: { data: Players[] }) {
    const ref = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      if (!ref.current) return
  
      const teamMap: Record<string, number> = {}
      data.forEach(p => {
        teamMap[p.team] = (teamMap[p.team] ?? 0) + p.total_points
      })
  
      const sorted = Object.entries(teamMap).sort((a, b) => b[1] - a[1])
      const teams  = sorted.map(([t]) => t)
      const points = sorted.map(([, v]) => v)
  
      const chart = new Chart(ref.current, {
        type: "bar",
        data: {
          labels: teams,
          datasets: [{
            label: "Total Points",
            data: points,
            backgroundColor: teams.map(t => getTeamColor(t, 0.75)),
            borderColor:      teams.map(t => getTeamColor(t, 1)),
            borderWidth: 1,
            borderRadius: 4,
          }],
        },
        options: {
          ...baseChartOptions,
          indexAxis: "y" as const,
          plugins: {
            ...baseChartOptions.plugins,
            legend: { display: false },
          },
          scales: {
            x: { ...baseChartOptions.scales.x,
              title: { display: true, text: "Total Points", color: TEXT_SEC }
            },
            y: { ...baseChartOptions.scales.y,
              ticks: {
                ...baseChartOptions.scales.y.ticks,
                font: { family: "'DM Mono', monospace", size: 9 }
              }
            },
          },
        },
      })
  
      return () => chart.destroy()
    }, [data])
  
    return (
      <ChartTile title="Total Points · By Team">
        <canvas ref={ref} />
      </ChartTile>
    )
  }
  
  // ── 2. Avg xG + xA per Team — Grouped Bar ───────────────────
  export function TeamXgXaChart({ data }: { data: Players[] }) {
    const ref = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      if (!ref.current) return
  
      const teamMap: Record<string, { xg: number; xa: number; count: number }> = {}
      data.forEach(p => {
        if (!teamMap[p.team]) teamMap[p.team] = { xg: 0, xa: 0, count: 0 }
        teamMap[p.team].xg    += p.expected_goals          ?? 0
        teamMap[p.team].xa    += p.expected_assists         ?? 0
        teamMap[p.team].count += 1
      })
  
      const sorted = Object.entries(teamMap)
        .sort((a, b) => (b[1].xg + b[1].xa) - (a[1].xg + a[1].xa))
      const teams = sorted.map(([t]) => t)
  
      const chart = new Chart(ref.current, {
        type: "bar",
        data: {
          labels: teams,
          datasets: [
            {
              label: "xG",
              data: sorted.map(([, v]) => +(v.xg / v.count).toFixed(2)),
              backgroundColor: teams.map(t => getTeamColor(t, 0.8)),
              borderColor:      teams.map(t => getTeamColor(t, 1)),
              borderWidth: 1,
              borderRadius: 4,
            },
            {
              label: "xA",
              data: sorted.map(([, v]) => +(v.xa / v.count).toFixed(2)),
              backgroundColor: "rgba(255,215,0,0.2)",
              borderColor:      GOLD,
              borderWidth: 1,
              borderRadius: 4,
            },
          ],
        },
        options: {
          ...baseChartOptions,
          plugins: {
            ...baseChartOptions.plugins,
            legend: {
              ...baseChartOptions.plugins.legend,
              display: true,
            },
          },
          scales: {
            x: {
              ...baseChartOptions.scales.x,
              ticks: {
                ...baseChartOptions.scales.x.ticks,
                maxRotation: 45,
                minRotation: 45,
                font: { family: "'DM Mono', monospace", size: 8 },
              },
            },
            y: {
              ...baseChartOptions.scales.y,
              title: { display: true, text: "Avg per Player", color: TEXT_SEC },
            },
          },
        },
      })
  
      return () => chart.destroy()
    }, [data])
  
    return (
      <ChartTile title="Avg xG & xA per Player · By Team">
        <canvas ref={ref} />
      </ChartTile>
    )
  }
  
  // ── 3. Points Spread per Team — Box Plot ────────────────────
  export function TeamPointsSpreadChart({ data }: { data: Players[] }) {
    const ref = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      if (!ref.current) return
  
      const teamMap: Record<string, number[]> = {}
      data.filter((p)=> p.minutes > 0).forEach(p => {
        if (!teamMap[p.team]) teamMap[p.team] = []
        teamMap[p.team].push(p.total_points)
      })
  
      const q = (arr: number[], p: number) => {
        const sorted = [...arr].sort((a, b) => a - b)
        const i  = (p / 100) * (sorted.length - 1)
        const lo = Math.floor(i)
        const hi = Math.ceil(i)
        return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo)
      }
  
      const stats = Object.entries(teamMap)
        .map(([team, pts]) => ({
          team,
          q1:     q(pts, 25),
          median: q(pts, 50),
          q3:     q(pts, 75),
          mean:   pts.reduce((a, b) => a + b, 0) / pts.length,
        }))
        .sort((a, b) => b.median - a.median)
  
      const teams = stats.map(s => s.team)
  
      const chart = new Chart(ref.current, {
        type: "bar",
        data: {
          labels: teams,
          datasets: [
            {
              label: "Base (hidden)",
              data: stats.map(s => s.q1),
              backgroundColor: "transparent",
              borderColor: "transparent",
              stack: "box",
            },
            {
              label: "IQR (Q1–Q3)",
              data: stats.map(s => s.q3 - s.q1),
              backgroundColor: teams.map(t => getTeamColor(t, 0.3)),
              borderColor:      teams.map(t => getTeamColor(t, 1)),
              borderWidth: 1,
              borderRadius: 4,
              stack: "box",
            },
            {
              label: "Median",
              data: stats.map(s => s.median),
              type: "scatter" as any,
              backgroundColor: GOLD,
              borderColor: "var(--dark)",
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              order: 0,
            },
            {
              label: "Mean",
              data: stats.map(s => s.mean),
              type: "scatter" as any,
              backgroundColor: EMERALD,
              borderColor: "var(--dark)",
              borderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 7,
              order: 0,
            },
          ],
        },
        options: {
          ...baseChartOptions,
          plugins: {
            ...baseChartOptions.plugins,
            tooltip: {
              ...baseChartOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const s = stats[ctx.dataIndex]
                  if (!s) return ""
                  return [
                    ` Q3:     ${s.q3.toFixed(1)}`,
                    ` Median: ${s.median.toFixed(1)}`,
                    ` Mean:   ${s.mean.toFixed(1)}`,
                    ` Q1:     ${s.q1.toFixed(1)}`,
                  ]
                },
              },
            },
          },
          scales: {
            x: {
              ...baseChartOptions.scales.x,
              stacked: true,
              ticks: {
                ...baseChartOptions.scales.x.ticks,
                maxRotation: 45,
                minRotation: 45,
                font: { family: "'DM Mono', monospace", size: 8 },
              },
            },
            y: {
              ...baseChartOptions.scales.y,
              stacked: true,
              title: { display: true, text: "Points", color: TEXT_SEC },
            },
          },
        },
      })
  
      return () => chart.destroy()
    }, [data])
  
    return (
      <ChartTile title="Points Spread · By Team">
        <canvas ref={ref} />
      </ChartTile>
    )
  }
  
  // ── Dashboard ────────────────────────────────────────────────
  export function TeamChartsDashboard({ data }: { data: Players[] }) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "16px",
        padding: "8px 0",
      }}>
        <TeamPointsChart       data={data} />
        <TeamPointsSpreadChart data={data} />
      </div>
    )
  }