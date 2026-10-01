import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { SEVERITY_META, type Finding } from "@/lib/audit/types";
import { SERVICES } from "@/lib/services";

/** PRD 5.2.3'teki sabit şablon: ne bulundu / neden önemli / ne yapılmalı. */
export function FindingCard({ finding }: { finding: Finding & { category?: string } }) {
  const meta = SEVERITY_META[finding.severity];
  const service = finding.service ? SERVICES.find((s) => s.slug === finding.service) : undefined;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.12em]"
          style={{ background: `${meta.color}22`, color: meta.color }}
        >
          {meta.label}
        </span>
        {finding.category && (
          <span className="text-[11px] font-medium text-white/35">{finding.category}</span>
        )}
      </div>

      <h3 className="mt-3 text-base font-semibold text-white">{finding.title}</h3>

      <dl className="mt-3 space-y-2 text-sm leading-relaxed">
        <Row term="Ne bulundu" desc={finding.evidence} />
        <Row term="Neden önemli" desc={finding.why} />
        <Row term="Ne yapılmalı" desc={finding.action} />
      </dl>

      {service && (
        <Link
          to="/hizmetler/$slug"
          params={{ slug: service.slug }}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{ color: service.accent }}
        >
          {service.title}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function Row({ term, desc }: { term: string; desc: string }) {
  return (
    <div className="flex gap-2">
      <dt className="w-[86px] shrink-0 text-xs font-medium text-white/35">{term}</dt>
      <dd className="min-w-0 flex-1 text-white/70">{desc}</dd>
    </div>
  );
}
