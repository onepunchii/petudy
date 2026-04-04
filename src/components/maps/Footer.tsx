import Link from 'next/link';
import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                            <span className="text-xl font-bold text-white tracking-tight">Po-ON</span>
                            <div className="w-2 h-2 rounded-full bg-[#A3DF46]"></div>
                        </Link>
                        <p className="text-[#666666] text-sm leading-relaxed max-w-xs break-keep">
                            반려동물 장례 전문 에이전시<br />
                            마지막까지, 품어드립니다.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#B0B0B0] hover:bg-white/10 hover:text-white cursor-pointer transition-all">blog</div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#B0B0B0] hover:bg-white/10 hover:text-white cursor-pointer transition-all">insta</div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="col-span-1">
                        <h4 className="text-white font-bold mb-6">Service</h4>
                        <ul className="space-y-4 text-sm text-[#B0B0B0]">
                            <li><Link href="#" className="hover:text-[#FF5500] transition-colors">Funeral</Link></li>
                            <li><Link href="#" className="hover:text-[#FF5500] transition-colors">Grooming</Link></li>
                            <li><Link href="#" className="hover:text-[#FF5500] transition-colors">Camping</Link></li>
                        </ul>
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-[#B0B0B0]">
                            <li><Link href="#" className="hover:text-[#FF5500] transition-colors">About us</Link></li>
                            <li><Link href="#" className="hover:text-[#FF5500] transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-[#666666]">
                    <p>Copyright © 2025 21gram. All rights reserved.</p>
                    <p>Designed by Antigravity</p>
                </div>
            </div>
        </footer>
    );
}
