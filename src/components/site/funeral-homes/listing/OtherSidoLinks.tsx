import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { funeralHomesPath, funeralSidoList, funeralSidoPath, type FuneralSidoSlug } from "@/lib/site/funeral-homes";
import { ICON_STROKE } from "../../ui";

/** 다른 시·도 바로가기: 윗선 하나로 묶은 글자 목록 (지역 링크 표와 같은 모양) + 전국 목록 링크 */
export function OtherSidoLinks({ current, className }: { current?: FuneralSidoSlug; className?: string }) {
    const list = funeralSidoList().filter((s) => s.slug !== current);
    return (
        <div className={className}>
            <ul className="grid grid-cols-2 gap-x-5 sm:grid-cols-3 xl:grid-cols-4">
                {list.map((s) => (
                    <li key={s.slug}>
                        <Link
                            href={funeralSidoPath(s.slug)}
                            className="group block border-t border-line py-3.5 pr-1 transition-colors hover:border-ink/50 motion-reduce:transition-none"
                        >
                            <span className="flex items-center justify-between gap-2 text-[15px] font-semibold text-ink">
                                <span className="min-w-0 truncate">{s.name}</span>
                                <ArrowRight
                                    className="h-3.5 w-3.5 shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                                    strokeWidth={ICON_STROKE}
                                    aria-hidden
                                />
                            </span>
                            <span className="mt-0.5 block text-[12.5px] tabular-nums text-ink-3">{s.count}곳</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {current && (
                <Link
                    href={funeralHomesPath()}
                    className="mt-6 inline-flex items-center gap-1 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                >
                    전국 반려동물 장례식장 목록
                    <ArrowRight className="h-4 w-4" strokeWidth={ICON_STROKE} aria-hidden />
                </Link>
            )}
        </div>
    );
}
