"use client";

import { IdCard, Send, Loader2, Phone, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { askAiCounselor } from "@/actions/consult";
import { APP_ICON_STROKE, AppButton, AppList, AppListItem, BRAND_ICON, BrandIcon, appInputClass, AppTopBar } from "@/components/app/ui";
import { SITE } from "@/lib/site/config";
import { cn } from "@/lib/utils";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function ConsultPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setIsLoading(true);

        const history = messages.map(m => ({
            role: m.role === "user" ? "user" : "model",
            content: m.content
        }));

        const result = await askAiCounselor(userMsg, history);

        if (result.success && result.answer) {
            setMessages(prev => [...prev, { role: "ai", content: result.answer! }]);
        } else {
            setMessages(prev => [...prev, { role: "ai", content: result.error || "지금 AI 도우미가 답변하기 어려워요. 잠시 후 다시 시도해 주세요." }]);
        }
        setIsLoading(false);
    };

    return (
        <div className="flex h-full flex-col bg-moon">
            {/* 뒤로 가기는 예전처럼 항상 앱 홈(/app)으로 가는 링크 */}
            <AppTopBar title="포온 AI 도우미" backHref="/" className="shrink-0">
                {/* 긴급 연락 안내 (채팅 영역 밖이라 스크롤해도 항상 보임). 장례 안내라 라임 없이 흰 글자로 */}
                <div className="flex flex-wrap items-center justify-between gap-x-3 border-t border-white/10 px-5 py-1 text-[13px]">
                    <span className="py-1.5 text-star-2">급한 장례는 전화가 가장 빠릅니다</span>
                    <div className="flex items-center gap-3">
                        <a
                            href={SITE.phoneHref}
                            className="inline-flex min-h-10 items-center gap-1 font-bold tabular-nums text-star transition-opacity hover:opacity-80"
                            aria-label={`${SITE.name} 전화 상담 ${SITE.phone}`}
                        >
                            <Phone className="h-3.5 w-3.5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            {SITE.phone}
                        </a>
                        <span className="h-3 w-px bg-white/15" aria-hidden="true" />
                        <Link href="/contact" className="inline-flex min-h-10 items-center font-semibold text-star-2 transition-colors hover:text-star">
                            상담 남기기
                        </Link>
                    </div>
                </div>
            </AppTopBar>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                className="scrollbar-hide flex-1 space-y-3 overflow-y-auto px-5 py-6"
            >
                {messages.length === 0 ? (
                    <div className="flex min-h-full flex-col items-center justify-center text-center">
                        <BrandIcon src={BRAND_ICON.ai} size={104} />
                        <h2 className="mt-5 text-[22px] font-bold text-ink">무엇이든 물어보세요!</h2>
                        <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-2">
                            아이의 증상이 궁금하거나<br />
                            앱 사용법이 헷갈리실 때 언제든 찾아주세요.
                        </p>
                        <div className="mt-8 w-full max-w-sm text-left">
                            <p className="mb-2 px-1 text-[13px] font-semibold text-ink-3">추천 질문</p>
                            <AppList aria-label="추천 질문">
                                <AppListItem
                                    onClick={() => setInput("강아지가 초콜릿을 먹었어요!")}
                                    icon={<Stethoscope className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                                    label="강아지가 초콜릿을 먹었어요!"
                                />
                                <AppListItem
                                    onClick={() => setInput("펫 패스는 어떻게 발급받나요?")}
                                    icon={<IdCard className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                                    label="펫 패스는 어떻게 발급받나요?"
                                />
                            </AppList>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={cn(
                                    "max-w-[85%] px-4 py-3 text-[15px] leading-relaxed",
                                    msg.role === "user"
                                        ? "rounded-[20px] rounded-tr-md bg-night font-medium text-star"
                                        : "whitespace-pre-wrap rounded-[20px] rounded-tl-md bg-pass text-ink ring-1 ring-line",
                                )}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="rounded-[20px] rounded-tl-md bg-pass px-4 py-3.5 ring-1 ring-line">
                            <Loader2 className="h-4 w-4 animate-spin text-ink-3 motion-reduce:animate-none" strokeWidth={APP_ICON_STROKE} />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area: 달빛 위 아래에 붙는 입력줄 */}
            <div className="shrink-0 border-t border-line bg-moon px-4 pt-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="메시지를 입력하세요..."
                        className={appInputClass}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            // 한글 조합 중 Enter 는 조합 확정이므로 보내지 않습니다 (두 번 보내지거나 끝 글자가 남는 문제 방지)
                            if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSend();
                        }}
                    />
                    <AppButton
                        variant="primary"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        aria-label="메시지 보내기"
                        className="h-12 w-12 shrink-0 px-0"
                    >
                        <Send className="h-[18px] w-[18px]" strokeWidth={APP_ICON_STROKE} aria-hidden />
                    </AppButton>
                </div>
            </div>
        </div>
    );
}
