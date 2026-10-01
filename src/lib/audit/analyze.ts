import { parse, type HTMLElement } from "node-html-parser";

import type { CategoryResult, Finding } from "@/lib/audit/types";

export interface PageInput {
  html: string;
  finalUrl: string;
  /** Kök dizindeki yardımcı dosyaların durumu. */
  robotsOk: boolean;
  sitemapOk: boolean;
  /** Var olmayan bir yol 404 dönüyor mu (soft-404 kontrolü). */
  notFoundOk: boolean;
  /** Sayfanın ham boyutu (bayt). */
  bytes: number;
}

/** Bir kontrolün sonucu: geçti/kaldı + isteğe bağlı bulgu. */
interface Check {
  weight: number;
  passed: boolean;
  finding?: Finding;
}

const text = (el: HTMLElement | null) => el?.text?.trim() ?? "";
const attr = (root: HTMLElement, sel: string, name: string) =>
  root.querySelector(sel)?.getAttribute(name)?.trim() ?? "";

const ratioOf = (checks: Check[]) => {
  const total = checks.reduce((n, c) => n + c.weight, 0);
  if (!total) return 1;
  return checks.reduce((n, c) => n + (c.passed ? c.weight : 0), 0) / total;
};

const collect = (checks: Check[]) =>
  checks.map((c) => c.finding).filter((f): f is Finding => Boolean(f));

