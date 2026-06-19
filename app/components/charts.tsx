import { BarController, BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip, LineElement, PointElement, LineController, ScatterController } from "chart.js";
import { useEffect, useRef } from "react";
import { type CaptainPickEntry } from "~/types";
import  { type GameweekHistory } from "~/types";

interface Props {
    data: CaptainPickEntry[];
    darkMode?: boolean;
    height?: number;
  }

interface HistoryProps {
  data: GameweekHistory[];
  height?: number;
}

const TEAL   = "rgba(1,105,111,0.85)";
const TEAL_F = "rgba(1,105,111,0.15)";
const GOLD   = "rgba(184,133,10,0.85)";
const HIT    = "rgba(161,44,123,0.85)";
const FREE   = "rgba(1,105,111,0.55)";
const GRID   = "rgba(40,37,29,0.07)";
const TICK   = "#7a7974";

const sharedScales = (label: string) => ({
  x: {
    grid: { display: false },
    ticks: { color: TICK, font: { size: 11 } },
    border: { display: false },
  },
  y: {
    beginAtZero: false,
    title: { display: true, text: label, color: "#28251d", font: { size: 11 } },
    grid: { color: GRID },
    ticks: { color: TICK, font: { size: 11 } },
    border: { display: false },
  },
});

const tooltipDefaults = {
  backgroundColor: "rgba(28,27,25,0.97)",
  titleColor: "#f9f8f4",
  bodyColor: "#cdccca",
  padding: 12,
  cornerRadius: 8,
  displayColors: false,
};

// ─── 1. Rank Panel ────────────────────────────────────────────────────────────
export function RankChart({ data, height = 180 }: HistoryProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current ||  !data) return;
    chart.current?.destroy();

    const sorted = [...data].sort((a, b) => a.event - b.event);

    chart.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: sorted.map(d => `GW${d.event}`),
        datasets: [{
          label: "Overall Rank",
          data: sorted.map(d => d.overallRank),
          borderColor: TEAL,
          backgroundColor: TEAL_F,
          borderWidth: 2,
          pointRadius: 3,
          fill: true,
          tension: 0.3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              title: i => i[0].label,
            //   label: ctx => `  Rank  ${ctx.parsed.y.toLocaleString()}`,
            },
          },
        },
        scales: {
          ...sharedScales("Overall Rank"),
          y: { ...sharedScales("Overall Rank").y, reverse: true }, // lower = better
        },
      },
    });
    return () => chart.current?.destroy();
  }, [data]);

  return (
    <div style={{ height, position: "relative", width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

// ─── 2. Points Panel ──────────────────────────────────────────────────────────
export function PointsChart({ data, height = 180 }: HistoryProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    chart.current?.destroy();

    const sorted = [...data].sort((a, b) => a.event - b.event);

    chart.current = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: sorted.map(d => `GW${d.event}`),
        datasets: [
          {
            label: "GW Points",
            data: sorted.map(d => d.points),
            backgroundColor: TEAL,
            borderRadius: { topLeft: 3, topRight: 3 },
            borderSkipped: false,
          },
          {
            label: "Bench Pts",
            data: sorted.map(d => d.pointsOnBench),
            backgroundColor: GOLD,
            type: "line" as const,
            borderColor: GOLD,
            borderWidth: 2,
            pointRadius: 4,
            pointStyle: "diamond",
            fill: false,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              title: i => i[0].label,
              label: ctx =>
                ctx.dataset.label === "GW Points"
                  ? `  Points      ${ctx.parsed.y} pts`
                  : `  Bench left  ${ctx.parsed.y} pts`,
            },
          },
        },
        scales: sharedScales("Points"),
      },
    });
    return () => chart.current?.destroy();
  }, [data]);

  return (
    <div style={{ height, position: "relative", width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

// ─── 3. Value Panel ───────────────────────────────────────────────────────────
export function ValueChart({ data, height = 150 }: HistoryProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current ||  !data) return;
    chart.current?.destroy();

    const sorted = [...data].sort((a, b) => a.event - b.event);

    chart.current = new Chart(ref.current, {
      type: "line",
      data: {
        labels: sorted.map(d => `GW${d.event}`),
        datasets: [{
          label: "Squad Value",
          data: sorted.map(d => d.value / 10), // tenths → £m
          borderColor: GOLD,
          backgroundColor: "rgba(184,133,10,0.10)",
          borderWidth: 2.5,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              title: i => i[0].label,
            //   label: ctx => `  Value  £${ctx.parsed.y.toFixed(1)}m`,
            },
          },
        },
        scales: sharedScales("Value (£m)"),
      },
    });
    return () => chart.current?.destroy();
  }, [data]);

  return (
    <div style={{ height, position: "relative", width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

// ─── 4. Transfers Panel ───────────────────────────────────────────────────────
export function TransfersChart({ data, height = 140 }: HistoryProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const chart = useRef<Chart | null>(null);

  useEffect(() => {
    if (!ref.current || !data) return;
    chart.current?.destroy();

    const sorted = [...data].sort((a, b) => a.event - b.event);

    const freeT = sorted.map(d =>
      d.eventTransfersCost === 0 ? d.eventTransfers : 1
    );
    const hitT = sorted.map(d =>
      d.eventTransfersCost > 0 ? Math.max(0, d.eventTransfers - 1) : 0
    );

    chart.current = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: sorted.map(d => `GW${d.event}`),
        datasets: [
          {
            label: "Free",
            data: freeT,
            backgroundColor: FREE,
            borderRadius: { topLeft: 3, topRight: 3 },
            borderSkipped: false,
          },
          {
            label: "Hit (−4pts)",
            data: hitT,
            backgroundColor: HIT,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            ...tooltipDefaults,
            callbacks: {
              title: i => i[0].label,
              label: ctx =>
                ctx.dataset.label === "Free"
                  ? `  Free transfers  ${ctx.parsed.y}`
                  : `  Hits (−4 pts)   ${ctx.parsed.y}`,
            },
          },
        },
        scales: {
          ...sharedScales("Transfers"),
          y: { ...sharedScales("Transfers").y, ticks: { stepSize: 1, color: TICK } },
        },
      },
    });
    return () => chart.current?.destroy();
  }, [data]);

  return  (
    <div style={{ height, position: "relative", width: "100%" }}>
      <canvas ref={ref} />
    </div>
  );
}

