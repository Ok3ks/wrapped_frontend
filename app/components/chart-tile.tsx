export function ChartTile({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="gameweek-tile !h-[280px] !p-3 !gap-2 md:!h-[340px] md:!p-5 md:!gap-3 w-full max-w-full">
      <h2>{title}</h2>
      <div className="flex-1 relative min-h-0 w-full max-w-full">
        {children}
      </div>
    </div>
  )
}
