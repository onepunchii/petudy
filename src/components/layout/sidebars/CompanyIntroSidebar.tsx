import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function CompanyIntroSidebar() {
    return (
        <aside className="hidden lg:flex flex-col justify-center items-end w-full max-w-[calc(50%-256px)] h-full fixed left-0 top-0 p-12 z-0">
            <div className="max-w-md text-right space-y-8 animate-in fade-in slide-in-from-left-10 duration-700">
                {/* Brand Section */}
                <div className="space-y-4">
                    <h1 className="text-6xl font-black text-white tracking-tighter">
                        foon <span className="text-3xl font-light text-white align-middle px-1">by</span> <span className="text-foon-lime">MAPS</span>
                    </h1>
                    <p className="text-2xl font-medium text-gray-400">
                        반려동물과 함께하는<br />
                        더 자유로운 세상
                    </p>
                </div>

                {/* Company Description */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                    <p className="text-gray-400 leading-relaxed font-light">
                        펫터디는 반려동물 전용 모빌리티 서비스를 시작으로,<br />
                        장례, 헬스케어 등 반려동물 생애주기 전반을<br />
                        아우르는 라이프스타일 플랫폼입니다.
                    </p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 justify-items-end text-sm font-bold text-foon-lime mb-4">
                        <span className="hover:text-white transition-colors cursor-pointer">사업 제휴</span>
                        <span className="hover:text-white transition-colors cursor-pointer">광고 문의</span>
                        <span className="hover:text-white transition-colors cursor-pointer">인증 사업 문의</span>
                        <span className="hover:text-white transition-colors cursor-pointer">마케팅·PR</span>
                        <span className="hover:text-white transition-colors cursor-pointer">IR</span>
                    </div>

                    <div className="flex flex-col items-end gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <span>contact@foon.com</span>
                            <Mail className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>02-1234-5678</span>
                            <Phone className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>서울시 강남구 테헤란로 123</span>
                            <MapPin className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Footer Links (Mock) */}
                <div className="flex gap-4 justify-end text-xs text-gray-600 pt-8">
                    <Link href="#" className="hover:text-foon-lime transition-colors">이용약관</Link>
                    <Link href="#" className="hover:text-foon-lime transition-colors">개인정보처리방침</Link>
                    <Link href="#" className="hover:text-foon-lime transition-colors">사업자정보확인</Link>
                </div>

                <div className="pt-2 text-[10px] text-gray-700 font-mono">
                    © 2025 foon Corp. All rights reserved.
                </div>
            </div>
        </aside>
    );
}
