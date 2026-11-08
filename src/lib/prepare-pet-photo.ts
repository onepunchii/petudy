/**
 * 사진을 고른 자리에서 바로 올릴 수 있는 모양으로 만듭니다 (브라우저 전용).
 *
 * 1) 긴 변 1920px, 1MB 안팎의 WebP 로 줄입니다.
 * 2) 줄이지 못하면(예: 컴퓨터 크롬에서 고른 아이폰 HEIC) 원본이 서버가 받는 형식·크기일 때만 그대로 씁니다.
 * 3) 그것도 안 되면 고른 자리에서 이유를 알려 줍니다. 마지막 '등록 완료'·'저장하기'에서야 거절되지 않게 하려는 것입니다.
 */
import { PET_PHOTO_BAD_TYPE, PET_PHOTO_MAX_BYTES, PET_PHOTO_TOO_BIG, sniffImageType } from "@/lib/pet-photo";

export type PreparedPetPhoto = { ok: true; file: File } | { ok: false; error: string };

const isHeic = (file: File) => /hei[cf]/i.test(file.type) || /\.hei[cf]$/i.test(file.name);

/** 서버(uploadPetPhoto)와 같은 기준으로 확인. 문제가 없으면 null */
async function photoError(file: File): Promise<string | null> {
    if (file.size === 0) return "사진을 다시 골라 주세요.";
    const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    if (!sniffImageType(head)) {
        return isHeic(file)
            ? "아이폰 HEIC 사진은 이 브라우저에서 올릴 수 없어요. JPG 사진으로 다시 골라 주세요."
            : PET_PHOTO_BAD_TYPE;
    }
    if (file.size > PET_PHOTO_MAX_BYTES) return PET_PHOTO_TOO_BIG;
    return null;
}

export async function preparePetPhoto(file: File): Promise<PreparedPetPhoto> {
    try {
        // browser-image-compression 은 브라우저에서만 돌아서 필요할 때 불러옵니다
        const imageCompression = (await import("browser-image-compression")).default;
        const compressed = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp",
        });
        const webp = new File([compressed], "image.webp", { type: compressed.type || "image/webp" });
        if (!(await photoError(webp))) return { ok: true, file: webp };
    } catch (error) {
        console.error("Image compression failed:", error);
    }

    // 줄이지 못했으면 원본을 그대로 쓸 수 있는지 봅니다
    const error = await photoError(file);
    return error ? { ok: false, error } : { ok: true, file };
}
