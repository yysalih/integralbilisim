import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, Gauge, Sparkles } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

import { FEATURED_WORK, type FeaturedWork } from "@/lib/references";
import { SERVICES } from "@/lib/services";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PhoneShowcase } from "./PhoneShowcase";

/** Hero'daki teklif sekmesinde kısayol olarak sunulan hizmetler. */
const QUICK_SERVICES = ["web-tasarim", "e-ticaret-web-siteleri", "mobil-uygulama"] as const;

/** Video oynatılamadığında (veya hareket azaltıldığında) kullanılan sabit süre. */
const FALLBACK_MS = 6000;
/** Videosuz (poster) kartın ekranda kalma süresi. */
const POSTER_MS = 5000;
/** Telefon vitrininde tek ekranın süresi; PhoneShowcase ile aynı olmalı. */
const SCREEN_MS = 2600;
/**
 * Güvenlik süresi: video takılır, yüklenemez veya "ended" hiç gelmezse
 * slayt burada kilitlenmesin. Hiçbir video bundan uzun değil.
 */
const MAX_SLIDE_MS = 12000;

/**
 * Kanıt odaklı hero: mesaj sabit kalır, dönen şey yapılan işlerdir.
 * Her iş kendi tanıtım videosuyla gösterilir; video bitince sıradakine geçilir.
 * Dosyalar büyük olduğu için yalnızca gösterilen işin videosu indirilir.
 */
