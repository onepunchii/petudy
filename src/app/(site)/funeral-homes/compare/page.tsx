import type { Metadata } from "next";
import {
    FUNERAL_HOMES,
    SERVICE_KEYS,
    SERVICE_LABEL,
    formatWon,
    funeralHomePath,
    funeralHomesPath,
    shortPlaceLabel,
} from "@/lib/site/funeral-homes";
import { STATUS_TEXT } from "@/components/site/funeral-homes/detail/content";
import { ShelfCompare, type CompareHome } from "@/components/site/funeral-homes/ShelfCompare";
import { PageHero } from "../../_components/PageHero";

/** 기기마다 내용이 달라 검색에 올리지 않습니다 */
export const metadata: Metadata = {
    title: "저장한 장례식장 비교",
    description: "저장한 허가 반려동물 장례식장을 가격·운영 시간·서비스별로 나란히 봅니다.",
    alternates: { canonical: "/funeral-homes/compare" },
    robots: { index: false, follow: true },
};

/** 비교 표에 쓰는 칸만 추려 넘깁니다(출처 본문·가격표 전체는 싣지 않음) */
function compareHomes(): CompareHome[] {
    return FUNERAL_HOMES.map((h) => ({
        id: h.id,
        name: h.name,
        place: shortPlaceLabel(h),
        path: funeralHomePath(h),
        phone: h.phone,
        price: h.priceFrom ? `${formatWon(h.priceFrom)}부터` : null,
        hours: h.hours?.text ?? null,
        services: SERVICE_KEYS.map((k) => {
            const status = h.services[k]?.status ?? "unknown";
            return { status, text: STATUS_TEXT[status] };
        }),
    }));
}

export default function FuneralComparePage() {
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "반려동물 장례식장 찾기", href: funeralHomesPath() },
        { name: "저장한 장례식장", href: "/funeral-homes/compare" },
    ];
    return (
        <>
            <PageHero size="compact" crumbs={crumbs} title="저장한 장례식장 비교" subtitle="가족과 나란히 보고 정할 수 있게, 저장한 곳을 한 화면에 모았어요" />
            <ShelfCompare homes={compareHomes()} serviceLabels={SERVICE_KEYS.map((k) => SERVICE_LABEL[k])} allHref={funeralHomesPath()} />
        </>
    );
}
