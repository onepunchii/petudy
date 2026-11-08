/**
 * 아이 프로필 사진 규칙. 브라우저(사진 고르기)와 서버(uploadPetPhoto)가 같은 값을 씁니다.
 * 브라우저와 서버 양쪽에서 쓰므로 node 전용 API 를 쓰지 않습니다.
 */

/**
 * 올릴 수 있는 사진 크기. Vercel 서버 함수는 요청 본문을 4.5MB 까지 받으므로
 * 폼 데이터 여유를 두고 4MB 로 맞춥니다 (넘으면 서버에 닿기 전에 끊겨 엉뚱한 안내가 뜹니다).
 */
export const PET_PHOTO_MAX_BYTES = 4 * 1024 * 1024;
export const PET_PHOTO_MAX_LABEL = "4MB";

export const PET_PHOTO_TOO_BIG = `사진은 ${PET_PHOTO_MAX_LABEL} 이하로 올려 주세요.`;
export const PET_PHOTO_BAD_TYPE = "JPG, PNG, WEBP, GIF 사진만 올릴 수 있어요.";

/** 파일 앞 12바이트로 실제 형식을 봅니다 (파일 이름·type 은 믿지 않음) */
export function sniffImageType(head: Uint8Array): { mime: string; ext: string } | null {
    const ascii = (from: number, to: number) => String.fromCharCode(...head.slice(from, to));
    if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
    if (head[0] === 0x89 && ascii(1, 4) === "PNG") return { mime: "image/png", ext: "png" };
    if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return { mime: "image/webp", ext: "webp" };
    if (ascii(0, 4) === "GIF8") return { mime: "image/gif", ext: "gif" };
    return null;
}
