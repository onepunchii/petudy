import Link from "next/link";
import { MessageCircle, Phone, Plus, ArrowRight } from "lucide-react";
import { APP_ICON_STROKE, AppBody, AppEmpty, AppHero, AppLinkButton, appButtonClass } from "@/components/app/ui";
import { SITE } from "@/lib/site/config";

/**
 * 내 상담
 * 앱 안에서 확정된 예약을 저장·조회하는 기능은 아직 없습니다.
 * 상담은 담당자가 전화로 확정하므로, 실제 데이터가 연결되기 전까지는 빈 상태만 보여줍니다.
 */
export default function MyBookingsPage() {
    return (
        <div className="min-h-full bg-moon">
            <AppHero title="내 상담" subtitle="상담은 담당자가 전화로 확정합니다." />

            <AppBody>
                <AppEmpty
                    icon={<MessageCircle className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                    title="아직 진행 중인 상담이 없어요"
                    description={SITE.hours}
                />

                <div className="mt-4 space-y-3">
                    <a href={SITE.phoneHref} className={appButtonClass({ variant: "accent", size: "lg", block: true, className: "tabular-nums" })}>
                        <Phone className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        전화 상담 {SITE.phone}
                    </a>
                    <AppLinkButton href="/booking/new" variant="secondary" size="lg" block>
                        <Plus className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        새 상담 시작하기
                    </AppLinkButton>
                </div>

                <p className="mt-6 text-center">
                    <Link
                        href="/contact"
                        className="inline-flex min-h-10 items-center gap-1 text-[14px] font-semibold text-pine underline-offset-4 hover:underline"
                    >
                        상담 남기기
                        <ArrowRight className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </Link>
                </p>
            </AppBody>
        </div>
    );
}
