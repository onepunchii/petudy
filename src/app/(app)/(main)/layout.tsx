import { BottomNav } from "@/components/shared/BottomNav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "po-on 2.0 | 마지막 순간까지 함께하는 반려동물 맞춤 서비스",
  description:
    "건강검진부터 장례까지, 소중한 반려동물과 함께하는 모든 순간을 정중히 보내드립니다",
  openGraph: {
    title: "po-on 2.0 | 마지막 순간까지 함께하는 반려동물 맞춤 서비스",
    description:
      "건강검진부터 장례까지, 소중한 반려동물과 함께하는 모든 순간을 정중히 보내드립니다",
    type: "website",
    locale: "ko_KR",
    siteName: "po-on",
  },
  twitter: {
    card: "summary_large_image",
    title: "po-on 2.0 | 마지막 순간까지 함께하는 반려동물 맞춤 서비스",
    description:
      "건강검진부터 장례까지, 소중한 반려동물과 함께하는 모든 순간을 정중히 보내드립니다",
  },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#0A0A0B]">
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-[480px]">
                    <div className="pb-24">
                        {children}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
