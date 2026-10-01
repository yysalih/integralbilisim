/**
 * Müşteri deneyimi videoları. Bunny CDN'de dikey (1080x1920) olarak duruyor.
 * Posterler videonun kendi karesinden üretilmiştir.
 *
 * Videolar toplam ~42 MB olduğu için kartlar tembel yüklenir: dosya ancak
 * bölüm ekrana girdiğinde indirilmeye başlar (bkz. VideoWall).
 */
export interface TestimonialVideo {
  id: string;
  /** Bunny yolu; mediaUrl() ile tam adrese çevrilir. */
  video: string;
  poster: string;
}

export const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  { id: "kalite-1", video: "/kalite/videos/1.mp4", poster: "/videolar/kalite-1.jpg" },
  { id: "kalite-2", video: "/kalite/videos/2.mp4", poster: "/videolar/kalite-2.jpg" },
  { id: "kalite-3", video: "/kalite/videos/3.mp4", poster: "/videolar/kalite-3.jpg" },
  { id: "kalite-4", video: "/kalite/videos/4.mp4", poster: "/videolar/kalite-4.jpg" },
];
