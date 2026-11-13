"use client";

import Link from "next/link";
import { ArrowRight, Check, CircleHelp, Minus, Phone, X } from "lucide-react";
import type { ServiceStatus } from "@/lib/site/funeral-homes";
import { RECENT_KEY, SAVED_KEY, SAVED_MAX, removeSaved, useShelf } from "@/lib/site/home-shelf";
import { cn } from "@/lib/utils";
import { Container, ICON_STROKE, pillClass } from "../ui";

export interface CompareHome {
    id: string;
    name: string;
    place: string;
    path: string;
    phone: string | null;
    /** "14만 원부터" 또는 null */
    price: string | null;
    hours: string | null;
    /** SERVICE_KEYS 순서 그대로 */
    services: { status: ServiceStatus; text: string }[];
}

const STATUS_ICON = { yes: Check, no: Minus, unknown: CircleHelp } as const;
const tel = (phone: string) => `tel:${phone.replace(/[^0-9+]/g, "")}`;

/**
 * 저장한 장례식장 비교 표 + 최근 본 곳. 내용은 이 기기 저장소에서 읽습니다.
 * 휴대폰에서는 표를 옆으로 밀어 보고, 첫 칸(항목 이름)은 고정합니다.
 */
export function ShelfCompare({ homes, serviceLabels, allHref }: { homes: CompareHome[]; serviceLabels: string[]; allHref: string }) {
    const savedIds = useShelf(SAVED_KEY);
    const recentIds = useShelf(RECENT_KEY);
    const byId = new Map(homes.map((h) => [h.id, h]));
    const saved = savedIds.map((id) => byId.get(id)).filter((h): h is CompareHome => Boolean(h));
    const recent = recentIds
        .filter((id) => !savedIds.includes(id))
        .map((id) => byId.get(id))
        .filter((h): h is CompareHome => Boolean(h));

    const rows: { label: string; cell: (h: CompareHome) => React.ReactNode }[] = [
        { label: "위치", cell: (h) => h.place },
        { label: "공개 장례 가격", cell: (h) => h.price ?? <span className="text-ink-3">업체 문의</span> },
        { label: "운영 시간", cell: (h) => h.hours ?? <span className="text-ink-3">홈페이지 안내 없음</span> },
        ...serviceLabels.map((label, i) => ({
            label,
            cell: (h: CompareHome) => {
                const s = h.services[i];
                const Icon = STATUS_ICON[s.status];
                return (
                    <span className={cn("inline-flex items-center gap-1.5", s.status === "yes" ? "font-semibold text-pine" : s.status === "no" ? "text-ink-2" : "text-ink-3")}>
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                        {s.text}
                    </span>
                );
            },
        })),
    ];

    return (
        <section className="py-12 sm:py-16">
            <Container>
                {saved.length === 0 ? (
                    <div className="rounded-[28px] bg-pass px-6 py-10 text-center ring-1 ring-line">
                        <h2 className="text-[19px] font-bold text-ink">아직 저장한 장례식장이 없어요</h2>
                        <p className="mx-auto mt-2 max-w-[36ch] text-[15px] leading-relaxed text-ink-2">
                            장례식장 화면에서 &lsquo;저장&rsquo;을 누르면 {SAVED_MAX}곳까지 여기서 나란히 볼 수 있어요. 저장은 이 기기에만 돼요.
                        </p>
                        <Link href={allHref} className={cn(pillClass({ tone: "onLight", variant: "solid" }), "mt-6")}>
                            장례식장 찾기
                        </Link>
                    </div>
                ) : (
                    <>
                        <h2 className="text-[22px] font-bold text-ink sm:text-[26px]">저장한 {saved.length}곳</h2>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">업체 홈페이지와 공식 허가 목록 기준이에요. 예약 전에 업체에 다시 확인해 주세요.</p>
                        <div className="mt-6 overflow-x-auto rounded-[20px] bg-pass ring-1 ring-line" role="region" aria-label="저장한 장례식장 비교 표" tabIndex={0}>
                            <table className="w-full min-w-[34rem] border-collapse text-left text-[14px]">
                                <caption className="sr-only">항목별로 저장한 장례식장을 비교합니다</caption>
                                <thead>
                                    <tr>
                                        <th scope="col" className="sticky left-0 z-[1] min-w-[7.5rem] bg-pass p-4 text-[13px] font-semibold text-ink-3">
                                            항목
                                        </th>
                                        {saved.map((h) => (
                                            <th key={h.id} scope="col" className="min-w-[10rem] p-4 align-top">
                                                <Link href={h.path} className="text-[16px] font-bold leading-snug text-ink underline-offset-4 hover:underline">
                                                    {h.name}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSaved(h.id)}
                                                    className="mt-1 flex min-h-11 items-center gap-1 text-[13px] font-medium text-ink-3 hover:text-ink"
                                                >
                                                    <X className="h-3.5 w-3.5" strokeWidth={ICON_STROKE} aria-hidden />
                                                    빼기<span className="sr-only"> {h.name}</span>
                                                </button>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r) => (
                                        <tr key={r.label} className="border-t border-line">
                                            <th scope="row" className="sticky left-0 z-[1] min-w-[7.5rem] bg-pass p-4 text-[13px] font-semibold text-ink-2">
                                                {r.label}
                                            </th>
                                            {saved.map((h) => (
                                                <td key={h.id} className="p-4 align-top text-ink">
                                                    {r.cell(h)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className="border-t border-line">
                                        <th scope="row" className="sticky left-0 z-[1] min-w-[7.5rem] bg-pass p-4 text-[13px] font-semibold text-ink-2">
                                            전화
                                        </th>
                                        {saved.map((h) => (
                                            <td key={h.id} className="p-4 align-top">
                                                {h.phone ? (
                                                    <a href={tel(h.phone)} className={pillClass({ tone: "onLight", variant: "solid", size: "sm" })}>
                                                        <Phone className="h-4 w-4 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                                                        <span className="tabular-nums">{h.phone}</span>
                                                        <span className="sr-only"> {h.name}에 전화</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-ink-3">공개된 번호 없음</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {recent.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-[19px] font-bold text-ink">최근 본 장례식장</h2>
                        <ul className="mt-4 border-b border-line">
                            {recent.map((h) => (
                                <li key={h.id}>
                                    <Link href={h.path} className="group flex min-h-14 items-center justify-between gap-4 border-t border-line py-3">
                                        <span className="min-w-0">
                                            <span className="block text-[12.5px] text-ink-3">{h.place}</span>
                                            <span className="block text-[16px] font-semibold text-ink group-hover:underline">{h.name}</span>
                                        </span>
                                        <ArrowRight className="h-4 w-4 shrink-0 text-ink-3" strokeWidth={ICON_STROKE} aria-hidden />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </Container>
        </section>
    );
}
