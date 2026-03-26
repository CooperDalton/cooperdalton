import type { HabitDay, HabitSummary } from "@/app/types/portfolio";

interface HabitHeatmapProps {
  days: HabitDay[];
  summary: HabitSummary;
}

const heatmapColors = ["#0f172a", "#134e4a", "#0f766e", "#14b8a6", "#5eead4"];
const weekDayLabels = ["Mon", "", "Wed", "", "Fri", "", ""];

function groupIntoWeeks(days: HabitDay[]) {
  const weeks: HabitDay[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

export function HabitHeatmap({ days, summary }: HabitHeatmapProps) {
  const weeks = groupIntoWeeks(days);

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-4">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Consistency snapshot
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">
            {summary.totalCompletions} completions across the last {weeks.length}{" "}
            weeks
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Streak
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {summary.streak} days
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Active
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {summary.consistency}%
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Trend
            </div>
            <div className="mt-1 text-sm font-semibold text-white">Upward</div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-grid min-w-full grid-cols-[auto_1fr] gap-3">
          <div className="grid grid-rows-7 gap-2 pt-1 text-[11px] text-slate-500">
            {weekDayLabels.map((label, index) => (
              <div key={index} className="flex h-4 items-center">
                {label}
              </div>
            ))}
          </div>

          <div
            className="grid grid-flow-col grid-rows-7 gap-2"
            aria-label="Habit completion heatmap"
          >
            {weeks.flatMap((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={day.date}
                  className="h-4 w-4 rounded-[5px] border border-white/6 shadow-[0_0_10px_rgba(15,23,42,0.45)]"
                  style={{
                    backgroundColor: heatmapColors[day.count],
                    opacity: day.count === 0 ? 0.55 : 1,
                  }}
                  title={`${day.date}: ${day.count} completed habits`}
                  aria-label={`Week ${weekIndex + 1}, day ${dayIndex + 1}, ${
                    day.count
                  } completions`}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <p>
          A placeholder grid for exercise, writing, deep work, and daily build
          sessions.
        </p>
        <div className="flex items-center gap-2">
          <span>Less</span>
          {heatmapColors.map((color) => (
            <span
              key={color}
              className="h-3 w-3 rounded-[4px] border border-white/10"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
