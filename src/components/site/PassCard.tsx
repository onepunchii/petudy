import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * 탑승권 카드. 흰 카드(pass) 한쪽에 점선 절취선과 반원 홈이 있고, 그 너머가 stub(떼어내는 부분)입니다.
 * - stub 이 없으면 같은 모양·그림자의 일반 카드로 렌더링됩니다(절취선 없음).
 * - 반원 홈은 CSS mask 로 실제로 뚫려 있어 어떤 배경 위에서도 그대로 보입니다(globals.css .pass).
 * - href 를 주면 카드 전체가 링크가 되고, 마우스를 올리면 살짝 떠오릅니다.
 * - 카드는 위계가 있을 때만 쓰세요. 같은 카드 3장을 나란히 두지 않습니다.
 */
export function PassCard({
    children,
    stub,
    stubPosition = "auto",
    tone = "light",
    radius = "card",
    href,
    as: Tag = "div",
    className,
    mainClassName,
    stubClassName,
    "aria-label": ariaLabel,
}: {
    children: React.ReactNode;
    /** 절취선 너머 영역 (요약 수치, 다음 행동 링크, 체크 표시 등) */
    stub?: React.ReactNode;
    /** auto: 모바일 아래, sm(640px) 이상 오른쪽 */
    stubPosition?: "auto" | "right" | "bottom";
    /** night: 밤 위 카드(night-2). 본문 중 예외적으로 한 장만 */
    tone?: "light" | "night";
    /** card 20px, tile 28px */
    radius?: "card" | "tile";
    href?: string;
    /** href 가 없을 때의 루트 태그 */
    as?: "div" | "article" | "section" | "li";
    className?: string;
    mainClassName?: string;
    stubClassName?: string;
    "aria-label"?: string;
}) {
    const data = {
        "data-stub": stub ? stubPosition : undefined,
        "data-tone": tone,
        "data-radius": radius,
    };
    const inner = (
        <>
            <div className={cn("pass-main p-6 sm:p-7", mainClassName)}>{children}</div>
            {stub && <div className={cn("pass-stub flex flex-col justify-center p-5 sm:min-w-[9.5rem] sm:p-6", stubClassName)}>{stub}</div>}
        </>
    );

    if (href) {
        return (
            <Link href={href} aria-label={ariaLabel} className={cn("pass group", className)} data-interactive="" {...data}>
                {inner}
            </Link>
        );
    }
    return (
        <Tag aria-label={ariaLabel} className={cn("pass", className)} {...data}>
            {inner}
        </Tag>
    );
}
