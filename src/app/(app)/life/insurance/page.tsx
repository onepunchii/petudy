"use client";

import { useRouter } from "next/navigation";
import { Check, HeartPulse, ShieldCheck, Wallet } from "lucide-react";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, AppList, AppSection, AppTopBar, AppIntro } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";

/* 펫보험 안내. 밤 윗줄 + 밤 소개 -> 달빛 본문, 주 버튼은 라임 하나 */

const COVERAGE = [
    "입원/통원 의료비 (일 최대 15만원)",
    "수술비 지원 (연간 2회)",
    "배상책임 보장 (최대 1천만원)",
    "반려견 장례비 지원",
];

export default function InsurancePage() {
    const router = useRouter();

    return (
        <div className="flex min-h-full flex-col bg-moon">
            {/* 윗줄은 소개와 한 덩어리로 보이도록 불투명 밤색 */}
            <AppTopBar title="펫보험" className="bg-night" />
            <AppIntro
                eyebrow="든든한 보장"
                title={
                    <>
                        병원비 걱정 없이
                        <br />
                        마음껏 사랑하세요
                    </>
                }
                subtitle="갑작스러운 질병과 사고에도 펫보험이 곁에 있습니다."
                icon={<ShieldCheck className="h-6 w-6" strokeWidth={APP_ICON_STROKE} />}
            />

            <AppBody className="flex-1 pb-4">
                {/* 필요한 이유 */}
                <AppSection title="왜 펫보험이 필요한가요?" id="insurance-why">
                    <AppList>
                        <InfoRow icon={<Wallet className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />} title="병원비 부담 감소">
                            CT, MRI 촬영 등 고액 검사비부터 슬개골 탈구 수술비까지 지원합니다.
                        </InfoRow>
                        <InfoRow icon={<HeartPulse className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />} title="노령동물 케어">
                            나이가 들어도 안심할 수 있도록, 만성 질환 통원 치료비를 보장합니다.
                        </InfoRow>
                    </AppList>
                </AppSection>

                {/* 주요 보장 내용: 탑승권 카드 */}
                <AppSection title="주요 보장 내용" id="insurance-coverage">
                    <PassCard mainClassName="p-5 sm:p-6">
                        <ul className="space-y-3.5">
                            {COVERAGE.map((item) => (
                                <li key={item} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-pine" strokeWidth={2.25} aria-hidden />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </PassCard>
                </AppSection>
            </AppBody>

            {/* 주 버튼 (화면당 라임 하나). 상담 폼으로 가는 버튼은 "상담 남기기" 한 라벨로 씁니다 */}
            <AppBottomAction>
                <AppButton variant="accent" size="lg" block onClick={() => router.push('/booking/new?category=INSURANCE')}>
                    상담 남기기
                </AppButton>
            </AppBottomAction>
        </div>
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
