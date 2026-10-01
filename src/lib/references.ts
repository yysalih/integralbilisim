/**
 * Referanslar - integralbilisim.com/referanslar sayfasindaki gercek musteri logolari.
 * Logolar public/referanslar/ altinda; Bunny'ye tasindiginda mediaUrl() uzerinden gecirilecek.
 */

export interface ReferenceClient {
  /** Alt metin icin marka adi. Logo duvarinda yazi olarak BASILMAZ. */
  name: string;
  logo: string;
}

/** Hero vitrini: her iş kendi tanıtım videosuyla gösterilir. */
export interface FeaturedWork {
  name: string;
  sector: string;
  accent: string;
  /** Hero'da bu iş gösterilirken soldaki başlık. */
  headline: string;
  /** Başlığın altındaki metin. Tamamı integralbilisim.com'daki gerçek metinlerdir. */
  blurb: string;
  /** Bunny'deki tanıtım videosu (16:9). Yoksa yalnızca poster gösterilir. */
  video?: string;
  /**
   * Videonun saniye cinsinden uzunluğu. Dosyalarda faststart olmadığı için
   * tarayıcı süreyi ancak tamamını indirince öğrenebiliyor; slaytın ne kadar
   * kalacağını beklemeden bilmek için burada tutulur.
   */
  videoSeconds?: number;
  /**
   * Ek ölçek. Kart oranı (1.96) çoğu videonun siyah şeridini zaten kırpar;
   * yalnızca daha kalın şeritle çekilmiş video için 1'den büyük olur.
   */
  cropScale?: number;
  /** Videonun ilk karesinden üretilmiş poster; video inene kadar görünür. */
  poster: string;
  /** Canlı site; kart tıklanınca yeni sekmede açılır. Yoksa kart tıklanmaz. */
  url?: string;
  /**
   * Mobil uygulama işi: kartta iPhone çerçevesi içinde ekranlar döner.
   * Görseller public/app/ altında (Bunny'deki PNG'ler 3 MB'ın üzerinde,
   * telefon ekranı en fazla ~170 px gösteriyor).
   */
  screens?: string[];
  /**
   * Bu işin karşılık geldiği hizmet. Hero'daki teklif bağlantısı, açık olan
   * slaydın hizmetini sihirbazda önceden seçili getirmek için kullanır.
   */
  service?: string;
}

