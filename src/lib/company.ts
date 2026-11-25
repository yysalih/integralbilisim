/**
 * İntegral Bilişim — gerçek şirket bilgileri.
 * Kaynak: integralbilisim.com (Ağustos 2026). Uydurma veri YOK.
 */
export const COMPANY = {
  name: "İntegral Bilişim",
  fullName: "İntegral Bilişim ve Yazılım Hizmetleri",
  logoTagline: "Bilişim ve Tasarım",
  foundedYear: 2007,
  phoneMobile: "+90 533 590 35 32",
  phoneOffice: "0216 410 55 33",
  phoneMobile2: "0554 959 50 55",
  email: "info@integralbilisim.com",
  address: "Esentepe Mah. Şht. Mehmet Mikdat Uluünlü Sok. No: 7, 34394 Şişli / İstanbul",
  /** Yapısal veri (schema.org PostalAddress) için adresin parçaları; address ile aynı kalmalı. */
  addressParts: {
    streetAddress: "Esentepe Mah. Şht. Mehmet Mikdat Uluünlü Sok. No: 7",
    postalCode: "34394",
    addressLocality: "Şişli",
    addressRegion: "İstanbul",
    addressCountry: "TR",
  },
  workingHours: "Pazartesi - Cuma, 09:00 - 18:00",
  whatsappNumber: "905335903532",
  social: {
    facebook: "https://www.facebook.com/integralbilisimm",
    twitter: "https://x.com/integralbilisim",
    instagram: "https://www.instagram.com/integralbilisim",
    tiktok: "https://www.tiktok.com/@integralbilisimm",
    pinterest: "https://tr.pinterest.com/integralbilisim",
  },
  mission:
    "Web tasarım, web yazılım ve hazır web sitesi hizmeti verdiğimiz kuruluşlara sunduğumuz altyapı, yazılım ve tasarımın kalitesini her geçen gün artırmak; hem kendimiz hem de müşterilerimiz için verimliliği yükselterek kurumsal gelişimi hızlandırmak.",
  vision:
    "Web yazılım, web tasarım, hazır web siteleri ve bilişim sektöründe önce ülkemizde, sonra tüm dünyada en iyi altyapı, tasarım ve yazılım hizmetlerini sunan öncü kuruluş olmak.",
} as const;

export const yearsInBusiness = () => new Date().getFullYear() - COMPANY.foundedYear;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${COMPANY.whatsappNumber}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
