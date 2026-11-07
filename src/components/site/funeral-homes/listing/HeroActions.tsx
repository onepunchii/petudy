import { CallButton, PillLink } from "../../ui";

/**
 * 목록 히어로 버튼 줄: 포온 전화 상담(주) + 우리 동네 찾기(보조, 페이지 안 앵커).
 * 서비스 히어로와 같은 순서·모양이고, 장례 영역이라 라임 대신 흰 알약입니다.
 */
export function ListingHeroActions({ findHref }: { /** "#sido", "#list" 같은 페이지 안 앵커 */ findHref: string }) {
    return (
        <>
            <CallButton tone="onNight" accent="white" />
            <PillLink href={findHref} tone="onNight" variant="ghost">
                우리 동네 찾기
            </PillLink>
        </>
    );
}
