import type { Metadata } from "next";

/*
 * 부고장 공개 화면의 공유 문구. 페이지가 "use client" 라 메타데이터를 여기(서버 레이아웃)에서 정합니다.
 * 상위 (main) 의 "반려동물 기록과 추억 / 내 아이 정보와 추억을 기록하는 포온" 대신 차분한 부고 문구를 씁니다.
 * 검색 노출은 (app)/layout.tsx 의 noindex 를 그대로 따릅니다.
 */
const TITLE = "부고장";
const SHARE_TITLE = "먼저 떠난 아이의 소식을 전합니다";
const DESCRIPTION = "포온 부고장으로 전하는 소식입니다.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: { title: SHARE_TITLE, description: DESCRIPTION, type: "website", locale: "ko_KR", siteName: "포온" },
    twitter: { card: "summary_large_image", title: SHARE_TITLE, description: DESCRIPTION },
};

export default function ObituaryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
