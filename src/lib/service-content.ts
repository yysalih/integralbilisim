/**
 * Hizmet sayfalarının derin içeriği.
 *
 * Kaynak kuralı: firmaya ait her iddia (dahil olan hizmetler, teslim formatları,
 * süreç adımları) integralbilisim.com'daki eski hizmet sayfalarından ve firmanın
 * kendi blog yazılarından alınmıştır; her kaydın `sources` alanı bunu gösterir.
 * Genel bilgi niteliğindeki cümleler (ör. alan adı seçimi, marka koruma süresi)
 * doğrulanabilir genel bilgilerdir. Kaynağı olmayan süre, rakam veya garanti
 * yazılmaz.
 */

export interface ServiceSection {
  heading: string;
  body: string[];
  list?: { label: string; detail: string }[];
}

export interface ServiceStep {
  title: string;
  detail: string;
}

export interface ServiceContent {
  /** Hizmetin ne olduğunu ve kime ne kazandırdığını anlatan giriş. */
  intro: string[];
  sections: ServiceSection[];
  /**
   * Hizmete özgü süreç. Verilmezse web hizmetlerinde ana sayfadaki genel
   * süreç gösterilir; diğerlerinde süreç bölümü hiç gösterilmez.
   */
  process?: ServiceStep[];
  /** Hero vitrinindeki gerçek işlerden bu hizmete karşılık gelenler. */
  works?: string[];
  /** Sektör temaları gibi etiket listesi (yalnızca ilgili hizmetlerde). */
  chips?: { heading: string; intro: string; items: string[] };
  faqs: { q: string; a: string }[];
  /** İçeriğin dayandığı eski sayfalar — doğrulama içindir, sayfada gösterilmez. */
  sources: string[];
}

/** integralbilisim.com/web-siteler sayfasındaki sektör temaları. */
const HAZIR_THEMES = [
  "Ajans", "Asansör Firması", "Avukat / Hukuk", "Belediye / Dernek", "Böcek İlaçlama",
  "Cafe & Restoran", "Cast Ajansı", "Çiçekçi", "Danışmanlık", "Düğün Salonu", "Eğitim / Okul",
  "Elektrik / Elektronik", "Emlak", "Finans / Mali Müşavir", "Firma Rehberi",
  "Fotoğrafçılık / Kişisel Blog", "Gıda", "Giyim & Çanta", "Güzellik Salonu", "Hastane / Sağlık",
  "İnşaat", "İş Makinası / Hafriyat", "Kamera & Alarm Sistemleri", "Kreş / Anaokulu",
  "Kuaför", "Kurumsal Firma", "Mekan Rehberi", "Mimarlık", "Mobilya", "Mühendislik / Makine",
  "Nakliyat / Lojistik", "Otel", "Parti / Aday", "Pastane / Unlu Mamüller",
  "PVC Zemin & Pencere", "Rent a Car", "Spor Salonu / Fitness", "Takı & Mücevherat",
  "Teknik Servis", "Temizlik Firması", "Tur & Gezi", "Yangın Söndürme", "Yedek Parça",
  "Yol Yardım", "Sigortacı", "Tarım / Ziraat", "Reklam & Tabela", "Oto Servis",
  "OSGB", "Dış Ticaret", "Vize & Tercüman", "Matbaa",
];

