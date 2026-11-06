import { REGIONS } from "@/lib/site/regions";
import { TONE, type Service } from "@/lib/site/services";
import { cn } from "@/lib/utils";
import { RegionPicker } from "./RegionPicker";
import { Breadcrumbs, CallButton, Container, ServiceIcon } from "./ui";

export function ServiceHero({
    service,
    crumbs,
    title,
    lead,
    chips,
    picker = true,
    aside,
}: {
    service: Service;
    crumbs: { name: string; href: string }[];
    title: React.ReactNode;
    lead: React.ReactNode;
    chips?: string[];
    picker?: boolean;
    aside?: React.ReactNode;
}) {
    const t = TONE[service.tone];
    const pickerRegions = REGIONS.map(({ sido, slug, name, lat, lng }) => ({ sido, slug, name, lat, lng }));
    return (
        <section className={cn("relative overflow-hidden text-white", t.bg)}>
            <svg viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] opacity-[0.07]" aria-hidden>
                {[190, 150, 110, 70, 30].map((r) => (
                    <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="white" strokeWidth="1.5" />
                ))}
            </svg>
            <Container className="relative pb-14 pt-6 sm:pb-20">
                <div className="[&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white/85 [&_nav]:text-white/60">
                    <Breadcrumbs items={crumbs} />
                </div>
                <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="flex items-center gap-2 text-[14px] font-semibold text-white/75">
                            <ServiceIcon icon={service.icon} className="h-4 w-4" />
                            {service.name}
                            {service.available24h && <span className="rounded-full bg-white/15 px-2 py-0.5 text-[12px]">24시간</span>}
                        </p>
                        <h1 className="mt-4 text-[32px] font-extrabold leading-[1.22] sm:text-[44px] lg:text-[50px]">{title}</h1>
                        <div className="mt-5 max-w-xl text-[16px] leading-[1.8] text-white/80">{lead}</div>
                        {chips && (
                            <ul className="mt-6 flex flex-wrap gap-2">
                                {chips.map((c) => (
                                    <li key={c} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[13px] font-medium">
                                        {c}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <CallButton tone="light" className="mt-8" label={service.available24h ? "지금 전화 상담" : "전화 상담"} />
                    </div>
                    {aside ?? (picker && <RegionPicker regions={pickerRegions} service={service.slug} variant="dark" />)}
                </div>
            </Container>
        </section>
    );
}
