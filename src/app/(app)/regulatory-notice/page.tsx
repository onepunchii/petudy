import { CheckCircle2, ShieldCheck, Truck, Scale } from "lucide-react";
import { APP_ICON_STROKE, AppBody, appCardClass, AppTopBar } from "@/components/app/ui";
import { PassCard } from "@/components/site/PassCard";
import { cn } from "@/lib/utils";

/*
 * 법적 고지 화면입니다. 문구·숫자·업체 정보는 바꾸지 않고 모양만 맞춥니다.
 * 장례 서비스 고지라 라임은 쓰지 않습니다 (강조는 ink).
 */

/** 본문 소제목 (h3: 문서 제목 h2 아래) */
function NoticeHeading({ icon: Icon, children }: { icon: typeof Truck; children: React.ReactNode }) {
    return (
        <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-2">
                <Icon className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
            </span>
            <h3 className="text-[18px] font-bold leading-snug text-ink">{children}</h3>
        </div>
    );
}

export default function RegulatoryNoticePage() {
    return (
        <div className="min-h-full bg-moon">
            <AppTopBar title="이용자 고지 사항" backHref="/app" />

            {/* Content */}
            <AppBody className="pb-16">
                {/* Document Header + Company Info: 확인서를 탑승권 카드로 */}
                <PassCard
                    as="section"
                    stubPosition="bottom"
                    mainClassName="p-6 text-center sm:p-6"
                    stubClassName="p-6"
                    stub={
                        <dl className="grid grid-cols-[6.75rem_minmax(0,1fr)] gap-x-3 gap-y-3.5 text-[14.5px] leading-[1.6]">
                            <dt className="text-ink-3">신청인</dt>
                            <dd className="break-keep font-bold text-ink">펫터디 주식회사 (대표 최정환)</dd>
                            <dt className="text-ink-3">사업자등록번호</dt>
                            <dd className="tabular-nums text-ink">110-86-18965</dd>
                            <dt className="text-ink-3">주소</dt>
                            <dd className="break-keep text-ink">서울시 구로구 디지털로 32길 30 코오롱빌란트 715호</dd>
                        </dl>
                    }
                >
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-soft px-3 py-1 text-[13px] font-bold text-pine">
                        <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        제381호
                    </span>
                    <h2 className="mt-3 break-keep text-[22px] font-extrabold leading-tight tracking-[-0.02em] text-ink">
                        실증을 위한 규제특례 확인서
                    </h2>
                    <p className="mt-2 text-[14px] text-ink-2">
                        산업통상자원부 장관 확인 (2023년 11월 6일)
                    </p>
                </PassCard>

                {/* Service Description */}
                <section className="mt-8">
                    <NoticeHeading icon={Truck}>서비스 명칭 및 내용</NoticeHeading>
                    <div className={cn(appCardClass, "break-keep p-5 text-[15px] leading-[1.75] text-ink-2")}>
                        <strong className="mb-2 block text-[16px] font-bold text-ink">이동식 반려동물 화장 및 찾아가는 장례 서비스</strong>
                        반려동물 집을 방문하여 염습 및 추모 후, 사체를 차량으로 옮겨 지정된 장소에서 화장 진행 후, 분골하여 유골함에 담은 후 보호자에게 전달하는 장례 서비스입니다.
                    </div>
                </section>

                {/* Validity Period */}
                <section className="mt-8">
                    <NoticeHeading icon={ShieldCheck}>유효 기간</NoticeHeading>
                    <div className={cn(appCardClass, "break-keep p-5 text-[15px] leading-[1.75] text-ink-2")}>
                        <p>책임보험에 가입하고 사업 개시 확인서의 사업 개시일로부터 <span className="font-bold text-ink">2년</span></p>
                    </div>
                </section>

                {/* Key Conditions */}
                <section className="mt-8">
                    <NoticeHeading icon={Scale}>주요 실증 조건</NoticeHeading>

                    <ul className="divide-y divide-line overflow-hidden rounded-[20px] bg-pass ring-1 ring-line/70">
                        <li className="flex gap-3 p-5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[13px] font-bold tabular-nums text-ink-2">1</span>
                            <div className="min-w-0 pt-0.5">
                                <h4 className="text-[15px] font-bold text-ink">기록 및 보고</h4>
                                <p className="mt-1 break-keep text-[14px] leading-[1.7] text-ink-2">
                                    차량에 대한 실시간 관리를 위해 24시간 기록 가능한 영상정보처리기기(CCTV), GPS 등을 설치하고 보고 의무를 준수합니다. (30일 이상 녹화 기록 보관)
                                </p>
                            </div>
                        </li>

                        <li className="flex gap-3 p-5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[13px] font-bold tabular-nums text-ink-2">2</span>
                            <div className="min-w-0 pt-0.5">
                                <h4 className="text-[15px] font-bold text-ink">개인정보 보호</h4>
                                <p className="mt-1 break-keep text-[14px] leading-[1.7] text-ink-2">
                                    영업상 취득한 개인정보(성명, 연락처 등)는 용도 외 목적으로 사용하지 않으며, 사업 종료 후 DB 정보를 안전하게 파기합니다.
                                </p>
                            </div>
                        </li>

                        <li className="flex gap-3 p-5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[13px] font-bold tabular-nums text-ink-2">3</span>
                            <div className="min-w-0 pt-0.5">
                                <h4 className="text-[15px] font-bold text-ink">안전 및 환경 기준 준수</h4>
                                <p className="mt-1 break-keep text-[14px] leading-[1.7] text-ink-2">
                                    자동차관리법, 대기환경보전법 등 타법령에 위반되지 않는 범위 내에서 서비스를 제공하며, 강화된 환경 기준을 준수합니다.
                                </p>
                            </div>
                        </li>

                        <li className="flex gap-3 p-5">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-2 text-[13px] font-bold tabular-nums text-ink-2">4</span>
                            <div className="min-w-0 pt-0.5">
                                <h4 className="text-[15px] font-bold text-ink">운영 지역 및 비용</h4>
                                <p className="mt-1 break-keep text-[14px] leading-[1.7] text-ink-2">
                                    지자체와 협의된 장소에서만 화장이 가능하며, 실증 기간 동안 서비스 가격은 실비 수준으로 청구됩니다.
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>

                {/* Official Stamp Section (Visual) */}
                <div className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-line pt-8">
                    <div className="flex h-20 w-20 rotate-12 items-center justify-center rounded-full border-4 border-danger/40">
                        <span className="text-center text-[12px] font-black leading-tight text-danger/80">
                            산업통상<br />자원부<br />장관인
                        </span>
                    </div>
                    <p className="max-w-[34ch] break-keep text-center text-[13px] leading-relaxed text-ink-3">
                        위와 같이 「산업융합 촉진법」에 따라 실증을 위한 규제특례 확인서를 발급합니다.
                    </p>
                </div>
            </AppBody>
        </div>
    );
}