export function Hero() {
  const [active, setActive] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);
  const work = FEATURED_WORK[active];

  const [tool, setTool] = useState<"analiz" | "teklif">("analiz");
  const [auditUrl, setAuditUrl] = useState("");
  const navigate = useNavigate();
  const onAudit = (e: FormEvent) => {
    e.preventDefault();
    const value = auditUrl.trim();
    if (!value) return;
    navigate({ to: "/araclar/site-analizi", search: { url: value } });
  };

  const next = () => setActive((a) => (a + 1) % FEATURED_WORK.length);
  const go = (dir: 1 | -1) =>
    setActive((a) => (a + dir + FEATURED_WORK.length) % FEATURED_WORK.length);

  // Video oynamıyorsa (hareket azaltma) yine de sırayla ilerle.
  useEffect(() => {
    if (!reducedMotion) return;
    const t = setTimeout(next, FALLBACK_MS);
    return () => clearTimeout(t);
  }, [active, reducedMotion]);

  return (
    <section data-track-location="hero"
      className="relative flex items-center overflow-hidden bg-[#0a0a12]"
      style={{ minHeight: "100dvh" }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-[15%] -top-[25%] h-[85%] w-[65%] rounded-full blur-[100px] transition-colors duration-1000 will-change-transform"
          style={{ backgroundColor: `${work.accent}5c`, animation: "aurora-a 14s ease-in-out infinite" }}
        />
        <div
          className="absolute -bottom-[30%] right-[-12%] h-[80%] w-[60%] rounded-full blur-[100px] transition-colors duration-1000 will-change-transform"
          style={{ backgroundColor: `${work.accent}40`, animation: "aurora-b 18s ease-in-out infinite" }}
        />
        <div
          className="absolute left-[25%] top-[15%] h-[60%] w-[45%] rounded-full blur-[110px] will-change-transform"
          style={{ backgroundColor: "#8B5CF62e", animation: "aurora-c 24s ease-in-out infinite" }}
        />
        <div
          className="absolute -inset-y-1/3 left-1/4 w-[38%] blur-[70px] will-change-transform"
          style={{
            background: `linear-gradient(90deg, transparent, ${work.accent}3a, transparent)`,
            animation: "aurora-sweep 11s ease-in-out infinite",
          }}
        />
      </div>
      {/* Yapısal grid: düz zemine hacim verir, kenarlara doğru solar. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.55) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.55) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 85% 65% at 42% 45%, #000 15%, transparent 76%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 65% at 42% 45%, #000 15%, transparent 76%)",
        }}
      />
      {/* İnce nokta dokusu, grid'in üzerinde kırılma yaratır. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Vignette: kenarlar koyulaşır, odak ortadaki vitrine gider. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 42%, transparent 38%, rgba(0,0,0,.5) 100%)",
        }}
      />
      {/* Üstte header ile hero arasında yumuşak geçiş. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,.45), transparent)" }}
      />

      <div className="container relative mx-auto px-4 pb-8 pt-24 md:pb-12 md:pt-24">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-8">
          <div className="lg:col-span-6 xl:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              2007'den beri
            </p>
            <div key={work.name} className="animate-[showcase-fade-in_0.5s_ease-out]">
              {/* Sabit yükseklik slaytlar arası zıplamayı önler; başlıklar 2-3 satır
                  arasında değiştiği için içerik alta yaslanır, böylece kısa
                  başlıklarda paragrafla arasında boşluk kalmaz. */}
              <h1
                className="mt-6 flex min-h-[3.15em] items-end text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {work.headline}
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/65 md:text-lg">
                {work.blurb}
              </p>
            </div>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/teklif"
                search={work.service ? { services: work.service } : {}}
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105 active:scale-[0.98]"
              >
                Teklif Alın
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/referanslar"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                İşlerimizi Görün
              </Link>
            </div>

            {/* İki ücretsiz araç hero'da tek kompakt alanda. Yalnızca masaüstünde:
                dar ekranlarda hero'yu 100dvh dışına taşırıyor, ikisi de aşağıdaki
                bölümlerde tam genişlikte sunuluyor. */}
            <div className="mt-9 hidden max-w-md lg:block">
              <div className="h-px bg-gradient-to-r from-white/18 via-white/6 to-transparent" />

              <div
                role="tablist"
                aria-label="Ücretsiz araçlar"
                className="mt-5 inline-flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1"
              >
                {([
                  ["analiz", "Ücretsiz analiz", Gauge],
                  ["teklif", "Teklif al", Sparkles],
                ] as const).map(([key, label, Icon]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={tool === key}
                    onClick={() => {
                      setTool(key);
                      track("hero_tool_tab", { tool: key });
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-300",
                      tool === key ? "text-white" : "text-white/45 hover:text-white/75",
                    )}
                    style={tool === key ? { backgroundColor: `${work.accent}33` } : undefined}
                  >
                    <Icon
                      className="h-3.5 w-3.5 transition-colors duration-500"
                      style={{ color: tool === key ? work.accent : undefined }}
                    />
                    {label}
                  </button>
                ))}
              </div>

              {tool === "analiz" ? (
                <form
                  onSubmit={onAudit}
                  className="mt-3 animate-[showcase-fade-in_0.35s_ease-out]"
                >
                  <label htmlFor="hero-audit" className="text-xs font-medium text-white/50">
                    Peki sizin siteniz kaç puan alır?
                  </label>
                  <div className="mt-2.5 flex gap-2">
                    <input
                      id="hero-audit"
                      value={auditUrl}
                      onChange={(e) => setAuditUrl(e.target.value)}
                      inputMode="url"
                      placeholder="siteniz.com"
                      className="min-w-0 flex-1 rounded-full border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-white/35 focus:bg-white/[0.1]"
                    />
                    <button
                      type="submit"
                      aria-label="Sitenizi ücretsiz analiz edin"
                      className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 hover:scale-110 active:scale-95"
                      style={{ backgroundColor: work.accent }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-white/30">Ücretsiz · kayıt gerekmez</p>
                </form>
              ) : (
                <div className="mt-3 animate-[showcase-fade-in_0.35s_ease-out]">
                  <p className="text-xs font-medium text-white/50">Ne yaptırmak istiyorsunuz?</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {QUICK_SERVICES.map((slug) => {
                      const service = SERVICES.find((x) => x.slug === slug);
                      if (!service) return null;
                      return (
                        <Link
                          key={slug}
                          to="/teklif"
                          search={{ services: slug }}
                          className="rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-xs font-semibold text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
                          style={{ boxShadow: `inset 0 0 0 1px ${service.accent}00` }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${service.accent}`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${service.accent}00`;
                          }}
                        >
                          {service.title}
                        </Link>
                      );
                    })}
                    <Link
                      to="/teklif"
                      className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition-colors"
                      style={{ color: work.accent }}
                    >
                      Tümü
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <p className="mt-2 text-[11px] text-white/30">
                    90 saniye · iletişim bilgisi en sonda
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-8">
            <WorkShowcase
              active={active}
              onEnded={next}
              onPrev={() => go(-1)}
              onNext={() => go(1)}
              onSelect={setActive}
              onTouchStart={(x) => {
                touchStartX.current = x;
              }}
              onTouchEnd={(x) => {
                if (touchStartX.current === null) return;
                const dx = x - touchStartX.current;
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                touchStartX.current = null;
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkShowcase({
  active,
  onEnded,
  onPrev,
  onNext,
  onSelect,
  onTouchStart,
  onTouchEnd,
}: {
  active: number;
  onEnded: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (i: number) => void;
  onTouchStart: (x: number) => void;
  onTouchEnd: (x: number) => void;
}) {
  const work = FEATURED_WORK[active];
  const total = FEATURED_WORK.length;

  return (
    <div
      className="relative"
      onTouchStart={(e) => onTouchStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
    >
      <div
        className={cn(
          "relative isolate mx-auto w-full max-w-4xl",
          // Telefon vitrini dar ekranda yatay kartta okunmuyor: yalnızca orada dikey oran.
          work.screens ? "aspect-[7/6] sm:aspect-[49/25]" : "aspect-[49/25]",
        )}
      >
        {FEATURED_WORK.map((item, i) => {
          const offset = (i - active + total) % total;
          if (offset > 2) return null;
          // Telefon vitrininde kart çerçevesi yok; arkadaki slaytlar sızmasın.
          if (work.screens && offset > 0) return null;
          return (
            <WorkCard
              key={item.name}
              item={item}
              offset={offset}
              onEnded={offset === 0 ? onEnded : undefined}
            />
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 md:mt-7">
        <div className="flex items-center gap-2">
          {FEATURED_WORK.map((item, i) => (
            <button
              key={item.name}
              onClick={() => onSelect(i)}
              aria-label={`${item.name} işini göster`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active ? "w-7" : "w-2.5 bg-white/25 hover:bg-white/45",
              )}
              style={i === active ? { backgroundColor: work.accent } : undefined}
            />
          ))}
        </div>

        {/* Mobilde kaydırma ve noktalar yeterli; oklar WhatsApp butonuyla çakışıyor. */}
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={onPrev}
            aria-label="Önceki iş"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onNext}
            aria-label="Sonraki iş"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function WorkCard({
  item,
  offset,
  onEnded,
}: {
  item: FeaturedWork;
  offset: number;
  onEnded?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const isActive = offset === 0;
  // Dosyalar 5-21 MB: kaynak yalnızca kart öne geldiğinde bağlanır.
  // Aktif kart ve hemen sıradaki hazırlanır; geçişte yükleme beklenmez.
  const [armed, setArmed] = useState(offset <= 1);
  // İlerleme bir kez tetiklenir: "ended", sona yaklaşma ve güvenlik süresi
  // aynı geçişi üç kez başlatmasın.
  const advanced = useRef(false);
  // Videonun gerçek uzunluğu; metadata gelince öğrenilir.
  const [duration, setDuration] = useState(0);

  const advance = () => {
    if (advanced.current || !onEnded) return;
    advanced.current = true;
    onEnded();
  };

  useEffect(() => {
    advanced.current = false;
  }, [isActive]);

  useEffect(() => {
    if (offset <= 1) setArmed(true);
  }, [offset]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !armed) return;
    if (isActive && !reducedMotion) {
      el.currentTime = 0;
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, armed, reducedMotion]);

  // Slaytın ekranda kalma süresi. Videoda süre, dosyanın kendi uzunluğudur:
  // oynatma takılsa bile hero orada kilitlenmez.
  useEffect(() => {
    if (!isActive || !onEnded) return;
    // Süre önce verideki değerden, yoksa metadata'dan; ikisi de yoksa güvenlik süresi.
    const known = duration > 0 ? duration : (item.videoSeconds ?? 0);
    const ms = item.video
      ? known > 0
        ? Math.min(MAX_SLIDE_MS, known * 1000 + 500)
        : MAX_SLIDE_MS
      : item.screens
        ? item.screens.length * SCREEN_MS + 900
        : POSTER_MS;
    const t = setTimeout(advance, ms);
    return () => clearTimeout(t);
  }, [isActive, item.video, item.screens, item.videoSeconds, duration, onEnded]);

  return (
    <Card
      href={item.url}
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
      aria-label={item.url ? `${item.name} sitesini yeni sekmede aç` : item.name}
      className={cn(
        "group absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        // Telefon vitrininde kart çerçevesi yok; yalnızca cihazlar görünür.
        item.screens ? "overflow-visible" : "overflow-hidden rounded-3xl ring-1 ring-white/10",
        isActive ? "block" : "hidden sm:block",
      )}
      style={{
        transform: `translate3d(${offset * 5}%, ${offset * -3.5}%, 0) scale(${1 - offset * 0.07})`,
        opacity: isActive ? 1 : offset === 1 ? 0.28 : 0.1,
        zIndex: 3 - offset,
        // Opak zemin: arkadaki slayt kartın içinden sızmasın.
        background: item.screens
          ? undefined
          : `linear-gradient(150deg, ${item.accent} 0%, #2a2350 34%, #12121c 82%)`,
        boxShadow:
          isActive && !item.screens
            ? `0 45px 100px -35px ${item.accent}a6, 0 14px 44px -14px rgba(0,0,0,.6)`
            : undefined,
      }}
    >
      {item.screens ? (
        <PhoneShowcase screens={item.screens} accent={item.accent} />
      ) : item.video && offset <= 1 ? (
        <video
          ref={videoRef}
          src={armed ? mediaUrl(item.video) : undefined}
          poster={item.poster}
          aria-label={`${item.name} tanıtım videosu`}
          className="absolute left-0 top-1/2 w-full transition-transform duration-700"
          // Yatayda tam oturur, yükseklik doğal kalır: kırpma yalnızca üst/alttan olur.
          style={{
            height: "auto",
            transform: `translateY(-50%) scale(${item.cropScale ?? 1})`,
          }}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={(e) => {
            const d = e.currentTarget.duration;
            if (isFinite(d) && d > 0) setDuration(d);
          }}
          onEnded={advance}
          onError={advance}
          // Dosya tam inmediğinde "ended" gelmeyebiliyor; sona yaklaşınca geç.
          onTimeUpdate={(e) => {
            const v = e.currentTarget;
            if (v.duration && v.currentTime >= v.duration - 0.35) advance();
          }}
        />
      ) : (
        <img
          src={item.poster}
          alt={`${item.name} web sitesi`}
          loading={isActive ? "eager" : "lazy"}
          className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
        />
      )}

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-12 transition-opacity duration-500",
          isActive && !item.screens ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="text-base font-semibold text-white">{item.name}</span>
        <span className="flex items-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: `${item.accent}59` }}
          >
            {item.sector}
          </span>
          {item.url && (
            <ExternalLink className="h-4 w-4 text-white/70 transition-colors group-hover:text-white" />
          )}
        </span>
      </div>
    </Card>
  );
}

/** Adresi olan iş bağlantı, olmayan iş düz kart olarak render edilir. */
function Card({
  href,
  children,
  ...rest
}: { href?: string } & React.HTMLAttributes<HTMLElement> & { tabIndex?: number }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  return <div {...rest}>{children}</div>;
}