/** Teknik SEO — ağırlık 25. */
function seoCategory(root: HTMLElement, input: PageInput): CategoryResult {
  const title = text(root.querySelector("title"));
  const desc = attr(root, 'meta[name="description"]', "content");
  const canonical = attr(root, 'link[rel="canonical"]', "href");
  const h1s = root.querySelectorAll("h1");
  const isHttps = input.finalUrl.startsWith("https://");

  const checks: Check[] = [
    {
      weight: 3,
      passed: title.length >= 15 && title.length <= 70,
      finding:
        title.length === 0
          ? {
              severity: "kritik",
              title: "Sayfa başlığı (title) yok",
              evidence: "Ana sayfada <title> etiketi bulunamadı.",
              why: "Başlık, arama sonuçlarında görünen ilk şeydir; olmadan sıralama şansı düşer.",
              action: "Marka ve ana hizmeti içeren 50-60 karakterlik bir başlık yazılmalı.",
              service: "web-tasarim",
            }
          : title.length > 70
            ? {
                severity: "firsat",
                title: "Sayfa başlığı çok uzun",
                evidence: `Başlık ${title.length} karakter; arama sonuçlarında kırpılıyor.`,
                why: "Kırpılan başlık tıklama oranını düşürür.",
                action: "Başlık 50-60 karaktere indirilmeli.",
                service: "web-tasarim",
              }
            : title.length < 15
              ? {
                  severity: "firsat",
                  title: "Sayfa başlığı çok kısa",
                  evidence: `Başlık yalnızca ${title.length} karakter.`,
                  why: "Kısa başlık, aranan kelimeleri kaçırır.",
                  action: "Marka + ana hizmet + konum içeren bir başlık yazılmalı.",
                  service: "web-tasarim",
                }
              : undefined,
    },
    {
      weight: 3,
      passed: desc.length >= 70 && desc.length <= 175,
      finding:
        desc.length === 0
          ? {
              severity: "onemli",
              title: "Meta açıklama yok",
              evidence: "Sayfada meta description etiketi bulunamadı.",
              why: "Arama sonucundaki açıklama metnini Google kendi seçer; mesajınız kontrolünüzden çıkar.",
              action: "Her sayfaya 120-160 karakterlik özgün bir açıklama yazılmalı.",
              service: "web-tasarim",
            }
          : undefined,
    },
    {
      weight: 3,
      passed: Boolean(canonical),
      finding: canonical
        ? undefined
        : {
            severity: "onemli",
            title: "Canonical etiketi yok",
            evidence: "Sayfada rel=canonical bağlantısı bulunamadı.",
            why: "Aynı içerik farklı adreslerden açılırsa arama motoru hangisinin asıl olduğunu bilemez.",
            action: "Her sayfaya kendi mutlak adresini gösteren canonical etiketi eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 3,
      passed: input.robotsOk,
      finding: input.robotsOk
        ? undefined
        : {
            severity: "kritik",
            title: "robots.txt bulunamadı",
            evidence: "/robots.txt adresi geçerli bir yanıt vermedi.",
            why: "Arama motoru ve yapay zeka botlarına hangi sayfaların taranacağı söylenemiyor.",
            action: "Kök dizine robots.txt eklenmeli ve içine sitemap adresi yazılmalı.",
            service: "web-tasarim",
          },
    },
    {
      weight: 3,
      passed: input.sitemapOk,
      finding: input.sitemapOk
        ? undefined
        : {
            severity: "kritik",
            title: "sitemap.xml bulunamadı",
            evidence: "/sitemap.xml adresi geçerli bir yanıt vermedi.",
            why: "İç sayfalarınız ve blog yazılarınız keşfedilmeden kalabilir.",
            action: "Tüm sayfaları listeleyen bir sitemap.xml yayınlanmalı.",
            service: "web-tasarim",
          },
    },
    {
      weight: 2,
      passed: h1s.length === 1,
      finding:
        h1s.length === 0
          ? {
              severity: "onemli",
              title: "Sayfada H1 başlığı yok",
              evidence: "Ana sayfada hiç H1 etiketi bulunamadı.",
              why: "H1, sayfanın ne hakkında olduğunu söyleyen en güçlü sinyaldir.",
              action: "Sayfanın ana konusunu anlatan tek bir H1 eklenmeli.",
              service: "web-tasarim",
            }
          : h1s.length > 1
            ? {
                severity: "firsat",
                title: `Sayfada ${h1s.length} adet H1 var`,
                evidence: `Ana sayfada ${h1s.length} H1 etiketi bulundu.`,
                why: "Birden fazla H1, sayfanın ana konusunu belirsizleştirir.",
                action: "Tek H1 bırakılıp diğerleri H2'ye indirilmeli.",
                service: "web-tasarim",
              }
            : undefined,
    },
    {
      weight: 3,
      passed: isHttps,
      finding: isHttps
        ? undefined
        : {
            severity: "kritik",
            title: "Site HTTPS üzerinden yayınlanmıyor",
            evidence: `Adres ${input.finalUrl} ile başlıyor.`,
            why: "Tarayıcılar HTTPS olmayan siteleri 'güvenli değil' diye işaretler; ziyaretçi güveni ve sıralama düşer.",
            action: "SSL sertifikası kurulup tüm trafik HTTPS'e yönlendirilmeli.",
            service: "domain-hosting",
          },
    },
    {
      weight: 2,
      passed: input.notFoundOk,
      finding: input.notFoundOk
        ? undefined
        : {
            severity: "firsat",
            title: "Olmayan sayfalar 404 dönmüyor",
            evidence: "Var olmayan bir adres denendi; sunucu 404 yerine başarılı yanıt verdi.",
            why: "Arama motorları boş sayfaları gerçek içerik sanıp indeksler.",
            action: "Bulunamayan adresler için doğru 404 durum kodu döndürülmeli.",
            service: "web-tasarim",
          },
    },
  ];

  return {
    key: "seo",
    label: "Teknik SEO",
    weight: 25,
    ratio: ratioOf(checks),
    findings: collect(checks),
  };
}

/** Mobil & Erişilebilirlik — ağırlık 20 (DOM tarafı; PSI erişilebilirlik skoru ayrıca harmanlanır). */
function mobileCategory(root: HTMLElement): CategoryResult {
  const viewport = attr(root, 'meta[name="viewport"]', "content");
  const imgs = root.querySelectorAll("img");
  const missingAlt = imgs.filter((i) => !i.getAttribute("alt")?.trim()).length;
  const altRatio = imgs.length ? 1 - missingAlt / imgs.length : 1;
  const htmlLang = root.querySelector("html")?.getAttribute("lang") ?? "";

  const checks: Check[] = [
    {
      weight: 4,
      passed: viewport.includes("width=device-width"),
      finding: viewport.includes("width=device-width")
        ? undefined
        : {
            severity: "kritik",
            title: "Mobil görüntü ayarı (viewport) eksik",
            evidence: "viewport meta etiketi yok ya da width=device-width içermiyor.",
            why: "Site telefonda masaüstü gibi açılır; ziyaretçi yazıları okuyamaz ve hemen çıkar.",
            action: "Sayfa başlığına standart viewport meta etiketi eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 3,
      passed: altRatio >= 0.9,
      finding:
        altRatio < 0.9
          ? {
              severity: "onemli",
              title: "Görsellerde alt metni eksik",
              evidence: `${imgs.length} görselin ${missingAlt} tanesinde alt metni yok.`,
              why: "Ekran okuyucular görseli tarif edemez ve görsel aramadan gelen trafik kaybedilir.",
              action: "Her görsele içeriğini anlatan kısa bir alt metni yazılmalı.",
              service: "web-tasarim",
            }
          : undefined,
    },
    {
      weight: 2,
      passed: Boolean(htmlLang),
      finding: htmlLang
        ? undefined
        : {
            severity: "firsat",
            title: "Sayfa dili tanımlı değil",
            evidence: "html etiketinde lang özniteliği bulunamadı.",
            why: "Tarayıcı ve ekran okuyucular içeriğin hangi dilde olduğunu bilemez.",
            action: 'html etiketine lang="tr" eklenmeli.',
            service: "web-tasarim",
          },
    },
  ];

  return {
    key: "mobil",
    label: "Mobil & Erişilebilirlik",
    weight: 20,
    ratio: ratioOf(checks),
    findings: collect(checks),
  };
}

/** Güven & Dönüşüm — ağırlık 15. */
function trustCategory(root: HTMLElement, input: PageInput): CategoryResult {
  const html = input.html;
  const hasTel = root.querySelectorAll('a[href^="tel:"]').length > 0;
  const hasMail =
    root.querySelectorAll('a[href^="mailto:"]').length > 0 || /[\w.-]+@[\w.-]+\.\w{2,}/.test(html);
  const hasWhatsapp = /wa\.me|api\.whatsapp\.com/.test(html);
  const hasForm = root.querySelectorAll("form").length > 0;
  const hasPrivacy = /gizlilik|kvkk|privacy/i.test(html);
  const hasCookie = /çerez|cookie/i.test(html);
  const social = root
    .querySelectorAll("a[href]")
    .filter((a) =>
      /facebook\.com|instagram\.com|x\.com|twitter\.com|linkedin\.com|youtube\.com|tiktok\.com/.test(
        a.getAttribute("href") ?? "",
      ),
    ).length;

  const checks: Check[] = [
    {
      weight: 3,
      passed: hasTel || hasWhatsapp,
      finding:
        hasTel || hasWhatsapp
          ? undefined
          : {
              severity: "onemli",
              title: "Tıklanabilir iletişim yolu yok",
              evidence: "Sayfada tel: bağlantısı ya da WhatsApp bağlantısı bulunamadı.",
              why: "Telefondan gelen ziyaretçi numarayı elle kopyalamak zorunda kalır; çoğu vazgeçer.",
              action: "Telefon numarası tel: bağlantısı, WhatsApp ise doğrudan sohbet linki olmalı.",
              service: "web-tasarim",
            },
    },
    {
      weight: 2,
      passed: hasMail,
      finding: hasMail
        ? undefined
        : {
            severity: "firsat",
            title: "E-posta adresi görünmüyor",
            evidence: "Sayfada e-posta adresi bulunamadı.",
            why: "Kurumsal müşteriler ilk teması genellikle e-postayla kurar.",
            action: "İletişim bölümüne kurumsal e-posta adresi eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 3,
      passed: hasForm,
      finding: hasForm
        ? undefined
        : {
            severity: "onemli",
            title: "Sitede iletişim formu yok",
            evidence: "Sayfada hiç form etiketi bulunamadı.",
            why: "Form olmadan ziyaretçinin size ulaşması için ekstra çaba göstermesi gerekir.",
            action: "Ana sayfaya kısa bir teklif/iletişim formu eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 3,
      passed: hasPrivacy,
      finding: hasPrivacy
        ? undefined
        : {
            severity: "kritik",
            title: "Gizlilik / KVKK metni görünmüyor",
            evidence: "Sayfada gizlilik politikası ya da KVKK metnine dair bir iz bulunamadı.",
            why: "Kişisel veri toplayan her site için KVKK aydınlatma yükümlülüğü vardır; yasal risk taşır.",
            action: "Gizlilik politikası ve KVKK aydınlatma metni yayınlanıp formlara onay kutusu eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 2,
      passed: hasCookie,
      finding: hasCookie
        ? undefined
        : {
            severity: "firsat",
            title: "Çerez bilgilendirmesi yok",
            evidence: "Sayfada çerez kullanımına dair bir bilgilendirme bulunamadı.",
            why: "Analitik veya pazarlama çerezi kullanılıyorsa ziyaretçinin bilgilendirilmesi gerekir.",
            action: "Çerez bildirimi eklenip analitik çerezler onaya bağlanmalı.",
            service: "web-tasarim",
          },
    },
    {
      weight: 2,
      passed: social > 0,
      finding:
        social > 0
          ? undefined
          : {
              severity: "firsat",
              title: "Sosyal medya bağlantısı yok",
              evidence: "Sayfada sosyal medya hesaplarına bağlantı bulunamadı.",
              why: "Aktif sosyal hesaplar, markanın canlı olduğunun en hızlı kanıtıdır.",
              action: "Sosyal medya hesapları alt bilgiye eklenmeli.",
              service: "sosyal-medya-yonetimi",
            },
    },
  ];

  return {
    key: "guven",
    label: "Güven & Dönüşüm",
    weight: 15,
    ratio: ratioOf(checks),
    findings: collect(checks),
  };
}

/** Sosyal & Paylaşım — ağırlık 10. */
function socialCategory(root: HTMLElement): CategoryResult {
  const ogImage = attr(root, 'meta[property="og:image"]', "content");
  const ogTitle = attr(root, 'meta[property="og:title"]', "content");
  const twitter = attr(root, 'meta[name="twitter:card"]', "content");
  const favicon = root.querySelectorAll('link[rel*="icon"]').length > 0;
  const ldJson = root.querySelectorAll('script[type="application/ld+json"]');
  const hasOrg = ldJson.some((s) => /"@type"\s*:\s*"?(Organization|LocalBusiness|ProfessionalService)/.test(s.text));

  const checks: Check[] = [
    {
      weight: 3,
      passed: Boolean(ogImage),
      finding: ogImage
        ? undefined
        : {
            severity: "onemli",
            title: "Paylaşım görseli (og:image) yok",
            evidence: "Sayfada og:image etiketi bulunamadı.",
            why: "Link WhatsApp veya LinkedIn'de paylaşıldığında görselsiz, cansız bir kart çıkar.",
            action: "Her sayfa için 1200×630 boyutunda bir paylaşım görseli tanımlanmalı.",
            service: "grafik-tasarim",
          },
    },
    {
      weight: 2,
      passed: Boolean(ogTitle),
      finding: ogTitle
        ? undefined
        : {
            severity: "firsat",
            title: "Paylaşım başlığı tanımlı değil",
            evidence: "Sayfada og:title etiketi bulunamadı.",
            why: "Paylaşılan bağlantının başlığını sosyal ağ kendi tahmin eder.",
            action: "og:title ve og:description etiketleri eklenmeli.",
            service: "web-tasarim",
          },
    },
    {
      weight: 1,
      passed: Boolean(twitter),
      finding: twitter
        ? undefined
        : {
            severity: "firsat",
            title: "Twitter/X kart etiketi yok",
            evidence: "twitter:card etiketi bulunamadı.",
            why: "X'te paylaşılan bağlantı küçük ve dikkat çekmeyen bir kart olarak görünür.",
            action: 'twitter:card="summary_large_image" eklenmeli.',
            service: "web-tasarim",
          },
    },
    {
      weight: 2,
      passed: favicon,
      finding: favicon
        ? undefined
        : {
            severity: "onemli",
            title: "Favicon yok",
            evidence: "Sayfada favicon bağlantısı bulunamadı.",
            why: "Tarayıcı sekmesinde jenerik simge görünür; onlarca sekme arasında marka kaybolur.",
            action: "Logodan üretilmiş bir favicon seti eklenmeli.",
            service: "kurumsal-kimlik",
          },
    },
    {
      weight: 4,
      passed: hasOrg,
      finding: hasOrg
        ? undefined
        : {
            severity: "kritik",
            title: "Yapısal veri (schema) yok",
            evidence: `Sayfada ${ldJson.length} JSON-LD bloğu bulundu; işletme şeması yok.`,
            why: "Google ve yapay zeka motorları işletmenizin ne yaptığını makine okunur biçimde göremiyor.",
            action: "Organization ve LocalBusiness şemaları eklenmeli.",
            service: "web-tasarim",
          },
    },
  ];

  return {
    key: "sosyal",
    label: "Sosyal & Paylaşım",
    weight: 10,
    ratio: ratioOf(checks),
    findings: collect(checks),
  };
}

/** HTML'den ölçülebilen dört kategori. Hız kategorisi tarayıcıda PSI ile ölçülür. */
export const analyzeHtml = (input: PageInput): CategoryResult[] => {
  const root = parse(input.html, { comment: false });
  return [
    seoCategory(root, input),
    mobileCategory(root),
    trustCategory(root, input),
    socialCategory(root),
  ];
};
