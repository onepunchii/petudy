import React from "react";
import { Upload } from "lucide-react";
import { APP_ICON_STROKE } from "@/components/app/ui";

interface StepPhotoProps {
    formData: {
        photo?: string | null;
        [key: string]: any;
    };
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepPhoto({ formData, onFileSelect }: StepPhotoProps) {
    return (
        <div className="flex flex-col">
            <h2 className="text-[24px] font-bold leading-[1.35] text-ink">
                프로필 사진을 등록해볼까요?
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                나중에 언제든지 바꿀 수 있어요.
                <br />
                (건너뛰면 사진 대신 발바닥 아이콘이 보여요)
            </p>

            <div className="group relative mx-auto mt-10 flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-ink/20 bg-pass transition-colors focus-within:border-pine hover:border-pine">
                {formData.photo ? (
                    <img
                        src={formData.photo}
                        alt="Preview"
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-ink-3 transition-colors group-hover:text-pine">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-paper-2">
                            <Upload className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </span>
                        <span className="text-[14px] font-semibold">사진 선택하기</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileSelect}
                    aria-label="사진 선택하기"
                    className="absolute inset-0 cursor-pointer opacity-0"
                />
            </div>
        </div>
    );
}
