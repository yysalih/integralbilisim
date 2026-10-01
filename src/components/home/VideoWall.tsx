import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TESTIMONIAL_VIDEOS, type TestimonialVideo } from "@/lib/videos";
import { mediaUrl } from "@/lib/media";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

/**
 * Müşteri deneyimi videoları duvarı. Videolar sessiz olarak aynı anda oynar;
 * sesi açılan tek bir video olabilir, diğerleri anında susar.
 */
export function VideoWall({
  title = "Müşterilerimiz anlatıyor.",
  subtitle = "Sesi açmak için bir videoya dokunun.",
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  const [audioId, setAudioId] = useState<string | null>(null);

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2
            className="font-bold text-foreground"
            style={{
              fontSize: "clamp(1.7rem, 3.4vw, 2.5rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h2>
          <p className="mt-4 text-muted-foreground">{subtitle}</p>
        </div>

        {/* Mobilde kaydırmalı ray, masaüstünde dörtlü ızgara. */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {TESTIMONIAL_VIDEOS.map((v, i) => (
            <VideoCard
              key={v.id}
              item={v}
              offset={i % 2 === 1}
              audioOn={audioId === v.id}
              onToggleAudio={() => setAudioId((cur) => (cur === v.id ? null : v.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({
  item,
  offset,
  audioOn,
  onToggleAudio,
}: {
  item: TestimonialVideo;
  offset: boolean;
  audioOn: boolean;
  onToggleAudio: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  // Dosyalar büyük: kaynak ancak kart bir kez görünür olunca bağlanır.
  const [armed, setArmed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setArmed(true);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Ekran dışına çıkan video susar; içerideyken kullanıcının tercihi geçerli.
  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = !audioOn || !inView;
  }, [audioOn, inView]);

  // Görünürken oynat, çıkınca duraklat: boşuna bant genişliği harcanmasın.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !armed) return;
    if (inView && !reducedMotion) el.play().catch(() => {});
    else el.pause();
  }, [inView, armed, reducedMotion]);

  return (
    <div
      ref={boxRef}
      className={cn(
        "group relative aspect-[9/16] w-[62%] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#0f0f18] shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl sm:w-[45%] md:w-auto md:shrink",
        offset && "md:translate-y-6",
      )}
    >
      <video
        ref={videoRef}
        // armed olana kadar src verilmez; video indirilmez.
        src={armed ? mediaUrl(item.video) : undefined}
        poster={item.poster}
        aria-label="Müşteri deneyimi videosu"
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
        preload="none"
      />

      <button
        type="button"
        onClick={onToggleAudio}
        aria-label={audioOn ? "Sesi kapat" : "Sesi aç"}
        className={cn(
          "absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors",
          audioOn && inView ? "bg-accent" : "bg-black/55 hover:bg-black/75",
        )}
      >
        {audioOn && inView ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>
    </div>
  );
}
