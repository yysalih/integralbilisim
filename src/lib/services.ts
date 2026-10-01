/**
 * Hizmet kataloğu — sistemin kalbi olan accent map.
 * Başlık ve açıklamalar integralbilisim.com'daki gerçek hizmet metinlerinden alınmıştır.
 * Her hizmetin tek bir sabit accent rengi vardır ve göründüğü HER yerde o renk kullanılır.
 */

export type ServiceCategory = "web" | "pazarlama" | "marka";

export const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  web: "Web & Yazılım",
  pazarlama: "Dijital Pazarlama",
  marka: "Marka & Tasarım",
};

export interface ServiceMeta {
  slug: string;
  title: string;
  category: ServiceCategory;
  accent: string;
  tagline: string; // 2 kelimelik kimlik
  short: string; // kart açıklaması (siteden gerçek metin)
  long: string[]; // detay sayfası paragrafları
  includes: { label: string; detail: string }[]; // "neler dahil" listesi
  image?: string; // CDN yolu, görseller geldikçe doldurulacak
}

export const SERVICES: ServiceMeta[] = [
  {
    slug: "web-tasarim",
    image: "/images/a.jpeg",
    title: "Web Tasarım",
    category: "web",
    accent: "#E11D48",
    tagline: "Dijital Vitrin",
    short:
      "Kullanıcı deneyimini ön planda tutarak estetik, işlevsel ve mobil uyumlu web siteleri tasarlıyoruz.",
    long: [
      "Web siteniz, markanızın dijital dünyadaki yüzüdür. İlk izlenim saniyeler içinde oluşur; bu yüzden tasarımda estetik kadar hız, erişilebilirlik ve kullanım kolaylığına da aynı özeni gösteriyoruz.",
      "Her projeye markanızı, hedef kitlenizi ve sektörünüzü anlayarak başlıyoruz. Tasarımdan yayına almaya kadar tüm süreci tek elden yürütüyor; alan adı, hosting, içerik ve teknik desteği aynı paketin içinde sunuyoruz.",
    ],
    includes: [
      { label: "Mobil Uyumlu Tasarım", detail: "Tüm ekran boyutlarında kusursuz görünüm ve kullanım." },
      { label: "Özgün Arayüz", detail: "Markanıza özel, şablon olmayan tasarım dili." },
      { label: "SEO Altyapısı", detail: "Arama motorlarının sevdiği temiz ve hızlı kod yapısı." },
      { label: "İçerik Girişi", detail: "Metin ve görsellerinizin siteye yerleştirilmesi." },
      { label: "Teknik Destek", detail: "Yayın sonrası bakım ve güncelleme desteği." },
    ],
  },
  {
    slug: "hazir-web-site",
    image: "/images/b.jpeg",
    title: "Hazır Web Site",
    category: "web",
    accent: "#F59E0B",
    tagline: "Hızlı Başlangıç",
    short:
      "Kodlama veya tasarım derdi olmadan, size özel tasarımlar ve kolay yönetim avantajıyla markanızı hemen online yapın.",
    long: [
      "Her sektöre uygun, anahtar teslim web siteleri. Alan adından tasarıma, yayına almaktan mobil uyuma kadar her şeyi biz üstleniyoruz.",
      "Hazır web sitesi çözümlerimizle siteniz 5 gün içinde yayında olur. Domain, hosting, içerik girişi, kurumsal e-posta ve teknik destek pakete dahildir. Tüm ihtiyaçlarınız tek elden, profesyonel bir yaklaşımla karşılanır.",
      "Hazır siteler yazılım bilgisi gerektirmez. Site ön yüzünde görünen tüm alanları hazır site admin panelinden yönetebilirsiniz. Hazır sitelerde olmayan özellikleri de ekleme olanağınız vardır.",
    ],
    includes: [
      { label: "5 Günde Yayında", detail: "Sektörünüze uygun sitenizin hızlı kurulumu ve teslimi." },
      { label: "Domain + Hosting", detail: "Alan adı kaydı ve barındırma pakete dahil." },
      { label: "Kurumsal E-posta", detail: "Şirket adınıza özel e-posta adresleri." },
      { label: "Kolay Yönetim", detail: "Kolay ve anlaşılabilir admin panel; yazılım bilgisi gerektirmez." },
      { label: "Mobil Uyum", detail: "Telefon ve tablette kusursuz görünüm." },
    ],
  },
  {
    slug: "e-ticaret-web-siteleri",
    image: "/images/c.jpeg",
    title: "E-Ticaret Web Siteleri",
    category: "web",
    accent: "#10B981",
    tagline: "Online Satış",
    short:
      "Ürünlerinizi online ortamda güvenli ve kolay bir şekilde satabileceğiniz, kullanıcı dostu ve mobil uyumlu e-ticaret siteleri geliştiriyoruz.",
    long: [
      "E-ticaret sitesi yalnızca bir vitrin değil, çalışan bir satış kanalıdır. Ürün yönetiminden güvenli ödemeye, kargo entegrasyonundan sipariş takibine kadar satışın her adımını düşünülmüş bir altyapıyla kuruyoruz.",
      "Mobil uyumlu, hızlı ve güvenli mağazanızla müşterileriniz kolayca alışveriş yapar; siz de tek panelden ürünlerinizi, siparişlerinizi ve kampanyalarınızı yönetirsiniz.",
    ],
    includes: [
      { label: "Güvenli Ödeme", detail: "SSL sertifikası ve güvenli ödeme altyapısı entegrasyonu." },
      { label: "Ürün Yönetimi", detail: "Sınırsız ürün, kategori ve stok yönetim paneli." },
      { label: "Kargo Entegrasyonu", detail: "Sipariş ve kargo süreçlerinin tek panelden takibi." },
      { label: "Mobil Alışveriş", detail: "Telefonda da masaüstü kadar akıcı satın alma deneyimi." },
      { label: "Kampanya Araçları", detail: "İndirim, kupon ve kampanya yönetimi." },
    ],
  },
  {
    slug: "mobil-uygulama",
    image: "/images/n.jpg",
    title: "Mobil Uygulama",
    category: "web",
    accent: "#6366F1",
    tagline: "Cepte Marka",
    short:
      "iOS ve Android için markanıza özel mobil uygulamalar geliştiriyor, tasarımdan mağaza yayınına kadar süreci biz yürütüyoruz.",
    long: [
      "Müşterileriniz günün büyük bölümünü telefonlarında geçiriyor. Kendi uygulamanız, markanızla aranızdaki en kısa yol: bildirim gönderebilir, sadık müşteriye özel deneyim sunabilir ve tarayıcıya bağlı kalmadan hizmet verebilirsiniz.",
      "İhtiyacınızı ve kullanıcı akışlarınızı birlikte belirliyoruz. Arayüz tasarımından geliştirmeye, test sürecinden App Store ve Google Play yayınına kadar tüm adımları tek elden yürütüyoruz.",
    ],
    includes: [
      { label: "iOS ve Android", detail: "Tek geliştirmeyle iki platformda çalışan uygulama." },
      { label: "Arayüz Tasarımı", detail: "Markanıza özel, kullanımı kolay ekran tasarımları." },
      { label: "Mağaza Yayını", detail: "App Store ve Google Play başvuru ve yayın süreci." },
      { label: "Bildirim Altyapısı", detail: "Kullanıcılarınıza doğrudan bildirim gönderebilme." },
      { label: "Güncelleme Desteği", detail: "Yayın sonrası bakım ve sürüm güncellemeleri." },
    ],
  },
  {
    slug: "domain-hosting",
    image: "/images/d.jpeg",
    title: "Domain & Hosting",
    category: "web",
    accent: "#06B6D4",
    tagline: "Kesintisiz Yayın",
    short:
      "Web sitenizin yayında kalması için gerekli olan alan adı kaydı ve güvenilir hosting hizmetleriyle kesintisiz internet varlığı sağlıyoruz.",
    long: [
      "Alan adınız markanızın internetteki adresi, hosting ise evidir. Doğru alan adı seçiminden kayda, barındırmadan yenileme takibine kadar tüm süreci sizin adınıza yönetiyoruz.",
      "Sitenizin hızlı açılması ve kesintisiz yayında kalması için güvenilir sunucu altyapısı kullanıyor; SSL sertifikası ve kurumsal e-posta hizmetleriyle paketi tamamlıyoruz.",
    ],
    includes: [
      { label: "Alan Adı Kaydı", detail: "Markanıza uygun alan adının seçimi ve tescili." },
      { label: "Güvenilir Barındırma", detail: "Hızlı ve kesintisiz sunucu altyapısı." },
      { label: "SSL Sertifikası", detail: "Ziyaretçileriniz için güvenli bağlantı." },
      { label: "Kurumsal E-posta", detail: "info@sirketiniz.com formatında adresler." },
      { label: "Yenileme Takibi", detail: "Süre dolmadan hatırlatma ve yenileme yönetimi." },
    ],
  },
  {
    slug: "marka-tescil",
    image: "/images/e.jpeg",
    title: "Marka Tescili",
    category: "marka",
    accent: "#8B5CF6",
    tagline: "Yasal Koruma",
    short:
      "Markanızı yasal olarak koruma altına alıyor, tescil sürecini başvuru aşamasından belge teslimine kadar profesyonelce takip ediyoruz.",
    long: [
      "Markanız en değerli varlığınızdır; tescilsiz bir marka her an taklit ve hak kaybı riskiyle karşı karşıyadır. Marka tescili, isminizi ve logonuzu yasal güvence altına alır.",
      "Ön araştırmadan başvuruya, itiraz süreçlerinden belge teslimine kadar tüm adımları sizin adınıza takip ediyor, süreci düzenli olarak raporluyoruz.",
    ],
    includes: [
      { label: "Ön Araştırma", detail: "Marka adının tescile uygunluğunun kontrolü." },
      { label: "Başvuru Yönetimi", detail: "Başvurunun hazırlanması ve resmi kuruma iletilmesi." },
      { label: "Süreç Takibi", detail: "Yayın ve itiraz süreçlerinin düzenli izlenmesi." },
      { label: "Belge Teslimi", detail: "Tescil belgesinin tarafınıza ulaştırılması." },
    ],
  },
  {
    slug: "google-ads-reklami",
    image: "/images/f.jpeg",
    title: "Google Ads Reklamı",
    category: "pazarlama",
    accent: "#3B82F6",
    tagline: "Doğru Zaman",
    short:
      "Hedef kitlenize en doğru zamanda ulaşmanızı sağlayan Google reklamlarıyla, tıklama başına maliyetinizi optimize ederek maksimum geri dönüş sağlıyoruz.",
    long: [
      "Google'da arama yapan kişi zaten sizin sunduğunuz hizmeti arıyordur. Google Ads, markanızı tam o anda müşterinin karşısına çıkarır.",
      "Anahtar kelime araştırmasından reklam metinlerine, bütçe optimizasyonundan dönüşüm takibine kadar kampanyalarınızı uçtan uca yönetiyor; harcadığınız her kuruşun karşılığını almanız için sürekli iyileştiriyoruz.",
    ],
    includes: [
      { label: "Anahtar Kelime Analizi", detail: "Sektörünüzde en çok aranan kelimelerin tespiti." },
      { label: "Kampanya Kurulumu", detail: "Arama, görüntülü ve alışveriş kampanyaları." },
      { label: "Bütçe Optimizasyonu", detail: "Tıklama başına maliyetin sürekli iyileştirilmesi." },
      { label: "Dönüşüm Takibi", detail: "Hangi reklamın kazandırdığının ölçülmesi." },
      { label: "Düzenli Raporlama", detail: "Anlaşılır performans raporları." },
    ],
  },
  {
    slug: "facebook-reklamciligi",
    image: "/images/g.jpeg",
    title: "Facebook Reklamcılığı",
    category: "pazarlama",
    accent: "#6366F1",
    tagline: "Sosyal Erişim",
    short:
      "Hedef kitlenize doğrudan ulaşmanızı sağlayan etkili Facebook reklam kampanyalarıyla markanızı büyütün.",
    long: [
      "Facebook ve Instagram, müşterilerinizin her gün vakit geçirdiği yerlerdir. Doğru hedefleme ile reklamlarınız tam da ürününüzle ilgilenecek kişilere ulaşır.",
      "Yaş, ilgi alanı, konum ve davranış bazlı hedeflemeyle kampanyalarınızı kuruyor; görsel ve metinleri markanıza uygun hazırlıyor, sonuçları düzenli olarak raporluyoruz.",
    ],
    includes: [
      { label: "Hedef Kitle Analizi", detail: "Demografi, ilgi alanı ve davranış bazlı hedefleme." },
      { label: "Reklam Tasarımı", detail: "Dikkat çeken görsel ve metinlerin hazırlanması." },
      { label: "Kampanya Yönetimi", detail: "Bütçe ve teklif stratejilerinin yönetimi." },
      { label: "Performans Raporu", detail: "Erişim, tıklama ve dönüşüm raporları." },
    ],
  },
  {
    slug: "sosyal-medya-yonetimi",
    image: "/images/h.jpeg",
    title: "Sosyal Medya Yönetimi",
    category: "pazarlama",
    accent: "#EC4899",
    tagline: "Sürekli Görünürlük",
    short:
      "Markanızın sosyal medyada aktif, tutarlı ve etkileyici bir şekilde var olmasını sağlıyoruz.",
    long: [
      "Sosyal medyada var olmak hesap açmakla bitmez; düzenli, tutarlı ve markaya uygun içerik ister. Takipçileriniz sizden güncel ve özenli bir profil bekler.",
      "İçerik planından tasarıma, paylaşım takviminden etkileşim yönetimine kadar hesaplarınızı bütünüyle yönetiyor; markanızın sosyal medyadaki sesini tek elden kuruyoruz.",
    ],
    includes: [
      { label: "İçerik Planı", detail: "Aylık paylaşım takvimi ve içerik stratejisi." },
      { label: "Görsel Tasarım", detail: "Markanıza uygun paylaşım tasarımları." },
      { label: "Profil Yönetimi", detail: "Hesapların düzenli ve güncel tutulması." },
      { label: "Etkileşim Takibi", detail: "Yorum ve mesajların takibi, raporlama." },
    ],
  },
  {
    slug: "grafik-tasarim",
    image: "/images/i.jpeg",
    title: "Grafik Tasarım",
    category: "marka",
    accent: "#F97316",
    tagline: "Görsel Etki",
    short:
      "Markanızın kimliğini yansıtan yaratıcı ve özgün tasarımlar ile dijital ve basılı mecralarda güçlü bir görsel etki oluşturuyoruz.",
    long: [
      "İyi tasarım, markanızın söylemek istediğini tek bakışta anlatır. Dijitalde ve baskıda kullanacağınız her görselin markanızla aynı dili konuşması gerekir.",
      "Sosyal medya görsellerinden afişe, ambalajdan dijital banner'a kadar tüm tasarım ihtiyaçlarınızı markanızın kimliğine sadık kalarak üretiyoruz.",
    ],
    includes: [
      { label: "Dijital Tasarım", detail: "Sosyal medya, banner ve web görselleri." },
      { label: "Baskı Tasarımı", detail: "Afiş, poster ve baskıya hazır çalışmalar." },
      { label: "Marka Uyumu", detail: "Tüm işlerde tutarlı kurumsal dil." },
      { label: "Revizyon Süreci", detail: "Onayınıza kadar birlikte iyileştirme." },
    ],
  },
  {
    slug: "kurumsal-kimlik",
    image: "/images/j.jpeg",
    title: "Kurumsal Kimlik",
    category: "marka",
    accent: "#14B8A6",
    tagline: "Marka Bütünlüğü",
    short:
      "Firmanızın değerlerini yansıtan logo, kartvizit, antetli kağıt gibi kurumsal kimlik tasarımlarıyla markanızı güçlü bir şekilde temsil edin.",
    long: [
      "Kurumsal kimlik, markanızın her temas noktasında aynı ve güçlü görünmesini sağlar. Logo, kartvizit, antetli kağıt, e-posta imzası: hepsi aynı dili konuşmalıdır.",
      "Markanızın karakterini analiz ederek renk, tipografi ve görsel dilini belirliyor; tüm kurumsal materyallerinizi bu bütünlük içinde tasarlıyoruz.",
    ],
    includes: [
      { label: "Logo Tasarımı", detail: "Markanızın karakterini taşıyan özgün logo." },
      { label: "Kartvizit & Antetli", detail: "Basılı kurumsal evrak takımı." },
      { label: "Renk & Tipografi", detail: "Markanıza özel renk paleti ve yazı ailesi." },
      { label: "Kullanım Kılavuzu", detail: "Kimliğin doğru kullanımını anlatan rehber." },
    ],
  },
  {
    slug: "logo-calismasi",
    image: "/images/k.jpeg",
    title: "Logo Çalışması",
    category: "marka",
    accent: "#A855F7",
    tagline: "İlk İmza",
    short:
      "Markanızın ruhunu ve karakterini yansıtan özgün, akılda kalıcı logo tasarımları ile kurumsal kimliğinizi güçlendirin.",
    long: [
      "Logo, markanızın imzasıdır; müşterinizin aklında kalan ilk ve en kalıcı izdir. İyi bir logo sade, özgün ve her boyutta okunur olmalıdır.",
      "Sektörünüzü ve rakiplerinizi inceleyerek alternatif konseptler üretiyor; seçtiğiniz yönü birlikte olgunlaştırıp tüm kullanım formatlarıyla teslim ediyoruz.",
    ],
    includes: [
      { label: "Konsept Alternatifleri", detail: "Farklı yönlerde özgün logo önerileri." },
      { label: "Revizyon Süreci", detail: "Seçilen konseptin birlikte olgunlaştırılması." },
      { label: "Tüm Formatlar", detail: "Baskı ve dijital için vektörel teslim dosyaları." },
      { label: "Renk Varyasyonları", detail: "Koyu, açık ve tek renk kullanımlar." },
    ],
  },
  {
    slug: "kartvizit-tasarimi",
    image: "/images/l.jpeg",
    title: "Kartvizit Tasarımı",
    category: "marka",
    accent: "#EAB308",
    tagline: "Cepte Prestij",
    short:
      "İlk izlenimi güçlendiren, şık ve profesyonel kartvizit tasarımlarımızla markanızı akıllarda kalıcı kılın.",
    long: [
      "Kartvizit, el sıkışmanın ardından geride bıraktığınız izdir. Şık bir kartvizit, markanızın profesyonelliğini karşınızdakine tek dokunuşta anlatır.",
      "Kurumsal kimliğinizle uyumlu, baskıya hazır kartvizit tasarımları hazırlıyor; kağıt ve baskı tekniği seçiminde de yol gösteriyoruz.",
    ],
    includes: [
      { label: "Özgün Tasarım", detail: "Kimliğinizle uyumlu ön-arka yüz tasarımı." },
      { label: "Baskıya Hazır Dosya", detail: "Matbaa standartlarında teslim." },
      { label: "Baskı Danışmanlığı", detail: "Kağıt ve teknik seçiminde yönlendirme." },
    ],
  },
  {
    slug: "brosur-katalog-tasarimi",
    image: "/images/m.jpeg",
    title: "Broşür & Katalog",
    category: "marka",
    accent: "#EF4444",
    tagline: "Basılı Güç",
    short:
      "Markanızın mesajını ve ürünlerinizi etkileyici görsellerle buluşturan profesyonel broşür ve katalog tasarımlarımızla hedef kitlenizin dikkatini çekin.",
    long: [
      "Broşür ve katalog, ürünlerinizi müşterinizin eline tutuşturduğunuz en somut tanıtım aracıdır. İyi kurgulanmış bir katalog, satış ekibinizin en güçlü yardımcısıdır.",
      "Ürünlerinizi ve mesajınızı doğru hiyerarşiyle kurguluyor, fotoğraf ve metinleri etkileyici bir düzende bir araya getiriyor, baskıya hazır dosyalarla teslim ediyoruz.",
    ],
    includes: [
      { label: "İçerik Kurgusu", detail: "Ürün ve mesaj hiyerarşisinin planlanması." },
      { label: "Sayfa Tasarımı", detail: "Etkileyici ve okunur sayfa düzenleri." },
      { label: "Baskıya Hazırlık", detail: "Matbaa standartlarında dosya teslimi." },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

export const servicesByCategory = (category: ServiceCategory) =>
  SERVICES.filter((s) => s.category === category);
