import Link from "next/link";
import { Award, Car, ChevronRight, Flower2, Hand, Home, Phone, Scissors } from "lucide-react";
import { SITE } from "@/lib/site/config";
import type { Faq, Service } from "@/lib/site/services";
import { cn } from "@/lib/utils";

export function ServiceIcon({ icon, className }: { icon: Service["icon"]; className?: string }) {
    const C = { flower: Flower2, scissors: Scissors, home: Home, hand: Hand, car: Car, award: Award }[icon];
    return <C className={className} strokeWidth={1.75} aria-hidden />;
}

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={cn("text-[13px] font-semibold tracking-wide text-pine flex items-center gap-2", className)}>
            <span className="inline-block h-px w-5 bg-current" aria-hidden />
            {children}
        </p>
    );
}

export function SectionTitle({ eyebrow, title, lead, className }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; className?: string }) {
    return (
        <div className={cn("max-w-2xl", className)}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2 className="mt-3 text-[26px] sm:text-[32px] font-bold leading-[1.25] text-ink">{title}</h2>
            {lead && <p className="mt-3 text-[15px] sm:text-base leading-relaxed text-ink-2">{lead}</p>}
        </div>
    );
}

export function CallButton({ className, label = "전화 상담", tone = "dark" }: { className?: string; label?: string; tone?: "dark" | "light" }) {
    return (
        <a
            href={SITE.phoneHref}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-5 h-12 text-[15px] font-semibold transition-colors",
                tone === "dark" ? "bg-ink text-white hover:bg-pine" : "bg-white text-ink hover:bg-paper-2",
                className,
            )}
        >
            <Phone className="h-4 w-4" aria-hidden />
            {label} <span className="tabular-nums">{SITE.phone}</span>
        </a>
    );
}

export function FaqList({ faqs }: { faqs: Faq[] }) {
    return (
        <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                    <summary className="flex cursor-pointer items-start justify-between gap-6 text-[16px] font-semibold text-ink">
                        <span className="flex gap-3">
                            <span className="text-pine">Q.</span>
                            {f.q}
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-ink-3 transition-transform group-open:rotate-90" aria-hidden />
                    </summary>
                    <p className="mt-3 pl-7 text-[15px] leading-[1.8] text-ink-2">{f.a}</p>
                </details>
            ))}
        </div>
    );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
    return (
        <nav aria-label="현재 위치" className="text-[13px] text-ink-3">
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((it, i) => (
                    <li key={it.href} className="flex items-center gap-1">
                        {i > 0 && <ChevronRight className="h-3 w-3" aria-hidden />}
                        {i === items.length - 1 ? (
                            <span aria-current="page" className="text-ink-2">{it.name}</span>
                        ) : (
                            <Link href={it.href} className="hover:text-ink">{it.name}</Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            // JSON.stringify 결과의 '<' 를 이스케이프해 </script> 주입을 막습니다
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
        />
    );
}

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span className={cn("inline-flex items-center rounded-full border border-line bg-white px-3 py-1 text-[13px] text-ink-2", className)}>
            {children}
        </span>
    );
}
