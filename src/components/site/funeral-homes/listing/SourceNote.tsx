import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FUNERAL_REGISTRY_LABEL, FUNERAL_REGISTRY_URL } from "@/lib/site/funeral-homes";
import { cn } from "@/lib/utils";
import { ICON_STROKE } from "../../ui";
import { CHECKED_DOT } from "./copy";

/**
 * 목록 페이지 출처와 정보 수정 안내. 포온은 목록의 업체들과 제휴 관계가 아니라는 점을 밝힙니다.
 */
export function SourceNote({ id = "sources", className }: { id?: string; className?: string }) {
    return (
        <div className={cn("border-t border-line pt-8", className)}>
            <h2 id={id} className="scroll-mt-24 text-[17px] font-bold text-ink">
                출처와 정보 수정
            </h2>
            <dl className="mt-4 grid gap-3 text-[14.5px] leading-relaxed">
                <div className="grid gap-0.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-semibold text-ink">업체명·소재지·전화·시설</dt>
                    <dd className="text-ink-2">
                        <a
                            href={FUNERAL_REGISTRY_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                        >
                            {FUNERAL_REGISTRY_LABEL}
                            <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={ICON_STROKE} aria-hidden />
                            <span className="sr-only">(새 창)</span>
                        </a>
                    </dd>
                </div>
                <div className="grid gap-0.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-semibold text-ink">서비스·운영 시간·가격</dt>
                    <dd className="text-ink-2">각 업체 홈페이지 (업체 페이지마다 출처 링크)</dd>
                </div>
                <div className="grid gap-0.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-6">
                    <dt className="font-semibold text-ink">확인일</dt>
                    <dd className="text-ink-2">{CHECKED_DOT}. 업체 사정에 따라 바뀔 수 있어요.</dd>
                </div>
            </dl>
            <p className="mt-5 max-w-[62ch] text-[14.5px] leading-relaxed text-ink-2">
                포온은 이 목록의 업체들과 제휴 관계가 아닙니다. 정보가 실제와 다르면{" "}
                <Link href="/contact" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink">
                    알려 주세요
                </Link>
                .
            </p>
        </div>
    );
}
