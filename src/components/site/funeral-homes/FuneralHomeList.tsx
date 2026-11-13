import { formatWon, funeralHomePath, serviceHighlights, shortPlaceLabel, type FuneralHome } from "@/lib/site/funeral-homes";
import { cn } from "@/lib/utils";
import { HomeRow, type HomeRowData } from "./HomeRow";
import type { FilterRow, HomeFilter } from "./FilteredHomeGroups";

/** 업체 데이터 → 목록 한 줄 값 (서버에서만 부릅니다) */
export function toRowData(home: FuneralHome): HomeRowData {
    return {
        id: home.id,
        name: home.name,
        place: shortPlaceLabel(home),
        path: funeralHomePath(home),
        highlights: serviceHighlights(home, 3),
        price: home.priceFrom ? `${formatWon(home.priceFrom)}부터` : null,
    };
}

/** 필터 '공개 가격 20만 원 이하부터'의 기준(원) */
const PRICE_LOW = 200000;

/** 목록 한 줄 값 + 맞는 조건(홈페이지에 '안내 있음'인 것만) */
export function toFilterRow(home: FuneralHome): FilterRow {
    const tags: HomeFilter[] = [];
    if (home.services.allDay?.status === "yes") tags.push("allDay");
    if (home.services.viewing?.status === "yes") tags.push("viewing");
    if (home.services.largeDog?.status === "yes") tags.push("largeDog");
    if (home.priceFrom !== null && home.priceFrom <= PRICE_LOW) tags.push("priceLow");
    return { ...toRowData(home), tags };
}

export function FuneralHomeRow({ home, km, className }: { home: FuneralHome; /** 기준 지점에서 직선거리(km) */ km?: number; className?: string }) {
    return <HomeRow row={toRowData(home)} km={km} className={className} />;
}

export function FuneralHomeList({ homes, distances, className }: { homes: FuneralHome[]; distances?: Map<string, number>; className?: string }) {
    return (
        <ul className={cn("border-b border-line", className)}>
            {homes.map((h) => (
                <FuneralHomeRow key={h.id} home={h} km={distances?.get(h.id)} />
            ))}
        </ul>
    );
}
