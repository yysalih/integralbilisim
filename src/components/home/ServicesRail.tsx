import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { SERVICES } from "@/lib/services";
import { mediaUrl } from "@/lib/media";

const GAP = 16;
/** Fare tekerleğinin tek "tık"ı; trackpad bunun altında kesirli değerler üretir. */
const WHEEL_STEP = 50;
/** px-4 dolgusu yüzünden ray başındayken scrollLeft 0 değil ~16 olur. */
const EDGE = GAP + 8;

/** Yatay scroll-snap hizmet rayı — 5.3 deseni. */
export function ServicesRail() {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  /** Bir kart + boşluk kadar ilerlet; snap noktasına tam oturur. */
  const nudge = useCallback((dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + GAP : rail.clientWidth * 0.8;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const sync = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setCanPrev(rail.scrollLeft > EDGE);
      setCanNext(rail.scrollLeft < max - EDGE);
    };
    sync();

    let lockedUntil = 0;

    const onWheel = (e: WheelEvent) => {
      // Trackpad'in yatay jesti tarayıcıda zaten çalışıyor, ona dokunma.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Trackpad dikey kaydırması küçük ve kesirli adımlar üretir; sayfayı
      // onun elinden almıyoruz. Yalnızca ayrık fare tekerleği tıklarını alırız.
      const mouseWheel =
        e.deltaMode !== 0 || (Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= WHEEL_STEP);
      if (!mouseWheel) return;

      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 0) return;

      // Ray sınıra dayandıysa devri sayfaya bırak, bölümde kilitlenmesin.
      const dir = e.deltaY > 0 ? 1 : -1;
      if ((dir < 0 && rail.scrollLeft <= 0) || (dir > 0 && rail.scrollLeft >= max - 1)) return;

      e.preventDefault();
      // snap-mandatory piksel piksel kaydırmayı geri çektiği için kart kart gidiyoruz.
      if (e.timeStamp < lockedUntil) return;
      lockedUntil = e.timeStamp + 260;
      nudge(dir);
    };

    // React onWheel'i passive bağladığı için preventDefault ancak böyle çalışır.
    rail.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      rail.removeEventListener("wheel", onWheel);
      rail.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [nudge]);

  return (
    <section className="bg-[#0a0a12] py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Hizmetlerimizi Keşfedin
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              {(
                [
                  ["Önceki hizmetler", -1, canPrev, ChevronLeft],
                  ["Sonraki hizmetler", 1, canNext, ChevronRight],
                ] as const
              ).map(([label, dir, enabled, Icon]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => nudge(dir)}
                  disabled={!enabled}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:bg-white/10 disabled:pointer-events-none disabled:opacity-25"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <Link
              to="/hizmetler"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Tümünü Gör
            </Link>
          </div>
        </div>

        <div
          ref={railRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden overscroll-x-contain px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {SERVICES.map((s, i) => (
            <Link
              key={s.slug}
              to="/hizmetler/$slug"
              params={{ slug: s.slug }}
              className="group relative flex min-h-[420px] w-[78%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:scale-[1.03] sm:w-72 md:min-h-[480px] md:w-80"
              style={{
                background: `linear-gradient(160deg, ${s.accent}26 0%, #14141f 55%, #0d0d16 100%)`,
                boxShadow: `inset 0 0 0 1px ${s.accent}30`,
              }}
            >
              {s.image && (
                <>
                  <img
                    src={mediaUrl(s.image)}
                    alt={s.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/25" />
                </>
              )}
              {!s.image && (
                <span
                  className="pointer-events-none absolute -top-6 right-2 select-none text-[9rem] font-black leading-none text-white/[0.07]"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              <div className="relative">
                <h3 className="mt-2 text-2xl font-bold text-white">{s.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{s.short}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 transition-colors group-hover:text-white">
                  İncele
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
