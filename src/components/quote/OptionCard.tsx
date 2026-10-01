import { Check } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Sihirbazdaki seçilebilir kart. Tek ve çoklu seçimde aynı görsel dil kullanılır;
 * fark yalnızca işaretin biçiminde (daire / kare).
 */
export function OptionCard({
  selected,
  multi,
  onClick,
  accent = "#C9436E",
  title,
  detail,
  media,
  compact,
}: {
  selected: boolean;
  multi?: boolean;
  onClick: () => void;
  accent?: string;
  title: string;
  detail?: string;
  media?: ReactNode;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left",
        "transition-all duration-300 will-change-transform",
        "hover:-translate-y-0.5 active:translate-y-0",
        selected
          ? "border-transparent bg-white/[0.07]"
          : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]",
        compact ? "min-h-[64px]" : "min-h-[76px]",
      )}
      style={
        selected
          ? { boxShadow: `inset 0 0 0 1.5px ${accent}, 0 12px 30px -12px ${accent}70` }
          : undefined
      }
    >
      {/* Seçiliyken kartın arkasına sızan marka ışığı */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl transition-opacity duration-500",
          selected ? "opacity-55" : "opacity-0 group-hover:opacity-25",
        )}
        style={{ background: accent }}
      />

      {media && <span className="relative shrink-0">{media}</span>}

      <span className="relative min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-white">{title}</span>
        {detail && (
          <span className="mt-1 block text-xs leading-relaxed text-white/50">{detail}</span>
        )}
      </span>

      <span
        className={cn(
          "relative flex h-6 w-6 shrink-0 items-center justify-center border transition-all duration-300",
          multi ? "rounded-md" : "rounded-full",
          selected ? "border-transparent" : "border-white/25",
        )}
        style={selected ? { background: accent } : undefined}
      >
        <Check
          className={cn(
            "h-3.5 w-3.5 text-white transition-all duration-300",
            selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
          )}
          strokeWidth={3}
        />
      </span>
    </button>
  );
}
