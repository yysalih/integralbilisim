/**
 * Sıkça sorulan sorular. Cevapların tamamı integralbilisim.com'daki
 * gerçek hizmet bilgilerine dayanır; fiyat veya garanti iddiası içermez.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Sitem ne kadar sürede yayına girer?",
    answer:
      "Hazır web sitesi çözümlerimizde siteniz 2-3 gün içinde yayına alınır. Özel tasarım projelerinde süre, işin kapsamına göre değişir.",
  },
  {
    question: "Alan adı ve hosting pakete dahil mi?",
    answer:
      "Evet. Domain kaydı, güvenilir hosting, SSL sertifikası ve kurumsal e-posta adresleri pakete dahildir. Yenileme takibini de biz yaparız.",
  },
  {
    question: "Siteyi kendim güncelleyebilir miyim?",
    answer:
      "Evet. Hazır sitelerde ön yüzde görünen tüm alanları admin panelinden yönetebilirsiniz. Yazılım bilgisi gerektirmez; panel kolay ve anlaşılırdır.",
  },
  {
    question: "İçerikleri kim hazırlıyor?",
    answer:
      "Metinlerinizin ve görsellerinizin siteye yerleştirilmesini biz üstleniyoruz. Size düşen, elinizdeki içerikleri bize iletmek.",
  },
  {
    question: "Yayına aldıktan sonra destek veriyor musunuz?",
    answer:
      "Evet. Yayın sonrasında bakım, güncelleme ve teknik destek konularında yanınızdayız. Tek muhatabınız yine biziz.",
  },
  {
    question: "E-ticaret sitesi de yapıyor musunuz?",
    answer:
      "Evet. Ürün ve stok yönetimi, güvenli ödeme altyapısı, kargo entegrasyonu ve kampanya araçlarıyla mobil uyumlu e-ticaret siteleri geliştiriyoruz.",
  },
  {
    question: "Marka tescil sürecini siz mi takip ediyorsunuz?",
    answer:
      "Evet. Ön araştırmadan başvuruya, yayın ve itiraz süreçlerinden belge teslimine kadar tüm adımları sizin adınıza yürütüyoruz.",
  },
  {
    question: "Sadece İstanbul'da mı çalışıyorsunuz?",
    answer:
      "Merkezimiz Kadıköy / İstanbul'da. Türkiye'nin farklı şehirlerinden markalarla çalışıyoruz; süreci uzaktan da yürütebiliyoruz.",
  },
];
