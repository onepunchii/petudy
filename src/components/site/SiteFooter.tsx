import Link from "next/link";
import { Phone } from "lucide-react";
import { SITE } from "@/lib/site/config";
import { REGIONS, SIDO } from "@/lib/site/regions";
import { SERVICES, liveServices } from "@/lib/site/services";
import { Logo } from "./SiteHeader";

const STROKE = 1.75;

/**
 * 푸터는 밝은 면(pass)을 유지합니다(밤 -> 달빛 전환은 페이지당 한 번).
 * 내부 링크 허브 역할도 합니다. 모든 지역 허브로의 링크가 있어
 * 검색엔진이 어떤 페이지에서 시작해도 전체 지역 페이지에 도달할 수 있습니다.
 * 모바일에서는 하단 탭(BottomNav call)이 떠 있으므로 그 높이만큼 아래 여백을 둡니다(lg 이상은 탭 없음).
 */
export function SiteFooter() {
    const live = liveServices();
    const linkCls = "transition-colors hover:text-ink";
    return (
        <footer className="mt-24 border-t border-line bg-pass pb-[calc(env(safe-area-inset-bottom)+112px)] lg:pb-10">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
                <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
                    <div>
                        <Logo tone="onLight" />
                        <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-ink-2">{SITE.tagline}</p>
                        <a href={SITE.phoneHref} className="mt-6 inline-flex items-center gap-2 text-[26px] font-bold tabular-nums text-ink hover:text-pine">
                            <Phone className="h-5 w-5" strokeWidth={STROKE} aria-hidden />
                            {SITE.phone}
                        </a>
                        <p className="mt-1 text-[13px] text-ink-3">{SITE.hours}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
                        <div>
                            <p className="text-[13px] font-bold text-ink">서비스</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                {SERVICES.map((s) => (
                                    <li key={s.slug}>
                                        <Link href={`/${s.slug}`} className={linkCls}>
                                            {s.name}
                                            {s.status === "soon" && <span className="ml-1 text-[11px] text-ink-3">준비 중</span>}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[13px] font-bold text-ink">알아두기</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                <li><Link href="/guide" className={linkCls}>보호자 가이드</Link></li>
                                <li><Link href="/about" className={linkCls}>포온 소개</Link></li>
                                <li><Link href="/partners" className={linkCls}>제휴 업체 모집</Link></li>
                                <li><Link href="/contact" className={linkCls}>상담 남기기</Link></li>
                                <li><Link href="/memorial" className={linkCls}>추억상자</Link></li>
                                <li><Link href="/regulatory-notice" className={linkCls}>규제특례 이용자 고지</Link></li>
                                <li><Link href="/privacy" className={linkCls}>개인정보처리방침</Link></li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <p className="text-[13px] font-bold text-ink">지역별 찾기</p>
                            <ul className="mt-3 space-y-2 text-[14px] text-ink-2">
                                <li><Link href="/funeral-homes" className={linkCls}>장례식장 찾기</Link></li>
                                {live.map((s) => (
                                    <li key={s.slug}>
                                        <Link href={`/${s.slug}#regions`} className={linkCls}>지역별 {s.short} 안내</Link>
                                    </li>
                                ))}
                                <li><Link href="/area" className={linkCls}>전체 지역 보기</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
                    {(["seoul", "gyeonggi"] as const).map((sido) => (
                        <div key={sido}>
                            <p className="text-[12px] font-bold text-ink-2">{SIDO[sido].name}</p>
                            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-[13px] text-ink-3">
                                {REGIONS.filter((r) => r.sido === sido).map((r) => (
                                    <li key={r.slug}>
                                        <Link href={`/area/${r.sido}/${r.slug}`} className={linkCls}>
                                            {r.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 border-t border-line pt-6 text-[12px] leading-relaxed text-ink-3">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                        <li>{SITE.company.legalName}</li>
                        <li>대표 {SITE.company.ceo}</li>
                        <li>사업자등록번호 {SITE.company.bizNumber}</li>
                        <li>통신판매업신고 {SITE.company.mailOrderNumber}</li>
                    </ul>
                    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <li>{SITE.company.address}</li>
                        <li>{SITE.company.email}</li>
                    </ul>
                    <p className="mt-3 max-w-[80ch]">
                        포온은 반려동물 서비스 업체를 연결하는 중개 서비스이며, 장례·미용 등 각 서비스는 동물보호법에 따라 허가·등록된 제휴 업체가 직접 제공합니다.
                    </p>
                    <p className="mt-2">© {new Date().getFullYear()} {SITE.brand}</p>
                </div>
            </div>
        </footer>
    );
}

/**
 * (이전) 모바일 하단 고정 전화 바. 지금은 BottomNav 의 call 줄이 대신합니다. 다른 곳에서 쓸 수 있어 남겨 둡니다.
 * 장례 페이지에도 나오므로 라임을 쓰지 않고 흰 알약으로 통일합니다.
 */
export function MobileCallBar() {
    return (
        <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 lg:hidden"
            style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
        >
            <div className="pointer-events-auto mx-auto flex max-w-md gap-1.5 rounded-full bg-night/90 p-1.5 shadow-[0_12px_32px_-8px_rgb(11_16_32/0.5)] ring-1 ring-white/10 backdrop-blur-md">
                <a
                    href={SITE.phoneHref}
                    className="flex h-12 flex-[1.45] items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-star px-3 text-[14.5px] font-semibold text-ink active:translate-y-px"
                >
                    <Phone className="h-4 w-4 shrink-0" strokeWidth={STROKE} aria-hidden />
                    전화 상담 <span className="tabular-nums max-[359px]:hidden">{SITE.phone}</span>
                </a>
                <Link
                    href="/contact"
                    className="flex h-12 flex-1 items-center justify-center whitespace-nowrap rounded-full px-3 text-[14.5px] font-semibold text-star ring-1 ring-inset ring-white/20 active:translate-y-px"
                >
                    상담 남기기
                </Link>
            </div>
        </div>
    );
}
