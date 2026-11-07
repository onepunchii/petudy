"use client";

import { useRouter } from "next/navigation";
import { MapPin, Car, Tent } from "lucide-react";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppList, AppSection, AppTopBar, AppIntro } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";

/* 펫여행 안내. 밤 윗줄 + 밤 소개 -> 달빛 본문, 주 버튼은 라임 하나 */

export default function TravelPage() {
    const router = useRouter();

    return (
        <div className="flex min-h-full flex-col bg-moon">
            {/* 윗줄은 소개와 한 덩어리로 보이도록 불투명 밤색 */}
            <AppTopBar title="펫여행" className="bg-night" />
            <AppIntro
                eyebrow="설레는 여행"
                title={
                    <>
                        아이와 함께 떠나는
                        <br />
                        행복한 추억 만들기
                    </>
                }
                subtitle="숙소부터 이동수단까지 포온이 모두 준비했습니다."
                icon={<MapPin className="h-6 w-6" strokeWidth={APP_ICON_STROKE} />}
            />

            <AppBody className="flex-1 pb-4">
                {/* 혜택 */}
                <AppSection title="포온 트래블만의 혜택" id="travel-features">
                    <AppList>
                        <InfoRow icon={<Tent className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />} title="검증된 펫 전용 숙소">
                            미끄럼 방지 매트, 전용 식기 등 반려동물을 위한 시설이 완비된 곳만 엄선합니다.
                        </InfoRow>
                        <InfoRow icon={<Car className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />} title="편안한 이동 서비스">
                            장거리 여행도 걱정 없도록, 넓고 쾌적한 펫 전용 차량을 지원합니다.
                        </InfoRow>
                    </AppList>
                </AppSection>

                {/* 인기 여행지: 탑승권 카드 */}
                <AppSection title="인기 여행지" id="travel-places">
                    <PassCard mainClassName="p-5 sm:p-6">
                        <ul className="divide-y divide-line">
                            <PlaceCard name="강릉 멍비치" desc="아이들이 마음껏 뛰어노는 전용 해변" tag="#바다" />
                            <PlaceCard name="제주 애견 동반 펜션" desc="감귤밭 산책로가 있는 독채 숙소" tag="#제주" />
                            <PlaceCard name="가평 풀빌라" desc="사계절 온수풀이 있는 프라이빗 공간" tag="#수영" />
                        </ul>
                    </PassCard>
                </AppSection>
            </AppBody>

            {/* 주 버튼 (화면당 라임 하나) */}
            <AppBottomAction>
                <AppButton variant="accent" size="lg" block onClick={() => router.push('/booking/new?category=TRAVEL')}>
                    여행 패키지 예약하기
                </AppButton>
            </AppBottomAction>
        </div>
    );
}

function PlaceCard({ name, desc, tag }: { name: string; desc: string; tag: string }) {
    return (
        <li className="flex items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
                <h3 className="text-[15.5px] font-semibold text-ink">{name}</h3>
                <p className="mt-0.5 text-[13.5px] leading-snug text-ink-3">{desc}</p>
            </div>
            <span className="shrink-0 rounded-full bg-pine-soft px-2.5 py-1 text-[13px] font-semibold text-pine">{tag}</span>
        </li>
    );
}

function InfoRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-3 px-4 py-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">{icon}</span>
            <div className="min-w-0 pt-0.5">
                <h3 className="text-[15.5px] font-semibold leading-snug text-ink">{title}</h3>
                <p className="mt-0.5 text-[14px] leading-relaxed text-ink-2">{children}</p>
            </div>
        </li>
    );
}
