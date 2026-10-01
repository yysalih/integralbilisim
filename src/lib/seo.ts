import { COMPANY, yearsInBusiness } from "@/lib/company";

/** Kanonik site adresi. Farklı bir adreste yayınlanacaksa VITE_SITE_URL ile geçilir. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://integralbilisim.com")
  .replace(/\/$/, "");

export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const DEFAULT_OG_IMAGE = "/og/default.png";

interface PageHeadInput {
  title: string;
  description: string;
  /** Site köküne göre yol: "/hizmetler" gibi. */
  path: string;
  /** Sayfaya özel OG görseli; verilmezse marka görseli kullanılır. */
  image?: string;
  type?: "website" | "article";
  /** Yalnızca article tipinde anlamlı. */
  publishedTime?: string;
}

/** Her sayfanın paylaşılabilir ve kanonik olması için ortak head parçası. */
export const pageHead = ({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = "website",
  publishedTime,
}: PageHeadInput) => {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: imageUrl },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "tr_TR" },
      { property: "og:site_name", content: COMPANY.name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },
      ...(publishedTime ? [{ property: "article:published_time", content: publishedTime }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
  };
};

/** JSON-LD'yi head'e script olarak koymak için ortak sarmalayıcı. */
export const jsonLd = (schema: object) => ({
  type: "application/ld+json",
  children: JSON.stringify(schema),
});

const ORG_ID = `${SITE_URL}/#organization`;

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: COMPANY.name,
  legalName: COMPANY.fullName,
  url: SITE_URL,
  logo: absoluteUrl("/logo-dark.png"),
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  foundingDate: String(COMPANY.foundedYear),
  description: `${COMPANY.foundedYear}'den beri web tasarım, web yazılım, e-ticaret ve dijital pazarlama hizmetleri veren ${yearsInBusiness()} yıllık bilişim ajansı.`,
  email: COMPANY.email,
  telephone: COMPANY.phoneMobile,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fikirtepe Mah. Mandıra Cad. Mandarins B Blok No: 11 İç Kapı No: 67",
    addressLocality: "Kadıköy",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  sameAs: Object.values(COMPANY.social),
});

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#localbusiness`,
  name: COMPANY.name,
  parentOrganization: { "@id": ORG_ID },
  url: SITE_URL,
  image: absoluteUrl(DEFAULT_OG_IMAGE),
  telephone: COMPANY.phoneMobile,
  email: COMPANY.email,
  priceRange: "₺₺",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Fikirtepe Mah. Mandıra Cad. Mandarins B Blok No: 11 İç Kapı No: 67",
    addressLocality: "Kadıköy",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  areaServed: { "@type": "Country", name: "Türkiye" },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: Object.values(COMPANY.social),
});

export const serviceSchema = (service: {
  slug: string;
  title: string;
  short: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.title,
  description: service.short,
  url: absoluteUrl(`/hizmetler/${service.slug}`),
  serviceType: service.title,
  provider: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "Türkiye" },
});

export const faqSchema = (items: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
});

export const blogPostingSchema = (post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: { heading?: string; text: string }[];
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  description: post.excerpt,
  datePublished: post.date,
  dateModified: post.date,
  wordCount: post.body.reduce((n, b) => n + b.text.split(/\s+/).length, 0),
  inLanguage: "tr-TR",
  mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
  image: absoluteUrl(`/og/blog-${post.slug}.png`),
  author: { "@type": "Organization", name: COMPANY.name, url: SITE_URL },
  publisher: { "@id": ORG_ID },
});

export const breadcrumbSchema = (trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});
