import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";

const KEY = "ib-analytics-consent";

type Choice = "granted" | "denied";

const read = (): Choice | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
};

/**
 * Analitik çerez bildirimi ve GA4 yüklemesi. Yalnızca ölçüm kimliği
 * tanımlıysa gösterilir — çerez konmuyorken onay istemek kullanıcıyı yanıltır.
 *
 * Google Consent Mode v2 (temel mod): Google betiği, ziyaretçi "Kabul et"
 * demeden hiç yüklenmez; yani onaydan önce Google'a hiçbir istek gitmez.
 * Reklam depolama sinyalleri her durumda "denied" kalır.
 */
export function CookieNotice({ ga4Id }: { ga4Id: string | null }) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(read());
    setReady(true);
  }, []);

  useEffect(() => {
    if (choice !== "granted" || !ga4Id) return;
    if (document.getElementById("ga4-src")) return;
    const s = document.createElement("script");
    s.id = "ga4-src";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.appendChild(s);
    const init = document.createElement("script");
    init.id = "ga4-init";
    init.textContent =
      "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}" +
      "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});" +
      "gtag('consent','update',{analytics_storage:'granted'});" +
      `gtag('js',new Date());gtag('config','${ga4Id}',{anonymize_ip:true});`;
    document.head.appendChild(init);
  }, [choice, ga4Id]);

  const decide = (next: Choice) => {
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* gizli sekmede yazılamayabilir; seçim yalnızca bu oturum için geçerli olur */
    }
    setChoice(next);
  };

  if (!ga4Id || !ready || choice) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez tercihi"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-lg animate-[hero-rise_0.45s_ease-out] sm:inset-x-auto sm:left-4 sm:bottom-4"
    >
      <div className="rounded-2xl border border-white/12 bg-[#12121c]/92 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-relaxed text-white/75">
              Siteyi nasıl kullandığınızı anlamak için isteğe bağlı analitik çerez
              kullanmak istiyoruz. Reddederseniz site aynı şekilde çalışır.{" "}
              <a
                href="/gizlilik-politikasi"
                className="font-medium text-accent underline underline-offset-2"
              >
                Ayrıntılar
              </a>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-white transition-transform hover:scale-[1.04]"
              >
                Kabul et
              </button>
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10"
              >
                Reddet
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => decide("denied")}
            aria-label="Kapat ve reddet"
            className="-mr-1 -mt-1 rounded-full p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