export const FEATURED_WORK: FeaturedWork[] = [
  {
    name: "Doping Hafıza",
    service: "web-tasarim",
    headline: "Markanızın dijital yüzü.",
    blurb:
      "Her projeye markanızı, hedef kitlenizi ve sektörünüzü anlayarak başlıyoruz. Tasarımdan yayına almaya kadar tüm süreci tek elden yürütüyoruz.",
    sector: "Eğitim",
    accent: "#A855F7",
    poster: "/isler/dopinghafiza.jpg",
    url: "https://www.dopinghafiza.com",
  },
  {
    name: "Luzayn",
    service: "e-ticaret-web-siteleri",
    headline: "E-ticaret siteleri.",
    blurb:
      "Ürünlerinizi online ortamda güvenli ve kolay bir şekilde satabileceğiniz, kullanıcı dostu ve mobil uyumlu e-ticaret siteleri geliştiriyoruz.",
    sector: "Sağlık & Takviye",
    accent: "#22D3EE",
    video: "/hero/luzayn.mp4",
    videoSeconds: 5.3,
    poster: "/isler/luzayn.jpg",
    url: "https://luzayn.com",
  },
  {
    name: "Op. Dr. Murat Karakuş",
    service: "web-tasarim",
    headline: "Kurumsal web siteleri.",
    blurb:
      "Kullanıcı deneyimini ön planda tutarak estetik, işlevsel ve mobil uyumlu web siteleri tasarlıyoruz.",
    sector: "Sağlık",
    accent: "#2563EB",
    video: "/hero/doktormuratkarakus.mp4",
    videoSeconds: 7.8,
    cropScale: 1.07,
    poster: "/isler/doktormuratkarakus.jpg",
    url: "https://doktormuratkarakus.com",
  },
  {
    name: "AURA GEO",
    service: "mobil-uygulama",
    headline: "Mobil uygulama geliştirme.",
    blurb:
      "iOS ve Android için markanıza özel mobil uygulamalar geliştiriyor, tasarımdan mağaza yayınına kadar süreci biz yürütüyoruz.",
    sector: "Mobil Uygulama",
    accent: "#6366F1",
    poster: "/app/1.jpg",
    screens: ["/app/1_1.jpg", "/app/10.jpg", "/app/11.jpg"],
  },
  {
    name: "Maderia",
    service: "hazir-web-site",
    headline: "Tek elden dijital çözüm.",
    blurb:
      "Web tasarım ve yazılım süreçlerinde müşterilerimize yalnızca bir site değil, eksiksiz ve kullanıma hazır dijital çözümler sunuyoruz.",
    sector: "Yeme & İçme",
    accent: "#F97316",
    video: "/hero/maderia-v2.mp4",
    videoSeconds: 6.4,
    poster: "/isler/maderia.jpg",
    url: "https://maderia.com.tr",
  },
  {
    name: "NeuroPlanck",
    service: "domain-hosting",
    headline: "Alan adından yayına.",
    blurb:
      "Web sitenizin yayında kalması için gerekli olan alan adı kaydı ve güvenilir hosting hizmetleriyle kesintisiz internet varlığı sağlıyoruz.",
    sector: "E-Ticaret",
    accent: "#10B981",
    video: "/hero/neuroplanck.mp4",
    videoSeconds: 8.8,
    poster: "/isler/neuroplanck.jpg",
    url: "https://joyful-store-maker.vercel.app",
  },
  {
    name: "Turkey Travel Agent",
    service: "hazir-web-site",
    headline: "Anahtar teslim web siteler.",
    blurb:
      "Alan adından tasarıma, yayına almaktan mobil uyuma kadar her şeyi biz üstleniyoruz.",
    sector: "Turizm",
    accent: "#14B8A6",
    video: "/hero/turkeytravelagency.mp4",
    videoSeconds: 7.6,
    poster: "/isler/turkeytravelagency.jpg",
    url: "https://demo.integral.org.tr/turkeytravelagent-com/",
  },
  {
    name: "Liudmila Remax",
    service: "kurumsal-kimlik",
    headline: "Markanızın kimliği.",
    blurb:
      "Firmanızın değerlerini yansıtan logo, kartvizit, antetli kağıt gibi kurumsal kimlik tasarımlarıyla markanızı güçlü bir şekilde temsil edin.",
    sector: "Gayrimenkul",
    accent: "#F59E0B",
    video: "/hero/liudmilaremax-v2.mp4",
    videoSeconds: 6.1,
    poster: "/isler/liudmilaremax.jpg",
    url: "https://demo.integral.org.tr/liudmilaremax-com/",
  },
];

