import { cn } from "@/lib/utils";

/**
 * 목차·버튼이 가리키는 섹션 제목. ASCII id + scroll-mt-24 (고정 헤더 아래로 멈춤).
 * size="section" 은 SectionTitle h2 와 같은 크기, "block" 은 한 섹션 안 여러 덩어리, "group" 은 시군구 묶음처럼 작은 h2 입니다.
 */
export function AnchorTitle({
    id,
    children,
    lead,
    size = "section",
    className,
}: {
    id: string;
    children: React.ReactNode;
    lead?: React.ReactNode;
    size?: "section" | "block" | "group";
    className?: string;
}) {
    return (
        <div className={cn("max-w-2xl", className)}>
            <h2
                id={id}
                className={cn(
                    "scroll-mt-24 font-bold leading-[1.28] text-ink",
                    size === "section" ? "text-[26px] sm:text-[32px]" : size === "block" ? "text-[23px] sm:text-[27px]" : "text-[20px] sm:text-[22px]",
                )}
            >
                {children}
            </h2>
            {lead && <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-ink-2 sm:text-base">{lead}</p>}
        </div>
    );
}
