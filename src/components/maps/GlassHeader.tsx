import Link from 'next/link';

export default function GlassHeader() {
    return (
        <header className="fixed top-0 left-0 w-full px-8 py-6 z-50 glass-header">
            <nav className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="text-xl font-bold text-white">SVS Motors</div>
                <ul className="flex gap-8 list-none">
                    <li><Link href="#home" className="text-gray-400 hover:text-white transition-colors text-sm">홈</Link></li>
                    <li><Link href="#products" className="text-gray-400 hover:text-white transition-colors text-sm">제품 소개</Link></li>
                    <li><Link href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">문의하기</Link></li>
                </ul>
            </nav>
        </header>
    );
}
