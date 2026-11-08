"use server";

import { createClient } from "@/lib/supabase/server";
import { PET_PHOTO_BAD_TYPE, PET_PHOTO_MAX_BYTES, PET_PHOTO_TOO_BIG, sniffImageType } from "@/lib/pet-photo";

// 받는 사진 형식·크기는 src/lib/pet-photo.ts 에서 화면과 같이 씁니다.
// 확장자는 파일 이름이 아니라 실제 내용(앞 몇 바이트)으로 정합니다.

type UploadResult = { success: true; url: string } | { success: false; code: "auth" | "invalid" | "server"; error: string };

export async function uploadPetPhoto(formData: FormData): Promise<UploadResult> {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
        return { success: false, code: "invalid", error: "사진을 다시 골라 주세요." };
    }
    if (file.size > PET_PHOTO_MAX_BYTES) {
        return { success: false, code: "invalid", error: PET_PHOTO_TOO_BIG };
    }

    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (!user) {
            return authError?.name === "AuthRetryableFetchError"
                ? { success: false, code: "server", error: "서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요." }
                : { success: false, code: "auth", error: "로그인이 필요해요. 다시 로그인한 뒤 시도해 주세요." };
        }

        const bytes = new Uint8Array(await file.arrayBuffer());
        const type = sniffImageType(bytes.subarray(0, 12));
        if (!type) {
            return { success: false, code: "invalid", error: PET_PHOTO_BAD_TYPE };
        }

        // 사용자별 폴더에 겹치지 않는 이름으로 저장
        const filePath = `pets/${user.id}/${crypto.randomUUID()}.${type.ext}`;
        const { error } = await supabase.storage.from("pet-photos").upload(filePath, bytes, {
            contentType: type.mime,
            cacheControl: "3600",
            upsert: false,
        });

        if (error) {
            // 관리자용 정보(버킷 없음 등)는 서버 로그에만 남깁니다
            console.error("Storage upload error (bucket 'pet-photos' must exist and be public):", error);
            return { success: false, code: "server", error: "사진을 올리지 못했어요. 잠시 후 다시 시도해 주세요." };
        }

        const { data: { publicUrl } } = supabase.storage.from("pet-photos").getPublicUrl(filePath);
        return { success: true, url: publicUrl };
    } catch (error) {
        console.error("Upload action failed:", error);
        return { success: false, code: "server", error: "사진을 올리지 못했어요. 잠시 후 다시 시도해 주세요." };
    }
}
