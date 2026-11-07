import Link from "next/link";
import { Mail, Phone, Clock, ArrowUpRight } from "lucide-react";
import { APP_ICON_STROKE } from "@/components/app/tokens";
import { Logo } from "@/components/site/SiteHeader";
import { SITE } from "@/lib/site/config";

// 앱 왼쪽 회사 소개 배너. 데스크톱(lg 이상)에서만 보이며 (app)/layout.tsx 의 밤하늘 위에 바로 놓입니다.
// 밤 위 글자는 star/star-2/star-3 만 씁니다. 라임은 쓰지 않습니다(오른쪽 배너의 작은 버튼 하나에만).
// 사이트 컴포넌트 중 Provider 가 필요 없는 Logo 만 가져오고, 나머지는 설정값(SITE)만 씁니다.

const SITE_LINKS = [
    { label: "지역별 반려동물 장례 찾기", href: "/funeral" },
    { label: "동네 애견미용 찾기", href: "/grooming" },
    { label: "보호자 가이드", href: "/guide" },
] as const;

// 라벨은 사이트 푸터와 같게: "/about" 은 "포온 소개", "/contact" 는 "상담 남기기" (한 의도 한 라벨)
const COMPANY_LINKS = [
    { label: "포온 소개", href: "/about" },
    { label: "개인정보처리방침", href: "/privacy" },
    { label: "상담 남기기", href: "/contact" },
] as const;

export default function CompanyIntroSidebar() {
    return (
        <aside className="scrollbar-hide fixed left-0 top-0 z-0 hidden h-full w-full max-w-[calc(50%-256px)] flex-col items-end overflow-y-auto p-6 lg:flex xl:p-12">
            {/* my-auto: 화면이 낮거나 좁으면(lg 1024px) 가운데 정렬 대신 스크롤 */}
            <div className="my-auto max-w-md space-y-8 text-right">
                {/* Brand Section */}
                <div className="space-y-5">
                    <div className="flex justify-end">
                        <Logo />
                    </div>
                    <p className="text-[22px] font-bold xl:text-[28px] leading-[1.3] tracking-[-0.02em] text-star">
                        우리 동네 반려동물 서비스<br />
                        에이전시
                    </p>
                </div>

                {/* Company Description */}
                <div className="space-y-6 border-t border-white/10 pt-6">
                    <p className="text-[15px] leading-relaxed text-star-2">
                        우리 동네 가까운 반려동물 서비스를<br />
                        보호자님과 연결하는 에이전시입니다.
                    </p>

                    {/* Site Links */}
                    <ul className="flex flex-col items-end gap-2.5 text-[15px] font-semibold">
                        {SITE_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="group inline-flex items-center gap-1 text-star underline-offset-4 transition-colors hover:underline"
                                >
                                    {link.label}
                                    <ArrowUpRight className="h-4 w-4 text-star-3 transition-colors group-hover:text-star" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className="flex justify-end text-[14px] font-semibold">
                        <Link href="/partners" className="text-star-2 transition-colors hover:text-star">제휴 업체 모집</Link>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-[14px] text-star-3">
                        <a href={`mailto:${SITE.company.email}`} className="flex items-center gap-2 transition-colors hover:text-star-2">
                            <span>{SITE.company.email}</span>
                            <Mail className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </a>
                        <a href={SITE.phoneHref} className="flex items-center gap-2 transition-colors hover:text-star-2">
                            <span className="tabular-nums">{SITE.phone}</span>
                            <Phone className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </a>
                        <div className="flex items-center gap-2">
                            <span>{SITE.hours}</span>
                            <Clock className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </div>
                    </div>
                </div>

                {/* Footer Links */}
                <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 pt-6 text-[13px] text-star-3">
                    {COMPANY_LINKS.map((link) => (
                        <Link key={link.href} href={link.href} className="whitespace-nowrap transition-colors hover:text-star-2">
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="pt-1 text-[13px] text-star-3">
                    © {SITE.company.legalName}. All rights reserved.
                </div>
            </div>
        </aside>
    );
}
