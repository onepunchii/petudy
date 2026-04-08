"use client";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ChevronLeft, Sparkles, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { askAiCounselor } from "@/actions/consult";
import { initRagDatabase } from "@/actions/init-db";
import { populate21gramData } from "@/actions/populate-21gram";

interface Message {
    role: "user" | "ai";
    content: string;
}

export default function ConsultPage() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // DB 초기화 함수 (관리자용 임시)
    const handleInitDB = async () => {
        if (!confirm("RAG DB를 초기화하고 21그램 데이터를 populates하시겠습니까?")) return;
        const initRes = await initRagDatabase();
        if (!initRes.success) {
            alert("DB 초기화 실패: " + initRes.error);
            return;
        }
        const popRes = await populate21gramData();
        if (popRes.success) alert("DB 초기화 및 21그램 데이터 population 완료!");
        else alert("Population 실패: " + popRes.error);
    };

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
            setMessages(prev => [...prev, { role: "ai", content: "죄송합니다. 오류가 발생했습니다: " + (result.error || "알 수 없는 오류") }]);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#121212] flex justify-center">
            <div className="w-full max-w-[512px] bg-bg-main h-screen border-x border-[#121212] relative flex flex-col">

                {/* Header */}
                <header className="sticky top-0 z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                    <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </Link>
                    <h1
                        className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white flex items-center gap-2 cursor-pointer"
                        onDoubleClick={handleInitDB}
                    >
                        <Sparkles className="w-4 h-4 text-foon-lime" />
                        AI 닥터 멍냥
                    </h1>
                </header>

                {/* Chat Area */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
                >
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80 py-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-foon-lime to-green-300 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(163,223,70,0.3)] overflow-hidden">
                                <div className="w-full h-full transform scale-125">
                                    <DotLottieReact
                                        src="https://lottie.host/fbd4eadc-be4a-44a3-adfb-0630b5bf1647/tBSDMcctNr.lottie"
                                        loop
                                        autoplay
                                    />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white">무엇이든 물어보세요!</h2>
                            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                                아이의 증상이 궁금하거나<br />
                                앱 사용법이 헷갈리실 때 언제든 찾아주세요.
                            </p>
                            <div className="w-full max-w-sm bg-[#1e1e20] rounded-2xl p-4 border border-white/5 text-left space-y-3">
                                <div className="text-xs text-gray-500 font-bold ml-1">추천 질문</div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setInput("강아지가 초콜릿을 먹었어요!")}
                                        className="w-full text-left p-3 rounded-xl bg-[#2a2a2c] hover:bg-[#333] transition-colors text-sm text-gray-200"
                                    >
                                        💊 강아지가 초콜릿을 먹었어요!
                                    </button>
                                    <button
                                        onClick={() => setInput("펫 패스는 어떻게 발급받나요?")}
                                        className="w-full text-left p-3 rounded-xl bg-[#2a2a2c] hover:bg-[#333] transition-colors text-sm text-gray-200"
                                    >
                                        💳 펫 패스는 어떻게 발급받나요?
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-foon-lime text-bg-main font-medium rounded-tr-none'
                                    : 'bg-[#1e1e20] text-gray-100 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-[#1e1e20] p-3.5 rounded-2xl rounded-tl-none border border-white/5">
                                <Loader2 className="w-4 h-4 text-foon-lime animate-spin" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/5 bg-[#121212]">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="메시지를 입력하세요..."
                            className="w-full bg-[#1e1e20] border border-white/10 rounded-full py-3.5 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-foon-lime/50 transition-colors"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foon-lime flex items-center justify-center text-bg-main hover:bg-[#bbf080] disabled:opacity-50 disabled:hover:bg-foon-lime transition-all"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
