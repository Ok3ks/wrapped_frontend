"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { Players } from "~/types"

// ── Shared theme ────────────────────────────────────────────
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

// ── Reusable tile wrapper ────────────────────────────────────
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

// ── 1. Top 10 Players by Total Points (Horizontal Bar) ───────
export function TopPointsChart({ data }: { data: Players[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const top10 = [...data].sort((a, b) => b.total_points - a.total_points).slice(0, 10)
    const chart = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: top10.map(p => p.player_name.split(" ").pop()),
        datasets: [{
          label: "Total Points",
          data: top10.map(p => p.total_points),
          backgroundColor: top10.map((_, i) =>
            i === 0 ? GOLD : i < 3 ? GOLD_SOFT : GOLD_MUTED
          ),
          borderColor: GOLD,
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
      },
    })
    return () => chart.destroy()
  }, [data])
  return (
    <ChartTile title="Top 10 · Total Points">
      <canvas ref={ref} />
    </ChartTile>
  )
}



// ── 4. Creativity vs Threat — Bubble ────────────────────────
export function CreativityThreatChart({ data }: { data: Players[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const top30 = [...data]
      .filter(p => (p.creativity ?? 0) > 0 && (p.threat ?? 0) > 0)
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 30)
    const chart = new Chart(ref.current, {
      type: "bubble",
      data: {
        datasets: [{
          label: "Players",
          data: top30.map(p => ({
            x: p.creativity ?? 0,
            y: p.threat ?? 0,
            r: Math.max(3, Math.min(14, (p.total_points ?? 0) / 4)),
          })),
          backgroundColor: top30.map(p =>
            p.position === "FWD" ? ROSE :
            p.position === "MID" ? GOLD_SOFT :
            p.position === "DEF" ? SKY :
            EMERALD
          ),
          borderColor: "transparent",
        }],
      },
      options: {
        ...baseChartOptions,
        plugins: {
          ...baseChartOptions.plugins,
          legend: { display: false },
          tooltip: {
            ...baseChartOptions.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                const p = top30[ctx.dataIndex]
                return ` ${p.player_name} (${p.position})  C:${p.creativity} T:${p.threat} Pts:${p.total_points}`
              },
            },
          },
        },
        scales: {
          x: { ...baseChartOptions.scales.x, title: { display: true, text: "Creativity", color: TEXT_SEC } },
          y: { ...baseChartOptions.scales.y, title: { display: true, text: "Threat", color: TEXT_SEC } },
        },
      },
    })
    return () => chart.destroy()
  }, [data])
  return (
    <ChartTile title="Creativity vs Threat  ·  bubble = pts">
      <canvas ref={ref} />
    </ChartTile>
  )
}

// ── 5. Clean Sheets + Saves — Top GK/DEF Stacked Bar ────────
export function DefensiveChart({ data }: { data: Players[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const defenders = [...data]
      .filter(p => p.position === "GK" || p.position === "DEF")
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 10)
    const chart = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: defenders.map(p => p.player_name.split(" ").pop()),
        datasets: [
          {
            label: "Clean Sheets",
            data: defenders.map(p => p.clean_sheets ?? 0),
            backgroundColor: EMERALD_MUT,
            borderColor: EMERALD,
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Saves",
            data: defenders.map(p => p.saves ?? 0),
            backgroundColor: SKY_MUT,
            borderColor: SKY,
            borderWidth: 1,
            borderRadius: 4,
          },
          {
            label: "Bonus",
            data: defenders.map(p => p.bonus ?? 0),
            backgroundColor: ROSE_MUT,
            borderColor: ROSE,
            borderWidth: 1,
            borderRadius: 4,
          },
        ],
      },
      options: {
        ...baseChartOptions,
        scales: {
          x: { ...baseChartOptions.scales.x, stacked: true },
          y: { ...baseChartOptions.scales.y, stacked: true },
        },
      },
    })
    return () => chart.destroy()
  }, [data])
  return (
    <ChartTile title="Defensive Contributions · GK & DEF">
      <canvas ref={ref} />
    </ChartTile>
  )
}

