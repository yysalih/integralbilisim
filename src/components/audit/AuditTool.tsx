import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { AlertTriangle, Check, Loader2, Lock, Search } from "lucide-react";

import { ConsentFields } from "@/components/ConsentFields";
import { FindingCard } from "@/components/audit/FindingCard";
import { ScoreDial } from "@/components/audit/ScoreDial";
import { auditSite, measureSpeed, sendAuditLead } from "@/lib/audit.functions";
import { allFindings, buildResult } from "@/lib/audit/score";
import { BAND, type AuditResult, type CategoryResult } from "@/lib/audit/types";
import { cn } from "@/lib/utils";

const STEPS = [
  "Adres doğrulanıyor",
  "Sayfa içeriği okunuyor",
  "Teknik SEO kontrolleri",
  "Mobil ve erişilebilirlik",
  "Güven ve paylaşım sinyalleri",
  "Google PageSpeed ile hız ölçümü",
];

/** Kilitsiz gösterilen bulgu sayısı — değer önce verilir, e-posta sonra istenir. */
const FREE_FINDINGS = 3;

type Phase = "idle" | "running" | "done" | "error";

export function AuditTool({ initialUrl }: { initialUrl?: string }) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [gateState, setGateState] = useState<"idle" | "sending" | "error">("idle");
  const resultRef = useRef<HTMLDivElement>(null);

  // Sunucu tarafı kontroller sürerken adımlar tahmini bir hızla ilerler;
  // hepsi gerçekten çalıştırılır, yalnızca görsel zamanlama tahminidir.
  useEffect(() => {
    if (phase !== "running" || stepIndex >= 4) return;
    const t = setTimeout(() => setStepIndex((i) => Math.min(4, i + 1)), 900);
    return () => clearTimeout(t);
  }, [phase, stepIndex]);

  const start = useCallback(
    async (e?: FormEvent) => {
      e?.preventDefault();
      if (!url.trim()) return;
      setPhase("running");
      setStepIndex(0);
      setError("");
      setResult(null);
      setUnlocked(false);

      try {
        const server = await auditSite({ data: { url: url.trim() } });
        setStepIndex(5);

        let hiz: CategoryResult;
        try {
          hiz = await measureSpeed({ data: { url: server.finalUrl } });
        } catch {
          // Kota dolmuş ya da PSI yanıt vermemiş olabilir: kategori ölçülemedi
          // sayılır ve kalan ağırlıklar 100'e yeniden ölçeklenir.
          hiz = {
            key: "hiz",
            label: "Hız & Performans",
            weight: 30,
            ratio: null,
            findings: [],
          };
        }

        setResult(
          buildResult(url.trim(), server.finalUrl, server.fetchedAt, [hiz, ...server.categories]),
        );
        setPhase("done");
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Site taranamadı.");
        setPhase("error");
      }
    },
    [url],
  );

  // Adres bağlantıyla geldiyse kullanıcı tekrar tıklamasın.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!initialUrl || autoStarted.current) return;
    autoStarted.current = true;
    void start();
  }, [initialUrl, start]);

  const onGate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!result) return;
    const fd = new FormData(e.currentTarget);
    setGateState("sending");
    const findings = allFindings(result.categories);
    try {
      await sendAuditLead({
        data: {
          email: String(fd.get("email") ?? ""),
          targetUrl: result.finalUrl,
          score: result.total,
          criticalCount: findings.filter((f) => f.severity === "kritik").length,
          consentKvkk: fd.get("consentKvkk") === "on",
          consentMarketing: fd.get("consentMarketing") === "on",
          website: String(fd.get("website") ?? ""),
        },
      });
    } catch (err) {
      console.error(err);
    }
    // Bildirim gitmese de rapor açılır: değer kullanıcıya vaat edildi.
    setUnlocked(true);
    setGateState("idle");
  };

  const findings = result ? allFindings(result.categories) : [];
  const visible = unlocked ? findings : findings.slice(0, FREE_FINDINGS);
  const hidden = findings.length - visible.length;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={start} className="relative">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              inputMode="url"
              placeholder="siteniz.com"
              aria-label="Analiz edilecek site adresi"
              className="w-full rounded-full border border-white/12 bg-white/[0.04] py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent focus:bg-white/[0.07]"
            />
          </div>
          <button
            type="submit"
            disabled={phase === "running" || !url.trim()}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all",
              phase === "running" || !url.trim()
                ? "cursor-not-allowed opacity-40"
                : "hover:scale-[1.03] active:scale-[0.98]",
            )}
          >
            {phase === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {phase === "running" ? "Analiz ediliyor" : "Analiz Et"}
          </button>
        </div>
        <p className="mt-3 text-xs text-white/35">
          Ücretsiz, kayıt gerekmez. Yalnızca herkese açık sayfalar taranır.
        </p>
      </form>

      {phase === "running" && (
        <ol className="mt-9 space-y-3">
          {STEPS.map((label, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={label} className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                    done
                      ? "border-transparent bg-emerald-500"
                      : active
                        ? "border-accent"
                        : "border-white/15",
                  )}
                >
                  {done ? (
                    <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
                  ) : active ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-accent" />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "text-sm transition-colors",
                    done ? "text-white/45" : active ? "text-white" : "text-white/25",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {phase === "error" && (
        <div className="mt-8 flex gap-3 rounded-2xl border border-red-400/25 bg-red-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-300" />
          <p className="text-sm leading-relaxed text-red-100/90">{error}</p>
        </div>
      )}

      {phase === "done" && result && (
        <div ref={resultRef} className="mt-10 scroll-mt-28">
          <ScoreCard result={result} />

          <h2 className="mt-10 text-xl font-bold text-white">
            {findings.length} bulgu
            <span className="ml-2 text-sm font-medium text-white/40">
              en önemliden başlayarak
            </span>
          </h2>

          <div className="mt-4 space-y-3">
            {visible.map((f, i) => (
              <FindingCard key={`${f.title}-${i}`} finding={f} />
            ))}
          </div>

          {hidden > 0 && (
            <div className="relative mt-3">
              {/* Kilitli bulguların silueti: değerin somut olduğunu gösterir. */}
              <div aria-hidden="true" className="pointer-events-none space-y-3 opacity-25 blur-[3px]">
                {findings.slice(FREE_FINDINGS, FREE_FINDINGS + 2).map((f, i) => (
                  <FindingCard key={`blur-${i}`} finding={f} />
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-0 top-0 flex items-start justify-center bg-gradient-to-b from-transparent via-[#0a0a12]/85 to-[#0a0a12] pt-10">
                <form
                  onSubmit={onGate}
                  className="w-full max-w-md rounded-2xl border border-white/12 bg-[#12121c]/95 p-6 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15">
                    <Lock className="h-4 w-4 text-accent" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {hidden} bulgu daha var
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">
                    E-posta adresinizi bırakın, raporun tamamı hemen ekranda açılsın.
                  </p>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="ornek@firma.com"
                    className="mt-4 w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent"
                  />
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <div className="mt-4">
                    <ConsentFields tone="dark" />
                  </div>
                  <button
                    type="submit"
                    disabled={gateState === "sending"}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  >
                    {gateState === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                    Tam raporu aç
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ScoreCard({ result }: { result: AuditResult }) {
  const band = BAND(result.total);
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-col items-center gap-7 md:flex-row md:items-center md:gap-10">
        <ScoreDial score={result.total} />

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
            {new URL(result.finalUrl).hostname}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white" style={{ color: band.color }}>
            {band.label}
          </h2>

          <div className="mt-5 space-y-2.5">
            {result.categories.map((c) => (
              <div key={c.key}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{c.label}</span>
                  <span className="font-semibold text-white/80">
                    {c.ratio === null ? "ölçülemedi" : `${Math.round(c.ratio * 100)}%`}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-[width] duration-1000 ease-out"
                    style={{
                      width: c.ratio === null ? "0%" : `${c.ratio * 100}%`,
                      background: BAND((c.ratio ?? 0) * 100).color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {result.unmeasured.length > 0 && (
            <p className="mt-4 text-xs leading-relaxed text-white/35">
              Hız ölçümü şu anda yapılamadı (Google'ın ücretsiz ölçüm kotası dolmuş olabilir).
              Skor, ölçülebilen kategoriler 100 üzerinden yeniden ağırlıklandırılarak
              hesaplandı.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
