import { cn } from "@/lib/utils";

/** Sihirbazın üstünde her zaman görünen adım göstergesi. */
export function QuoteProgress({
  steps,
  current,
  onJump,
}: {
  steps: string[];
  current: number;
  onJump: (i: number) => void;
}) {
  // İlk adımda da bir ilerleme görünsün: boş çubuk süreci başlamamış gibi hissettiriyor.
  const pct = ((current + 1) / steps.length) * 100;
  return (
    <div className="w-full">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg,#C9436E,#8B5CF6)",
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-1">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <button
              key={label}
              type="button"
              onClick={() => done && onJump(i)}
              disabled={!done}
              className={cn(
                "min-w-0 flex-1 truncate text-left text-[11px] font-medium transition-colors sm:text-xs",
                active ? "text-white" : done ? "text-white/45 hover:text-white/80" : "text-white/25",
                done && "cursor-pointer",
              )}
            >
              <span className="hidden sm:inline">{i + 1}. </span>
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
