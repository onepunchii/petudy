import React, { useRef } from "react";
import { LoaderCircle, Upload } from "lucide-react";
import { APP_ICON_STROKE } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface StepPhotoProps {
    formData: {
        photo?: string | null;
        [key: string]: any;
    };
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
    /** 고른 사진 빼기 (사진 없이 등록) */
    onRemove: () => void;
    /** 사진을 줄이는 중 */
    busy?: boolean;
    /** 고른 사진을 쓸 수 없는 이유 */
    error?: string | null;
    /** 등록 중에는 사진을 바꾸거나 뺄 수 없습니다 */
    disabled?: boolean;
}

/** 문장 안의 글자 버튼. 손가락으로 누르기 쉽게 높이 44px 영역을 줍니다 (줄 높이는 그대로) */
const inlineActionClass =
    "-my-3 inline-flex min-h-11 items-center px-1 font-semibold text-ink-2 underline underline-offset-2 hover:text-ink disabled:pointer-events-none disabled:opacity-40";

export default function StepPhoto({ formData, onFileSelect, onRemove, busy = false, error, disabled = false }: StepPhotoProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const locked = busy || disabled;

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

            <div
                className={cn(
                    "group relative mx-auto mt-10 flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed bg-pass transition-colors focus-within:border-pine hover:border-pine",
                    error && !formData.photo ? "border-danger" : "border-ink/20",
                )}
            >
                {formData.photo ? (
                    <img
                        src={formData.photo}
                        alt="고른 프로필 사진"
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
                {busy && (
                    <span className="absolute inset-0 flex items-center justify-center bg-moon/70">
                        <LoaderCircle className="h-7 w-7 animate-spin text-ink motion-reduce:animate-none" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </span>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={onFileSelect}
                    disabled={locked}
                    aria-label={formData.photo ? "다른 사진 고르기" : "사진 선택하기"}
                    aria-describedby={error ? "step-photo-error" : undefined}
                    className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-wait"
                />
            </div>

            <div className="mt-4 flex min-h-6 flex-col items-center gap-2 text-center" aria-live="polite">
                {busy && <p className="text-[14px] text-ink-2">사진을 준비하고 있어요…</p>}
                {error && (
                    <p id="step-photo-error" role="alert" className="text-[14px] font-semibold leading-snug text-danger">
                        {error}
                    </p>
                )}
                {formData.photo && !busy && (
                    <p className="text-[14px] text-ink-3">
                        사진을 누르면 바꿀 수 있어요 ·{" "}
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                                onRemove();
                                // 누른 버튼이 사라지므로 키보드 위치를 사진 고르기로 옮깁니다
                                inputRef.current?.focus();
                            }}
                            className={inlineActionClass}
                        >
                            사진 빼기
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
}
