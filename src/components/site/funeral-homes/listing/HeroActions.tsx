import { SITE } from "@/lib/site/config";
import { CallButton, PillLink } from "../../ui";

/**
 * 목록 히어로 버튼 줄: 포온 전화 상담(주) + 우리 동네 찾기(보조, 페이지 안 앵커).
 * 서비스 히어로와 같은 순서·모양이고, 장례 영역이라 라임 대신 흰 알약입니다.
 */
export function ListingHeroActions({
    findHref,
    findLabel = "우리 동네 찾기",
}: {
    /** "#sido", "#list" 같은 페이지 안 앵커 */
    findHref: string;
    findLabel?: string;
}) {
    return (
        <>
            <CallButton tone="onNight" accent="white" />
            {/* 대표 번호가 없으면 '우리 동네 찾기'가 주 버튼 */}
            <PillLink href={findHref} tone="onNight" variant={SITE.hasPhone ? "ghost" : "solid"}>
                {findLabel}
            </PillLink>
        </>
    );
}
