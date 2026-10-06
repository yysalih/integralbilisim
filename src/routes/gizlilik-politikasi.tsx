import { createFileRoute } from "@tanstack/react-router";

import { COMPANY } from "@/lib/company";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/gizlilik-politikasi")({
  head: () => {
    const base = pageHead({
      title: "Gizlilik Politikası ve KVKK Aydınlatma Metni | İntegral Bilişim",
      description:
        "Kişisel verilerinizin işlenmesi, saklanması ve haklarınız hakkında bilgilendirme.",
      path: "/gizlilik-politikasi",
      image: "/og/gizlilik-politikasi.png",
    });
    return {
      ...base,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Gizlilik Politikası", path: "/gizlilik-politikasi" },
          ]),
        ),
      ],
    };
  },
  component: PrivacyPage,
});

// integralbilisim.com/gizlilik-politikasi sayfasındaki politika esas alınmıştır.
const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Veri Sorumlusu",
    body: [
      `Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla ${COMPANY.fullName} tarafından hazırlanmıştır. Adres: ${COMPANY.address}. İletişim: ${COMPANY.email} · ${COMPANY.phoneMobile}`,
    ],
  },
  {
    title: "Giriş",
    body: [
      "Ziyaretçilerimizin gizliliği bizim için önemlidir. Bu politika, web sitemizi ziyaret ettiğinizde hangi bilgilerin toplandığını ve bu bilgilerin nasıl kullanıldığını açıklar.",
    ],
  },
  {
    title: "Toplanan Kişisel Bilgiler",
    body: [
      "Sitemizi kullandığınızda IP adresi, coğrafi konum, tarayıcı türü ve sürümü ile işletim sistemi gibi teknik bilgiler; ziyaret geçmişi; iletişim formu üzerinden ilettiğiniz ad, e-posta ve telefon gibi bilgiler ve bize gönderdiğiniz mesaj içerikleri toplanabilir.",
    ],
  },
  {
    title: "Kişisel Bilgilerin Kullanımı",
    body: [
      "Toplanan bilgiler; sitenin yönetimi, hizmetlerin sunulması, taleplerinize dönüş yapılması, izniniz olması halinde pazarlama iletişimi ve dolandırıcılığın önlenmesi amaçlarıyla kullanılır.",
    ],
  },
  {
    title: "Bilgilerin Paylaşımı",
    body: [
      "Kişisel bilgileriniz; yalnızca hizmetin gerektirdiği ölçüde çalışanlarımız, danışmanlarımız ve tedarikçilerimizle ya da yasal bir zorunluluk bulunması halinde yetkili mercilerle paylaşılabilir.",
    ],
  },
  {
    title: "Saklama ve Güvenlik",
    body: [
      "Bilgileriniz, ilgili amaç için gerekli olduğu süre boyunca saklanır; yasal saklama yükümlülükleri saklıdır. Verileriniz şifreli sunucularda korunur.",
    ],
  },
  {
    title: "İşleme Amaçları ve Hukuki Sebep",
    body: [
      "İletişim formu üzerinden paylaştığınız ad, e-posta, telefon ve mesaj içeriği; yalnızca talebinizi yanıtlamak ve teklif sürecini yürütmek amacıyla, KVKK m.5/2-(c) ve (f) uyarınca sözleşmenin kurulması ve meşru menfaat hukuki sebeplerine dayanılarak işlenir.",
      "Bir form gönderdiğinizde, talebinizin hangi kanaldan geldiğini (ör. Google araması, reklam, doğrudan ziyaret), sitemize ilk girdiğiniz sayfayı ve varsa reklam kampanyası bilgisini (UTM parametreleri) talebinizle birlikte kaydederiz; amaç hangi tanıtım çalışmasının talep getirdiğini anlamak ve talebinize daha iyi dönmektir. Bu bilgi, siteyi ziyaret ettiğiniz sürece yalnızca tarayıcınızın oturum belleğinde tutulur, sekmeyi kapattığınızda silinir ve form göndermezseniz bize ulaşmaz.",
      "Kampanya ve hizmet duyurusu gönderimi ayrı bir onaya tabidir; bu onay verilmediğinde tarafınıza ticari elektronik ileti gönderilmez. Verdiğiniz onayı dilediğiniz zaman geri alabilirsiniz.",
    ],
  },
  {
    title: "Haklarınız (KVKK m.11)",
    body: [
      "Kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, eksik veya yanlış işlenmiş olması hâlinde düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, bu işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.",
      `Taleplerinizi ${COMPANY.email} adresine iletebilirsiniz. Başvurular en geç otuz gün içinde sonuçlandırılır.`,
    ],
  },
  {
    title: "Çerezler",
    body: [
      "Sitenin çalışması için zorunlu olan teknik çerezler dışında çerez, siteye ilk girişinizde verdiğiniz açık onayla kullanılır.",
      "Onay verirseniz ziyaretçi istatistiği için Google Analytics 4 (Google Ireland Limited) devreye girer. Hangi sayfaların görüntülendiği, sitede geçirilen süre, tahmini konum (ülke/şehir düzeyinde), cihaz ve tarayıcı türü ile telefon, WhatsApp ve form düğmelerine tıklanıp tıklanmadığı, teklif sihirbazında ve site analizi aracında hangi adımlara ulaşıldığı gibi kullanım bilgileri toplanır. Forma yazdığınız ad, e-posta, telefon ve mesaj gibi bilgiler Google Analytics'e gönderilmez; IP adresi anonimleştirilir. Bu bilgiler sizi kimliğinizle tanımlamak için kullanılmaz ve reklam amacıyla kullanılmaz.",
      "Onay vermediğiniz ya da \"Reddet\" dediğiniz sürece Google Analytics yüklenmez, Google'a herhangi bir istek gönderilmez ve site aynı şekilde çalışmaya devam eder. Tercihinizi tarayıcınızın site verilerini temizleyerek her zaman değiştirebilirsiniz.",
    ],
  },
  {
    title: "İletişim",
    body: [
      `Gizlilik politikamızla ilgili sorularınız için ${COMPANY.email} adresinden veya ${COMPANY.phoneMobile} numarasından bize ulaşabilirsiniz.`,
    ],
  },
];

function PrivacyPage() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
          Yasal
        </span>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Gizlilik Politikası
        </h1>
        <p className="mt-4 text-muted-foreground">
          {COMPANY.fullName} olarak ziyaretçilerimizin kişisel verilerini özenle koruyoruz.
        </p>
        <div className="mt-10 space-y-8">
          {SECTIONS.map((s, i) => (
            <div key={s.title}>
              <h2 className="text-xl font-semibold text-foreground">
                {i + 1}. {s.title}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-2 leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
