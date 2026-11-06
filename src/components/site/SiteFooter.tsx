import Link from "next/link";
import { SITE } from "@/lib/site/config";
import { REGIONS, SIDO } from "@/lib/site/regions";
import { SERVICES, liveServices } from "@/lib/site/services";
import { Logo } from "./SiteHeader";

/**
 * 푸터는 내부 링크 허브 역할도 합니다 — 모든 지역 허브로의 링크가 있어
 * 검색엔진이 어떤 페이지에서 시작해도 전체 지역 페이지에 도달할 수 있습니다.
 */
export function SiteFooter() {
    const live = liveServices();
    return (
        <footer className="mt-24 border-t border-line bg-paper-2/60 pb-28 lg:pb-10">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
                    <div>
                        <Logo />
                        <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">{SITE.tagline}</p>
                        <a href={SITE.phoneHref} className="mt-5 block text-[26px] font-bold tabular-nums text-ink">
                            {SITE.phone}
                        </a>
                        <p className="text-[13px] text-ink-3">{SITE.hours}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        <div>
                            <p className="text-[13px] font-bold text-ink">서비스</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                {SERVICES.map((s) => (
                                    <li key={s.slug}>
                                        <Link href={`/${s.slug}`} className="hover:text-ink">
                                            {s.name}
                                            {s.status === "soon" && <span className="ml-1 text-[11px] text-ink-3">준비중</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-ink">알아두기</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                <li><Link href="/guide" className="hover:text-ink">보호자 가이드</Link></li>
                                <li><Link href="/about" className="hover:text-ink">포온 소개</Link></li>
                                <li><Link href="/partners" className="hover:text-ink">제휴 업체 모집</Link></li>
                                <li><Link href="/contact" className="hover:text-ink">상담 접수</Link></li>
                                <li><Link href="/privacy" className="hover:text-ink">개인정보처리방침</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-[13px] font-bold text-ink">지역별 찾기</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                {live.map((s) => (
                                    <li key={s.slug}>
                                        <Link href={`/${s.slug}#regions`} className="hover:text-ink">지역별 {s.short} 안내</Link>
                                    </li>
                                ))}
                                <li><Link href="/area" className="hover:text-ink">전체 지역 보기</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {(["seoul", "gyeonggi"] as const).map((sido) => (
                    <div key={sido} className="mt-10">
                        <p className="text-[12px] font-bold text-ink-3">{SIDO[sido].name}</p>
                        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-ink-3">
                            {REGIONS.filter((r) => r.sido === sido).map((r) => (
                                <li key={r.slug}>
                                    <Link href={`/area/${r.sido}/${r.slug}`} className="hover:text-ink">
                                        {r.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                <div className="mt-12 border-t border-line pt-6 text-[12px] leading-relaxed text-ink-3">
                    <p>
                        {SITE.company.legalName} · 대표 {SITE.company.ceo} · 사업자등록번호 {SITE.company.bizNumber} · 통신판매업신고 {SITE.company.mailOrderNumber}
                    </p>
                    <p>{SITE.company.address} · {SITE.company.email}</p>
                    <p className="mt-2">
                        포온은 반려동물 서비스 업체를 연결하는 중개 서비스이며, 장례·미용 등 각 서비스는 동물보호법에 따라 허가·등록된 제휴 업체가 직접 제공합니다.
                    </p>
                    <p className="mt-2">© {new Date().getFullYear()} {SITE.brand}</p>
                </div>
            </div>
        </footer>
    );
}

export function MobileCallBar() {
    return (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            <div className="mx-auto flex max-w-md gap-2">
                <a href={SITE.phoneHref} className="flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-semibold text-white">
                    24시간 전화 상담
                </a>
                <Link href="/contact" className="flex h-12 flex-1 items-center justify-center rounded-full border border-ink/15 bg-white text-[15px] font-semibold text-ink">
                    상담 남기기
                </Link>
            </div>
        </div>
    );
}
