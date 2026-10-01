import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, ExternalLink, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { COMPANY } from "@/lib/company";
import { cn } from "@/lib/utils";

/** Kurumsal menüsü. Tanıtım dosyası dış bağlantıdır. */
const KURUMSAL_LINKS: { label: string; to?: string; href?: string; hash?: string }[] = [
  { label: "Hizmetler", to: "/hizmetler" },
  { label: "Misyon & Vizyon", to: "/hakkimizda", hash: "misyon-vizyon" },
  { label: "Tanıtım", href: "https://integralbilisim.com/integralbilisim.pdf" },
  { label: "Gizlilik Politikası", to: "/gizlilik-politikasi" },
];

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Sayfa değişince menüleri kapat
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const transparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        isHome ? "fixed" : "sticky",
        "top-0 z-30 w-full transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-border bg-white/90 backdrop-blur-md",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-[72px]">
        <Link to="/" className="flex items-center gap-2" aria-label="İntegral Bilişim ana sayfa">
          {/* Şeffaf başlıkta tamamen beyaz, solid başlıkta renkli varyant. */}
          <img
            src={transparent ? "/logo-white.png" : "/logo-light.png"}
            alt="İntegral Bilişim ve Tasarım"
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* Desktop nav */}
        <nav
          className={cn(
            "hidden items-center gap-1 text-sm font-medium lg:flex",
            transparent ? "text-white/80" : "text-foreground/80",
          )}
        >
          <HeaderLink to="/" label="Ana Sayfa" transparent={transparent} />
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setServicesOpen((o) => !o)}
              aria-expanded={servicesOpen}
              className={cn(
                "flex items-center gap-1 rounded-full px-4 py-2 transition-colors",
                transparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-muted hover:text-foreground",
              )}
            >
              Kurumsal
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 animate-[showcase-fade-in_0.18s_ease-out] overflow-hidden rounded-2xl border border-border bg-white p-2 shadow-xl">
                {KURUMSAL_LINKS.map((l) =>
                  l.href ? (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {l.label}
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      to={l.to!}
                      hash={l.hash}
                      className="block rounded-xl px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
          <HeaderLink to="/hakkimizda" label="Hakkımızda" transparent={transparent} />
          <HeaderLink to="/referanslar" label="Referanslar" transparent={transparent} />
          <HeaderLink to="/araclar" label="Araçlar" transparent={transparent} />
          <HeaderLink to="/blog" label="Blog" transparent={transparent} />
          <HeaderLink to="/teklif" label="İletişim" transparent={transparent} />
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
            className={cn(
              "flex items-center gap-2 text-sm font-medium",
              transparent ? "text-white/80 hover:text-white" : "text-foreground/70 hover:text-foreground",
            )}
          >
            <Phone className="h-4 w-4" />
            {COMPANY.phoneMobile}
          </a>
          <Link
            to="/iletisim"
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-semibold shadow-lg transition-transform hover:scale-105",
              transparent ? "bg-white text-black" : "bg-accent text-white",
            )}
          >
            Teklif Alın
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className={cn(
            "rounded-full p-2 lg:hidden",
            transparent ? "text-white" : "text-foreground",
          )}
          aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-white lg:hidden">
          <nav className="container mx-auto flex flex-col px-4 py-4 text-sm font-medium text-foreground/90">
            <MobileLink to="/" label="Ana Sayfa" />
            <button
              onClick={() => setMobileServicesOpen((o) => !o)}
              aria-expanded={mobileServicesOpen}
              className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-muted"
            >
              Kurumsal
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", mobileServicesOpen && "rotate-180")}
              />
            </button>
            {mobileServicesOpen && (
              <div className="mb-2 ml-3 border-l border-border pl-3">
                {KURUMSAL_LINKS.map((l) =>
                  l.href ? (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-foreground/70 hover:bg-muted"
                    >
                      {l.label}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <Link
                      key={l.label}
                      to={l.to!}
                      hash={l.hash}
                      className="block rounded-lg px-3 py-2.5 text-foreground/70 hover:bg-muted"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
              </div>
            )}
            <MobileLink to="/hakkimizda" label="Hakkımızda" />
            <MobileLink to="/referanslar" label="Referanslar" />
            <MobileLink to="/araclar" label="Araçlar" />
            <MobileLink to="/blog" label="Blog" />
            <MobileLink to="/teklif" label="İletişim" />
            <Link
              to="/iletisim"
              className="mt-3 rounded-full bg-accent px-5 py-3 text-center font-semibold text-white"
            >
              Teklif Alın
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function HeaderLink({
  to,
  label,
  transparent,
}: {
  to: string;
  label: string;
  transparent: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "rounded-full px-4 py-2 transition-colors",
        transparent ? "hover:bg-white/10 hover:text-white" : "hover:bg-muted hover:text-foreground",
      )}
      activeProps={{
        className: transparent ? "text-white" : "text-accent",
      }}
    >
      {label}
    </Link>
  );
}

function MobileLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="rounded-lg px-3 py-3 hover:bg-muted"
      activeProps={{ className: "text-accent" }}
    >
      {label}
    </Link>
  );
}
