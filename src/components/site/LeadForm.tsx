"use client";

import { useActionState } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from "lucide-react";
import { submitLead, type LeadState } from "@/actions/lead";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";
import { ICON_STROKE, pillClass } from "./ui";

/** 밝은 카드 위 입력창. 테두리는 흰 바탕 대비 3:1, 초점은 남색 테두리 + 옅은 링 */
const INPUT =
    "w-full rounded-xl border border-ink-3/70 bg-white px-3.5 text-[15px] text-ink outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-ink-3 focus-visible:border-pine focus-visible:ring-2 focus-visible:ring-pine/25 motion-reduce:transition-none";
const LABEL = "text-[13.5px] font-semibold text-ink";

/**
 * 상담 남기기 폼. 밝은 카드(pass) 한 장으로 렌더링되며 밝은 면, 밤 위 어디에 두어도 됩니다.
 * 라벨은 입력창 위, 필수 항목은 연락처와 동의뿐입니다.
 */
export function LeadForm({
    service = "funeral",
    services,
    regionSido,
    regionSlug,
    regionName,
    compact,
    className,
}: {
    service?: string;
    services?: { slug: string; short: string }[];
    regionSido?: string;
    regionSlug?: string;
    regionName?: string;
    /** 한 줄에 한 칸씩 (좁은 자리용) */
    compact?: boolean;
    className?: string;
}) {
    const pathname = usePathname();
    const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, null);
    const card = "rounded-[20px] bg-pass ring-1 ring-line shadow-[0_24px_48px_-30px_rgb(31_39_66/0.35)]";

    if (state?.ok) {
        return (
            <div role="status" className={cn(card, "p-8 text-center", className)}>
                <CheckCircle2 className="mx-auto h-10 w-10 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                <p className="mt-4 text-[18px] font-bold text-ink">{state.message}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
                    급하시면 바로 전화 주세요.{" "}
                    <a href={SITE.phoneHref} className="font-semibold text-ink underline underline-offset-4">
                        전화 상담 <span className="tabular-nums">{SITE.phone}</span>
                    </a>
                </p>
            </div>
        );
    }

    const wide = compact ? "" : "sm:col-span-2";
    // 제휴 문의(/partners)는 보호자용 항목 대신 업체용 라벨을 보여 줍니다. 서버 액션 필드 이름(name)은 그대로입니다
    const partner = service === "partner";
    const copy = partner
        ? {
              dong: "업체 소재지",
              dongPh: "예: 경기 광주시 오포읍",
              name: "담당자 성함",
              info: "업체명·허가(등록)번호",
              infoPh: "예: 업체명, 허가·등록번호",
              messagePh: "예: 운영하는 서비스, 가능한 시간, 픽업 여부",
              consent: "제휴 상담을 위한 개인정보(연락처, 담당자 성함, 업체 정보) 수집·이용에 동의합니다. 제휴 상담에만 쓰고, 상담을 마친 뒤 1년간 보관 후 파기합니다.",
          }
        : {
              dong: "계신 동네",
              dongPh: regionName ? `예: ${regionName} ○○동` : "예: 광진구 자양동",
              name: "보호자 성함",
              info: "아이 정보",
              infoPh: "예: 말티즈, 4kg, 15살",
              messagePh: "예: 오늘 저녁 희망, 픽업 필요",
              consent: "상담을 위한 개인정보(연락처, 동네, 아이 정보) 수집·이용에 동의합니다. 상담과 업체 연결에만 쓰고, 상담을 마친 뒤 1년간 보관 후 파기합니다.",
          };

    return (
        <form action={action} aria-busy={pending} className={cn(card, "grid gap-4 p-5 sm:p-7", !compact && "sm:grid-cols-2", className)}>
            <input type="hidden" name="sourcePath" value={pathname ?? ""} />
            <input type="hidden" name="regionSido" value={regionSido ?? ""} />
            <input type="hidden" name="regionSlug" value={regionSlug ?? ""} />
            <div aria-hidden className="hidden">
                <label>
                    웹사이트
                    <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            <p className={cn("text-[14px] leading-relaxed text-ink-2", wide)}>
                연락처만 있으면 됩니다. 나머지는 아는 만큼만 적어 주세요.
            </p>

            {services ? (
                <label className={cn("grid gap-1.5", wide)}>
                    <span className={LABEL}>필요한 서비스</span>
                    <span className="relative block">
                        <select name="service" defaultValue={service} className={cn(INPUT, "h-12 appearance-none pr-10")}>
                            {services.map((s) => (
                                <option key={s.slug} value={s.slug}>
                                    {s.short}
                                </option>
                            ))}
                        </select>
                        <ChevronDown
                            className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                            strokeWidth={ICON_STROKE}
                            aria-hidden
                        />
                    </span>
                </label>
            ) : (
                <input type="hidden" name="service" value={service} />
            )}

            <label className="grid gap-1.5">
                <span className={LABEL}>
                    연락처{" "}
                    <span className="text-danger" aria-hidden>
                        *
                    </span>
                    <span className="sr-only">(필수)</span>
                </span>
                <input name="phone" type="tel" inputMode="tel" autoComplete="tel" required placeholder="010-0000-0000" className={cn(INPUT, "h-12")} />
            </label>
            <label className="grid gap-1.5">
                <span className={LABEL}>{copy.dong}</span>
                <input name="dong" placeholder={copy.dongPh} className={cn(INPUT, "h-12")} />
            </label>
            <label className="grid gap-1.5">
                <span className={LABEL}>{copy.name}</span>
                <input name="name" autoComplete="name" className={cn(INPUT, "h-12")} />
            </label>
            <label className="grid gap-1.5">
                <span className={LABEL}>{copy.info}</span>
                <input name="petInfo" placeholder={copy.infoPh} className={cn(INPUT, "h-12")} />
            </label>
            <label className={cn("grid gap-1.5", wide)}>
                <span className={LABEL}>남기실 말씀</span>
                <textarea name="message" rows={3} placeholder={copy.messagePh} className={cn(INPUT, "min-h-[6rem] resize-y py-3 leading-relaxed")} />
            </label>

            <label className={cn("flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-2", wide)}>
                <input type="checkbox" name="agree" required className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-pine" />
                <span>{copy.consent}</span>
            </label>

            {state && !state.ok && (
                <p role="alert" className={cn("flex items-start gap-2 rounded-xl bg-danger/[0.06] px-3.5 py-3 text-[14px] font-medium text-danger", wide)}>
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                    {state.message}
                </p>
            )}

            <button type="submit" disabled={pending} className={cn(pillClass({ tone: "onLight", variant: "solid" }), "w-full disabled:cursor-wait disabled:opacity-70", wide)}>
                {pending && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" strokeWidth={ICON_STROKE} aria-hidden />}
                상담 남기기
            </button>
            <p className={cn("text-center text-[12.5px] leading-relaxed text-ink-3", wide)}>
                확인하는 대로 담당자가 연락드려요. 급하시면 전화가 가장 빠릅니다.
            </p>
        </form>
    );
}
