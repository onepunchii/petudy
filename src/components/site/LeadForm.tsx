"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { submitLead, type LeadState } from "@/actions/lead";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";

export function LeadForm({
    service = "funeral",
    services,
    regionSido,
    regionSlug,
    regionName,
    compact,
}: {
    service?: string;
    services?: { slug: string; short: string }[];
    regionSido?: string;
    regionSlug?: string;
    regionName?: string;
    compact?: boolean;
}) {
    const pathname = usePathname();
    const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, null);

    if (state?.ok) {
        return (
            <div className="rounded-3xl bg-white p-8 text-center ring-1 ring-line">
                <CheckCircle2 className="mx-auto h-10 w-10 text-pine" aria-hidden />
                <p className="mt-4 text-[18px] font-bold text-ink">{state.message}</p>
                <p className="mt-2 text-[14px] text-ink-2">급하시면 바로 전화 주세요. <a href={SITE.phoneHref} className="font-semibold text-ink underline">{SITE.phone}</a></p>
            </div>
        );
    }

    const input = "h-12 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink outline-none placeholder:text-ink-3 focus-visible:ring-2 focus-visible:ring-pine";

    return (
        <form action={action} className={cn("grid gap-3 rounded-3xl bg-white p-5 ring-1 ring-line sm:p-7", compact ? "" : "sm:grid-cols-2")}>
            <input type="hidden" name="sourcePath" value={pathname ?? ""} />
            <input type="hidden" name="regionSido" value={regionSido ?? ""} />
            <input type="hidden" name="regionSlug" value={regionSlug ?? ""} />
            <div aria-hidden className="hidden">
                <label>웹사이트<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            {services ? (
                <label className="grid gap-1.5 sm:col-span-2">
                    <span className="text-[13px] font-semibold text-ink-2">필요한 서비스</span>
                    <select name="service" defaultValue={service} className={input}>
                        {services.map((s) => (
                            <option key={s.slug} value={s.slug}>{s.short}</option>
                        ))}
                    </select>
                </label>
            ) : (
                <input type="hidden" name="service" value={service} />
            )}
            <label className="grid gap-1.5">
                <span className="text-[13px] font-semibold text-ink-2">연락처 <span className="text-clay">*</span></span>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="010-0000-0000" className={input} />
            </label>
            <label className="grid gap-1.5">
                <span className="text-[13px] font-semibold text-ink-2">계신 동네</span>
                <input name="dong" placeholder={regionName ? `예: ${regionName} ○○동` : "예: 광진구 자양동"} className={input} />
            </label>
            <label className="grid gap-1.5">
                <span className="text-[13px] font-semibold text-ink-2">보호자 성함</span>
                <input name="name" autoComplete="name" placeholder="선택" className={input} />
            </label>
            <label className="grid gap-1.5">
                <span className="text-[13px] font-semibold text-ink-2">아이 정보</span>
                <input name="petInfo" placeholder="예: 말티즈 · 4kg · 15살" className={input} />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
                <span className="text-[13px] font-semibold text-ink-2">남기실 말씀</span>
                <textarea name="message" rows={3} placeholder="희망 시간, 픽업 필요 여부 등" className={cn(input, "h-auto py-3")} />
            </label>
            <label className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-2 sm:col-span-2">
                <input type="checkbox" name="agree" required className="mt-1 h-4 w-4 accent-pine" />
                <span>
                    상담을 위한 개인정보(연락처·동네·아이 정보) 수집·이용에 동의합니다. 수집 정보는 상담 및 업체 연결 목적으로만 쓰이며 상담 완료 후 1년간 보관 후 파기합니다.
                </span>
            </label>
            {state && !state.ok && <p role="alert" className="text-[14px] font-medium text-clay sm:col-span-2">{state.message}</p>}
            <button type="submit" disabled={pending} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-ink text-[15px] font-semibold text-white hover:bg-pine disabled:opacity-60 sm:col-span-2">
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                상담 접수하기
            </button>
            <p className="text-center text-[12px] text-ink-3 sm:col-span-2">남겨주신 내용 확인 후 담당자가 연락드려요. 급하시면 전화가 가장 빠릅니다.</p>
        </form>
    );
}
