import { Check, CircleHelp, ExternalLink, Minus } from "lucide-react";
import type { ServiceStatus } from "@/lib/site/funeral-homes";
import { cn } from "@/lib/utils";
import { Reveal } from "../../Reveal";
import { ICON_STROKE } from "../../ui";
import { STATUS_TEXT, UNKNOWN_TEXT } from "./content";

/**
 * 상세 페이지 섹션 틀. h2 에 목차와 같은 ASCII id 와 scroll-mt-24 (sticky 헤더 64px + 여유)를 둡니다.
 * 섹션 위 작은 라벨(eyebrow)은 쓰지 않습니다.
 */
export function DetailSection({
    id,
    title,
    lead,
    children,
    className,
}: {
    id: string;
    title: string;
    lead?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Reveal as="section" className={cn("mt-16 sm:mt-20", className)}>
            <h2 id={id} className="scroll-mt-24 text-[23px] font-bold leading-[1.3] text-ink sm:text-[28px]">
                {title}
            </h2>
            {lead && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2 sm:text-[15.5px]">{lead}</p>}
            <div className="mt-7">{children}</div>
        </Reveal>
    );
}

/** 새 창으로 여는 바깥 링크 (제휴가 아니므로 sponsored 없이 noopener noreferrer) */
export function OutLink({ href, children, className, label }: { href: string; children: React.ReactNode; className?: string; label?: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>
            {children}
            {!label && <span className="sr-only"> (새 창)</span>}
        </a>
    );
}

/** 항목 옆 작은 "출처" 링크 */
export function SourceLink({ href, what, className }: { href: string; /** 읽기 도구용: "운영 시간" 등 */ what: string; className?: string }) {
    return (
        <OutLink
            href={href}
            label={`${what} 출처, 업체 홈페이지 (새 창)`}
            className={cn(
                "inline-flex items-center gap-0.5 whitespace-nowrap align-baseline text-[12.5px] font-medium text-ink-3 underline decoration-line underline-offset-[3px] transition-colors hover:text-ink hover:decoration-ink-3 motion-reduce:transition-none",
                className,
            )}
        >
            출처
            <ExternalLink className="h-3 w-3" strokeWidth={ICON_STROKE} aria-hidden />
        </OutLink>
    );
}

/** 모르는 값 표시 */
export function Unknown({ children = UNKNOWN_TEXT }: { children?: React.ReactNode }) {
    return <span className="text-ink-3">{children}</span>;
}

const STATUS_ICON = { yes: Check, no: Minus, unknown: CircleHelp } as const;

/** 서비스 상태: 아이콘 + 글자 (색만으로 구분하지 않습니다) */
export function StatusIcon({ status, className }: { status: ServiceStatus; className?: string }) {
    const Icon = STATUS_ICON[status];
    return <Icon className={cn("h-[18px] w-[18px] shrink-0", status === "yes" ? "text-pine" : "text-ink-3", className)} strokeWidth={ICON_STROKE} aria-hidden />;
}

export function StatusText({ status, className }: { status: ServiceStatus; className?: string }) {
    return (
        <span className={cn("text-[13px]", status === "yes" ? "font-semibold text-pine" : status === "no" ? "text-ink-2" : "text-ink-3", className)}>
            {STATUS_TEXT[status]}
        </span>
    );
}
