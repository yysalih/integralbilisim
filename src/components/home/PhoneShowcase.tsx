import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Üç iPhone 17 Pro yan yana: ortadaki öne çıkar, yandakiler hafif geride
 * ve yatık durur. Her telefon uygulamanın ayrı bir ekranını gösterir.
 * Hareket yalnızca transform/opacity ile; azaltma tercihinde durur.
 */
export function PhoneShowcase({ screens, accent }: { screens: string[]; accent: string }) {
  const reducedMotion = usePrefersReducedMotion();
  // Ortadaki öne gelsin diye sıralama: sol, orta, sağ
  const layout = [
    { i: 0, tilt: -9, y: 18, scale: 0.9, z: 1, delay: "0s" },
    { i: 1, tilt: 0, y: 0, scale: 1, z: 3, delay: "1.1s" },
    { i: 2, tilt: 9, y: 18, scale: 0.9, z: 1, delay: "2.2s" },
  ].filter((l) => l.i < screens.length);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[70%] w-[62%] rounded-full blur-[90px]"
        style={{ backgroundColor: `${accent}4d` }}
      />

      <div className="relative flex h-full w-full items-center justify-center gap-[2%] sm:gap-[3%]">
        {layout.map(({ i, tilt, y, scale, z, delay }) => (
          <div
            key={screens[i]}
            className="relative h-[86%]"
            style={{
              aspectRatio: "9 / 19.5",
              zIndex: z,
              // Duruş dışta sabit; yüzme iç katmanda, böylece birbirini ezmez.
              transform: `translateY(${y}px) rotate(${tilt}deg) scale(${scale})`,
            }}
          >
            <div
              className="h-full w-full will-change-transform"
              style={{
                animation: reducedMotion
                  ? undefined
                  : `phone-float 7s ease-in-out ${delay} infinite`,
              }}
            >
              <Phone src={screens[i]} accent={accent} lead={z === 3} reducedMotion={reducedMotion} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Phone({
  src,
  accent,
  lead,
  reducedMotion,
}: {
  src: string;
  accent: string;
  lead: boolean;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[13%/6%] p-[1.7%]"
      style={{
        background:
          "linear-gradient(150deg, #6b7280 0%, #2a2d33 18%, #16181c 46%, #3b3f46 78%, #1b1d21 100%)",
        boxShadow: lead
          ? `0 40px 90px -30px rgba(0,0,0,.8), 0 0 0 1px rgba(255,255,255,.09), 0 24px 60px -28px ${accent}99`
          : "0 26px 60px -28px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.06)",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[11.5%/5.2%]"
        style={{ background: `linear-gradient(160deg, ${accent}55, #0b0b14 72%)` }}
      >
        <img
          src={src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Dynamic Island */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[1.6%] h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black"
        />

        {/* Cam üzerinden geçen ışık yalnızca öndeki telefonda */}
        {lead && !reducedMotion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[-30%] left-0 w-[45%] blur-[6px]"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,.22), transparent)",
              animation: "phone-glare 9s ease-in-out infinite",
            }}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 rounded-[13%/6%]")}
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)" }}
      />
    </div>
  );
}
