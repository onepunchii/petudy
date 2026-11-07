import { ArrowRight, Building2, Car, FileText, UserRound } from "lucide-react";
import Link from "next/link";
import { APP_ICON_STROKE, appButtonClass } from "@/components/app/tokens";

// 앱 오른쪽 배너. 데스크톱(lg 이상)에서만 보이며 (app)/layout.tsx 의 밤하늘 위에 바로 놓입니다.
// 카드는 night-2 + ring-white/10, 글자는 star 계열. 라임은 제휴 상담 버튼 하나에만 씁니다(장례 카드에는 쓰지 않음).

const chipClass = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-night-3 px-3 py-1.5 text-[13px] text-star-2";

export default function ServiceBannerSidebar() {
    return (
        <aside className="scrollbar-hide fixed right-0 top-0 z-0 hidden h-full w-full max-w-[calc(50%-256px)] flex-col items-start overflow-y-auto p-6 lg:flex xl:p-12">
            {/* my-auto: 화면이 낮거나 좁으면(lg 1024px) 가운데 정렬 대신 스크롤 */}
            <div className="my-auto w-full max-w-md space-y-4">

                {/* Banner 1: 제휴 업체 모집 (라임 버튼은 이 배너에만) */}
                <div className="rounded-[28px] bg-night-2 p-6 ring-1 ring-white/10 xl:p-8">
                    <div className={chipClass}>
                        <Building2 className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        파트너 모집
                    </div>
                    <h3 className="mt-4 text-[20px] font-bold leading-[1.3] tracking-[-0.02em] text-star xl:text-[24px]">
                        포온과 함께할<br />
                        파트너를 찾습니다
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-star-2">
                        동네 보호자님과 연결될<br />
                        허가·등록 반려동물 서비스 업체를 모집합니다.
                    </p>

                    {/* "/partners" 의 상담 폼은 사이트와 같은 "상담 남기기" 라벨 (한 의도 한 라벨) */}
                    <Link href="/partners" className={appButtonClass({ variant: "accent", size: "sm", className: "mt-6" })}>
                        상담 남기기
                        <ArrowRight className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                </div>

                {/* Banner 2: 반려동물 장례 (라임 없이 흰색·남색만) */}
                <div className="rounded-[28px] bg-night-2 p-6 ring-1 ring-white/10 xl:p-8">
                    <h3 className="text-[18px] font-bold text-star">
                        반려동물 장례
                    </h3>
                    <p className="mt-1 text-[14px] text-star-2">
                        반려동물의 마지막 길을 정성껏 모십니다
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <span className={chipClass}>
                            <UserRound className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            전문 지도사 동행
                        </span>
                        <span className={chipClass}>
                            <Car className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            전용 운구 차량
                        </span>
                    </div>

                    <Link href="/regulatory-notice" className={appButtonClass({ variant: "onNightGhost", size: "sm", block: true, className: "mt-5 h-auto min-h-10 whitespace-normal py-2 text-center text-[13px]" })}>
                        <FileText className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        <span>실증특례 이용자 고지 보기</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                </div>

                {/* Banner 3: 사이트 바로가기 (지역 서비스 찾기) */}
                <div className="flex flex-col gap-3 xl:flex-row">
                    <Link
                        href="/funeral"
                        className="group/card flex flex-1 items-center justify-between gap-2 rounded-[20px] bg-night-2 p-4 ring-1 ring-white/10 transition-colors hover:bg-night-3"
                    >
                        <div className="text-left">
                            <div className="text-[13px] text-star-3">반려동물 장례</div>
                            <div className="text-[14px] font-bold text-star-2 transition-colors group-hover/card:text-star">지역별 장례 찾기</div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-star-3 transition-colors group-hover/card:text-star" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                    <Link
                        href="/grooming"
                        className="group/card flex flex-1 items-center justify-between gap-2 rounded-[20px] bg-night-2 p-4 ring-1 ring-white/10 transition-colors hover:bg-night-3"
                    >
                        <div className="text-left">
                            <div className="text-[13px] text-star-3">반려동물 미용</div>
                            <div className="text-[14px] font-bold text-star-2 transition-colors group-hover/card:text-star">애견미용 찾기</div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-star-3 transition-colors group-hover/card:text-star" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                </div>

            </div>
        </aside>
    );
}
