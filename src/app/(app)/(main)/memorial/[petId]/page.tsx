"use client";

import { AppBody, AppTopBar } from "@/components/app/ui";

export default function MemorialPetPage() {
    return (
        <div className="min-h-full">
            <AppTopBar back="/memorial" title="추억상자" />

            <AppBody>
                <p className="py-10 text-center text-[15px] text-ink-3">반려동물 추모실 페이지</p>
            </AppBody>
        </div>
    );
}
