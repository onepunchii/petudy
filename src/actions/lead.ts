"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { agencyLeads } from "@/lib/db/schema";
import { LEAD_SERVICE_UNSURE, LEAD_SERVICE_UNSURE_LABEL } from "@/lib/site/lead-options";
import { SITE } from "@/lib/site/config";
import { getService } from "@/lib/site/services";

const LeadSchema = z.object({
    service: z.string().min(1).max(40),
    regionSido: z.string().max(20).optional().or(z.literal("")),
    regionSlug: z.string().max(40).optional().or(z.literal("")),
    dong: z.string().max(40).optional().or(z.literal("")),
    name: z.string().max(40).optional().or(z.literal("")),
    phone: z
        .string()
        .transform((v) => v.replace(/[^0-9]/g, ""))
        .refine((v) => /^0\d{8,10}$/.test(v), "연락처를 확인해 주세요"),
    petInfo: z.string().max(200).optional().or(z.literal("")),
    message: z.string().max(1000).optional().or(z.literal("")),
    sourcePath: z.string().max(300).optional().or(z.literal("")),
    agree: z.literal("on", { message: "개인정보 수집·이용에 동의해 주세요" }),
    // 봇 방지용 숨김 필드 — 값이 있으면 무시
    website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadState = { ok: boolean; message: string } | null;

const serviceLabel = (slug: string) =>
    slug === LEAD_SERVICE_UNSURE ? `서비스 미정(${LEAD_SERVICE_UNSURE_LABEL})` : slug === "partner" ? "업체 제휴 문의" : (getService(slug)?.name ?? slug);

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
    const parsed = LeadSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) {
        return { ok: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인해 주세요" };
    }
    const lead = { ...parsed.data } as Partial<typeof parsed.data>;
    if (lead.website) return { ok: true, message: "상담 접수가 완료됐어요." }; // 봇
    delete lead.agree;
    delete lead.website;
    const row = Object.fromEntries(Object.entries(lead).map(([k, v]) => [k, v === "" ? null : v])) as Record<string, string | null>;

    let saved = false;
    try {
        await db.insert(agencyLeads).values({ ...row, service: parsed.data.service, phone: parsed.data.phone });
        saved = true;
    } catch (e) {
        console.error("[lead] db insert failed", e);
    }

    const hook = process.env.LEAD_WEBHOOK_URL;
    if (hook) {
        try {
            await fetch(hook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // 담당자가 읽는 알림 글에는 서비스 이름을(미정이면 '아직 모르겠어요'), 원본 값은 lead.service 에 그대로 둡니다
                body: JSON.stringify({ text: `새 상담 접수: ${serviceLabel(parsed.data.service)} / ${lead.regionSlug ?? ""} ${lead.dong ?? ""} / ${lead.phone}`, lead: row }),
            });
            saved = true;
        } catch (e) {
            console.error("[lead] webhook failed", e);
        }
    }

    if (!saved) {
        return {
            ok: false,
            message: SITE.hasPhone
                ? "접수 중 문제가 생겼어요. 번거로우시겠지만 전화로 연락 부탁드립니다."
                : "접수 중 문제가 생겼어요. 잠시 후 다시 남겨 주세요. 장례가 급하시면 '장례식장 찾기'에서 업체에 바로 전화하실 수 있어요.",
        };
    }
    return { ok: true, message: "상담 접수가 완료됐어요. 담당자가 순서대로 연락드립니다." };
}
