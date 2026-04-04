import { signInWithGoogle, signInWithKakao } from "@/actions/auth";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-bg-main relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-foon-lime rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500 rounded-full blur-[120px] opacity-5 pointer-events-none"></div>

            {/* Logo / Branding Section */}
            <div className="mb-12 text-center relative z-10 flex flex-col items-center animate-in fade-in zoom-in duration-700 slide-in-from-bottom-5">
                <div className="w-28 h-28 rounded-[28px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-[#333] mb-6 relative group">
                    <Image
                        src="/icons/app-icon.png"
                        alt="foon App Icon"
                        width={112}
                        height={112}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        priority
                    />
                    {/* Gloss Shine */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
                </div>
                <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">foon</h1>
                <p className="text-gray-400 font-medium">반려동물과 함께하는<br />특별한 라이프스타일</p>
            </div>

            {/* Login Buttons */}
            <div className="w-full space-y-4 max-w-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200 fill-mode-backwards">
                {/* Kakao Login */}
                <form action={signInWithKakao}>
                    <button className="w-full flex items-center justify-center gap-3 px-4 py-4 text-[#191919] bg-[#FEE500] rounded-2xl hover:bg-[#FDD835] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg relative group overflow-hidden">
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            className="relative z-10"
                        >
                            <path
                                d="M12 3C5.9 3 1 6.9 1 11.8c0 3.2 2.1 6.1 5.3 7.6-.2.7-.8 2.8-.8 3 0 .1.1.2.2.2.1 0 .1 0 .2-.1.9-.6 3.8-2.6 4.4-3 .5.1 1.2.1 1.7.1 6.1 0 11-3.9 11-8.8C23 6.9 18.1 3 12 3z"
                                fill="#000"
                            />
                        </svg>
                        <span className="font-bold text-base relative z-10">카카오로 3초만에 시작하기</span>
                    </button>
                </form>

                {/* Google Login */}
                <form action={signInWithGoogle}>
                    <button className="w-full flex items-center justify-center gap-3 px-4 py-4 text-white bg-[#1E1E20] border border-[#333] rounded-2xl hover:bg-[#2C2C2E] transition-all hover:border-foon-lime/50 hover:scale-[1.02] active:scale-[0.98] relative group">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span className="font-bold text-gray-200">Google로 계속하기</span>
                    </button>
                </form>
            </div>

            <div className="mt-10 text-[11px] text-gray-500 text-center animate-in fade-in duration-1000 delay-500">
                계속 진행하시면 foon의 <span className="underline decoration-gray-600 underline-offset-2">이용약관</span> 및 <br />
                <span className="underline decoration-gray-600 underline-offset-2">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
            </div>
        </div>
    );
}
