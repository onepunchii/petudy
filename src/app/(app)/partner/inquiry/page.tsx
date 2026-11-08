"use client";

import { useState } from "react";
import { Building2, Car, Check } from "lucide-react";
import { APP_ICON_STROKE, AppBody, AppBottomAction, AppButton, appInputClass, appLabelClass, appOptionClass, appTextareaClass, AppTopBar } from "@/components/app/ui";
import { cn } from "@/lib/utils";

type InquiryType = "funeral" | "bath";

const INQUIRY_TYPES = [
    { value: "funeral", label: "모빌리티 장례", icon: Car },
    { value: "bath", label: "고정식 장례", icon: Building2 },
] as const satisfies ReadonlyArray<{ value: InquiryType; label: string; icon: typeof Car }>;

export default function PartnerInquiryPage() {
    const [inquiryType, setInquiryType] = useState<InquiryType>("funeral");
    const [formData, setFormData] = useState({
        name: "",
        contact: "",
        region: "",
        message: ""
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement submission logic here
        alert("상담 신청이 접수되었습니다.");
    };

    return (
        <div className="flex min-h-full flex-col bg-moon">
            <AppTopBar title="가맹점 상담 신청" backHref="/" />

            <AppBody className="flex-1 pb-0">
                {/* Intro Text */}
                <div>
                    <h2 className="text-[22px] font-bold leading-[1.4] tracking-[-0.02em] text-ink">
                        포온과 새로운 가치를<br />
                        만들어갈 파트너님을 모십니다
                    </h2>
                    <p className="mt-2 text-[15px] leading-[1.65] text-ink-2">
                        관심 있는 서비스 분야를 선택하고 상담을 신청해주세요.<br />
                        담당자가 확인 후 빠르게 연락드리겠습니다.
                    </p>
                </div>

                {/* Category Selection */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    {INQUIRY_TYPES.map(({ value, label, icon: Icon }) => {
                        const selected = inquiryType === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setInquiryType(value)}
                                aria-pressed={selected}
                                className={appOptionClass(selected, "relative flex flex-col items-center gap-3 px-4 py-6")}
                            >
                                <span
                                    className={cn(
                                        "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                                        selected ? "bg-night text-star" : "bg-paper-2 text-ink-2",
                                    )}
                                >
                                    <Icon className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                </span>
                                <span className={cn("text-[15px] font-bold", selected ? "text-ink" : "text-ink-2")}>{label}</span>
                                {selected && (
                                    <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-night text-star" aria-hidden>
                                        <Check className="h-3 w-3" strokeWidth={3} />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8">
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="partner-name" className={appLabelClass}>
                                신청하시는 분 (업체명)
                            </label>
                            <input
                                id="partner-name"
                                type="text"
                                placeholder="홍길동"
                                className={appInputClass}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="partner-contact" className={appLabelClass}>
                                연락처
                            </label>
                            <input
                                id="partner-contact"
                                type="tel"
                                placeholder="010-1234-5678"
                                className={cn(appInputClass, "tabular-nums")}
                                value={formData.contact}
                                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="partner-region" className={appLabelClass}>
                                희망 지역
                            </label>
                            <input
                                id="partner-region"
                                type="text"
                                placeholder="서울시 강남구"
                                className={appInputClass}
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="partner-message" className={appLabelClass}>
                                문의 내용
                            </label>
                            <textarea
                                id="partner-message"
                                placeholder="궁금하신 점이나 문의 내용을 자유롭게 적어주세요."
                                className={appTextareaClass}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <AppBottomAction className="-mx-5 mt-4">
                        <AppButton type="submit" size="lg" block>
                            상담 신청하기
                        </AppButton>
                    </AppBottomAction>
                </form>
            </AppBody>
        </div>
    );
}
