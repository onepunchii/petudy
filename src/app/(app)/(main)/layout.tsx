import { BottomNav } from "@/components/shared/BottomNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "foon 2.0 | 반려동물 모빌리티 플랫폼",
  description:
    "반려동물 건강검진, 장묘, 보험, 여행까지 — 원스톱 반려동물 모빌리티 플랫폼",
  openGraph: {
    title: "foon 2.0 | 반려동물 모빌리티 플랫폼",
    description:
      "반려동물 건강검진, 장묘, 보험, 여행까지 — 원스톱 반려동물 모빌리티 플랫폼",
    type: "website",
    locale: "ko_KR",
    siteName: "foon",
  },
  twitter: {
    card: "summary_large_image",
    title: "foon 2.0 | 반려동물 모빌리티 플랫폼",
    description:
      "반려동물 건강검진, 장묘, 보험, 여행까지 — 원스톱 반려동물 모빌리티 플랫폼",
  },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-bg-main pb-20">
            <div className="flex-1">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
