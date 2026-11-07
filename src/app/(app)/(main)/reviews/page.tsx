"use client";

import { Star, User } from "lucide-react";
import { APP_ICON_STROKE, AppBody, appCardClass, AppTopBar } from "@/components/app/ui";
import { reviews } from "@/lib/data/reviews";
import { cn } from "@/lib/utils";

export default function ReviewsPage() {
    return (
        <div className="min-h-full bg-moon">
            {/* 뒤로 가기는 예전처럼 항상 앱 홈(/app)으로 */}
            <AppTopBar title="이용 후기" backHref="/app" />

            <AppBody>
                <div className="mb-6">
                    <div className="mb-1.5 flex items-center gap-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-5 w-5 fill-pine text-pine" strokeWidth={APP_ICON_STROKE} />
                            ))}
                        </div>
                        <span className="text-[18px] font-bold tabular-nums text-ink">4.9</span>
                        <span className="text-[14px] tabular-nums text-ink-3">/ 5.0</span>
                    </div>
                    <p className="text-[14px] text-ink-2">총 {reviews.length}개의 후기</p>
                </div>

                <div className="space-y-3">
                    {reviews.map((review) => (
                        <div key={review.id} className={cn(appCardClass, "p-5")}>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper-2 text-ink-3">
                                        <User className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-[15px] font-semibold text-ink">{review.name}</p>
                                        <p className="text-[13px] text-ink-3">
                                            {review.petType} · {review.serviceType}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-pine text-pine" strokeWidth={APP_ICON_STROKE} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-[15px] leading-relaxed text-ink-2">
                                {review.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 rounded-[20px] bg-pine-soft p-5 text-center">
                    <p className="mb-1 text-[15px] font-semibold text-pine">정성을 다한 서비스를 경험해보세요</p>
                    <p className="text-[14px] text-ink-2">이용 후기를 남겨주세요</p>
                </div>
            </AppBody>
        </div>
    );
}
