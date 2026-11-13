import { ChevronDown } from "lucide-react";
import type { FuneralHome } from "@/lib/site/funeral-homes";
import { LeadForm } from "../../LeadForm";
import { ICON_STROKE, pillClass } from "../../ui";
import { DetailSection } from "./bits";

/**
 * 업체 사장님 입구. 자기 업체 페이지를 본 사장님이 바로 정보 수정·제휴 문의를 남길 수 있게 합니다.
 * - 폼은 접혀 있다가 펼칩니다(보호자에게는 한 줄 안내만 보이게).
 * - 제휴 문의 폼(service="partner")을 그대로 쓰고, 업체명·소재지를 미리 채웁니다. 접수에는 이 페이지 주소(sourcePath)가 함께 남습니다.
 * - 제휴 업체가 있다고 말하지 않습니다(지금 제휴 관계 없음).
 */
export function OwnerSection({ home: h }: { home: FuneralHome }) {
    return (
        <DetailSection
            id="owner"
            title="이 장례식장 사장님이세요?"
            lead="정보가 다르거나 바뀌었으면 알려 주세요. 확인한 뒤 고쳐 둡니다. 포온과의 제휴 문의도 여기서 남기실 수 있어요."
        >
            <details className="group">
                <summary className={`${pillClass({ tone: "onLight", variant: "ghost" })} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                    정보 고치기·제휴 문의 남기기
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" strokeWidth={ICON_STROKE} aria-hidden />
                </summary>
                <LeadForm
                    service="partner"
                    compact
                    className="mt-6 max-w-xl"
                    defaults={{ dong: h.address, petInfo: h.name, message: "고칠 내용 또는 문의: " }}
                />
            </details>
        </DetailSection>
    );
}
