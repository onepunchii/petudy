import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Po-On (포온) | 투자 IR 자료",
  description:
    "포온(Po-On) — 반려동물 장례 전문 에이전시 플랫폼. 2026년 Seed 투자 유치 진행중. 서울·경기 관객권 중심으로 반려동물 장례 서비스를 연결하는 플랫폼입니다.",
  openGraph: {
    title: "Po-On (포온) | 투자 IR 자료",
    description:
      "포온(Po-On) — 반려동물 장례 전문 에이전시 플랫폼. 2026년 Seed 투자 유치 진행중. 3,000억 규모 장례 시장에서 플랫폼 역량을 펼칩니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "Po-On",
  },
  twitter: {
    card: "summary_large_image",
    title: "Po-On (포온) | 투자 IR 자료",
    description:
      "포온(Po-On) — 반려동물 장례 전문 에이전시 플랫폼. 2026년 Seed 투자 유치 진행중.",
  },
};

export default function IRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
