import { createFileRoute } from "@tanstack/react-router";

import { Hero } from "@/components/home/Hero";
import { VideoWall } from "@/components/home/VideoWall";
import { ServicesRail } from "@/components/home/ServicesRail";
import { WhyUs } from "@/components/home/WhyUs";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ServiceExplorer } from "@/components/home/ServiceExplorer";
import { ReferencesStrip } from "@/components/home/ReferencesStrip";
import { MissionVision } from "@/components/home/MissionVision";
import { ContactSection } from "@/components/home/ContactSection";
import { CtaSection } from "@/components/home/CtaSection";
import { FaqSection } from "@/components/home/FaqSection";
import { faqSchema, jsonLd, pageHead } from "@/lib/seo";
import { FAQ_ITEMS } from "@/lib/faq";
import { ProofStrip } from "@/components/home/ProofStrip";
import { AuditPromo } from "@/components/home/AuditPromo";
import { QuotePromo } from "@/components/home/QuotePromo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead({
      title: "İntegral Bilişim | Web Tasarım, Yazılım ve Dijital Pazarlama",
      description:
        "2007'den beri web tasarım, hazır web siteleri, e-ticaret, grafik tasarım ve dijital pazarlama hizmetleri. Alan adından yayına almaya kadar her şey tek elden.",
      path: "/",
    }),
    scripts: [jsonLd(faqSchema(FAQ_ITEMS))],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <VideoWall />
      <ServicesRail />
      <WhyUs />
      <AuditPromo />
      <ProcessSection />
      <QuotePromo />
      <ServiceExplorer />
      <ReferencesStrip />
      <MissionVision />
      <ContactSection />
      <CtaSection />
      <FaqSection />
    </>
  );
}