export const REFERENCES: ReferenceClient[] = [
  { name: "3689", logo: "/referanslar/3689.webp" },
  { name: "Ada", logo: "/referanslar/ada_logo.webp" },
  { name: "Adasa", logo: "/referanslar/adasa_logo.webp" },
  { name: "Agile", logo: "/referanslar/agile-logo.webp" },
  { name: "AHD", logo: "/referanslar/ahd.webp" },
  { name: "Aksa Zemin", logo: "/referanslar/aksazemin.webp" },
  { name: "Alarm24", logo: "/referanslar/alarm24.webp" },
  { name: "Albeni Şemsiye", logo: "/referanslar/albenisemsiye.webp" },
  { name: "Alkeba", logo: "/referanslar/alkeba.webp" },
  { name: "Alperen Ekici", logo: "/referanslar/alperenekici.webp" },
  { name: "Alperen Prefabrik", logo: "/referanslar/alperenpref.webp" },
  { name: "Ant Prime", logo: "/referanslar/antprime.webp" },
  { name: "Ardem Zemin", logo: "/referanslar/ardemzeminlogo.webp" },
  { name: "Aren Art", logo: "/referanslar/arenart.webp" },
  { name: "Asana", logo: "/referanslar/asana.webp" },
  { name: "Ateşlift Asansörleri", logo: "/referanslar/ateslift-asansorleri-logo.webp" },
  { name: "AY Mühendislik", logo: "/referanslar/ay_muhendislik_logo.webp" },
  { name: "Aydın Konveyör", logo: "/referanslar/aydinkonveyor.webp" },
  { name: "Aymes", logo: "/referanslar/aymes.webp" },
  { name: "Bakalit", logo: "/referanslar/bakalit-logo.webp" },
  { name: "Bar Bayani", logo: "/referanslar/barbayani.webp" },
  { name: "Bayılıksız", logo: "/referanslar/baylyksyz-2.webp" },
  { name: "Bekirhan", logo: "/referanslar/bekirhanlogo.webp" },
  { name: "Bena", logo: "/referanslar/bena-1.webp" },
  { name: "Beysan Zemin", logo: "/referanslar/beysanzemin-logo.webp" },
  { name: "BGM", logo: "/referanslar/bgm.webp" },
  { name: "Biletin Bayisi", logo: "/referanslar/biletinbayisi.webp" },
  { name: "Bursa Ajansı", logo: "/referanslar/bursaajansi.webp" },
  { name: "Bursa Anahtar", logo: "/referanslar/bursaanahtar.webp" },
  { name: "Buzer", logo: "/referanslar/buzer.webp" },
  { name: "Çamak Cam", logo: "/referanslar/camakcam.webp" },
  { name: "Cango", logo: "/referanslar/cango.webp" },
  { name: "Canseven", logo: "/referanslar/canseven.webp" },
  { name: "CLO Law", logo: "/referanslar/clolaw.webp" },
  { name: "Cool Travel", logo: "/referanslar/cooltravel.webp" },
  { name: "Çukurova Tohum", logo: "/referanslar/cukurova-tohum.webp" },
  { name: "Debut", logo: "/referanslar/debutlogo_.webp" },
  { name: "Delta Prefabrik", logo: "/referanslar/deltaprefabrik.webp" },
  { name: "Doğu Batı", logo: "/referanslar/dogubati.webp" },
  { name: "Dry Floors", logo: "/referanslar/dryfloors-logo1.webp" },
  { name: "Düzey Medical", logo: "/referanslar/duzeymedical.webp" },
  { name: "DVS Tekstil", logo: "/referanslar/dvs-tekstil.webp" },
  { name: "Ence", logo: "/referanslar/ence.webp" },
  { name: "Ersa", logo: "/referanslar/ersa.webp" },
  { name: "Esider", logo: "/referanslar/esider.webp" },
  { name: "Fam", logo: "/referanslar/fam.webp" },
  { name: "Foremak", logo: "/referanslar/foremak.webp" },
  { name: "Fuga Prefabrik", logo: "/referanslar/fuga-prefabrik.webp" },
  { name: "Galata Park", logo: "/referanslar/galatapark.webp" },
  { name: "Gediz Mobilya", logo: "/referanslar/gediz-mobilya-logo.webp" },
  { name: "Gem Danışmanlık", logo: "/referanslar/gemdanismanlik-logo.webp" },
  { name: "Geotech", logo: "/referanslar/geotech.webp" },
  { name: "Gizabella", logo: "/referanslar/gizabella-logo-1.webp" },
  { name: "Göksu İklimlendirme", logo: "/referanslar/goksuiklimlendirme.webp" },
  { name: "Grass", logo: "/referanslar/grass.webp" },
  { name: "Güntür", logo: "/referanslar/guntur.webp" },
  { name: "Hakan Özkul", logo: "/referanslar/hakanozkul.webp" },
  { name: "Haksan", logo: "/referanslar/haksan.webp" },
  { name: "Han Apartman", logo: "/referanslar/han-apartman.webp" },
  { name: "Hanamaru", logo: "/referanslar/hanamaru.webp" },
  { name: "Haymo Fis", logo: "/referanslar/haymofis.webp" },
  { name: "Helvacıoğlu Pansiyon", logo: "/referanslar/helvacioglupansiyon.webp" },
  { name: "Herbalife", logo: "/referanslar/herbalife.webp" },
  { name: "HMS", logo: "/referanslar/hms.webp" },
  { name: "House Chill", logo: "/referanslar/housechill.webp" },
  { name: "Housecurity", logo: "/referanslar/housecurity.webp" },
  { name: "Hür Kimya", logo: "/referanslar/hurkimya-logo-1.webp" },
  { name: "Icebag", logo: "/referanslar/icebag.webp" },
  { name: "İcmal", logo: "/referanslar/icmal-logo.webp" },
  { name: "İki H Tasarım", logo: "/referanslar/ikihtasarim.webp" },
  { name: "Infinity Enerji", logo: "/referanslar/infinity-enerji_logo_2.webp" },
  { name: "İpek", logo: "/referanslar/ipek.webp" },
  { name: "İzvak", logo: "/referanslar/izvak.webp" },
  { name: "Kazanç", logo: "/referanslar/kazanc-yatagragm-logo.webp" },
  { name: "Kibarköy Et Ürünleri", logo: "/referanslar/kibarkoy-et-urunleri.webp" },
  { name: "Kitaş Zemin", logo: "/referanslar/kitaszemin.webp" },
  { name: "Kutlu", logo: "/referanslar/kutlu.webp" },
  { name: "Referans", logo: "/referanslar/logo.webp" },
  { name: "Referans", logo: "/referanslar/logo-1.webp" },
  { name: "Bahçesaray Kahve", logo: "/referanslar/logo-bahcesaraykahve.webp" },
  { name: "Doğal", logo: "/referanslar/logo-dogal.webp" },
  { name: "Joe", logo: "/referanslar/logo-joe.webp" },
  { name: "Neli Kahve", logo: "/referanslar/logo-nelikahve.webp" },
  { name: "Lunadenn", logo: "/referanslar/lunadenn-logo.webp" },
  { name: "MAD Mimarlık", logo: "/referanslar/madmimarlik.webp" },
  { name: "Madr", logo: "/referanslar/madr.webp" },
  { name: "Mamma Besin Ürünleri", logo: "/referanslar/mamma-besin_urunleri.webp" },
  { name: "Marmara", logo: "/referanslar/marmara.webp" },
  { name: "Mars Yönetim", logo: "/referanslar/mars-yonetim-logo.webp" },
  { name: "Masah Gold", logo: "/referanslar/masah_gold_.webp" },
  { name: "Master Makina", logo: "/referanslar/mastermakina.webp" },
  { name: "Meriç", logo: "/referanslar/meric.webp" },
  { name: "Mert Metal", logo: "/referanslar/mert-metal-logo.webp" },
  { name: "Mesut Tekstil", logo: "/referanslar/mesuttekstil.webp" },
  { name: "Metar", logo: "/referanslar/metar.webp" },
  { name: "Modda", logo: "/referanslar/modda-logo.webp" },
  { name: "Mutluoğlu", logo: "/referanslar/mutluoglu.webp" },
  { name: "N. Karabulut", logo: "/referanslar/n-karabulut.webp" },
  { name: "Nanoen", logo: "/referanslar/nanoen.webp" },
  { name: "Nar İstanbul", logo: "/referanslar/naristanbul.webp" },
  { name: "Negemaag", logo: "/referanslar/negemaag.webp" },
  { name: "Novymask", logo: "/referanslar/novymask-logo.webp" },
  { name: "Nutritions", logo: "/referanslar/nutritions.webp" },
  { name: "NVE", logo: "/referanslar/nve.webp" },
  { name: "Odak CNC", logo: "/referanslar/odakcnc.webp" },
  { name: "Online", logo: "/referanslar/online.webp" },
  { name: "ORN Makine", logo: "/referanslar/orn-makine.webp" },
  { name: "Oryen Eğitim Danışmanlık", logo: "/referanslar/oryenegitimdanismanlik.webp" },
  { name: "Özgür Yıldız", logo: "/referanslar/ozgur-yildiz-logo.webp" },
  { name: "Öztürgütler", logo: "/referanslar/ozturgutlar-logo.webp" },
  { name: "Panoteks", logo: "/referanslar/panoteks.webp" },
  { name: "Parga", logo: "/referanslar/parga.webp" },
  { name: "Partner Pet", logo: "/referanslar/partner-pet-logo.webp" },
  { name: "Pergola", logo: "/referanslar/pergola.webp" },
  { name: "Pizza L'arte", logo: "/referanslar/pizza-larte-logo.webp" },
  { name: "Prime Mall Taksi", logo: "/referanslar/primemalltaksi-logo.webp" },
  { name: "Proje Antalya", logo: "/referanslar/proje_antalya.webp" },
  { name: "Realite", logo: "/referanslar/realite-logo.webp" },
  { name: "Reiki Nefes", logo: "/referanslar/reikinefes-logo.webp" },
  { name: "Retro Art", logo: "/referanslar/retro-art-logo.webp" },
  { name: "Rocco Pizza", logo: "/referanslar/rocco-pizza.webp" },
  { name: "Roza Danışmanlık", logo: "/referanslar/roza-danismanlik-temizlik.webp" },
  { name: "RTK", logo: "/referanslar/rtk.webp" },
  { name: "Sadıkoğlu", logo: "/referanslar/sadikoglu.webp" },
  { name: "Sakarya Tadilat", logo: "/referanslar/sakarya-tadilat-tamirat-isleri.webp" },
  { name: "Serkan Plastik", logo: "/referanslar/serkanplastik.webp" },
  { name: "SHM", logo: "/referanslar/shm.webp" },
  { name: "Sibe Akademi", logo: "/referanslar/sibeakademi.webp" },
  { name: "Şifa Market", logo: "/referanslar/sifamarket.webp" },
  { name: "Sinerji", logo: "/referanslar/sinerji.webp" },
  { name: "SPN Clinic", logo: "/referanslar/spnclinic-logo.webp" },
  { name: "Stil Kutu", logo: "/referanslar/stilkutu.webp" },
  { name: "Suntent", logo: "/referanslar/suntent-logo-_1.webp" },
  { name: "Taşkıran", logo: "/referanslar/taskiran.webp" },
  { name: "Torex", logo: "/referanslar/torexlogo.webp" },
  { name: "Transpaletçi", logo: "/referanslar/transpaletchi.webp" },
  { name: "TUK", logo: "/referanslar/tuk-01.webp" },
  { name: "Turkey", logo: "/referanslar/turkey-logo.webp" },
  { name: "Tuy Kaitai Kogyo", logo: "/referanslar/tuy-kaitai-kogyo-logo.webp" },
  { name: "Ustası Gelsin", logo: "/referanslar/ustasigelsin-logo.webp" },
  { name: "Uygar Zemin", logo: "/referanslar/uygar-zemin-logo.webp" },
  { name: "Uzman Dost Eli", logo: "/referanslar/uzmandosteli-logo.webp" },
  { name: "VBox", logo: "/referanslar/vbox.webp" },
  { name: "Vitamin", logo: "/referanslar/vitamin.webp" },
  { name: "Yakut Alu", logo: "/referanslar/yakutalu.webp" },
  { name: "Yalınkaya", logo: "/referanslar/yalinkaya.webp" },
  { name: "Yasa Home", logo: "/referanslar/yasahome.webp" },
  { name: "Yaşam Park", logo: "/referanslar/yasam-park-br-mobil.webp" },
  { name: "YKM Proje Zemin", logo: "/referanslar/ykm_proje_zemin_2_2.webp" },
  { name: "YKM Zemin", logo: "/referanslar/ykmzemin-lg.webp" },
  { name: "YokYok", logo: "/referanslar/yokyok.webp" },
  { name: "Zeminpak", logo: "/referanslar/zeminpak.webp" },
  { name: "Zeminsan", logo: "/referanslar/zeminsan.webp" },
];