// ─── Wrapper ──────────────────────────────────────────────────────────────────
const label = (text: string, sub?: string) => (
  <div style={{ marginBottom: 6 }}>
    <span style={{ fontWeight: 600, fontSize: 13, color: "#28251d" }}>{text}</span>
    {sub && <span style={{ fontSize: 11, color: "#7a7974", marginLeft: 8 }}>{sub}</span>}
  </div>
);

export function GameweekDashboard({ data }: { data: GameweekHistory[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, padding: "0 4px" }}>
      <div>{label("Overall Rank", "lower = better")}  <RankChart data={data} /></div>
      <div>{label("GW Points", "gold diamonds = pts left on bench")} <PointsChart data={data} /></div>
      <div>{label("Squad Value")} <ValueChart data={data} /></div>
      <div>{label("Transfers", "purple = hit −4 pts")} <TransfersChart data={data} /></div>
    </div>
  );
}

export function CaptainPicksChart({
    data,
    height = 520,
  }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef  = useRef<Chart | null>(null);
  
    const gridC  = "rgba(40,37,29,0.08)";
    const tickC  = "#7a7974";
    const titleC = "#28251d";


    Chart.register(
        BarController,
        BarElement,
        CategoryScale,  // ← this is what resolves your error
        LinearScale,
        LineElement,
        Tooltip,
        Legend,
        Title,
        PointElement,
        LineController,
        ScatterController,
      );

  
    useEffect(() => {
      if (!canvasRef.current || !data) return;
  
      // Destroy previous instance on re-render
      chartRef.current?.destroy();
  
      const sorted   = [...data].sort((a, b) => a.gw - b.gw);
      const labels   = sorted.map(d => `GW${d.gw}`);
      const captains = sorted.map(d => d.captainPlayerName);
      const finals   = sorted.map(d => d.finalCaptainGameweekScore);
      const fixtures = sorted.map(d => d.captainFixture);
  
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Total Points",
              data: finals,
              backgroundColor: "rgba(1,105,111,0.88)",
              borderColor: "#01696f",
              borderWidth: 1,
              borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 5, bottomRight: 5 },
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? false
            : { duration: 650, easing: "easeOutQuart" },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "rgba(28,27,25,0.97)",
              titleColor: "#f9f8f4",
              bodyColor: "#cdccca",
              padding: 14,
              cornerRadius: 10,
              displayColors: false,
              callbacks: {
                title: (items) => {
                  const i = items[0].dataIndex;
                  return `${labels[i]}  ·  ${captains[i]}`;
                },
                afterBody: (items) => {
                    const fixt = fixtures[items[0].dataIndex]
                    return fixt.map(f => `  ${f.home} vs ${f.away} `)
            },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                color: tickC,
                maxRotation: 0,
                autoSkip: true,
                font: { size: 11 },
              },
              border: { display: false },
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: { color: tickC, font: { size: 11 } },
              title: {
                display: true,
                text: "Points",
                color: titleC,
                font: { size: 12, weight: "bold" },
              },
              grid: { color: gridC },
              border: { display: false },
            },
          },
        },
      });
  
      return () => {
        chartRef.current?.destroy();
      };
    }, [data]);
  
    return (
      <div style={{ height, position: "relative", width: "100%" }}>
        <canvas ref={canvasRef} />
      </div>
    );
  }