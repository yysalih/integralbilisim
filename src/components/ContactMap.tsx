import { useState } from "react";
import { MapPin, Navigation } from "lucide-react";

import { COMPANY } from "@/lib/company";
import { track } from "@/lib/track";

const query = encodeURIComponent(COMPANY.mapQuery);
const EMBED_URL = `https://www.google.com/maps?q=${query}&hl=tr&z=16&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

/**
 * Ofis haritası. Google Haritalar iframe'i yüklenir yüklenmez Google'a istek
 * atar ve çerez bırakabilir; gizlilik politikamız onaydan önce Google'a istek
 * gitmediğini söylüyor. Bu yüzden harita, ziyaretçi düğmeye basana kadar
 * yüklenmez. "Yol tarifi" düğmesi ise yeni sekmede Google Haritalar'ı açar.
 */
export function ContactMap() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="mt-16 md:mt-20">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Bizi ziyaret edin</h2>
      <p className="mt-2 text-sm text-muted-foreground">{COMPANY.address}</p>

      <div className="relative mt-6 min-h-[24rem] overflow-hidden rounded-3xl border border-border bg-[#0a0a12] sm:aspect-[16/7] sm:min-h-[19rem]">
        {loaded ? (
          <iframe
            src={EMBED_URL}
            title={`${COMPANY.name} ofis konumu`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px),linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[90px]"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg">
              <MapPin className="h-6 w-6" />
            </div>
            <p className="relative mt-5 text-lg font-semibold text-white">Şişli / İstanbul</p>
            <p className="relative mt-1 max-w-sm text-xs leading-relaxed text-white/45">
              Haritayı göstermek için Google Haritalar yüklenir.
            </p>
            <div className="relative mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  track("map_load");
                  setLoaded(true);
                }}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
              >
                Haritayı göster
              </button>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("directions_click")}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Navigation className="h-4 w-4" />
                Yol tarifi al
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
