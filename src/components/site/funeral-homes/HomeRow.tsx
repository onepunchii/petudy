import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ICON_STROKE } from "../ui";

/**
 * 목록 한 줄에 필요한 값만. 서버에서 만들어 넘기므로 브라우저 코드(필터)에서도 업체 데이터 전체를 싣지 않습니다.
 */
export interface HomeRowData {
    id: string;
    name: string;
    /** "경기 김포시" */
    place: string;
    path: string;
    /** 홈페이지에서 확인된 짧은 항목 (최대 3개) */
    highlights: string[];
    /** "14만 원부터" 또는 null */
    price: string | null;
}

/**
 * 장례식장 목록 한 줄. 카드 대신 구분선 목록으로 씁니다(디렉터리는 훑어보기가 우선).
 * 장례 영역이라 라임·아이콘 장식 없이 ink 계열만 씁니다.
 */
export function HomeRow({ row, km, className }: { row: HomeRowData; /** 기준 지점에서 직선거리(km) */ km?: number; className?: string }) {
    return (
        <li className={className}>
            <Link
                href={row.path}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 border-t border-line py-5 transition-colors hover:border-ink/50 motion-reduce:transition-none"
            >
                <span className="min-w-0">
                    <span className="block text-[13px] text-ink-3">
                        {row.place}
                        {/* 좌표가 대부분 시·군청 기준이라 1km 미만은 "같은 지역"으로만 표시 */}
                        {km !== undefined &&
                            (km < 1 ? <span> · 같은 지역</span> : <span className="tabular-nums"> · 약 {km < 10 ? km.toFixed(1) : Math.round(km)}km</span>)}
                    </span>
                    <span className="mt-1 flex items-center gap-1.5 text-[17px] font-bold leading-snug text-ink">
                        <span className="min-w-0">{row.name}</span>
                        <ArrowRight
                            className="h-4 w-4 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                            strokeWidth={ICON_STROKE}
                            aria-hidden
                        />
                    </span>
                    {row.highlights.length > 0 ? (
                        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-ink-2">
                            {row.highlights.map((x) => (
                                <span key={x} className="inline-flex items-center gap-1">
                                    <Check className="h-3.5 w-3.5 text-pine" strokeWidth={ICON_STROKE} aria-hidden />
                                    {x}
                                </span>
                            ))}
                        </span>
                    ) : (
                        <span className="mt-2 block text-[13px] text-ink-3">운영 정보는 업체에 확인이 필요해요</span>
                    )}
                </span>
                <span className="shrink-0 text-right">
                    <span className="block text-[13px] text-ink-3">공개 장례 가격</span>
                    <span className={cn("mt-0.5 block text-[15px] font-semibold tabular-nums", row.price ? "text-ink" : "text-ink-3")}>{row.price ?? "업체 문의"}</span>
                </span>
            </Link>
        </li>
    );
}
