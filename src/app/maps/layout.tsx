import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./maps.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "MAPS - 모빌리티 올펫 서비스",
    description: "미래지향적인 모빌리티와 편안함을 경험하세요. 반려동물 장례부터 미용까지, 가장 완벽한 파트너가 되어 드립니다.",
};

export default function MapsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${inter.variable} antialiased min-h-screen bg-[#050505] text-white selection:bg-[#FF5500] selection:text-white`}>
            <div className="background-glow fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(255,85,0,0.1)_0%,rgba(0,0,0,0)_70%)] blur-[80px] -z-10 pointer-events-none"></div>
            {children}
        </div>
    );
}
