import { PassCard } from "../../PassCard";
import { CallButton } from "../../ui";
import { TocNav, type TocItem } from "../TocNav";

/**
 * lg 이상 본문 오른쪽 sticky 칸: 목차 + 포온 상담 카드(본문 속 예외 밤 카드 한 장, 가이드 페이지와 같은 모양).
 * 모바일은 하단 플로팅 바가 상담 역할을 하므로 칸째 숨깁니다.
 */
export function DetailSidebar({ toc }: { toc: TocItem[] }) {
    return (
        <aside aria-label="목차와 상담" className="hidden lg:block">
            <div className="sticky top-24 grid max-h-[calc(100dvh-7rem)] gap-10 overflow-y-auto overscroll-contain pb-4">
                <TocNav items={toc} layout="sidebar" />
                <PassCard
                    tone="night"
                    stubPosition="bottom"
                    mainClassName="p-6"
                    stubClassName="p-5"
                    stub={<CallButton tone="onNight" size="sm" className="w-full" />}
                >
                    <p className="text-[16.5px] font-bold leading-snug text-star">어디로 모실지 고민이라면</p>
                    <p className="mt-2 text-[14px] leading-[1.7] text-star-2">계신 동네를 알려 주시면 가까운 허가 업체와 비용을 먼저 확인해 드립니다.</p>
                </PassCard>
            </div>
        </aside>
    );
}
