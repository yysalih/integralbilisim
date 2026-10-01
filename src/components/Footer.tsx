import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { COMPANY } from "@/lib/company";
import { SERVICES } from "@/lib/services";

const SOCIALS: { label: string; href: string }[] = [
  { label: "Facebook", href: COMPANY.social.facebook },
  { label: "Instagram", href: COMPANY.social.instagram },
  { label: "X", href: COMPANY.social.twitter },
  { label: "TikTok", href: COMPANY.social.tiktok },
  { label: "Pinterest", href: COMPANY.social.pinterest },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a12] text-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marka */}
          <div>
            <img
              src="/logo-dark.png"
              alt="İntegral Bilişim ve Tasarım"
              className="h-10 w-auto"
            />
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              {COMPANY.foundedYear}'den beri web tasarım ve yazılım süreçlerinde müşterilerimize
              yalnızca bir site değil, eksiksiz ve kullanıma hazır dijital çözümler sunuyoruz.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Hizmetler */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Hizmetler
            </h3>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 text-sm">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link
                    to="/hizmetler/$slug"
                    params={{ slug: s.slug }}
                    className="text-white/60 transition-colors hover:text-white"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/hizmetler" className="font-medium text-white/80 hover:text-white">
                  Tümünü görün →
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
              Kurumsal
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm">
              <li>
                <Link to="/hakkimizda" className="text-white/60 hover:text-white">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/referanslar" className="text-white/60 hover:text-white">
                  Referanslar
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/60 hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-white/60 hover:text-white">
                  İletişim
                </Link>
              </li>
              <li>
                <Link to="/gizlilik-politikasi" className="text-white/60 hover:text-white">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
              İletişim
            </h3>
            <ul className="mt-5 space-y-3.5 text-sm text-white/60">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>
                  <a href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`} className="hover:text-white">
                    {COMPANY.phoneMobile}
                  </a>
                  <br />
                  <a href={`tel:${COMPANY.phoneOffice.replace(/\s/g, "")}`} className="hover:text-white">
                    {COMPANY.phoneOffice}
                  </a>
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>{COMPANY.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-white/40" />
                <span>{COMPANY.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-7 text-xs text-white/40 md:flex-row">
          <p>
            © {new Date().getFullYear()} {COMPANY.fullName}. Tüm hakları saklıdır.
          </p>
          <p>{COMPANY.foundedYear}'den beri dijital çözüm ortağınız.</p>
        </div>
      </div>
    </footer>
  );
}
