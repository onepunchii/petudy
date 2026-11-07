"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import { addPetAction } from "@/actions/user";
import {
    APP_ICON_STROKE,
    AppButton,
    SheetHeader,
    SheetPanel,
    appButtonClass,
    appInputClass,
    appLabelClass,
    appTextareaClass,
    sheetBackdropClass,
} from "@/components/app/ui";
import { cn } from "@/lib/utils";

/** 라디오(peer) 다음에 오는 선택 칩. 선택 = 남색 채움 (appChipClass 와 같은 모양, 상태는 :checked 로) */
const radioChipClass =
    "flex h-12 cursor-pointer items-center justify-center rounded-full bg-pass text-[15px] font-semibold text-ink-2 ring-1 ring-inset ring-line transition-colors hover:text-ink peer-checked:bg-night peer-checked:text-star peer-checked:ring-night peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink";

/** 세그먼트(중성화 여부) 한 칸. 선택 = 흰 칸 */
const segmentClass =
    "flex h-10 cursor-pointer items-center justify-center rounded-full text-[14px] font-semibold text-ink-2 transition-colors peer-checked:bg-pass peer-checked:text-ink peer-checked:shadow-[0_1px_2px_rgb(31_39_66/0.08),0_4px_10px_-4px_rgb(31_39_66/0.18)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-ink";

export function AddPetDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        try {
            const res = await addPetAction(formData);
            if (res?.success) {
                setIsOpen(false);
            }
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)} className={appButtonClass({ variant: "secondary", size: "sm" })}>
                <Plus className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                추가하기
            </button>

            {isOpen && (
                <>
                    <div className={sheetBackdropClass} aria-hidden />
                    <SheetPanel aria-labelledby="add-pet-title" className="max-h-[92dvh] overflow-y-auto overscroll-contain">
                        <div className="sticky top-0 z-10 bg-moon pb-2">
                            <SheetHeader title={<span id="add-pet-title">반려동물 등록</span>} onClose={() => setIsOpen(false)} />
                        </div>

                        <form action={handleSubmit} className="space-y-5 px-5 pb-2 pt-3">
                            <div>
                                <label htmlFor="add-pet-name" className={appLabelClass}>
                                    이름
                                </label>
                                <input id="add-pet-name" name="name" type="text" required placeholder="예: 뽀삐" className={appInputClass} />
                            </div>

                            <fieldset>
                                <legend className={appLabelClass}>종류</legend>
                                <div className="grid grid-cols-2 gap-2">
                                    <label>
                                        <input type="radio" name="type" value="dog" className="peer sr-only" defaultChecked />
                                        <span className={radioChipClass}>강아지</span>
                                    </label>
                                    <label>
                                        <input type="radio" name="type" value="cat" className="peer sr-only" />
                                        <span className={radioChipClass}>고양이</span>
                                    </label>
                                </div>
                            </fieldset>

                            <div>
                                <label htmlFor="add-pet-breed" className={appLabelClass}>
                                    품종
                                </label>
                                <input id="add-pet-breed" name="breed" type="text" required placeholder="예: 말티즈" className={appInputClass} />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="add-pet-birth" className={appLabelClass}>
                                        생년월일
                                    </label>
                                    <input id="add-pet-birth" name="birthDate" type="date" required className={cn(appInputClass, "[color-scheme:light]")} />
                                </div>
                                <div>
                                    <label htmlFor="add-pet-gender" className={appLabelClass}>
                                        성별
                                    </label>
                                    <div className="relative">
                                        <select id="add-pet-gender" name="gender" className={cn(appInputClass, "appearance-none pr-10")}>
                                            <option value="MALE">수컷</option>
                                            <option value="FEMALE">암컷</option>
                                        </select>
                                        <ChevronDown
                                            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                                            strokeWidth={APP_ICON_STROKE}
                                            aria-hidden
                                        />
                                    </div>
                                </div>
                            </div>

                            <fieldset>
                                <legend className={appLabelClass}>중성화 여부</legend>
                                <div className="grid grid-cols-3 gap-1 rounded-full bg-paper-2 p-1">
                                    <label>
                                        <input type="radio" name="neutered" value="Y" className="peer sr-only" defaultChecked />
                                        <span className={segmentClass}>예</span>
                                    </label>
                                    <label>
                                        <input type="radio" name="neutered" value="N" className="peer sr-only" />
                                        <span className={segmentClass}>아니오</span>
                                    </label>
                                    <label>
                                        <input type="radio" name="neutered" value="UNKNOWN" className="peer sr-only" />
                                        <span className={segmentClass}>모름</span>
                                    </label>
                                </div>
                            </fieldset>

                            <input type="hidden" name="regStatus" value="N" />

                            <div>
                                <label htmlFor="add-pet-weight" className={appLabelClass}>
                                    몸무게 (kg)
                                </label>
                                <input id="add-pet-weight" name="weight" type="number" step="0.1" placeholder="5.2" className={cn(appInputClass, "tabular-nums")} />
                            </div>

                            <div>
                                <label htmlFor="add-pet-specifics" className={appLabelClass}>
                                    특이사항 (선택)
                                </label>
                                <textarea id="add-pet-specifics" name="specifics" placeholder="예: 낯가림이 심해요" className={cn(appTextareaClass, "min-h-[96px]")} />
                            </div>

                            <AppButton type="submit" variant="accent" size="lg" block disabled={isPending} className="mt-2">
                                {isPending ? "등록 중..." : "등록완료"}
                            </AppButton>
                        </form>
                    </SheetPanel>
                </>
            )}
        </>
    );
}
