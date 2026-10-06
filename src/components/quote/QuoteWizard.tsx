import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

import { OptionCard } from "@/components/quote/OptionCard";
import { QuoteProgress } from "@/components/quote/QuoteProgress";
import { QuoteResult } from "@/components/quote/QuoteResult";
import { ConsentFields } from "@/components/ConsentFields";
import { mediaUrl } from "@/lib/media";
import { SERVICES } from "@/lib/services";
import { sendQuoteRequest } from "@/lib/quote.functions";
import {
  BUDGET_OPTIONS,
  SITUATION_QUESTIONS,
  URGENCY_OPTIONS,
  emptyAnswers,
  estimate,
  leadScore,
  scopeQuestionsFor,
  summaryLines,
  type QuoteAnswers,
} from "@/lib/quote";
import { PRICING_APPROVED } from "@/lib/pricing.config";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

const STEP_LABELS = ["Hizmet", "Kapsam", "Durumunuz", "Zaman & bütçe", "İletişim"];
const DRAFT_KEY = "ib-quote-draft";

type SendState = "idle" | "sending" | "sent" | "error";

export function QuoteWizard({ initialServices }: { initialServices?: string }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuoteAnswers>(() => {
    // Bağlantıyla gelen hizmetler ilk adımda işaretli başlar; kullanıcı
    // seçimini görüp değiştirebilsin diye adım atlanmaz.
    const picked = (initialServices ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter((v) => SERVICES.some((s) => s.slug === v));
    return picked.length ? { ...emptyAnswers(), services: picked } : emptyAnswers();
  });
  const [sendState, setSendState] = useState<SendState>("idle");
  const [result, setResult] = useState<{
    summary: string[];
    min: number;
    max: number;
    /** E-posta bildirimi gerçekten gitti mi; gitmediyse kullanıcıya alternatif kanal sunulur. */
    delivered: boolean;
  } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  // Sihirbazın ilk gerçek etkileşimi: huni ölçümünün başlangıcı.
  const markStarted = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    track("quote_start", { entry: initialServices ? "service_page" : "direct" });
  }, [initialServices]);

  // Yarım bırakılan sihirbaz aynı sekmede geri dönünce kaldığı yerden devam eder.
  useEffect(() => {
    try {
      // Bağlantı belirli bir hizmetle geldiyse taslak onu ezmemeli.
      if (initialServices) return;
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as { step: number; answers: QuoteAnswers };
        if (draft.answers?.services?.length) {
          setAnswers({ ...emptyAnswers(), ...draft.answers });
          setStep(Math.min(draft.step ?? 0, STEP_LABELS.length - 1));
        }
      }
    } catch {
      /* gizli sekmede okunamayabilir; taslak olmadan başlanır */
    }
  }, [initialServices]);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers }));
    } catch {
      /* kota dolu ya da erişim kapalı; taslak kaydedilmez */
    }
  }, [step, answers]);

  const scopeQuestions = useMemo(() => scopeQuestionsFor(answers.services), [answers.services]);

  const canAdvance = useMemo(() => {
    if (step === 0) return answers.services.length > 0;
    if (step === 1)
      return scopeQuestions.every(({ key }) => (answers.scope[key]?.length ?? 0) > 0);
    if (step === 2) return SITUATION_QUESTIONS.every((q) => Boolean(answers.situation[q.id]));
    if (step === 3) return Boolean(answers.urgency && answers.budget);
    return true;
  }, [step, answers, scopeQuestions]);

  const focusTop = useCallback(() => {
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);

  const go = useCallback(
    (next: number) => {
      // Seçilen hizmetlerin kapsam sorusu yoksa 2. adım atlanır.
      let target = next;
      if (target === 1 && scopeQuestions.length === 0) target = next > step ? 2 : 0;
      const clamped = Math.max(0, Math.min(STEP_LABELS.length - 1, target));
      if (clamped > step) {
        markStarted();
        track("quote_step", { step_number: clamped + 1, step_name: STEP_LABELS[clamped] });
      }
      setStep(clamped);
      focusTop();
    },
    [scopeQuestions.length, step, focusTop, markStarted],
  );

  const toggleService = (slug: string) => {
    markStarted();
    setAnswers((a) => ({
      ...a,
      services: a.services.includes(slug)
        ? a.services.filter((s) => s !== slug)
        : [...a.services, slug],
    }));
  };

  const pickScope = (key: string, value: string, multi?: boolean) =>
    setAnswers((a) => {
      const cur = a.scope[key] ?? [];
      const next = multi
        ? cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value]
        : [value];
      return { ...a, scope: { ...a.scope, [key]: next } };
    });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const contact = {
      name: String(fd.get("name") ?? ""),
      company: String(fd.get("company") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
    };
    const est = estimate(answers);
    const summary = summaryLines(answers);
    setSendState("sending");
    try {
      const res = await sendQuoteRequest({
        data: {
          ...contact,
          services: answers.services.map(
            (slug) => SERVICES.find((s) => s.slug === slug)?.title ?? slug,
          ),
          summary,
          urgency: URGENCY_OPTIONS.find((o) => o.value === answers.urgency)?.label ?? "",
          budget: BUDGET_OPTIONS.find((o) => o.value === answers.budget)?.label ?? "",
          leadScore: leadScore(answers, contact),
          estimateMin: est.min,
          estimateMax: est.max,
          priceShown: PRICING_APPROVED,
          consentKvkk: fd.get("consentKvkk") === "on",
          consentMarketing: fd.get("consentMarketing") === "on",
          website: String(fd.get("website") ?? ""),
        },
      });
      // Bildirim gitmese bile kullanıcı özetini görmeli; aksi halde 5 adımlık
      // emek boşa gider ve talep tamamen kaybolur. Alternatif kanal sunulur.
      track(res.ok ? "generate_lead" : "form_error", {
        lead_source: "quote_wizard",
        lead_score: leadScore(answers, contact),
        services: answers.services.join(","),
        urgency: answers.urgency,
        budget: answers.budget,
        estimate_min: est.min,
        estimate_max: est.max,
      });
      setResult({ summary, min: est.min, max: est.max, delivered: res.ok });
      setSendState("sent");
      try {
        sessionStorage.removeItem(DRAFT_KEY);
      } catch {
        /* yok sayılabilir */
      }
      focusTop();
    } catch (err) {
      console.error(err);
      track("form_error", { lead_source: "quote_wizard" });
      setResult({ summary, min: est.min, max: est.max, delivered: false });
      setSendState("sent");
      focusTop();
    }
  };

  if (sendState === "sent" && result) {
    return (
      <div ref={topRef}>
        <QuoteResult
          summary={result.summary}
          min={result.min}
          max={result.max}
          delivered={result.delivered}
        />
      </div>
    );
  }

  return (
    <div ref={topRef} className="relative mx-auto w-full max-w-3xl scroll-mt-28">
      <QuoteProgress steps={STEP_LABELS} current={step} onJump={go} />

      <div
        key={step}
        className="mt-8 animate-[step-in_0.42s_cubic-bezier(0.22,1,0.36,1)] pb-28 md:pb-0"
      >
        {step === 0 && (
          <Step
            title="Ne yaptırmak istiyorsunuz?"
            hint="Birden fazla seçebilirsiniz — birlikte alınan işlerde paket avantajı uygularız."
          >
            <div className="grid gap-2.5 sm:grid-cols-2">
              {SERVICES.map((s) => (
                <OptionCard
                  key={s.slug}
                  multi
                  selected={answers.services.includes(s.slug)}
                  onClick={() => toggleService(s.slug)}
                  accent={s.accent}
                  title={s.title}
                  detail={s.tagline}
                  media={
                    s.image ? (
                      <img
                        src={mediaUrl(s.image)}
                        alt=""
                        loading="lazy"
                        className="h-11 w-11 rounded-xl object-cover"
                      />
                    ) : undefined
                  }
                />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="Kapsamı netleştirelim" hint="Bu cevaplar tahmini doğrudan etkiler.">
            <div className="space-y-8">
              {scopeQuestions.map(({ key, service, question }) => (
                <div key={key}>
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: service.accent }}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      {service.title}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-white">{question.label}</h3>
                  {question.hint && (
                    <p className="mt-1 text-xs text-white/45">{question.hint}</p>
                  )}
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {question.options.map((o) => (
                      <OptionCard
                        key={o.value}
                        compact
                        multi={question.multi}
                        selected={(answers.scope[key] ?? []).includes(o.value)}
                        onClick={() => pickScope(key, o.value, question.multi)}
                        accent={service.accent}
                        title={o.label}
                        detail={o.detail}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Bugün nerede duruyorsunuz?" hint="Sıfırdan başlamak da tamamen normal.">
            <div className="space-y-8">
              {SITUATION_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <h3 className="text-base font-semibold text-white">{q.label}</h3>
                  <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {q.options.map((o) => (
                      <OptionCard
                        key={o.value}
                        compact
                        selected={answers.situation[q.id] === o.value}
                        onClick={() =>
                          setAnswers((a) => ({
                            ...a,
                            situation: { ...a.situation, [q.id]: o.value },
                          }))
                        }
                        title={o.label}
                        detail={o.detail}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Zaman ve bütçe" hint="Bütçeyi bilmiyorsanız da devam edebilirsiniz.">
            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold text-white">Ne zaman yayında olmalı?</h3>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                  {URGENCY_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.value}
                      compact
                      selected={answers.urgency === o.value}
                      onClick={() => setAnswers((a) => ({ ...a, urgency: o.value }))}
                      title={o.label}
                      detail={o.detail}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Aklınızdaki bütçe aralığı?</h3>
                <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {BUDGET_OPTIONS.map((o) => (
                    <OptionCard
                      key={o.value}
                      compact
                      selected={answers.budget === o.value}
                      onClick={() => setAnswers((a) => ({ ...a, budget: o.value }))}
                      title={o.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="Son adım — sizi tanıyalım" hint="Özeti hazırlayıp size dönüş yapalım.">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="name" label="Adınız Soyadınız" required placeholder="Adınız" />
                <TextField name="company" label="Firma (isteğe bağlı)" placeholder="Firma adı" />
                <TextField
                  name="email"
                  type="email"
                  label="E-posta"
                  required
                  placeholder="ornek@firma.com"
                />
                <TextField name="phone" label="Telefon" placeholder="05xx xxx xx xx" />
              </div>

              {/* Bot tuzağı: ekranda görünmez, klavyeyle de gezilmez. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <ConsentFields tone="dark" />

              <div className="hidden md:flex md:items-center md:gap-3 md:pt-2">
                <BackButton onClick={() => go(step - 1)} />
                <SubmitButton state={sendState} />
              </div>

              <MobileBar>
                <BackButton onClick={() => go(step - 1)} />
                <SubmitButton state={sendState} />
              </MobileBar>
            </form>
          </Step>
        )}

        {step < 4 && (
          <>
            <div className="mt-9 hidden items-center gap-3 md:flex">
              {step > 0 && <BackButton onClick={() => go(step - 1)} />}
              <NextButton disabled={!canAdvance} onClick={() => go(step + 1)} />
              {!canAdvance && <StepHint step={step} />}
            </div>
            <MobileBar>
              {step > 0 && <BackButton onClick={() => go(step - 1)} />}
              <NextButton disabled={!canAdvance} onClick={() => go(step + 1)} />
            </MobileBar>
          </>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">{title}</h2>
      {hint && <p className="mt-2 text-sm leading-relaxed text-white/50">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StepHint({ step }: { step: number }) {
  const text =
    step === 0
      ? "Devam etmek için en az bir hizmet seçin"
      : step === 1
        ? "Her soruyu yanıtlayın"
        : step === 2
          ? "Üç soruyu da yanıtlayın"
          : "Zaman ve bütçeyi seçin";
  return <span className="text-xs text-white/35">{text}</span>;
}

/** Mobilde ekranın altına sabitlenen aksiyon çubuğu — tek elle kullanım için. */
function MobileBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0a0a12]/95 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-3xl items-center gap-3">{children}</div>
    </div>
  );
}

function NextButton({ disabled, onClick }: { disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white md:flex-none",
        "bg-accent shadow-lg transition-all duration-200",
        disabled ? "cursor-not-allowed opacity-30" : "hover:scale-[1.03] active:scale-[0.98]",
      )}
    >
      Devam
      <ArrowRight className="h-4 w-4" />
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 px-5 py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10"
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden sm:inline">Geri</span>
    </button>
  );
}

function SubmitButton({ state }: { state: SendState }) {
  return (
    <button
      type="submit"
      disabled={state === "sending"}
      className={cn(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white md:flex-none",
        "shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]",
        state === "sending" && "opacity-70",
      )}
    >
      {state === "sending" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {state === "sending" ? "Hazırlanıyor..." : "Özetimi hazırla"}
    </button>
  );
}

function TextField({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent focus:bg-white/[0.07]"
      />
    </label>
  );
}
