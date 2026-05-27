import type { Players } from "~/types";
import { teamAbbreviations } from "~/lib/team-abbreviations";

function abbr(team: string) {
  return teamAbbreviations[team] || team.substring(0, 3).toUpperCase();
}

export function TeamChip({ team, size = "sm" }: { team: string; size?: "xs" | "sm" }) {
  const sizing =
    size === "xs"
      ? "text-[0.6rem] px-1 py-0.5"
      : "text-[0.65rem] px-1.5 py-0.5";
  return (
    <span
      className={`inline-block font-mono font-semibold uppercase tracking-wider bg-gold-subtle border border-gold-border text-gold shrink-0 ${sizing}`}
    >
      {abbr(team)}
    </span>
  );
}

interface SupportingStat {
  label: string;
  value: string | number;
}

function PerformerCard({
  label,
  player,
  stat,
  statLabel,
  supporting,
}: {
  label: string;
  player: Players;
  stat: string | number;
  statLabel: string;
  supporting: SupportingStat[];
}) {
  return (
    <div className="relative bg-surface border border-gold-border p-4 sm:p-5 flex flex-col gap-3 transition-colors hover:border-gold-border-hover">
      <div className="absolute top-0 left-4 sm:left-5 w-8 h-[2px] bg-gold" />

      <p className="text-[0.65rem] font-mono font-semibold uppercase tracking-wider text-gold pt-1">
        {label}
      </p>

      <div className="flex items-center gap-2 min-w-0">
        <p className="text-base sm:text-lg font-body font-semibold text-text-primary truncate">
          {player.player_name}
        </p>
        <TeamChip team={player.team} />
      </div>

      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl sm:text-4xl font-mono font-bold text-text-primary leading-none">
          {stat}
        </p>
        <span className="text-[0.65rem] font-mono uppercase tracking-wider text-text-secondary">
          {statLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] font-mono uppercase tracking-wider text-text-secondary border-t border-gold-border-subtle pt-2">
        {supporting.map((s) => (
          <span key={s.label}>
            <span className="text-text-primary font-semibold">{s.value}</span>{" "}
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function toFloat(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

export function TopPerformers({ data }: { data: Players[] }) {
  const real = data.filter((p) => p.player_id !== 0);
  if (real.length === 0) return null;

  const topScorer = [...real].sort(
    (a, b) => b.total_points - a.total_points || b.bonus - a.bonus,
  )[0];

  const bonusKing = [...real].sort(
    (a, b) => b.bonus - a.bonus || b.bps - a.bps,
  )[0];

  const ictLeader = [...real].sort(
    (a, b) => toFloat(b.ict_index) - toFloat(a.ict_index),
  )[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
      <PerformerCard
        label="Top Scorer"
        player={topScorer}
        stat={topScorer.total_points}
        statLabel="pts"
        supporting={[
          { label: "G", value: topScorer.goals_scored },
          { label: "Bonus", value: topScorer.bonus },
          { label: "Min", value: topScorer.minutes },
        ]}
      />
      <PerformerCard
        label="Bonus King"
        player={bonusKing}
        stat={bonusKing.bonus}
        statLabel="bonus"
        supporting={[
          { label: "BPS", value: bonusKing.bps },
          { label: "Pts", value: bonusKing.total_points },
          { label: "Min", value: bonusKing.minutes },
        ]}
      />
      <PerformerCard
        label="ICT Leader"
        player={ictLeader}
        stat={toFloat(ictLeader.ict_index).toFixed(1)}
        statLabel="ict"
        supporting={[
          { label: "Inf", value: toFloat(ictLeader.influence).toFixed(1) },
          { label: "Cre", value: toFloat(ictLeader.creativity).toFixed(1) },
          { label: "Thr", value: toFloat(ictLeader.threat).toFixed(1) },
        ]}
      />
    </div>
  );
}
