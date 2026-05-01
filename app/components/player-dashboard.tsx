"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import type { Players } from "~/types"
import { colors, chartTheme } from "~/lib/design-tokens"
import { ChartTile } from "./chart-tile"

const baseOptions = { responsive: true, maintainAspectRatio: false } as const

// ── Top 10 Players by Total Points (Horizontal Bar) ─────────
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
            i === 0 ? colors.gold : i < 3 ? colors.goldSoft : colors.goldMuted
          ),
          borderColor: colors.gold,
          borderWidth: 1,
          borderRadius: 0,
        }],
      },
      options: {
        ...baseOptions,
        indexAxis: "y" as const,
        plugins: {
          ...chartTheme.plugins,
          legend: { display: false },
        },
        scales: chartTheme.scales,
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

// ── Creativity vs Threat — Bubble ───────────────────────────
export function CreativityThreatChart({ data }: { data: Players[] }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const top30 = [...data]
      // .filter(p => (p.creativity ?? 0) > 0 && (p.threat ?? 0) > 0)
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
            p.position === "FWD" ? colors.rose :
            p.position === "MID" ? colors.goldSoft :
            p.position === "DEF" ? colors.sky :
            colors.emerald
          ),
          borderColor: "transparent",
        }],
      },
      options: {
        ...baseOptions,
        plugins: {
          ...chartTheme.plugins,
          legend: { display: false },
          tooltip: {
            ...chartTheme.plugins.tooltip,
            callbacks: {
              label: (ctx) => {
                const p = top30[ctx.dataIndex]
                return ` ${p.player_name} (${p.position})  C:${p.creativity} T:${p.threat} Pts:${p.total_points}`
              },
            },
          },
        },
        scales: {
          x: { ...chartTheme.scales.x, title: { display: true, text: "Creativity", color: colors.textSecondary } },
          y: { ...chartTheme.scales.y, title: { display: true, text: "Threat", color: colors.textSecondary } },
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

// ── Clean Sheets + Saves — Top GK/DEF Stacked Bar ──────────
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
            backgroundColor: colors.emeraldMuted,
            borderColor: colors.emerald,
            borderWidth: 1,
            borderRadius: 0,
          },
          {
            label: "Saves",
            data: defenders.map(p => p.saves ?? 0),
            backgroundColor: colors.skyMuted,
            borderColor: colors.sky,
            borderWidth: 1,
            borderRadius: 0,
          },
          {
            label: "Bonus",
            data: defenders.map(p => p.bonus ?? 0),
            backgroundColor: colors.roseMuted,
            borderColor: colors.rose,
            borderWidth: 1,
            borderRadius: 0,
          },
        ],
      },
      options: {
        ...baseOptions,
        plugins: chartTheme.plugins,
        scales: {
          x: { ...chartTheme.scales.x, stacked: true },
          y: { ...chartTheme.scales.y, stacked: true },
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

// ── Points Spread by Position — Box Plot style via bar ──────
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
            label: "Base (hidden)",
            data: grouped.map(g => g.q1),
            backgroundColor: "transparent",
            borderColor: "transparent",
            stack: "box",
          },
          {
            label: "IQR (Q1–Q3)",
            data: grouped.map(g => g.q3 - g.q1),
            backgroundColor: colors.goldMuted,
            borderColor: colors.gold,
            borderWidth: 1,
            borderRadius: 0,
            stack: "box",
          },
          {
            label: "Median",
            data: grouped.map(g => g.median),
            type: "scatter" as any,
            backgroundColor: colors.gold,
            borderColor: colors.dark,
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 9,
            order: 0,
          },
          {
            label: "Mean",
            data: grouped.map(g => g.mean),
            type: "scatter" as any,
            backgroundColor: colors.emerald,
            borderColor: colors.dark,
            borderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 8,
            order: 0,
          },
          {
            label: "Min",
            data: grouped.map(g => g.min),
            type: "scatter" as any,
            backgroundColor: colors.rose,
            borderColor: "transparent",
            pointRadius: 4,
            pointStyle: "dash",
            order: 0,
          },
          {
            label: "Max",
            data: grouped.map(g => g.max),
            type: "scatter" as any,
            backgroundColor: colors.sky,
            borderColor: "transparent",
            pointRadius: 4,
            pointStyle: "dash",
            order: 0,
          },
        ],
      },
      options: {
        ...baseOptions,
        scales: {
          x: { ...chartTheme.scales.x, stacked: true },
          y: {
            ...chartTheme.scales.y,
            stacked: true,
            title: { display: true, text: "Points", color: colors.textSecondary },
          },
        },
        plugins: {
          ...chartTheme.plugins,
          tooltip: {
            ...chartTheme.plugins.tooltip,
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

// ── Dashboard ───────────────────────────────────────────────
export function PlayerChartsDashboard({ data }: { data: Players[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 py-1 md:grid-cols-2 md:gap-4">
      <TopPointsChart       data={data} />
      <CreativityThreatChart data={data} />
    </div>
  )
}
