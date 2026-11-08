import { signInWithGoogle, signInWithKakao } from "@/actions/auth";
import Image from "next/image";
import { appButtonClass } from "@/components/app/tokens";
import { Logo } from "@/components/site/SiteHeader";
import { safeNextPath } from "@/lib/safe-next";

interface LoginPageProps {
    searchParams: Promise<{ next?: string | string[] }>;
}

/* 로그인. 밤 머리(로고, 앱 아이콘, 이름) -> 달빛 본문(로그인 버튼). 화면 구성은 AppHero 와 같습니다
 * ?next=/register 처럼 돌아갈 경로가 오면 로그인 뒤 그 화면으로 보냅니다(사이트 안 경로만) */
export default async function LoginPage({ searchParams }: LoginPageProps) {
    const { next: rawNext } = await searchParams;
    const next = safeNextPath(Array.isArray(rawNext) ? rawNext[0] : rawNext, "");
    const reason = next.startsWith("/register")
        ? "아이를 등록하려면 먼저 로그인해 주세요."
        : next.startsWith("/mypage")
          ? "내 정보와 내 아이를 보려면 먼저 로그인해 주세요."
          : null;

    return (
        <div className="flex min-h-full flex-col bg-moon">
            {/* 밤 머리 */}
            <header
                className="relative isolate overflow-hidden rounded-b-[28px] bg-night px-5 pb-10 text-star"
                style={{ paddingTop: "max(20px, env(safe-area-inset-top))" }}
            >
                <div className="site-stars -z-10" aria-hidden />
                {/* 데스크톱은 위에 사이트 머리 메뉴(로고 포함)가 있어 모바일에서만 보입니다 */}
                <div className="flex min-h-10 items-center lg:hidden">
                    <Logo />
                </div>
                <div className="mt-10 flex lg:mt-4 flex-col items-center text-center">
                    {/* 앱 아이콘 그림의 흰 여백을 잘라 어두운 타일만 보이게 합니다 */}
                    <div className="relative h-24 w-24 overflow-hidden rounded-[28px] ring-1 ring-white/10">
                        <Image
                            src="/icons/app-icon.png"
                            alt="포온 아이콘"
                            width={160}
                            height={160}
                            className="h-full w-full scale-[1.55] object-cover"
                            priority
                        />
                    </div>
                    <h1 className="mt-6 text-[26px] font-extrabold leading-[1.28] tracking-[-0.03em] text-star">포온</h1>
                    <p className="mt-2 text-[15px] leading-[1.65] text-star-2">
                        반려동물과 함께하는
                        <br />
                        특별한 라이프스타일
                    </p>
                </div>
            </header>

            {/* 달빛 본문: 로그인 버튼 */}
            <div className="flex flex-1 flex-col px-5 pt-8" style={{ paddingBottom: "max(24px, env(safe-area-inset-bottom))" }}>
                <div className="mx-auto w-full max-w-sm space-y-3">
                    {reason && (
                        <p role="status" className="mb-5 rounded-2xl bg-pass px-4 py-3.5 text-center text-[15px] font-semibold leading-snug text-ink ring-1 ring-inset ring-line">
                            {reason}
                        </p>
                    )}
                    {/* Kakao Login */}
                    <form action={signInWithKakao}>
                        {next && <input type="hidden" name="next" value={next} />}
                        {/* 브랜드 예외: 카카오 디자인 가이드에 따라 카카오 노랑(#FEE500) 바탕, 검은 심볼, #191919 글자를 그대로 씁니다 */}
                        <button
                            type="submit"
                            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-[#FEE500] px-6 text-[16px] font-semibold text-[#191919] transition-[filter,transform] duration-200 hover:brightness-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-px motion-reduce:transition-none"
                        >
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                                <path
                                    d="M12 3C5.9 3 1 6.9 1 11.8c0 3.2 2.1 6.1 5.3 7.6-.2.7-.8 2.8-.8 3 0 .1.1.2.2.2.1 0 .1 0 .2-.1.9-.6 3.8-2.6 4.4-3 .5.1 1.2.1 1.7.1 6.1 0 11-3.9 11-8.8C23 6.9 18.1 3 12 3z"
                                    fill="#000"
                                />
                            </svg>
                            <span>카카오로 3초만에 시작하기</span>
                        </button>
                    </form>

                    {/* Google Login (Google 로고 색은 브랜드 가이드 그대로) */}
                    <form action={signInWithGoogle}>
                        {next && <input type="hidden" name="next" value={next} />}
                        <button type="submit" className={appButtonClass({ variant: "secondary", size: "lg", block: true })}>
                            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            <span>Google로 계속하기</span>
                        </button>
                    </form>
                </div>

                <p className="mt-auto pt-10 text-center text-[13px] leading-relaxed text-ink-3">
                    계속 진행하시면 포온의 <span className="underline decoration-ink-3/50 underline-offset-2">이용약관</span> 및 <br />
                    <span className="underline decoration-ink-3/50 underline-offset-2">개인정보처리방침</span>에 동의하는 것으로 간주됩니다.
                </p>
            </div>
        </div>
    );
}
