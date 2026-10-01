import { useEffect, useState } from "react";

import { BAND } from "@/lib/audit/types";

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Genel skoru gösteren halka; değere doğru dolar. */
export function ScoreDial({ score, size = 180 }: { score: number; size?: number }) {
  const [n, setN] = useState(REDUCED ? score : 0);
  const band = BAND(score);
  const r = (size - 16) / 2;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    if (REDUCED) {
      setN(score);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1200);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(score * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,.09)"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={band.color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * n) / 100}
          style={{ transition: REDUCED ? undefined : "stroke-dashoffset 90ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold tracking-tight text-white">{n}</span>
        <span className="text-xs font-medium text-white/40">/ 100</span>
      </div>
    </div>
  );
}