// ── Points spread by position — Box Plot style via bar ──────
export function PointsSpreadByPositionChart({ data }: { data: Players[] }) {
    const ref = useRef<HTMLCanvasElement>(null)
  
    useEffect(() => {
      if (!ref.current) return
  
      const positions = ["GK", "DEF", "MID", "FWD"]
  
      const grouped = positions.map(pos => {
        const pts = data
          .filter(p => p.position === pos)
          .map(p => p.total_points)
          .sort((a, b) => a - b)
  
        if (!pts.length) return { pos, min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0 }
  
        const q = (arr: number[], p: number) => {
          const i = (p / 100) * (arr.length - 1)
          const lo = Math.floor(i)
          const hi = Math.ceil(i)
          return arr[lo] + (arr[hi] - arr[lo]) * (i - lo)
        }
  
        return {
          pos,
          min:    pts[0],
          q1:     q(pts, 25),
          median: q(pts, 50),
          q3:     q(pts, 75),
          max:    pts[pts.length - 1],
          mean:   pts.reduce((a, b) => a + b, 0) / pts.length,
        }
      })
  
      const chart = new Chart(ref.current, {
        type: "bar",
        data: {
          labels: grouped.map(g => g.pos),
          datasets: [
            {
              // invisible base to float the IQR box
              label: "Base (hidden)",
              data: grouped.map(g => g.q1),
              backgroundColor: "transparent",
              borderColor: "transparent",
              stack: "box",
            },
            {
              // IQR box (Q1 → Q3)
              label: "IQR (Q1–Q3)",
              data: grouped.map(g => g.q3 - g.q1),
              backgroundColor: GOLD_MUTED,
              borderColor: GOLD,
              borderWidth: 1,
              borderRadius: 4,
              stack: "box",
            },
            {
              // median dot
              label: "Median",
              data: grouped.map(g => g.median),
              type: "scatter" as any,
              backgroundColor: GOLD,
              borderColor: "var(--dark)",
              borderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 9,
              order: 0,
            },
            {
              // mean dot
              label: "Mean",
              data: grouped.map(g => g.mean),
              type: "scatter" as any,
              backgroundColor: EMERALD,
              borderColor: "var(--dark)",
              borderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              order: 0,
            },
            {
              // min whisker line
              label: "Min",
              data: grouped.map(g => g.min),
              type: "scatter" as any,
              backgroundColor: ROSE,
              borderColor: "transparent",
              pointRadius: 4,
              pointStyle: "dash",
              order: 0,
            },
            {
              // max whisker line
              label: "Max",
              data: grouped.map(g => g.max),
              type: "scatter" as any,
              backgroundColor: SKY,
              borderColor: "transparent",
              pointRadius: 4,
              pointStyle: "dash",
              order: 0,
            },
          ],
        },
        options: {
          ...baseChartOptions,
          scales: {
            x: { ...baseChartOptions.scales.x, stacked: true },
            y: {
              ...baseChartOptions.scales.y,
              stacked: true,
              title: { display: true, text: "Points", color: TEXT_SEC },
            },
          },
          plugins: {
            ...baseChartOptions.plugins,
            tooltip: {
              ...baseChartOptions.plugins.tooltip,
              callbacks: {
                label: (ctx) => {
                  const g = grouped[ctx.dataIndex]
                  if (!g) return ""
                  return [
                    ` Max:    ${g.max.toFixed(1)}`,
                    ` Q3:     ${g.q3.toFixed(1)}`,
                    ` Median: ${g.median.toFixed(1)}`,
                    ` Mean:   ${g.mean.toFixed(1)}`,
                    ` Q1:     ${g.q1.toFixed(1)}`,
                    ` Min:    ${g.min.toFixed(1)}`,
                  ]
                },
              },
            },
          },
        },
      })
  
      return () => chart.destroy()
    }, [data])
  
    return (
      <ChartTile title="Points Spread · By Position">
        <canvas ref={ref} />
      </ChartTile>
    )
  }

// ── Dashboard ────────────────────────────────────────────────
export function PlayerChartsDashboard({ data }: { data: Players[] }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "16px",
      padding: "8px 0",
    }}>
      <TopPointsChart       data={data} />
      <CreativityThreatChart data={data} />
    </div>
  )
}