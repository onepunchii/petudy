import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FUNERAL_SIDO, funeralHomesBySido, funeralHomesPath, funeralSidoPath, nearestFuneralHomes, type FuneralHome } from "@/lib/site/funeral-homes";
import { ICON_STROKE } from "../../ui";
import { FuneralHomeList } from "../FuneralHomeList";
import { DetailSection } from "./bits";

const moreLink =
    "group inline-flex items-center gap-1.5 text-[15px] font-semibold text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-ink";

/** 가까운 다른 장례식장 4곳 (대략 좌표 기준 직선거리) + 시·도 목록, 전국 목록 링크 */
export function NearbySection({ home: h }: { home: FuneralHome }) {
    const near = nearestFuneralHomes(h, 4, h.id);
    // 대략 좌표(시·군청 기준)끼리는 같은 지점일 수 있어 "약 0.0km"가 됩니다. 1km 미만은 거리를 빼고 지역만 보여 줍니다
    const distances = new Map(near.filter((n) => n.km >= 1 || (h.geo === "address" && n.home.geo === "address")).map((n) => [n.home.id, n.km]));
    const sido = FUNERAL_SIDO[h.sido];
    const sidoCount = funeralHomesBySido(h.sido).length;

    return (
        <DetailSection id="nearby" title="가까운 다른 장례식장" lead="공식 목록 소재지를 바탕으로 한 대략 위치 기준 직선거리입니다.">
            <FuneralHomeList homes={near.map((n) => n.home)} distances={distances} />
            <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
                <Link href={funeralSidoPath(h.sido)} className={moreLink}>
                    {sido.short} 반려동물 장례식장 {sidoCount}곳
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                </Link>
                <Link href={funeralHomesPath()} className={moreLink}>
                    전국 반려동물 장례식장 찾기
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                </Link>
            </div>
        </DetailSection>
    );
}