/** integralbilisim.com/e-ticaret-siteleri sayfasındaki e-ticaret temaları. */
const ETICARET_THEMES = [
  "Mobilya & Dekorasyon", "Oto Lastik / Yedek Parça", "İçecek", "Su Arıtma",
  "Şarküteri & Süt Ürünleri", "Spor Ekipmanları", "Motosiklet & Bisiklet Aksesuar",
  "Kuruyemiş", "Unlu Mamüller", "Kuyumcu", "Ev Dekorasyon", "Fast Food", "Çiçekçi",
  "Organik Ürünler", "Medikal / Kozmetik", "Temizlik Ürünleri", "İş Elbiseleri",
  "Züccaciye", "Yöresel Ürünler", "Telefon & Aksesuar", "Kamp & Av Malzemeleri",
  "Bebek & Çocuk Ürünleri", "Sandalye & Koltuk", "Saat",
];

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  "web-tasarim": {
    intro: [
      "Mahallenizdeki pastaneden kurumsal holdinglere kadar işletmelerin ortak noktası bir web sitesine sahip olmaları. Web sitesi, firmanızın fiziksel dünyadaki varlığını internete taşır; ürünlerinizi, hizmetlerinizi ve referanslarınızı günün her saatinde ulaşılabilir kılar.",
      "Bize ilettiğiniz bilgiler doğrultusunda sitenizi baştan sona doldurup yayına hazır hale getiriyoruz. Alan adı, hosting, kurumsal e-posta ve teknik destek aynı çatı altında; tek muhatabınız biziz.",
    ],
    sections: [
      {
        heading: "Web sitesi işletmenize ne kazandırır?",
        body: [
          "Yaptığınız işleri ve referanslarınızı daha fazla kişiye göstermek, size yeni müşteri olarak geri döner. Web sitesi sizi rakiplerinize göre daha ulaşılabilir ve tanınır kılar; arayan kişi telefonunuzu, adresinizi ve çalışmalarınızı tek yerde bulur.",
          "Sitenizde ister ürünlerinize, ister hizmetlerinize, isterseniz yalnızca firma bilgilerinize yer verebilirsiniz. Önemli olan, ziyaretçinin aradığı bilgiyi bulup sayfadan memnun ayrılmasıdır: en güzel tasarım bile uzun, alakasız ya da başka yerden kopyalanmış metinlerle etkisini yitirir.",
        ],
      },
      {
        heading: "İyi bir web sitesinde neye dikkat ediyoruz?",
        body: [
          "Bir web sitesini ziyaretçinin gözünden kuruyoruz. Tasarım kararlarımızın dayandığı ilkeler şunlar:",
        ],
        list: [
          { label: "Önce içerik", detail: "Ziyaretçi aradığı bilgiyi hızla bulmalı. Metinler kısa, net ve size özgü olmalı." },
          { label: "Sade arayüz", detail: "Logo, menü ve öne çıkan alanların yerini kullanıcının bakış alışkanlıklarına göre belirliyoruz." },
          { label: "Kolay gezinme", detail: "Ana sayfadan her bölüme, iç sayfalardan diğerlerine bağlantı veriyoruz; geri tuşuna ihtiyaç kalmamalı." },
          { label: "Okunabilirlik", detail: "Yazı rengi, boyutu ve arka plan uyumu metnin rahat okunmasını sağlayacak şekilde ayarlanır." },
          { label: "Tarayıcı uyumu", detail: "Ziyaretçinin hangi tarayıcıyı kullanacağı bilinemez; site hepsinde aynı şekilde çalışmalı." },
        ],
      },
      {
        heading: "Mobil uyum artık bir seçenek değil",
        body: [
          "İnternet kullanıcılarının büyük bölümü sitelere telefondan giriyor. Mobil uyumlu (responsive) tasarım, sitenin masaüstü, tablet ve telefonda kendiliğinden doğru görünmesini sağlar; ekrandan taşan görseller ya da kaydırılamayan menüler ziyaretçiyi hemen sitenizden çıkarır.",
          "Responsive tasarım tek bir kod yapısıyla tüm cihazlarda çalışır. Farklı cihazlar için ayrı siteler yaptırmanız gerekmez; güncellemeleri tek yerden yaparsınız ve paylaşılan bağlantılar tek adreste toplanır. Arama motorları da mobil uyumlu sitelere sıralamada öncelik verir.",
        ],
      },
      {
        heading: "Web tasarım fiyatı neleri kapsamalı?",
        body: [
          "Fiyatı belirleyen, paketin içeriğidir. Bir sitenin yayına açılması için gereken tasarım, yazılım, alan adı, hosting, yönetim paneli ve teknik destek fiyata dahil olmalı. Bir forum sitesiyle bir e-ticaret sitesinin ihtiyaçları farklı olduğu için fiyat da projeye göre değişir.",
          "Karar verirken yalnızca en düşük fiyata bakmamanızı öneririz. Teklifin neleri kapsadığını, yayından sonra güncelleme ve teknik sorunlar için firmaya ulaşıp ulaşamayacağınızı sorun. Bizim paketlerimizde alan adınızla kurumsal e-posta adresleri (ör. info@firmaniz.com) ücretsizdir ve yıl boyunca ücretsiz teknik destek veriyoruz.",
        ],
      },
    ],
    works: ["Doping Hafıza", "Op. Dr. Murat Karakuş", "Maderia", "Turkey Travel Agent", "Liudmila Remax"],
    faqs: [
      {
        q: "Web sitesi yaptırmak için neler hazırlamalıyım?",
        a: "Firma bilgileriniz, hizmet ya da ürün açıklamalarınız, logonuz ve kullanmak istediğiniz görseller yeterli. Elinizdeki içerikleri bize iletmeniz yeterli; siteye yerleştirilmesini biz yapıyoruz.",
      },
      {
        q: "Hazır tema mı, özel tasarım mı seçmeliyim?",
        a: "Hazır temalar sektörünüze göre önceden tasarlandığı için daha hızlı ve ekonomiktir. Markanıza özgü bir arayüz ya da özel işlevler istiyorsanız özel tasarım daha doğru olur. İkisini Hazır Web Site sayfamızda karşılaştırdık.",
      },
      {
        q: "Kurumsal e-posta adresi veriyor musunuz?",
        a: "Evet. Alan adınızla (ör. info@firmaniz.com) kurumsal e-posta adreslerini ücretsiz oluşturuyoruz. Müşterilerinizle bu adreslerden yazışmak sizi daha güvenilir ve kurumsal gösterir.",
      },
      {
        q: "Yayından sonra destek veriyor musunuz?",
        a: "Evet. Yıl boyunca ücretsiz teknik destek veriyoruz; bir sorun ya da güncelleme ihtiyacında bize istediğiniz zaman ulaşabilirsiniz.",
      },
      {
        q: "Sitem Google'da üst sıralarda çıkar mı?",
        a: "Sitenizi arama motorlarına uygun bir teknik altyapıyla kuruyoruz: mobil uyum, hızlı açılış ve doğru sayfa yapısı. Sıralama ise içeriğinize ve sektörünüzdeki rekabete bağlıdır; bunun için kimse garanti veremez.",
      },
    ],
    sources: [
      "https://integralbilisim.com/web-tasarim/",
      "https://integralbilisim.com/web-tasarimin-temel-ilkeleri/",
      "https://integralbilisim.com/responsive-web-tasarim-nedir/",
      "https://integralbilisim.com/web-tasarim-fiyatlari-neleri-kapsar-2/",
    ],
  },

  "hazir-web-site": {
    intro: [
      "Hazır web sitesi, sektörünüz için önceden tasarlanmış bir temanın firmanıza göre doldurulmasıdır. Tasarım ve yazılımın temeli hazır olduğu için süre ve maliyet, sıfırdan bir site geliştirmeye göre belirgin şekilde düşer; siz yalnızca firmanıza uyarlanmasının karşılığını ödersiniz.",
      "Hazır web sitesi paketlerimiz grafik tasarım ve web yazılım uzmanlarımız tarafından, firmanızı internette en iyi şekilde temsil edecek ve bilgisayar, tablet ya da telefonda sorunsuz çalışacak şekilde hazırlandı.",
    ],
    sections: [
      {
        heading: "Pakete neler dahil?",
        body: [
          "Hazır web sitesi paketlerimizde siteyle birlikte ihtiyaç duyacağınız temel hizmetler de gelir. Alan adı, hosting ve e-posta için ayrı ayrı firma aramanız, hangisinin güvenilir olduğunu düşünmeniz gerekmez; bir sorun olduğunda tek bir muhatapla kısa yoldan çözersiniz.",
        ],
        list: [
          { label: "1 yıllık alan adı, hosting ve e-posta", detail: "İlk yıl pakete dahildir, ayrıca ücret alınmaz." },
          { label: "Türkçe yönetim paneli", detail: "Kod bilmeden hizmet ekleyebilir, referans yükleyebilir, iletişim bilgilerinizi anında değiştirebilirsiniz." },
          { label: "Yıl boyu teknik destek", detail: "Teknik hizmet yıl boyunca müşteri temsilcilerimiz tarafından verilir." },
          { label: "Ücretsiz güncellemeler", detail: "Sistemdeki teknolojik güncellemeler ek ücret olmadan yapılır." },
          { label: "Mobil uyum", detail: "Tüm temalar telefon, tablet ve bilgisayarda doğru görünecek şekilde hazırlanmıştır." },
        ],
      },
      {
        heading: "Hazır site kimler için uygun?",
        body: [
          "Hazır web siteleri özellikle bütçesi sınırlı ama profesyonel bir siteye ihtiyaç duyan küçük işletmeler ve girişimciler için uygundur. Hızla yayına çıkmak isteyenler, belirli bir kampanya ya da etkinlik için site kuranlar ve portföyünü sergilemek isteyen serbest çalışanlar da bu çözümden en çok faydalanan gruplardır.",
          "Kodlama ya da tasarım bilgisi gerekmez. Temel çalışmanın büyük kısmı önceden yapıldığı için hedef kitlenizle çok daha erken buluşursunuz.",
        ],
      },
      {
        heading: "Hazır site mi, özel tasarım mı?",
        body: [
          "Hazır site; hız, düşük maliyet ve sektörünüze uygun bir başlangıç noktası sunar. Özel tasarım ise markanıza özgü bir arayüz, hazır temalarda bulunmayan işlevler ve sitenin altyapısı üzerinde tam kontrol isteyenler içindir.",
          "Bilmeniz gereken önemli bir fark: hazır sitelerimiz İntegral Bilişim sunucularında çalışan yazılımımız üzerine kuruludur ve kaynak dosyaları başka bir sunucuya taşınamaz. Sitenizi kendi sunucunuzda barındırmayı planlıyorsanız özel tasarım doğru seçim olur.",
        ],
      },
    ],
    chips: {
      heading: "Sektörünüze özel temalar",
      intro: "Hazır web sitesi temalarımız farklı sektörlerin ihtiyaçlarına göre ayrı ayrı tasarlandı. Bazıları:",
      items: HAZIR_THEMES,
    },
    works: ["Maderia", "Turkey Travel Agent"],
    faqs: [
      {
        q: "Hazır site kaç günde yayına alınır?",
        a: "Hazır web sitesi çözümlerimizde siteniz 5 gün içinde yayına alınır.",
      },
      {
        q: "Hazır sitemi kendim güncelleyebilir miyim?",
        a: "Evet. Türkçe yönetim paneliyle kod bilmeden hizmet ekleyebilir, referans yükleyebilir ve iletişim bilgilerinizi değiştirebilirsiniz.",
      },
      {
        q: "Alan adı, hosting ve e-posta pakete dahil mi?",
        a: "Evet. İlk yıl için alan adı, hosting ve e-posta hizmeti pakete dahildir; ayrıca ücret alınmaz.",
      },
      {
        q: "İkinci yıldan itibaren ne oluyor?",
        a: "Sitenizin yayında kalması için hosting yıllık olarak yenilenir. Yıllık hosting ödemesi yapılmayan siteler bir hafta içinde yayından kalkar; yenileme takibini birlikte yapıyoruz.",
      },
      {
        q: "Hazır siteyi başka bir sunucuya taşıyabilir miyim?",
        a: "Hayır. Hazır sitelerimiz yalnızca İntegral Bilişim sunucularında çalışan yazılım üzerine kuruludur ve kaynak kodları farklı bir sunucuda çalışmaz. Kendi sunucunuzu kullanmak istiyorsanız özel tasarım öneririz.",
      },
      {
        q: "Tema firmama göre düzenleniyor mu?",
        a: "Evet. Bize ilettiğiniz bilgi ve görsellerle tema baştan sona doldurulur; logonuz, metinleriniz ve iletişim bilgilerinizle yayına hazır hale gelir.",
      },
    ],
    sources: [
      "https://integralbilisim.com/hazir-web-site/",
      "https://integralbilisim.com/hazir-web-sitesi-nasil-olmalidir/",
      "https://integralbilisim.com/hazir-web-sitesi-olusturmak/",
      "https://integralbilisim.com/web-siteler/",
    ],
  },

  "e-ticaret-web-siteleri": {
    intro: [
      "Perakende hızla dijitalleşiyor. E-ticaret sitesi, ürünlerinizi bulunduğunuz şehrin ötesine taşıyan ve günün her saati açık olan bir dijital mağazadır; müşterileriniz kendi zamanlarına göre alışveriş yapar, siz de satış fırsatlarınızı mesai saatlerinin dışına taşırsınız.",
      "Başarılı bir e-ticaret sitesinin ürünleri sergilemekten ibaret olmadığını biliyoruz. Kullanıcı dostu bir arayüz, güvenli ödeme ve sağlam bir altyapı, online satışlarınızın verimini doğrudan belirler.",
    ],
    sections: [
      {
        heading: "E-ticaret işletmenize ne kazandırır?",
        body: [
          "Fiziksel bir mağazanın kira, personel ve fatura gibi sürekli giderleri varken e-ticaret sitesi çok daha düşük sabit maliyetle işletilebilir. Ürün yönetimi, stok takibi ve sipariş işleme gibi süreçler otomatikleşir, iş yükünüz hafifler.",
          "Pazarlama tarafında da elinizi güçlendirir: hedefli reklam kampanyaları yürütmek, müşteri verilerini analiz etmek ve kişiselleştirilmiş alışveriş deneyimleri sunmak kendi sitenizde çok daha kolaydır.",
        ],
      },
      {
        heading: "E-ticaret sitesi kurarken neye dikkat ediyoruz?",
        body: ["E-ticaret sitelerinin tasarımında şu temel ilkelere odaklanıyoruz:"],
        list: [
          { label: "Kullanıcı deneyimi", detail: "Ziyaretçi ürünü kolayca bulmalı, sepete eklemeli ve sorunsuz ödeme yapabilmeli. Sezgisel ve akıcı bir gezinme sunuyoruz." },
          { label: "Mobil uyum", detail: "Trafiğin büyük kısmı telefondan geliyor; site masaüstü, tablet ve telefonda aynı kusursuzlukta çalışır." },
          { label: "Güvenli ödeme", detail: "SSL ile şifrelenmiş, güvenilir ödeme altyapılarını (kredi kartı, EFT/havale, mobil ödeme) sitenize entegre ediyoruz." },
          { label: "SEO uyumlu altyapı", detail: "Ürün ve kategori sayfalarınızın arama motorlarında bulunabilmesi için siteyi SEO ilkelerine uygun kuruyoruz." },
          { label: "Yönetim paneli", detail: "Ürün ekleme, stok durumu, sipariş takibi ve müşteri bilgilerini tek panelden yönetirsiniz." },
          { label: "Hız", detail: "Hızlı açılan bir mağaza hem satın alma oranını hem de arama sıralamasını olumlu etkiler." },
        ],
      },
    ],
    chips: {
      heading: "Sektörlere göre e-ticaret temaları",
      intro: "Farklı ürün gruplarının ihtiyaçlarına göre hazırlanmış e-ticaret temalarımızdan bazıları:",
      items: ETICARET_THEMES,
    },
    works: ["Luzayn", "NeuroPlanck"],
    faqs: [
      {
        q: "Hangi ödeme yöntemlerini kullanabilirim?",
        a: "Kredi kartı, EFT/havale ve mobil ödeme gibi yaygın ödeme yöntemlerini, SSL ile şifrelenmiş güvenli altyapılar üzerinden sitenize entegre ediyoruz.",
      },
      {
        q: "Ürünleri ve siparişleri kendim yönetebilir miyim?",
        a: "Evet. Yönetim panelinden ürün ekleyip çıkarabilir, stok durumunu güncelleyebilir, siparişleri takip edebilir ve müşteri bilgilerine ulaşabilirsiniz.",
      },
      {
        q: "Sitem telefonda da düzgün çalışır mı?",
        a: "Evet. Tasarladığımız tüm e-ticaret siteleri masaüstü, tablet ve telefonda sorunsuz çalışacak şekilde mobil uyumlu hazırlanır.",
      },
      {
        q: "Kendi sitem mi, pazaryeri mi?",
        a: "Pazaryerleri hazır bir trafik sunar ama komisyon, platform kuralları ve fiyat rekabetiyle gelir. Kendi sitenizde ise marka, müşteri ilişkisi ve veriler sizindir. Birçok işletme ikisini birlikte kullanır; doğru dengeyi ürününüze göre birlikte belirleyebiliriz.",
      },
    ],
    sources: [
      "https://integralbilisim.com/e-ticaret-web-siteleri/",
      "https://integralbilisim.com/e-ticaret-siteleri/",
      "https://integralbilisim.com/e-ticaret-sitesi-nedir-2/",
    ],
  },

  "mobil-uygulama": {
    intro: [
      "Mobil uygulama, müşterinizle cebindeki ekran üzerinden doğrudan ve sürekli bir bağ kurmanın yoludur. Web sitesinden farklı olarak bildirimlerle kullanıcıya ulaşabilir, telefonun kamera ve konum gibi özelliklerinden yararlanabilir, sık kullanılan işlemleri tek dokunuşa indirebilirsiniz.",
      "iOS ve Android için markanıza özel uygulamalar geliştiriyor, arayüz tasarımından App Store ve Google Play yayınına kadar süreci baştan sona yürütüyoruz.",
    ],
    sections: [
      {
        heading: "Uygulamanın kapsamını birlikte belirliyoruz",
        body: [
          "Her uygulama farklıdır; doğru kapsam, hem bütçeyi hem de yayın süresini belirler. Başlamadan önce şu soruların cevabını birlikte netleştiriyoruz:",
        ],
        list: [
          { label: "Platform", detail: "Yalnızca iOS, yalnızca Android ya da her ikisi. Kararı hedef kitlenizin kullandığı cihazlara göre veriyoruz." },
          { label: "Kullanıcı hesabı", detail: "Kullanıcıların giriş yapıp kendilerine ait verileri göreceği bir yapı gerekip gerekmediği." },
          { label: "Ödeme", detail: "Uygulama içinden satın alma ya da ödeme alınıp alınmayacağı." },
          { label: "Bildirimler", detail: "Kullanıcılara doğrudan bildirim gönderip göndermeyeceğiniz." },
          { label: "Arka uç", detail: "Uygulamanın konuşacağı mevcut bir sisteminiz olup olmadığı ya da sıfırdan kurulması gerektiği." },
        ],
      },
      {
        heading: "Güvenliği baştan tasarlıyoruz",
        body: [
          "Güvenlik, zaman baskısı nedeniyle çoğu projede sonraya bırakılır ve ancak bir sorun yaşandığında gündeme gelir. Hiçbir uygulama yüzde yüz güvenli olmasa da doğru alışkanlıklarla riskin büyük kısmı en baştan ortadan kaldırılabilir. Uygulama geliştirirken dikkat ettiğimiz noktalardan bazıları:",
        ],
        list: [
          { label: "Veri saklama", detail: "Hassas bilgi mümkün olduğunca cihazda tutulmaz; saklanması gerekenler şifrelenir, parolalar iOS'ta Keychain, Android'de Keystore içinde korunur." },
          { label: "Sunucu tarafında doğrulama", detail: "Uygulama bir ön yüzdür; gelen her veri hangi kanaldan gelirse gelsin sunucu tarafında ayrıca kontrol edilir." },
          { label: "Şifreli iletişim", detail: "Hassas veri yalnızca HTTPS üzerinden iletilir; uygulama, bağlandığı sunucunun sertifikasını doğrular." },
          { label: "Gereksiz izin yok", detail: "Rehber gibi kişisel verilere erişim yalnızca gerçekten gerekiyorsa istenir." },
          { label: "Kodun korunması", detail: "Yayından önce kod karartma (obfuscation) uygulanır, kaynak koddaki açıklama satırlarında anahtar ya da parola bırakılmaz." },
          { label: "Uygulama bütünlüğü", detail: "Kurulum dosyasının değiştirilip başka mağazalarda yeniden yayınlanmasına karşı önlem alınır." },
        ],
      },
    ],
    works: ["AURA GEO"],
    faqs: [
      {
        q: "Hem iOS hem Android için mi geliştiriyorsunuz?",
        a: "Projenin ihtiyacına göre tek platform ya da her ikisi için geliştirebiliyoruz. Kararı hedef kitlenizin hangi cihazları kullandığına göre birlikte veriyoruz.",
      },
      {
        q: "Uygulamayı mağazalara siz mi yüklüyorsunuz?",
        a: "Evet. App Store ve Google Play başvuru ve yayın sürecini biz yürütüyoruz.",
      },
      {
        q: "Yayından sonra güncelleme yapıyor musunuz?",
        a: "Evet. Yayın sonrasında bakım ve sürüm güncellemeleriyle uygulamanızın yanındayız.",
      },
      {
        q: "Mobil uygulama ne kadara mal olur?",
        a: "Fiyatı platform sayısı, kullanıcı hesabı, ödeme ve bildirim gibi özellikler belirler. Teklif sihirbazında bu seçimleri yaparak tahmini bir aralık görebilirsiniz.",
      },
    ],
    sources: [
      "src/lib/services.ts (mobil-uygulama kaydı)",
      "https://integralbilisim.com/mobil-uygulamalarda-en-cok-yapilan-10-guvenlik-hatasi/",
    ],
  },

  "domain-hosting": {
    intro: [
      "Alan adı (domain), web sitenizin internetteki adresidir; ziyaretçilerin sizi bulmak için tarayıcıya yazdığı isimdir. Hosting ise sitenizin dosyalarının saklandığı ve her ziyarette sunulduğu alandır. Bir web sitesinin sürekli erişilebilir ve hızlı olması bu iki temelin sağlamlığına bağlıdır.",
      "Markanıza en uygun alan adını seçmenizde danışmanlık veriyor, alan adını sizin adınıza tescil ediyor ve sitenizin ihtiyacına uygun hosting altyapısını sunuyoruz.",
    ],
    sections: [
      {
        heading: "Alan adı seçerken nelere dikkat etmeli?",
        body: [
          "Doğru alan adı markanızın akılda kalıcılığını, güvenilirliğini ve arama motorlarındaki görünürlüğünü etkiler. Seçim yaparken şu noktaları öneriyoruz:",
        ],
        list: [
          { label: "Kısa ve akılda kalıcı", detail: "Kolay hatırlanan ve hatasız yazılabilen bir isim seçin." },
          { label: "Markanızla uyumlu", detail: "Firma adınızı yansıtan bir alan adı marka bilinirliğinizi güçlendirir." },
          { label: "Tire kullanmayın", detail: "Kelimeleri tireyle ayırmak yerine bitişik yazılan alan adları tercih edilmelidir." },
          { label: "Kısaltmalara dikkat", detail: "Herkesin bildiği bir kısaltmanız yoksa kelimeyi kısaltmak sizi bulunmaz hale getirebilir." },
          { label: "İçerikle ilişki", detail: "Alan adı sitenizin konusuyla ne kadar uyumluysa o kadar etkili olur." },
        ],
      },
      {
        heading: ".com mu, .com.tr mi?",
        body: [
          ".com dünyada en yaygın kullanılan uzantıdır ve uluslararası bir imaj sunar; yurt dışına satış yapan ya da global bir kitleye seslenen işletmeler için doğal tercihtir. .com.tr ise Türkiye'ye özel uzantıdır; hedef kitlesi Türkiye olan işletmelere yerellik ve güven kazandırır.",
          "Popüler kelimelerle oluşturulmuş .com adreslerinin büyük bölümü dolu olduğu için aradığınız ismi .com.tr'de bulma ihtimaliniz daha yüksek olabilir. Birçok marka iki uzantıyı birlikte alıp birini diğerine yönlendirir. .tr uzantılı alan adlarının kayıt koşulları TRABİS tarafından belirlenir; başvuru sırasında güncel şartları sizin için kontrol ediyoruz.",
        ],
      },
      {
        heading: "Kaliteli hosting neden önemli?",
        body: [
          "Yavaş açılan sayfalar ziyaretçi kaybettirir; arama motorları da hızlı siteleri daha üst sıralarda gösterir. İyi bir hosting sitenizin her an erişilebilir olmasını, verilerinizin kötü amaçlı yazılım, siber saldırı ve veri kaybına karşı korunmasını sağlar.",
          "Hosting paketinin sitenizin ihtiyacını karşılayacak kapasitede olması gerekir. Disk alanı (sitenizin dosyaları için ayrılan yer) ve bant genişliği (aylık veri trafiği) en temel iki ölçüttür. İşiniz büyüdükçe paketin de büyüyebilmesi önemlidir.",
        ],
      },
      {
        heading: "Neler sunuyoruz?",
        body: [],
        list: [
          { label: "Alan adı tescili", detail: "Markanıza en uygun, henüz alınmamış alan adını bulup sizin adınıza tescil ediyoruz." },
          { label: "Güvenilir hosting", detail: "Sitenizin kesintisiz ve hızlı çalışması için güçlü sunucular ve modern altyapı." },
          { label: "SSL sertifikası", detail: "Sitenizle ziyaretçi arasındaki trafik şifrelenir, tarayıcıda güvenli bağlantı görünür." },
          { label: "Düzenli yedekleme", detail: "Olası aksaklıklarda verileriniz kaybolmasın diye düzenli yedek alınır." },
          { label: "Güvenlik duvarı", detail: "Sitenize yönelik tehditlere karşı gelişmiş koruma." },
          { label: "Teknik destek", detail: "Karşılaşacağınız sorunlarda hızlı destek; alan adı ve hosting sitenizle sorunsuz entegre edilir." },
        ],
      },
    ],
    faqs: [
      {
        q: "SSL sertifikası dahil mi?",
        a: "Evet. Sitelerimizde SSL sertifikası bulunur; sitenizle ziyaretçi arasındaki trafik şifrelenir ve tarayıcı güvenli bağlantı gösterir.",
      },
      {
        q: "Sitemin yedeği alınıyor mu?",
        a: "Evet. Olası bir aksaklıkta verilerinizin kaybolmaması için düzenli yedekleme yapıyoruz.",
      },
      {
        q: "Kurumsal e-posta adresi açabilir miyim?",
        a: "Evet. Alan adınızla (ör. info@firmaniz.com) kurumsal e-posta adresleri oluşturuyoruz.",
      },
      {
        q: "İstediğim alan adı alınmışsa ne yapmalıyım?",
        a: "Farklı bir uzantı (.com.tr gibi), markanızı tamamlayan bir kelime ya da daha kısa bir varyasyon deneyebilirsiniz. Markanıza en uygun boş alternatifi bulmanıza yardımcı oluyoruz.",
      },
    ],
    sources: [
      "https://integralbilisim.com/domain-hosting/",
      "https://integralbilisim.com/domain-nedir/",
      "https://integralbilisim.com/hosting-nedir/",
      "https://integralbilisim.com/com-ve-com-tr-arasindaki-fark-nedir/",
    ],
  },

  "marka-tescil": {
    intro: [
      "Markanız; ürünlerinizi, hizmetlerinizi ve şirketinizin itibarını temsil eder ve işletmenizin en değerli varlıklarından biridir. Marka tescili bu değeri yasal güvence altına alır: başkalarının aynı ya da karıştırılabilecek benzer bir ismi kullanmasını engeller.",
      "Ön araştırmadan başvuruya, yayın dönemindeki itirazlardan tescilin tamamlanmasına kadar süreci Türk Patent ve Marka Kurumu (TÜRKPATENT) nezdinde sizin adınıza yürütüyoruz.",
    ],
    sections: [
      {
        heading: "Marka tescili neden gerekli?",
        body: [
          "Tescil, markanız üzerinde size yasal tekel hakkı tanır. İzniniz olmadan kimse tescilli markanızı ya da onunla karıştırılabilecek bir markayı kullanamaz; böylece taklitçilik ve haksız rekabetin önüne geçersiniz.",
          "Tescilli marka müşterilerin gözünde daha güvenilir ve kurumsal bir izlenim yaratır. Aynı zamanda şirketinizin bir varlığı sayılır: gerektiğinde lisanslanabilir, devredilebilir ya da teminat olarak gösterilebilir.",
          "Tescilsiz bir markayla, benzer ismi kullanan başka bir işletmeyle yaşanacak anlaşmazlıklar çok daha karmaşık ve maliyetli olur. Tescil, olası bir ihlalde hukuki süreçleri hızlandırır; uzun vadede hem zaman hem para kazandırır.",
        ],
      },
      {
        heading: "Sınıf seçimi neden önemli?",
        body: [
          "Marka koruması, başvuruda seçtiğiniz mal ve hizmet sınıflarıyla sınırlıdır. Uluslararası Nice sınıflandırmasında 34'ü mal, 11'i hizmet olmak üzere 45 sınıf bulunur. Bugün yaptığınız işin yanında yakın gelecekte gireceğiniz alanları da hesaba katmak, ileride ikinci bir başvuruya gerek kalmamasını sağlar.",
          "Türkiye'de tescilli bir marka başvuru tarihinden itibaren 10 yıl korunur ve bu süre her 10 yılda bir yenilenebilir.",
        ],
      },
    ],
    process: [
      { title: "Ön araştırma", detail: "TÜRKPATENT kayıtlarında benzer ya da aynı markaları tarıyor, markanızın tescil edilebilirliğini değerlendiriyoruz. Bu adım ret riskini en aza indirir." },
      { title: "Sınıflandırma", detail: "Faaliyet alanınıza göre doğru sınıfları ve ürün-hizmet listesini belirliyoruz." },
      { title: "Başvuru", detail: "Gerekli belgeleri sizin adınıza eksiksiz hazırlayıp başvurunuzu TÜRKPATENT'e iletiyoruz." },
      { title: "Takip ve savunma", detail: "Başvurunuzu takip ediyor, yayın döneminde gelebilecek itirazlara karşı savunmaları hazırlıyoruz." },
    ],
    faqs: [
      {
        q: "Marka tescili ne kadar süre korur?",
        a: "Türkiye'de tescilli bir marka başvuru tarihinden itibaren 10 yıl korunur ve her 10 yılda bir yenilenebilir.",
      },
      {
        q: "Kaç sınıfta başvurmalıyım?",
        a: "Bugünkü faaliyetinize ve yakın gelecekteki planlarınıza göre değişir. Ön araştırma aşamasında hangi sınıfların sizi koruyacağını birlikte belirliyoruz.",
      },
      {
        q: "Başvuruma itiraz gelirse ne olur?",
        a: "Yayın döneminde gelebilecek itirazlara karşı profesyonel savunmaları biz hazırlıyor ve itiraz sürecini sizin adınıza yönetiyoruz.",
      },
      {
        q: "Tescil süreci ne kadar sürer?",
        a: "Süre TÜRKPATENT'in inceleme ve yayın aşamalarına ve itiraz olup olmamasına bağlıdır. Başvurunuzun durumunu süreç boyunca sizin için takip ediyoruz.",
      },
      {
        q: "Logom henüz yok, önce ne yapmalıyım?",
        a: "Marka adınızla başvuru yapılabilir; logolu başvuru için önce logo çalışması da yapabiliyoruz. Logo Çalışması sayfamızda süreci anlattık.",
      },
    ],
    sources: [
      "https://integralbilisim.com/marka-tescil/",
      "src/lib/faq.ts (marka tescil süreci)",
    ],
  },

  "google-ads-reklami": {
    intro: [
      "Google Ads, ürün ya da hizmetinizi tam da onu arayan kişilere göstermenizi sağlayan reklam platformudur. Bir kullanıcı ilgili anahtar kelimeyi aradığında reklamınız organik sonuçların üzerinde, ilk görülen yerde çıkar: anında görünürlük ve potansiyel müşteriyle doğrudan temas.",
      "Google Ads'in karmaşık yapısını sizin için sadeleştiriyor, işletmenizin hedeflerine göre kurgulanmış ve sürekli iyileştirilen kampanyalar yönetiyoruz.",
    ],
    sections: [
      {
        heading: "Arama ağı ve görüntülü reklam ağı",
        body: [
          "Arama ağı reklamları, kullanıcı aradığında karşısına çıkar; satın alma niyeti en yüksek anı yakalar. Görüntülü Reklam Ağı ise reklamlarınızı milyonlarca web sitesinde, mobil uygulamada ve YouTube'da gösterir. Belirli demografik özelliklere, ilgi alanlarına ya da davranışlara sahip kitlelere ulaşarak marka bilinirliğinizi artırır.",
        ],
      },
      {
        heading: "Her kuruşun nereye gittiğini görürsünüz",
        body: [
          "Google Ads'in en güçlü yanı ölçülebilir olmasıdır. Reklamınızın kaç kez görüntülendiğini, kaç kişinin tıkladığını, sitenizde kaç dönüşüm (satış, form, arama) yaşandığını ve ne kadar harcandığını anlık olarak görürsünüz.",
          "Bu verilerle hangi reklamların işe yaradığını anlar, bütçeyi iyi çalışanlara kaydırırsınız. Reklamlarınızı belirli şehir ve bölgelere, belirli saatlere ya da cihazlara göre hedefleyerek bütçenizi yalnızca ilgili kitleye harcarsınız.",
        ],
      },
      {
        heading: "Reklam bütçesi ile yönetim ücreti arasındaki fark",
        body: [
          "Ödediğiniz iki ayrı kalem vardır: reklamların gösterimi için doğrudan Google'a ödenen reklam bütçesi ve kampanyaların kurulması, takibi ve iyileştirilmesi için ödenen yönetim ücreti. Teklifleri karşılaştırırken bu ikisini ayrı ayrı sorun; reklam bütçenizin tamamının gerçekten reklama gittiğinden emin olun.",
        ],
      },
    ],
    faqs: [
      {
        q: "Google Ads için minimum bütçe var mı?",
        a: "Google'ın zorunlu bir alt sınırı yoktur; bütçeyi siz belirlersiniz. Sektörünüzdeki rekabete ve hedefinize göre anlamlı sonuç verecek bir başlangıç bütçesini birlikte belirliyoruz.",
      },
      {
        q: "Reklamlarım hangi bölgelerde gösterilir?",
        a: "Tamamen size bağlı. Reklamları belirli şehir ya da bölgelere, belirli saatlere ve cihazlara göre hedefleyebiliyoruz.",
      },
      {
        q: "Sonuçları nasıl takip edeceğim?",
        a: "Gösterim, tıklama, dönüşüm ve harcama verilerini düzenli olarak raporluyoruz; hangi reklamın ne getirdiğini net olarak görürsünüz.",
      },
      {
        q: "Google Ads mi, SEO mu?",
        a: "Google Ads hemen görünürlük sağlar ama bütçe durduğunda reklam da durur. SEO ise zaman alır ama kalıcı bir organik görünürlük kurar. İkisi birbirini tamamlar; yeni başlayan işletmelerde reklamla hızlı sonuç alıp SEO'yu paralel yürütmek iyi işler.",
      },
    ],
    sources: [
      "https://integralbilisim.com/google-adwors-reklami/",
    ],
  },

  "facebook-reklamciligi": {
    intro: [
      "Facebook ve Instagram, milyonlarca kullanıcısıyla hedef kitlenize doğrudan ulaşabileceğiniz en geniş sosyal reklam ağıdır. Meta'nın reklam sistemi, reklamlarınızı ilgi alanı, davranış ve demografik özelliklere göre en ilgili kişilere gösterir.",
      "Her gün binlerce işletme satışlarını artırmak ve marka değerini yükseltmek için bu platformda reklam veriyor. Ama Google Ads gibi Meta reklamlarının da kendine özgü kuralları vardır; yanlış yönetilen bir kampanya hem bütçenizi hem de fırsatı boşa harcar.",
    ],
    sections: [
      {
        heading: "Doğru kişiye, doğru mesaj",
        body: [
          "Meta reklamlarının gücü hedeflemedeki inceliğinden gelir. Yaş, konum ve dil gibi temel özelliklerin yanında ilgi alanlarına ve davranışlara göre kitle seçebilir, sitenizi ziyaret etmiş ya da sizinle etkileşime girmiş kişilere yeniden ulaşabilirsiniz.",
          "Reklamlarınız Facebook ve Instagram akışlarında, hikâyelerde ve kısa videolarda gösterilebilir. Hangi yerleşimin daha iyi çalıştığını verilere göre belirliyoruz.",
        ],
      },
      {
        heading: "Kampanyayı hedefinize göre kuruyoruz",
        body: [
          "Her kampanya bir hedefle başlar ve Meta, reklamlarınızı o hedefe göre optimize eder. Bilinirlik, sitenize trafik, etkileşim, potansiyel müşteri toplama ya da doğrudan satış: hangisini istediğinizi netleştirmeden bütçe harcamaya başlamıyoruz.",
        ],
        list: [
          { label: "Hedef kitle analizi", detail: "Demografi, ilgi alanı ve davranış bazlı hedefleme." },
          { label: "Reklam tasarımı", detail: "Akışta dikkat çeken görsel ve metinlerin hazırlanması." },
          { label: "Kampanya yönetimi", detail: "Bütçe ve teklif stratejilerinin yönetimi, düşük performanslı reklamların durdurulması." },
          { label: "Performans raporu", detail: "Erişim, tıklama ve dönüşüm verilerinin düzenli raporlanması." },
        ],
      },
      {
        heading: "Reklam bütçesi ile yönetim ücreti",
        body: [
          "Reklam bütçesi doğrudan Meta'ya ödenir; yönetim ücreti ise kampanyaların kurulması, takibi ve iyileştirilmesinin karşılığıdır. İkisini ayrı ayrı görmeniz, bütçenizin tamamının gerçekten reklama gittiğinden emin olmanızı sağlar.",
        ],
      },
    ],
    faqs: [
      {
        q: "Reklamlarım Instagram'da da çıkar mı?",
        a: "Evet. Meta reklamları Facebook ve Instagram'da birlikte yönetilir; yerleşimleri hedefinize ve performansa göre seçiyoruz.",
      },
      {
        q: "Ne kadar bütçeyle başlamalıyım?",
        a: "Zorunlu bir alt sınır yoktur. Hedefinize ve hedef kitlenizin büyüklüğüne göre anlamlı veri toplayabileceğiniz bir başlangıç bütçesini birlikte belirliyoruz.",
      },
      {
        q: "Sosyal medya yönetiminden farkı ne?",
        a: "Sosyal medya yönetimi hesaplarınızın düzenli paylaşımlarla canlı tutulmasıdır. Reklamcılık ise bütçe ayırarak bu içeriklerin ya da özel kampanyaların seçtiğiniz kitleye gösterilmesidir. İkisi birlikte daha güçlü çalışır.",
      },
    ],
    sources: [
      "https://integralbilisim.com/facebook-reklamciligi/",
      "src/lib/services.ts (facebook-reklamciligi kaydı)",
    ],
  },

  "sosyal-medya-yonetimi": {
    intro: [
      "Sosyal medya yönetimi, markanızın Instagram, Facebook, X, LinkedIn ve TikTok gibi platformlardaki varlığını planlama, içerik üretme, yayınlama, takip etme ve iyileştirme sürecidir. Yalnızca paylaşım yapmak değil; hedef kitleyle bağ kurmak, bilinirlik oluşturmak ve sonunda iş hedeflerine ulaşmaktır.",
      "Klasik medyanın yerini giderek sosyal medyanın aldığı bugün, markanızın bu kanallarda düzenli ve tutarlı temsil edilmesi bir zorunluluk. Daha önce ulaşamadığınız kitlelere ulaşır, mevcut müşterilerinizle doğrudan konuşur, yeni ürünlerinizi tanıtırsınız.",
    ],
    sections: [
      {
        heading: "Sosyal medya işletmenize ne kazandırır?",
        body: [],
        list: [
          { label: "Marka bilinirliği", detail: "Düzenli ve planlı paylaşımlarla markanız daha geniş kitlelere ulaşır." },
          { label: "Müşteri bağlılığı", detail: "Hedef kitlenizle doğrudan iletişim güven ve sadakat oluşturur." },
          { label: "Web sitesi trafiği", detail: "Paylaşımlarınız potansiyel müşterileri sitenize yönlendirir." },
          { label: "Satış ve dönüşüm", detail: "Ürün ve hizmetlerinizi doğrudan tanıtıp harekete geçirici çağrılar yapabilirsiniz." },
          { label: "Geri bildirim", detail: "Müşterilerinizin ilgi alanları, beklentileri ve şikâyetleri hakkında doğrudan bilgi edinirsiniz." },
        ],
      },
      {
        heading: "Nasıl çalışıyoruz?",
        body: [
          "Sosyal medya yönetimi tek seferlik bir iş değil, sürekli dönen bir döngüdür. Her ay şu dört adımı tekrarlıyoruz:",
        ],
        list: [
          { label: "1. Strateji", detail: "Hedefinizi (bilinirlik mi, satış mı, müşteri hizmeti mi), hedef kitlenizi ve kitlenizin en aktif olduğu platformları belirliyor, rakiplerinizin ne yaptığını inceliyoruz." },
          { label: "2. İçerik ve takvim", detail: "Markanıza uygun görsel ve metinleri hazırlıyor, hangi gün hangi içeriğin yayınlanacağını aylık bir takvimde planlıyoruz." },
          { label: "3. Etkileşim", detail: "Yorumları ve mesajları takip ediyor, olumsuz yorumlara ve kriz anlarına profesyonelce yanıt veriyoruz." },
          { label: "4. Analiz", detail: "Erişim, etkileşim oranı, takipçi artışı ve tıklama verilerini raporluyor, bir sonraki ayın planını bu verilere göre güncelliyoruz." },
        ],
      },
      {
        heading: "Başarı neye bağlı?",
        body: [
          "Tutarlılık: paylaşım sıklığında ve marka dilinde istikrar, takipçinin sizi tanımasını ve güvenmesini sağlar. Değer: her içerik hedef kitleye bilgi, eğlence ya da bir çözüm sunmalı. Görsel kalite: sosyal medyada görsel ve video metinden çok daha hızlı dikkat çeker.",
          "Organik erişim önemli olsa da tek başına sınırlıdır. Hedefli reklamlarla desteklenen hesaplar belirli hedeflere çok daha hızlı ulaşır; bunun için Facebook Reklamcılığı hizmetimize göz atabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Hangi platformları yönetiyorsunuz?",
        a: "Hedef kitlenizin en aktif olduğu platformları birlikte seçiyoruz: Instagram, Facebook, X, LinkedIn, TikTok ve YouTube bunların başında geliyor.",
      },
      {
        q: "Paylaşım içeriklerini kim hazırlıyor?",
        a: "Aylık paylaşım takvimini ve markanıza uygun paylaşım tasarımlarını biz hazırlıyoruz.",
      },
      {
        q: "Yorum ve mesajları da takip ediyor musunuz?",
        a: "Evet. Yorum ve mesajların takibi hizmetin parçasıdır; dönemsel raporlarda etkileşim verilerini de paylaşıyoruz.",
      },
      {
        q: "Sosyal medya yönetimine reklam dahil mi?",
        a: "Hayır, reklam ayrı bir hizmettir ve reklam bütçesi doğrudan platforma ödenir. İkisini birlikte yürütmek isterseniz tek elden planlıyoruz.",
      },
    ],
    sources: [
      "https://integralbilisim.com/sosyal-medya-yonetimi/",
      "https://integralbilisim.com/sosyal-medya-yonetimi-nedir/",
      "src/lib/services.ts (sosyal-medya-yonetimi kaydı)",
    ],
  },

  "grafik-tasarim": {
    intro: [
      "Bir logo, bir web sitesi düzeni, bir sosyal medya gönderisi ya da bir broşür: hepsi hedef kitlenizin zihninde markanıza dair bir izlenim bırakır. Grafik tasarım yalnızca estetik bir iş değil, markanızın kimliğini ve mesajını görsel olarak aktaran stratejik bir iletişim biçimidir.",
      "Markanızın tüm görsel ihtiyaçlarını tek elden karşılıyor; yaratıcılığı stratejik düşünceyle birleştirerek size özgü tasarımlar hazırlıyoruz.",
    ],
    sections: [
      {
        heading: "Grafik tasarım markanız için neden önemli?",
        body: [
          "İnsanlar bir markayı saniyeler içinde görsel olarak değerlendirir. Tutarlı ve çekici bir tasarım ilk bakışta olumlu bir algı yaratır; özensiz bir tasarım ise markanızın da özensiz olduğu izlenimini uyandırır.",
          "Karmaşık fikirler ve ürün bilgileri iyi tasarlanmış görsellerle çok daha hızlı anlaşılır. Logo, renk paleti ve tipografinin her yerde tutarlı kullanılması, müşterilerinizin sizi kolayca tanımasını ve rakiplerinizden ayırmasını sağlar.",
        ],
      },
      {
        heading: "Hangi işleri tasarlıyoruz?",
        body: [],
        list: [
          { label: "Kurumsal kimlik", detail: "Logo, antetli kâğıt, kartvizit ve zarf gibi kurumsal materyallerin baştan sona tasarımı." },
          { label: "Sosyal medya görselleri", detail: "Etkileşimi artıran, markanızın mesajını yansıtan özgün paylaşım tasarımları." },
          { label: "Basılı materyaller", detail: "Broşür, katalog, el ilanı, afiş, dergi ve gazete ilanları." },
          { label: "Ambalaj tasarımı", detail: "Ürününüzün rafta dikkat çekmesini ve marka mesajınızı taşımasını sağlayan işlevsel ambalajlar." },
        ],
      },
      {
        heading: "Tasarımı baskıya ve ekrana göre hazırlıyoruz",
        body: [
          "Aynı tasarım ekranda ve kâğıtta farklı davranır. Basılacak işleri baskıya uygun renk ve çözünürlükte, dijital işleri ise ekranda net görünecek ölçülerde hazırlıyoruz. Broşür ve katalog gibi basılı işlerde tasarımdan baskıya kadar süreci de sizin için takip edebiliyoruz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Tek bir tasarım için de çalışıyor musunuz?",
        a: "Evet. Tek bir afişten sürekli sosyal medya tasarımına kadar ihtiyacınıza göre çalışıyoruz.",
      },
      {
        q: "Baskı işini de siz mi takip ediyorsunuz?",
        a: "Broşür ve katalog gibi basılı işlerde tasarımdan baskıya kadar olan adımları sizin için takip edip anahtar teslim hizmet veriyoruz.",
      },
      {
        q: "Kurumsal kimlik ile grafik tasarım arasındaki fark ne?",
        a: "Kurumsal kimlik, markanızın tüm görsel dilini belirleyen sistemdir. Grafik tasarım ise bu dil içinde üretilen her bir iştir: bir afiş, bir gönderi, bir broşür.",
      },
    ],
    sources: [
      "https://integralbilisim.com/grafik-tasarim/",
      "https://integralbilisim.com/brosur-katalog-tasarimi/",
    ],
  },

  "kurumsal-kimlik": {
    intro: [
      "Kalabalık bir pazarda öne çıkmak için iyi bir ürün ya da hizmet tek başına yetmiyor. Kurumsal kimlik, markanızın kendini dünyaya nasıl tanıttığını, değerlerini nasıl yansıttığını ve müşteriyle nasıl bağ kurduğunu belirler: markanızın görünen yüzü ve duyulan sesidir.",
      "Markanızın hikâyesini, değerlerini ve hedeflerini anlayıp bunları tutarlı bir görsel dile dönüştürüyoruz.",
    ],
    sections: [
      {
        heading: "Kurumsal kimlik neden hayati?",
        body: [],
        list: [
          { label: "Tutarlılık ve güven", detail: "Logo, renkler, yazı tipleri ve iletişim dilinin web sitesinden basılı materyale kadar her yerde aynı olması güven inşa eder." },
          { label: "Farklılaşma", detail: "Güçlü ve özgün bir kimlik sizi yüzlerce benzer işletmeden ayırır, akılda kalmanızı sağlar." },
          { label: "Profesyonel imaj", detail: "İyi tasarlanmış bir kimlik, iş ortakları, yatırımcılar ve müşteriler nezdinde kalitenizi yansıtır." },
          { label: "İletişim kolaylığı", detail: "Kimlik kılavuzu sayesinde farklı ekipler ve ajanslarla çalışırken bile markanız bozulmadan korunur." },
        ],
      },
      {
        heading: "Kimlik çalışması neleri kapsar?",
        body: [],
        list: [
          { label: "Logo tasarımı", detail: "Markanızın ruhunu yansıtan, akılda kalıcı ve zamansız bir logo; tüm görsel iletişimin temeli." },
          { label: "Renk paleti ve tipografi", detail: "Markanızın kişiliğini yansıtan renk ve yazı tiplerinin belirlenmesi." },
          { label: "Antetli kâğıt, kartvizit ve zarf", detail: "Yazışmalarda ve yüz yüze görüşmelerde profesyonel izlenim bırakan materyaller." },
          { label: "Sunum şablonları", detail: "Toplantı ve iş görüşmelerinde kullanacağınız, markanızla uyumlu sunum şablonları." },
          { label: "Sosyal medya profil ve kapakları", detail: "Dijital platformlarda kimliğinizi yansıtan uyumlu görseller." },
          { label: "Marka kılavuzu", detail: "Tüm bu unsurların nerede ve nasıl kullanılacağını anlatan, tutarlılığı uzun vadede koruyan kılavuz." },
        ],
      },
      {
        heading: "Marka kılavuzu neden önemli?",
        body: [
          "Bir yıl sonra bir matbaayla, bir sosyal medya ajansıyla ya da yeni bir çalışanla çalıştığınızda markanızın doğru kullanılacağının güvencesi kılavuzdur. Logonun hangi zeminde nasıl kullanılacağı, hangi renk kodlarının geçerli olduğu, hangi yazı tiplerinin seçildiği tek bir belgede durur. İletişim süreçlerini hızlandırır, maliyetleri düşürür.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kurumsal kimlik ile logo aynı şey mi?",
        a: "Hayır. Logo kimliğin bir parçasıdır. Kurumsal kimlik; renkleri, yazı tiplerini, basılı ve dijital materyalleri ve bunların nasıl kullanılacağını anlatan kılavuzu da kapsayan bütün sistemdir.",
      },
      {
        q: "Hangi materyaller teslim ediliyor?",
        a: "Logo, renk paleti ve tipografi, antetli kâğıt, kartvizit ve zarf, sunum şablonları, sosyal medya profil ve kapak tasarımları ve marka kılavuzu.",
      },
      {
        q: "Web sitesi tasarımıyla birlikte yapılabilir mi?",
        a: "Evet. Kimliği ve siteyi birlikte tasarlamak, markanızın her mecrada aynı dili konuşmasının en kısa yoludur.",
      },
    ],
    sources: [
      "https://integralbilisim.com/kurumsal-kimlik/",
    ],
  },

  "logo-calismasi": {
    intro: [
      "Logo, şirketinizin imzasıdır. Yaptığınız her iş logonuzla anılır; müşteriler onu tanıdıkça size aşinalık ve sadakat geliştirir. Bu yüzden logo kolayca anlaşılır, tanınır ve uzun yıllar kullanılabilir olmalıdır.",
      "Markanızı, ürününüzü ya da fikrinizi en iyi temsil edecek, akılda kalıcı ve size özgü logoyu istediğiniz renk ve biçim tercihleriyle tasarlıyoruz.",
    ],
    sections: [
      {
        heading: "İyi bir logonun özellikleri",
        body: ["Güzel görünmesi tek başına yetmez; bir logo her yerde çalışmalıdır:"],
        list: [
          { label: "Sadelik", detail: "Bir bakışta anlaşılır ve hatırlanır. Gereksiz ayrıntı küçük boyutlarda kaybolur." },
          { label: "Ölçeklenebilirlik", detail: "Bir kartvizitte de, bir tabelada da aynı netlikte okunur." },
          { label: "Tek renkte çalışabilme", detail: "Siyah-beyaz baskıda, kaşede ya da tek renkli bir zeminde de tanınır." },
          { label: "Özgünlük", detail: "Sizi rakiplerinizden ayırır; başka bir markayla karıştırılmaz." },
          { label: "Zamansızlık", detail: "Modası kısa sürede geçecek akımlardan uzak durur; yıllarca kullanılabilir." },
        ],
      },
      {
        heading: "Teslim formatları",
        body: [
          "Logonuzu JPG, PNG, AI ve PDF formatlarında teslim ediyoruz. JPG ve PNG ekranda ve web'de kullanım içindir; PNG şeffaf arka planı destekler. AI ve PDF ise vektör formatlardır: logonuz kalite kaybı olmadan bir kartvizit boyutuna da küçültülebilir, bir bina tabelası boyutuna da büyütülebilir. Matbaa ve tabelacılar vektör dosya ister.",
        ],
      },
      {
        heading: "Logonuzu koruma altına alın",
        body: [
          "Logo tasarlandıktan sonra marka tescil başvurusuyla koruma altına alınabilir; böylece başkalarının benzer bir logo kullanmasının önüne geçersiniz. Logonun tek başına değil bir kimlik sistemi içinde kullanılmasını istiyorsanız Kurumsal Kimlik hizmetimize bakabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Logo hangi formatlarda teslim ediliyor?",
        a: "JPG, PNG, AI ve PDF formatlarında. Vektör dosyalar (AI, PDF) logonun kalite kaybı olmadan her boyutta kullanılmasını sağlar.",
      },
      {
        q: "Vektör dosya neden önemli?",
        a: "Vektör dosya pikselden değil matematiksel çizgilerden oluşur; tabela gibi büyük baskılarda bile bulanıklaşmaz. Matbaa ve tabelacılar logonuzu bu formatta ister.",
      },
      {
        q: "Logomu tescil ettirebilir miyim?",
        a: "Evet. Marka tescil başvurusunu logonuzla birlikte yapabiliriz; süreci Marka Tescili sayfamızda anlattık.",
      },
      {
        q: "Renk ve biçim tercihlerimi belirtebilir miyim?",
        a: "Elbette. İstediğiniz renk ve biçim tercihlerini tasarımın başında alıyor, logoyu bu doğrultuda hazırlıyoruz.",
      },
    ],
    sources: [
      "https://integralbilisim.com/logo-calismasi/",
    ],
  },

  "kartvizit-tasarimi": {
    intro: [
      "Kartvizit, iletişim bilgilerinizi karşınızdakine bıraktığınız somut bir hatırlatıcıdır. İlk tanışmada bıraktığınız izlenim, ileride nasıl bir müşteri ilişkisi kuracağınızın da habercisidir; kartvizit sizi ve işinizi en kısa yoldan anlatan araçtır.",
      "Kurumsal kimliğinizin en önemli parçalarından biri olan kartviziti size ve çalışma alanınıza uygun, istediğiniz renk ve ölçülerde tasarlıyoruz.",
    ],
    sections: [
      {
        heading: "Kartvizitte neler yer almalı?",
        body: [
          "Kartvizit küçük bir alandır; her bilgi yerini hak etmeli. Genellikle şunlar bulunur: ad-soyad ve unvan, şirket adı ve logosu, telefon, e-posta, web sitesi ve adres. Gerektiğinde sosyal medya hesabı ya da web sitenize yönlendiren bir QR kod eklenebilir.",
          "Önemli olan bilginin değil okunabilirliğin önde olmasıdır. Kalabalık bir kartvizit, sade bir kartvizitten daha az akılda kalır.",
        ],
      },
      {
        heading: "Ölçü, kâğıt ve baskı",
        body: [
          "Türkiye'de yaygın kartvizit ölçüsü 85×55 mm'dir; cüzdanlara ve kartlıklara bu ölçü uyar. Arka yüzün de kullanıldığı çift taraflı kartvizitler logoya ya da tek bir mesaja yer açar.",
          "Kâğıt kalınlığı, mat ya da parlak selefon, kabartma ve lak gibi baskı seçenekleri kartvizitin elde nasıl hissettirdiğini belirler. Tasarımı seçilen baskı tekniğine uygun hazırlıyoruz; böylece ekranda gördüğünüz kartvizit kâğıtta da aynı görünür.",
        ],
      },
      {
        heading: "Kimliğinizle uyumlu",
        body: [
          "Kartvizit tek başına değil, logonuz, antetli kâğıdınız ve web sitenizle birlikte anlam kazanır. Tüm kurumsal kimlik projelerinde kartvizitin önemini biliyor, tasarımcılarımızla birlikte size özel ve kimliğinizle uyumlu kartvizitler hazırlıyoruz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kartvizit hangi ölçüde tasarlanıyor?",
        a: "Türkiye'de yaygın ölçü 85×55 mm'dir; farklı bir ölçü ya da biçim isterseniz tercihinize göre tasarlıyoruz.",
      },
      {
        q: "Çift taraflı kartvizit önerir misiniz?",
        a: "Arka yüz logonuza, bir mesaja ya da web sitenize yönlendiren bir QR koda yer açar; ön yüzü sadeleştirmek için iyi bir yoldur.",
      },
      {
        q: "Logom yok, yine de kartvizit yaptırabilir miyim?",
        a: "Evet; ama önce logo çalışması yapmak, kartvizitin ve sonraki tüm materyallerinizin tutarlı olmasını sağlar.",
      },
    ],
    sources: [
      "https://integralbilisim.com/kartvizit-tasarimi/",
    ],
  },

  "brosur-katalog-tasarimi": {
    intro: [
      "Dijital reklamların öne çıktığı bugün bile basılı materyaller güçlü bir tanıtım aracı olmaya devam ediyor. Katalog, işletmenizin sunduğu ürün ve hizmetlerin ayrıntılı olarak anlatıldığı, müşterinin elinde kalan bir vitrindir; broşür ise tek bir mesajı kısa ve etkili biçimde aktarır.",
      "İhtiyacınıza uygun broşür ve katalogları tasarlıyor, tasarımdan baskıya kadar olan adımları sizin için takip ederek anahtar teslim hizmet veriyoruz.",
    ],
    sections: [
      {
        heading: "Broşür mü, katalog mu?",
        body: [
          "Broşür genellikle tek sayfa ya da katlanır bir yapradır; bir kampanyayı, bir hizmeti ya da firmanızı kısaca tanıtır. Fuarlarda, mağazada ya da posta yoluyla dağıtılmaya uygundur.",
          "Katalog ise çok sayfalı bir yayındır; ürün gruplarınızı, teknik özelliklerini ve fiyatlarını düzenli bir yapıda sunar. Bayilerinize, satış ekibinize ya da müşterilerinize ürün yelpazenizin tamamını göstermek istediğinizde doğru araçtır.",
        ],
      },
      {
        heading: "E-katalog: dijital kopyası da hazır",
        body: [
          "Basılı kataloğunuzun dijital bir sürümü de olabilir. E-katalog baskıya göre çok daha düşük maliyetlidir, daha fazla kişiye kolayca ulaşır ve web sitenizde tek tıkla erişilebilir hale getirilebilir. Bir süre sonra atılacak bir kataloğu bastırmak yerine internette sunmak çevreci de bir tercihtir.",
          "Basılı katalogla e-katalog birbirinin alternatifi değil; aynı tasarımın iki ayrı kanalda kullanılmasıdır.",
        ],
      },
    ],
    process: [
      { title: "İhtiyacı belirleme", detail: "Kime, hangi amaçla ve hangi kanalda dağıtılacağını; sayfa sayısını ve içeriği birlikte netleştiriyoruz." },
      { title: "Tasarım", detail: "Kurumsal kimliğinize uygun, okunabilir ve dikkat çeken bir düzen hazırlıyoruz." },
      { title: "Baskı ve uygulama", detail: "Baskı ve uygulama adımlarını sizin yerinize takip ediyoruz; isterseniz e-katalog sürümünü de sitenize ekliyoruz." },
    ],
    faqs: [
      {
        q: "Baskı işini de siz mi takip ediyorsunuz?",
        a: "Evet. Tasarımın yanında baskı ve uygulama aşamalarını da sizin için takip ediyor, anahtar teslim hizmet veriyoruz.",
      },
      {
        q: "Kataloğumu web sitemde de yayınlayabilir miyim?",
        a: "Evet. Kataloğun e-katalog sürümünü web sitenizde tek tıkla erişilebilir hale getirebiliriz.",
      },
      {
        q: "Fiyat neye göre belirleniyor?",
        a: "Sayfa sayısı, içerik yoğunluğu ve baskı seçenekleri fiyatı belirler. Teklif sihirbazında sayfa sayısını seçerek tahmini bir aralık görebilirsiniz.",
      },
    ],
    sources: [
      "https://integralbilisim.com/brosur-katalog-tasarimi/",
    ],
  },
};

/**
 * Web hizmetlerinin süreci; ana sayfadaki adımlarla aynı. Yayın süresi (5 gün)
 * firma tarafından teyit edildi (eski sitede 7 iş günü yazıyordu).
 */
const WEB_PROCESS: ServiceStep[] = [
  { title: "Görüşme & Analiz", detail: "İhtiyacınızı dinliyor, sektörünüze ve hedef kitlenize en uygun çözümü birlikte belirliyoruz." },
  { title: "Tasarım", detail: "Kullanıcı deneyimini ön planda tutarak estetik, işlevsel ve mobil uyumlu web siteleri tasarlıyoruz." },
  { title: "İçerik & Kurulum", detail: "Domain, hosting, içerik, kurumsal e-posta ve teknik destek dahil; tüm ihtiyaçlarınız tek elden karşılanır." },
  { title: "Yayın & Destek", detail: "Hazır web sitesi çözümlerinde siteniz 5 gün içinde yayında olur; sonrasında yıl boyu teknik destekle yanınızdayız." },
];

const WEB_SERVICES = new Set(["web-tasarim", "hazir-web-site", "e-ticaret-web-siteleri"]);

/** Hizmete özgü süreç; yoksa web hizmetlerinde genel süreç, diğerlerinde hiç. */
export const processFor = (slug: string): ServiceStep[] | null =>
  SERVICE_CONTENT[slug]?.process ?? (WEB_SERVICES.has(slug) ? WEB_PROCESS : null);
