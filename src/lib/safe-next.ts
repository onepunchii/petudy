/**
 * 로그인 뒤 돌아갈 경로 검사. 우리 사이트 안의 경로("/..." )만 받고,
 * "//evil.com", "/\\evil.com", "@evil.com" 처럼 다른 사이트로 빠지는 값은 버립니다(open redirect 방지).
 */
export const LOGIN_NEXT_COOKIE = "poon_login_next";

export function safeNextPath(raw: unknown, fallback = "/app"): string {
    if (typeof raw !== "string" || raw.length === 0 || raw.length > 300) return fallback;
    if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return fallback;
    // 제어 문자·역슬래시가 섞이면 브라우저마다 해석이 달라 버립니다
    if (/[\u0000-\u001f\u007f\\]/.test(raw)) return fallback;
    try {
        const base = "https://poon.invalid";
        const url = new URL(raw, base);
        if (url.origin !== base) return fallback;
        // 로그인 화면으로 다시 돌아가는 고리는 막습니다
        if (url.pathname === "/login" || url.pathname.startsWith("/auth/")) return fallback;
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return fallback;
    }
}
