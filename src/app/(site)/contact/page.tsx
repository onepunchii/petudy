import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site/config";
import { leadServiceFromParam, liveServicesEverydayFirst } from "@/lib/site/services";
import { LeadForm } from "@/components/site/LeadForm";
import { CallButton, Container } from "@/components/site/ui";
import { PageHero } from "../_components/PageHero";

export const metadata: Metadata = {
    title: "상담 접수 · 24시간 반려동물 서비스 상담",
    description: "반려동물 장례, 애견미용 상담을 남겨주세요. 계신 동네 기준으로 가까운 허가·등록 업체와 예상 비용을 확인해 연락드립니다.",
    alternates: { canonical: "/contact" },
};

const STEPS = [
    { t: "남겨 주신 내용 확인", d: "담당자가 계신 동네와 아이의 상황을 먼저 읽습니다." },
    { t: "가까운 업체 확인", d: "동네 기준으로 허가·등록 업체와 가능한 시간을 확인합니다." },
    { t: "예상 비용과 함께 연락", d: "남겨 주신 연락처로 확인한 내용을 알려 드립니다." },
];

/** 하단 '상담 남기기'·서비스 페이지에서 ?service=grooming 처럼 보던 서비스를 넘깁니다. 없거나 모르는 값이면 '아직 모르겠어요' */
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ service?: string | string[] }> }) {
    const { service } = await searchParams;
    const crumbs = [
        { name: "홈", href: "/" },
        { name: "상담 남기기", href: "/contact" },
    ];
    return (
        <>
            <PageHero
                size="compact"
                overlap
                crumbs={crumbs}
                title={
                    <>
                        24시간 반려동물
                        <br />
                        서비스 상담
                    </>
                }
                subtitle="급하시면 전화가 가장 빠릅니다. 천천히 남겨 주셔도 괜찮습니다."
                actions={<CallButton tone="onNight" />}
            />

            <section className="pb-16 pt-12 sm:pb-24">
                <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
                    {/* 폼은 모바일에서 먼저, lg 에서는 오른쪽 칸에서 히어로 아래쪽에 걸칩니다 */}
                    <div id="form" className="order-first scroll-mt-24 lg:relative lg:z-[1] lg:order-last lg:-mt-48">
                        <h2 className="sr-only">상담 남기기</h2>
                        <LeadForm
                            service={leadServiceFromParam(service)}
                            services={liveServicesEverydayFirst().map((s) => ({ slug: s.slug, short: s.name }))}
                        />
                    </div>

                    <div>
                        <h2 id="contact-steps" className="text-[20px] font-bold text-ink sm:text-[22px]">
                            남겨 주시면 이렇게 이어집니다
                        </h2>
                        <ol aria-labelledby="contact-steps" className="relative mt-8 grid gap-7">
                            <span aria-hidden className="absolute bottom-3 left-[7px] top-3 w-px bg-ink/15" />
                            {STEPS.map((s) => (
                                <li key={s.t} className="relative pl-10">
                                    <span aria-hidden className="absolute left-0 top-1.5 h-[15px] w-[15px] rounded-full border-2 border-ink bg-moon" />
                                    <h3 className="text-[17px] font-bold text-ink">{s.t}</h3>
                                    <p className="mt-1.5 text-[15px] leading-[1.75] text-ink-2">{s.d}</p>
                                </li>
                            ))}
                        </ol>

                        <dl className="mt-12 grid gap-5 border-t border-line pt-8 text-[15px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                            <div>
                                <dt className="text-[13px] font-semibold text-ink-3">상담 시간</dt>
                                <dd className="mt-1 font-semibold text-ink">{SITE.hours}</dd>
                            </div>
                            <div>
                                <dt className="text-[13px] font-semibold text-ink-3">이메일</dt>
                                <dd className="mt-1">
                                    <a href={`mailto:${SITE.company.email}`} className="font-semibold text-ink underline-offset-4 hover:underline">
                                        {SITE.company.email}
                                    </a>
                                </dd>
                            </div>
                            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
                                <dt className="text-[13px] font-semibold text-ink-3">업체 제휴</dt>
                                <dd className="mt-1 text-ink-2">
                                    장례식장·미용실 등 업체 문의는{" "}
                                    <Link href="/partners" className="font-semibold text-pine underline-offset-4 hover:underline">
                                        제휴 업체 모집
                                    </Link>
                                    에서 받습니다.
                                </dd>
                            </div>
                        </dl>
                    </div>
                </Container>
            </section>
        </>
    );
}
