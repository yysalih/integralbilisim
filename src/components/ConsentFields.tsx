import type { ReactNode } from "react";

/**
 * KVKK açık rızası ve ticari elektronik ileti izni.
 * İki onay ayrı tutulur: ilki formun gönderilmesi için zorunlu, ikincisi
 * isteğe bağlıdır — pazarlama iletisi için ayrı izin gerekir.
 */
export function ConsentFields({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="space-y-2.5">
      <Consent name="consentKvkk" tone={tone} required>
        <a href="/gizlilik-politikasi" className="font-medium text-accent underline underline-offset-2">
          KVKK Aydınlatma Metni
        </a>
        'ni okudum; iletişim bilgilerimin talebimi yanıtlamak amacıyla işlenmesine onay
        veriyorum.
      </Consent>
      <Consent name="consentMarketing" tone={tone}>
        Kampanya ve hizmet duyurularının tarafıma gönderilmesine izin veriyorum. (isteğe
        bağlı)
      </Consent>
    </div>
  );
}

function Consent({
  name,
  required,
  tone,
  children,
}: {
  name: string;
  required?: boolean;
  tone: "light" | "dark";
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed ${
        tone === "dark" ? "text-white/60" : "text-muted-foreground"
      }`}
    >
      <input
        type="checkbox"
        name={name}
        required={required}
        className={`mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded accent-accent ${
          tone === "dark" ? "border-white/25" : "border-black/20"
        }`}
      />
      <span>{children}</span>
    </label>
  );
}
