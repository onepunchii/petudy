"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { agencyLeads } from "@/lib/db/schema";

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
                body: JSON.stringify({ text: `새 상담 접수: ${lead.service} / ${lead.regionSlug ?? ""} ${lead.dong ?? ""} / ${lead.phone}`, lead: row }),
            });
            saved = true;
        } catch (e) {
            console.error("[lead] webhook failed", e);
        }
    }

    if (!saved) {
        return { ok: false, message: "접수 중 문제가 생겼어요. 번거로우시겠지만 전화로 연락 부탁드립니다." };
    }
    return { ok: true, message: "상담 접수가 완료됐어요. 담당자가 순서대로 연락드립니다." };
}
