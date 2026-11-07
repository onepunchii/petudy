import { BottomNav } from "@/components/shared/BottomNav";
import { Metadata } from "next";

// title 은 지정하지 않습니다 — 상위 (app)/layout.tsx 의 "포온 앱" / "%s | 포온 앱" 템플릿을 사용
const APP_DESCRIPTION = "내 아이 정보와 추억을 기록하는 포온 앱";
const APP_SHARE_TITLE = "포온 앱 | 반려동물 기록과 추억";

export const metadata: Metadata = {
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_SHARE_TITLE,
    description: APP_DESCRIPTION,
    type: "website",
    locale: "ko_KR",
    siteName: "포온",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_SHARE_TITLE,
    description: APP_DESCRIPTION,
  },
};

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-full flex-col bg-moon">
            <div className="flex-1 flex justify-center">
                <div className="w-full">
                    <div className="pb-28">
                        {children}
                    </div>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
