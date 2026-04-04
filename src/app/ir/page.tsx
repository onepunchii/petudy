"use client";

import { useState, useEffect, useRef } from "react";

export default function IRPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setIsScrolled(window.scrollY > 60);
      const progressBar = document.getElementById("progress");
      if (progressBar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (window.scrollY / h * 100) + "%";
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, e.target.id]));
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const counterRef = useRef<HTMLDivElement>(null);
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    if (!counterRef.current || countersStarted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setCountersStarted(true);
            document.querySelectorAll(".counter").forEach((el) => {
              const target = +(el as HTMLElement).dataset.target!;
              const suffix = (el as HTMLElement).dataset.suffix || "";
              const dur = 1800;
              const start = performance.now();
              const tick = (now: number) => {
                const p = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 4);
                const val = Math.round(ease * target);
                el.textContent = (val >= 1000 && target >= 1000 ? val.toLocaleString("ko") : val) + suffix;
                if (p < 1) requestAnimationFrame(tick);
              };
              requestAnimationFrame(tick);
            });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [countersStarted]);

  useEffect(() => {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !(e.target as HTMLElement).dataset.done) {
            (e.target as HTMLElement).dataset.done = "1";
            (e.target as HTMLElement).style.width = (e.target as HTMLElement).dataset.width + "%";
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".growth-bar-fill").forEach((el) => barObserver.observe(el));
    return () => barObserver.disconnect();
  }, []);

  const navLinks = [
    { href: "#brand", label: "브랜드" },
    { href: "#market", label: "시장" },
    { href: "#model", label: "비즈니스" },
    { href: "#financial", label: "재무" },
    { href: "#team", label: "팀" },
    { href: "#invest", label: "사업계획" },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D14] text-[#F5F5F7] overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.025]" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} 
      />
      <div id="progress" className="fixed top-0 left-0 h-[2px] bg-gradient-to-r from-[#A3DF46] to-[#BEF16E] z-[9999] transition-all duration-100" style={{ width: "0%" }} />
      <nav className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-10 py-4 md:py-5 flex justify-between items-center transition-all duration-400" style={{ background: isScrolled ? "rgba(13,13,20,.85)" : "transparent", backdropFilter: isScrolled ? "blur(20px)" : "none", borderBottom: isScrolled ? "1px solid rgba(255,255,255,.06)" : "none" }}>
        <div className="text-xl font-black tracking-[-1px]">
          <span className="text-[#F5F5F7]">Po-</span><span className="text-[#A3DF46]">On</span>
        </div>
        <div className="hidden md:flex gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="text-[#8888A0] text-xs md:text-sm font-medium hover:text-[#A3DF46] transition-colors duration-200">
              {link.label}
            </a>
          ))}
        </div>
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      <section id="hero" className="min-h-screen flex items-center px-4 md:px-10 pb-16 md:pb-20 pt-24 relative overflow-hidden">
        <div className="absolute rounded-full pointer-events-none" style={{ width: "700px", height: "700px", background: "radial-gradient(circle,rgba(163,223,70,.08) 0%,transparent 70%)", top: "-15%", left: "-10%", filter: "blur(120px)" }} />
        <div className="absolute rounded-full pointer-events-none hidden md:block" style={{ width: "500px", height: "500px", background: "radial-gradient(circle,rgba(60,60,120,.25) 0%,transparent 70%)", bottom: "-10%", right: "5%", filter: "blur(120px)" }} />
        <div className="absolute rounded-full pointer-events-none hidden md:block" style={{ width: "400px", height: "400px", background: "radial-gradient(circle,rgba(163,223,70,.04) 0%,transparent 70%)", top: "40%", left: "40%", filter: "blur(120px)" }} />

        <div className="max-w-[1400px] mx-auto w-full relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-20">
          <div className="flex-1 max-w-[600px] w-full text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-[#8888A0] mb-6 md:mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#A3DF46] animate-[blink_2s_ease-in-out_infinite]" />
              <span>2026년 Seed 투자 유치 — 서울·경기 관객권</span>
            </div>

            <h1 className="text-[clamp(2.5rem,8vw,7.5rem)] font-black leading-[1.1] tracking-[-2px] md:tracking-[-3px] mb-4 md:mb-5 overflow-hidden">
              <span className="block animate-[line-reveal_0.9s_cubic-bezier(.16,1,.3,1)_forwards] mb-2 md:mb-4" style={{ transform: "translateY(110%)", opacity: 0 }}>마지막까지</span>
              <span className="block animate-[line-reveal_0.9s_cubic-bezier(.16,1,.3,1)_forwards] text-[#A3DF46]" style={{ transform: "translateY(110%)", opacity: 0, animationDelay: "0.15s" }}>품어드립니다</span>
            </h1>

            <p className="text-sm md:text-lg text-[#8888A0] leading-[1.7] mb-8 md:mb-12 animate-[fade-up_0.9s_0.3s_ease_forwards]" style={{ opacity: 0 }}>
              포온 (Po-On) — 반려동물 장례 전문 에이전시 플랫폼<br />
              슬픔의 순간, 투명하고 신뢰할 수 있는 장례 서비스를 연결합니다
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start animate-[fade-up_0.9s_0.45s_ease_forwards]" style={{ opacity: 0 }}>
              <button className="px-6 md:px-9 py-3 md:py-4 bg-[#A3DF46] text-[#0D0D14] font-bold text-sm rounded-2xl transition-all hover:bg-[#BEF16E] hover:translate-y-[-2px] shadow-[0_0_40px_rgba(163,223,70,.25)]">
                사업계획서 보기
              </button>
              <button className="px-6 md:px-9 py-3 md:py-4 border border-white/15 text-white text-sm rounded-2xl bg-transparent transition-all hover:bg-white/5 hover:translate-y-[-2px]">
                연락하기
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-8 md:mt-12" ref={counterRef}>
              {[
                { target: 7000, suffix: "만원", label: "Seed 목표 자금" },
                { target: 3000, suffix: "억", label: "국내 장례 시장 규모" },
                { target: 15, suffix: "%+", label: "연평균 성장률" },
                { target: 3, suffix: "분", label: "앱 예약 소요 시간" },
              ].map((m, i) => (
                <div key={i} className="p-3 md:p-4 rounded-[16px] bg-white/4 border border-white/8 transition-all hover:bg-white/7 hover:border-[rgba(163,223,70,.2)]">
                  <div className="text-lg md:text-xl font-black text-[#A3DF46] tracking-[-1px]">
                    <span className="counter" data-target={m.target} data-suffix={m.suffix}>0</span>
                  </div>
                  <div className="text-xs text-[#8888A0] mt-1">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex-shrink-0 hidden lg:block">
            <div className="absolute -top-8 -right-4 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl border border-[rgba(163,223,70,.3)] text-[#A3DF46] bg-[rgba(163,223,70,.15)] animate-[float_6s_ease-in-out_infinite] z-20" style={{ animationDelay: "0s" }}>
              펫장례 24시간
            </div>
            <div className="absolute -top-4 -left-16 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl border border-white/15 text-[#8888A0] animate-[float_7s_ease-in-out_infinite] z-20" style={{ animationDelay: "1.2s" }}>
              AI 펫로스 케어
            </div>
            <div className="absolute -bottom-8 -right-8 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl border border-[rgba(163,223,70,.3)] text-[#A3DF46] bg-[rgba(163,223,70,.15)] animate-[float_6s_ease-in-out_infinite] z-20" style={{ animationDelay: "2.5s" }}>
              3분 예약
            </div>
            <div className="absolute -bottom-4 -left-20 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-xl border border-white/15 text-[#8888A0] animate-[float_8s_ease-in-out_infinite] z-20" style={{ animationDelay: "0.7s" }}>
              투명 가격 공시
            </div>

            <div className="relative w-[280px] h-[560px] rounded-[40px] bg-gradient-to-b from-[#1E1E2A] to-[#12121E] border border-white/20 shadow-[0_40px_80px_rgba(0,0,0,.5),0_0_60px_rgba(163,223,70,.1)] overflow-hidden animate-[fade-up_0.9s_0.3s_ease_forwards]" style={{ opacity: 0 }}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[28px] bg-[#0D0D14] rounded-b-2xl z-10" />
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-[8px] h-[8px] rounded-full bg-[#A3DF46] opacity-80" />
              
              <div className="pt-12 px-5">
                <div className="text-center mb-6">
                  <div className="text-3xl font-black tracking-[-1px] mb-1">
                    <span className="text-white">Po-</span><span className="text-[#A3DF46]">On</span>
                  </div>
                  <div className="text-[10px] text-[#8888A0]">마지막까지, 품어드립니다</div>
                </div>

                <div className="bg-[rgba(163,223,70,.1)] border border-[rgba(163,223,70,.3)] rounded-2xl p-4 mb-4">
                  <div className="text-xs text-[#A3DF46] font-bold mb-2">🐾 즉시 예약</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8888A0]">예약 시간</span>
                      <span className="text-white font-medium">지금</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-[#8888A0]">예상 비용</span>
                      <span className="text-[#A3DF46] font-bold">₩ 280,000~</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#A3DF46]/20 flex items-center justify-center text-sm">🏛️</div>
                    <div>
                      <div className="text-xs font-bold text-white">서울 장례식장</div>
                      <div className="text-[10px] text-[#8888A0]">신규 파트너 · 즉시 예약</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-3 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#6699ff]/20 flex items-center justify-center text-sm">💜</div>
                    <div>
                      <div className="text-xs font-bold text-white">AI 펫로스 케어</div>
                      <div className="text-[10px] text-[#8888A0]">24시간 심리 지원</div>
                    </div>
                  </div>
                </div>

                <div className="bg-[rgba(163,223,70,.15)] rounded-2xl p-3 text-center">
                  <div className="text-xs text-[#A3DF46] font-bold">✓ 예약 확정</div>
                  <div className="text-[10px] text-[#8888A0] mt-1">SMS로 확인서 발송 완료</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[0.65rem] tracking-[0.2em] uppercase text-[#8888A0]">Scroll</span>
          <div className="w-[18px] h-[28px] border border-white/30 rounded-full flex justify-center pt-1">
            <div className="w-0.5 h-2 bg-[#A3DF46] rounded-full animate-[scroll-bounce_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </section>

      <section id="brand" className="relative z-10 bg-[#12121E]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="mb-4">
            <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">01 / Brand Identity</div>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-4">브랜드<br />아이덴티티</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div>
              <p className="text-[#8888A0] leading-[1.75] max-w-[540px] mb-6">
                <strong className="text-white">"품다(抱)"</strong>와 <strong className="text-white">"온기(溫)"</strong>의 합성어.<br />
                반려동물의 마지막 순간을 따뜻하게 안아준다는 의미를 담았습니다.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-8 lg:mb-10">
                {["신뢰", "투명", "전문", "따뜻함", "존엄"].map((kw) => (
                  <span key={kw} className="px-4 py-2 rounded-full border border-[rgba(163,223,70,.3)] bg-[rgba(163,223,70,.07)] text-[#A3DF46] text-sm font-medium transition-all hover:bg-[rgba(163,223,70,.15)] hover:scale-[1.05]">
                    {kw}
                  </span>
                ))}
              </div>
              <div className="mt-8 lg:mt-10 p-6 lg:p-12 bg-[#1E1E2A] rounded-[28px] border border-white/6 text-center">
                <div className="text-3xl lg:text-5xl font-black tracking-[-2px] lg:tracking-[-3px] leading-1">
                  <span className="text-white">Po-</span><span className="text-[#A3DF46]">On</span>
                </div>
                <div className="text-xl lg:text-2xl text-[#8888A0] mt-4 lg:mt-8">포온</div>
                <div className="text-sm text-[#8888A0] tracking-[0.15em] mt-4 lg:mt-6">마지막까지, 품어드립니다</div>
              </div>
            </div>

            <div>
              <div className="text-sm text-[#8888A0] mb-5 font-semibold">컬러 시스템</div>
              <div className="grid grid-cols-4 lg:grid-cols-2 gap-3 lg:gap-4">
                {[
                  { name: "Deep Navy", color: "#0D0D14", hex: "#0D0D14" },
                  { name: "Warm Beige", color: "#E8DED1", hex: "#E8DED1" },
                  { name: "Poon Lime", color: "#A3DF46", hex: "#A3DF46" },
                  { name: "Soft White", color: "#F5F5F7", hex: "#F5F5F7" },
                ].map((sw) => (
                  <div key={sw.name}>
                    <div className="h-14 lg:h-20 rounded-xl lg:rounded-2xl border border-white/10" style={{ backgroundColor: sw.color }} />
                    <div className="text-xs lg:text-sm text-[#8888A0] mt-2">{sw.name}</div>
                    <div className="text-[10px] lg:text-xs text-white/30 font-mono">{sw.hex}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 lg:mt-7 p-4 lg:p-6 bg-[#1E1E2A] rounded-[20px] border border-white/6">
                <div className="text-xs text-[#8888A0] mb-4 font-semibold">타이포그래피</div>
                <div className="text-lg lg:text-xl font-black text-white tracking-[-1px] mb-1">Po-On 포온</div>
                <div className="text-sm text-[#8888A0]">Noto Sans KR</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="problem" className="relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">02 / Problem & Solution</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-8 md:mb-16">시장 문제와<br />포온의 해결책</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4 md:mb-5">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[rgba(255,80,80,.15)] text-[#ff7070] flex items-center justify-center text-sm font-bold">✕</div>
                <span className="font-bold text-sm md:text-base">보호자가 겪는 5가지 고통</span>
              </div>
              {[
                { num: "01", title: "정보 불투명", desc: "업체마다 가격이 천차만별, 슬픔이 극심한 순간 여러 곳에 전화해 견적 비교" },
                { num: "02", title: "불편한 예약 방식", desc: "전화 중심, 영업시간 외 연락 불가. 새벽 임종 시 아침까지 기다려야" },
                { num: "03", title: "품질 불균일", desc: "업체 수준 사전 파악 방법 없음, 신뢰할 수 있는 후기 시스템 부재" },
                { num: "04", title: "장례 후 공백", desc: "서비스가 끊기고 펫로스 증후군에 대한 심리 지원 전무" },
                { num: "05", title: "절차 이해 부족", desc: "화장·매장·수목장 차이를 모르고 결정, 이후 후회하는 경우 다수" },
              ].map((p, i) => (
                <div key={i} className="p-4 md:p-5 rounded-[16px] md:rounded-[18px] border border-white/7 bg-white/3 mb-2 md:mb-3 transition-all hover:translate-x-1.5 hover:border-[rgba(255,80,80,.2)] hover:bg-[rgba(255,80,80,.04)]">
                  <div className="text-xs font-bold text-[#8888A0] mb-1">{p.num}</div>
                  <div className="text-sm font-bold text-white mb-1">{p.title}</div>
                  <div className="text-xs text-[#8888A0] leading-[1.55]">{p.desc}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center gap-2.5 mb-4 md:mb-5">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-[rgba(163,223,70,.15)] text-[#A3DF46] flex items-center justify-center text-sm font-bold">✓</div>
                <span className="font-bold text-sm md:text-base">포온의 5가지 해결책</span>
              </div>
              {[
                { num: "01", title: "투명 가격 비교", desc: "항목별 가격 상세 표시, 숨은 비용 제로. 파트너 장례식장 실시간 견적" },
                { num: "02", title: "24시간 즉시 예약", desc: "전화 없이 앱/웹에서 3분 완료. 심야·새벽 예약도 즉시 처리" },
                { num: "03", title: "파트너 품질 인증", desc: "100항목 현장 실사 후 포온 인증 마크 부여. 분기별 품질 점검" },
                { num: "04", title: "AI 펫로스 케어", desc: "24시간 AI 챗봇 심리 케어 + 전문 상담사 연결. 디지털 추모관 운영" },
                { num: "05", title: "실시간 진행 알림", desc: "화장 시작→진행→완료→유골 인도까지 단계별 SMS·앱 푸시 알림" },
              ].map((s, i) => (
                <div key={i} className="p-4 md:p-5 rounded-[16px] md:rounded-[18px] border border-[rgba(163,223,70,.2)] bg-[rgba(163,223,70,.03)] mb-2 md:mb-3 transition-all hover:translate-x-1.5 hover:border-[rgba(163,223,70,.25)] hover:bg-[rgba(163,223,70,.05)]">
                  <div className="text-xs font-bold text-[#A3DF46] mb-1">{s.num}</div>
                  <div className="text-sm font-bold text-white mb-1">{s.title}</div>
                  <div className="text-xs text-[#8888A0] leading-[1.55]">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="market" className="relative z-10 bg-[#12121E]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">03 / Market Analysis</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-4">시장 분석</h2>
          <p className="text-[#8888A0] leading-[1.75] max-w-[540px] mb-8 md:mb-12">
            반려동물 시장의 성장과 함께 장례 서비스 시장도 빠르게 확장되고 있습니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
            {[
              { target: 6, suffix: "조+", label: "국내 반려동물 전체 시장 (2026)", sub: "연평균 12% 성장" },
              { target: 3000, suffix: "억", label: "국내 반려동물 장례 시장", sub: "연평균 15%+ 성장" },
              { target: 1500, suffix: "억", label: "수도권 장례 시장", sub: "초기 집중 공략 대상" },
            ].map((s, i) => (
              <div key={i} className="p-5 md:p-9 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/6 to-white/2 border border-white/8 text-center transition-all hover:-translate-y-1 hover:border-[rgba(163,223,70,.2)] group">
                <div className="text-2xl md:text-3xl font-black tracking-[-1px] md:tracking-[-2px] mb-1">
                  <span className="counter" data-target={s.target} data-suffix={s.suffix}>0</span>
                </div>
                <div className="text-xs md:text-sm text-[#8888A0]">{s.label}</div>
                <div className="text-[10px] md:text-xs text-white/20 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {[
              { pct: "76.8%", text: "반려견 보호자가 향후 별도 장례 서비스 이용 의향 있음" },
              { pct: "71.5%", text: "반려묘 보호자가 향후 별도 장례 서비스 이용 의향 있음" },
              { pct: "2.4x", text: "1인당 장례 소비액 5년 만에 11만원 → 26만원 증가" },
              { pct: "14.7%", text: "온라인 예약 플랫폼 CAGR — 가장 빠르게 성장하는 채널" },
            ].map((ins, i) => (
              <div key={i} className="flex items-center gap-3 md:gap-5 p-4 md:p-5 rounded-[14px] md:rounded-[18px] bg-white/4 border border-white/7 transition-all hover:-translate-y-1 hover:bg-white/7">
                <div className="text-lg md:text-xl font-black text-[#A3DF46] whitespace-nowrap min-w-[60px] md:min-w-[80px] tracking-[-1px]">{ins.pct}</div>
                <div className="text-xs md:text-sm text-[#8888A0] leading-[1.5]">{ins.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 md:mt-15 p-6 md:p-10 bg-[#1E1E2A] rounded-2xl md:rounded-3xl border border-white/6">
            <div className="text-sm font-bold text-white mb-4 md:mb-6">📈 시장 성장 동인</div>
            {[
              { label: "1인 가구·고령화 증가 → 반려동물 가족화", level: "매우 높음", width: 92 },
              { label: "디지털 네이티브 반려인 증가", level: "높음", width: 80 },
              { label: "펫로스 증후군 인식 확산", level: "높음", width: 74 },
              { label: "불법 매립 단속 강화 → 합법 장례 수요", level: "중간", width: 62 },
            ].map((g, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-xs text-[#8888A0] mb-2">
                  <span>{g.label}</span>
                  <span style={{ color: "var(--lime)" }}>{g.level}</span>
                </div>
                <div className="h-2 bg-white/6 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#A3DF46] to-[#BEF16E] growth-bar-fill" data-width={g.width} style={{ width: "0%", transition: "width 1.5s cubic-bezier(.16,1,.3,1)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="competition" className="relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">04 / Competition</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-4">경쟁사 분석</h2>
          <p className="text-[#8888A0] leading-[1.75] max-w-[540px] mb-8 md:mb-12">
            포포즈(펫닥)가 직영 장례식장 체인이라면, 포온은 관객권 모든 우수 장례식장을 한 곳에서 비교·예약하는 에이전시 플랫폼입니다.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">브랜드</th>
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">유형</th>
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">온라인 예약</th>
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">가격 투명성</th>
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">AI 케어</th>
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0]">수도권</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {[
                  { brand: "🟢 포온 (신규)", type: "에이전시 플랫폼", online: { text: "24시간", class: "bg-[rgba(163,223,70,.12)] text-[#A3DF46]" }, price: { text: "완전 공시", class: "bg-[rgba(163,223,70,.12)] text-[#A3DF46]" }, ai: { text: "AI 챗봇", class: "bg-[rgba(163,223,70,.12)] text-[#A3DF46]" }, coverage: { text: "파트너 15+", class: "bg-[rgba(163,223,70,.12)] text-[#A3DF46]" }, highlight: true },
                  { brand: "포포즈 (펫닥)", type: "직영 장례식장", online: { text: "앱 예약", class: "bg-[rgba(163,223,70,.12)] text-[#A3DF46]" }, price: { text: "부분 공시", class: "bg-[rgba(255,180,0,.1)] text-[#ffcc44]" }, ai: { text: "AI 추모", class: "bg-[rgba(255,180,0,.1)] text-[#ffcc44]" }, coverage: { text: "9개 직영점", class: "bg-[rgba(255,180,0,.1)] text-[#ffcc44]" }, highlight: false },
                  { brand: "펫포레스트", type: "장례식장", online: { text: "전화 중심", class: "bg-[rgba(255,80,80,.1)] text-[#ff8080]" }, price: { text: "불투명", class: "bg-[rgba(255,80,80,.1)] text-[#ff8080]" }, ai: { text: "없음", class: "bg-[rgba(255,80,80,.1)] text-[#ff8080]" }, coverage: { text: "일부", class: "bg-[rgba(255,180,0,.1)] text-[#ffcc44]" }, highlight: false },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-white/5 transition-colors hover:bg-white/[0.025] ${row.highlight ? "bg-[rgba(163,223,70,.03)]" : ""}`}>
                    <td className={`p-3 md:p-4 ${row.highlight ? "text-[#A3DF46] font-bold" : "text-[#8888A0]"}`}>{row.brand}</td>
                    <td className="p-3 md:p-4 text-[#8888A0]">{row.type}</td>
                    <td className="p-3 md:p-4"><span className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${row.online.class}`}>{row.online.text}</span></td>
                    <td className="p-3 md:p-4"><span className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${row.price.class}`}>{row.price.text}</span></td>
                    <td className="p-3 md:p-4"><span className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${row.ai.class}`}>{row.ai.text}</span></td>
                    <td className="p-3 md:p-4"><span className={`inline-block px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold ${row.coverage.class}`}>{row.coverage.text}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="model" className="relative z-10 bg-[#12121E]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">05 / Business Model</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-8 md:mb-12">비즈니스 모델</h2>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0 p-5 md:p-9 bg-[#1E1E2A] rounded-2xl md:rounded-3xl border border-white/6 mb-8 md:mb-10">
            <div className="flex-1 text-center p-4 md:p-5">
              <div className="text-xl md:text-2xl mb-2">🐾</div>
              <div className="text-sm font-bold text-white mb-1">반려인 보호자</div>
              <div className="text-xs text-[#8888A0] leading-[1.5]">슬픔 속에서 신뢰할 수 있는 장례 서비스 탐색</div>
            </div>
            <div className="text-[#A3DF46] opacity-50 text-lg md:text-xl px-2">→</div>
            <div className="flex-1 text-center p-4 md:p-5 bg-[rgba(163,223,70,.08)] border border-[rgba(163,223,70,.2)] rounded-[16px] md:rounded-[20px]">
              <div className="text-xl md:text-2xl mb-2">📱</div>
              <div className="text-sm font-bold text-[#A3DF46] mb-1">포온 플랫폼</div>
              <div className="text-xs text-[#8888A0] leading-[1.5]">비교·예약·알림·케어<br />수수료 수취</div>
            </div>
            <div className="text-[#A3DF46] opacity-50 text-lg md:text-xl px-2">→</div>
            <div className="flex-1 text-center p-4 md:p-5">
              <div className="text-xl md:text-2xl mb-2">🏛️</div>
              <div className="text-sm font-bold text-white mb-1">파트너 장례식장</div>
              <div className="text-xs text-[#8888A0] leading-[1.5]">인증된 합법 장묘업체<br />서비스 직접 제공</div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-3.5 mb-8 md:mb-10">
            {[
              { pct: "65%", title: "중개 수수료", desc: "예약 1건당 거래액의 15~18%", color: "#A3DF46" },
              { pct: "10%", title: "프리미엄 노출", desc: "월 5~15만원 파트너 구독", color: "#6699ff" },
              { pct: "15%", title: "추모품 커머스", desc: "유골함·메모리얼 스톤, 35% 마진", color: "#cc88ff" },
              { pct: "5%", title: "AI 구독", desc: "월 9,900원 심리 케어", color: "#ff9944" },
              { pct: "5%", title: "B2B 소개료", desc: "동물병원 건당 1~3만원", color: "#ff6699" },
            ].map((r, i) => (
              <div key={i} className="p-4 md:p-6 rounded-[16px] md:rounded-[20px] bg-white/4 border border-white/7 text-center relative overflow-hidden transition-all hover:-translate-y-1">
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: r.color }} />
                <div className="text-lg md:text-xl font-black tracking-[-1px] mb-1 md:mb-2" style={{ color: r.color }}>{r.pct}</div>
                <div className="text-xs font-bold text-white mb-1.5">{r.title}</div>
                <div className="text-xs text-[#8888A0] leading-[1.5]">{r.desc}</div>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-10 bg-gradient-to-br from-[rgba(163,223,70,.08)] to-[rgba(163,223,70,.02)] border border-[rgba(163,223,70,.2)] rounded-2xl md:rounded-3xl">
            <div className="text-sm font-bold text-[#A3DF46] mb-4 md:mb-7">💰 단위 경제 — 평균 거래 1건 기준</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 items-center">
              <div>
                <div className="text-xs text-[#8888A0] mb-3 md:mb-4">수익 내역</div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/6 text-xs md:text-sm">
                    <span className="text-[#8888A0]">평균 거래금액</span>
                    <span className="text-white font-bold">400,000원</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/6 text-xs md:text-sm">
                    <span className="text-[#8888A0]">중개 수수료 (17%)</span>
                    <span className="text-[#A3DF46]">+68,000원</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/6 text-xs md:text-sm">
                    <span className="text-[#8888A0]">추모품 (35%×6만원)</span>
                    <span className="text-[#A3DF46]">+21,000원</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/6 text-xs md:text-sm">
                    <span className="text-[#8888A0]">B2B 소개료 (20%)</span>
                    <span className="text-[#A3DF46]">+5,000원</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-xs md:text-sm">
                    <span className="text-[#8888A0]">변동 비용</span>
                    <span className="text-[#ff7070]">-8,000원</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center text-2xl text-[#8888A0]">=</div>
              <div className="text-center p-6 md:p-8 bg-black/30 rounded-[16px] md:rounded-[20px]">
                <div className="text-xs text-[#8888A0] mb-2">거래당 순기여 마진</div>
                <div className="text-2xl md:text-3xl font-black text-[#A3DF46] tracking-[-1px] md:tracking-[-2px]">86<span className="text-sm text-[#8888A0]">,000원</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="financial" className="relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">06 / Financial</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-8 md:mb-12">재무 계획</h2>

          <div className="overflow-x-auto mb-6 bg-[#1E1E2A] rounded-2xl md:rounded-3xl border border-white/6">
            <table className="w-full border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#8888A0] bg-white/3">구분</th>
                  <th className="text-right p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] bg-white/3">1년차</th>
                  <th className="text-right p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] bg-white/3">2년차</th>
                  <th className="text-right p-3 md:p-4 text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] bg-white/3">3년차</th>
                </tr>
              </thead>
              <tbody className="text-xs md:text-sm">
                {[
                  { label: "월 평균 예약 건수", v1: "65건", v2: "140건", v3: "230건", highlight: false, profit: false },
                  { label: "평균 거래금액", v1: "42만원", v2: "45만원", v3: "48만원", highlight: false, profit: false },
                  { label: "연간 총 거래액", v1: "3.3억원", v2: "7.6억원", v3: "13.2억원", highlight: false, profit: false },
                  { label: "총 플랫폼 수익", v1: "6,700만원", v2: "1.61억원", v3: "2.89억원", highlight: true, profit: false },
                  { label: "총 운영 비용", v1: "2.44억원", v2: "2.84억원", v3: "4.0억원", highlight: false, profit: false },
                  { label: "영업이익", v1: "▼ 1.74억원", v2: "▼ 1.23억원", v3: "▲ 8,900만원", highlight: false, profit: true },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-white/4 hover:bg-white/2 transition-colors ${row.highlight ? "bg-white/2" : ""}`}>
                    <td className={`p-3 md:p-4 ${row.highlight ? "text-white font-medium" : "text-[#8888A0]"}`}>{row.label}</td>
                    <td className={`text-right p-3 md:p-4 ${row.profit ? (row.v1.startsWith("▼") ? "text-[#ff7070] font-bold" : "text-[#A3DF46] font-bold") : "text-[#8888A0]"}`}>{row.v1}</td>
                    <td className={`text-right p-3 md:p-4 ${row.profit ? (row.v2.startsWith("▼") ? "text-[#ff7070] font-bold" : "text-[#A3DF46] font-bold") : "text-[#8888A0]"}`}>{row.v2}</td>
                    <td className={`text-right p-3 md:p-4 ${row.profit ? (row.v3.startsWith("▼") ? "text-[#ff7070] font-bold" : "text-[#A3DF46] font-bold") : "text-[#8888A0]"}`}>{row.v3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-12">
            <div className="p-8 rounded-[22px] bg-white/4 border border-white/8">
              <div className="text-xs text-[#8888A0] mb-3">손익분기점 (BEP)</div>
              <div className="text-2xl font-black text-white">월 <span className="text-[#A3DF46]">약 100건</span></div>
              <div className="text-xs text-[#8888A0] mt-2">구독·B2B·추모품 수익 포함 시</div>
            </div>
            <div className="p-6 md:p-8 rounded-[18px] md:rounded-[22px] bg-white/4 border border-white/8">
              <div className="text-xs text-[#8888A0] mb-2 md:mb-3">BEP 예상 시점</div>
              <div className="text-lg md:text-xl font-black text-white">사업 개시 후 <span className="text-[#A3DF46]">18~24개월</span></div>
              <div className="text-xs text-[#8888A0] mt-2">2028년 상반기 목표</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-white mb-4 md:mb-5">Seed 7,000만원 사용 계획</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { amount: "2,800만원", desc: "플랫폼 개발 (MVP + 앱)", pct: "40%" },
                { amount: "1,500만원", desc: "초기 마케팅 (6개월)", pct: "21%" },
                { amount: "1,500만원", desc: "운영 준비금 (6개월 인건비)", pct: "21%" },
                { amount: "400만원", desc: "브랜드 디자인 (CI/BI)", pct: "6%" },
                { amount: "300만원", desc: "파트너십 구축", pct: "4%" },
                { amount: "500만원", desc: "법인 설립 + 법무 + 예비비", pct: "7%" },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 md:gap-4 p-3 md:p-4.5 rounded-[14px] md:rounded-[16px] bg-white/4 border border-white/7 items-center transition-all hover:border-[rgba(163,223,70,.2)]">
                  <div className="text-sm md:text-base font-black text-[#A3DF46] whitespace-nowrap min-w-[70px] md:min-w-[90px] tracking-[-0.5px]">{s.amount}</div>
                  <div>
                    <div className="text-xs md:text-sm text-white">{s.desc}</div>
                    <div className="text-[10px] md:text-xs text-[#8888A0]">{s.pct}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="roadmap" className="relative z-10 bg-[#12121E]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">07 / Roadmap</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-8 md:mb-12">실행 로드맵</h2>

          <div className="hidden md:block relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#A3DF46] via-[rgba(163,223,70,.2)] to-white/5 -translate-x-1/2" />

            {[
              { quarter: "2026 Q2~Q3", title: "창업 및 MVP 런칭", desc: "법인 설립, 브랜드 등록\n웹 MVP 베타 오픈\n파트너 장례식장 15곳 계약", status: "active" },
              { quarter: "2026 Q4", title: "앱 출시 + 추모관", desc: "iOS/Android 앱 런칭\n디지털 추모관 서비스\n동물병원 제휴 30곳 달성", status: "planned", right: true },
              { quarter: "2027 Q1~Q2", title: "AI 서비스 + B2B", desc: "AI 펫로스 케어 챗봇 출시\n동물병원 B2B 포털 오픈\n보험사 제휴 1곳 이상", status: "planned" },
              { quarter: "2027 Q3~Q4", title: "지역 확장 + BEP 도달", desc: "인천·경기 북부 파트너 확대\n월 180건+, BEP 근접\n구독 가입자 500명+", status: "planned", right: true },
              { quarter: "2028 이후", title: "전국 스케일업", desc: "전국 5대 도시 확장\n시리즈 A 투자 유치 (15~30억원)\n일본 시장 파일럿 검토", status: "future" },
            ].map((rm, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr] gap-12 items-center mb-12 relative">
                <div className={`text-right pr-8 ${rm.right ? "opacity-0 pointer-events-none" : ""}`}>
                  <div className="text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] mb-2">{rm.quarter}</div>
                  <div className="text-base font-bold text-white mb-2">{rm.title}</div>
                  <div className="text-xs text-[#8888A0] leading-[1.6] whitespace-pre-line">{rm.desc}</div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10 absolute left-1/2 -translate-x-1/2 ${rm.status === "active" ? "bg-[#A3DF46] text-[#0D0D14] border-[#A3DF46] shadow-[0_0_30px_rgba(163,223,70,.4)]" : rm.status === "planned" ? "bg-[#12121E] text-[#8888A0] border-white/20" : "bg-[#12121E] text-white/20 border-white/8"}`}>
                  {i + 1}
                </div>
                <div className={`text-left pl-8 ${rm.right ? "" : "opacity-0 pointer-events-none"}`}>
                  <div className="text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] mb-2">{rm.quarter}</div>
                  <div className="text-base font-bold text-white mb-2">{rm.title}</div>
                  <div className="text-xs text-[#8888A0] leading-[1.6] whitespace-pre-line">{rm.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-4">
            {[
              { quarter: "2026 Q2~Q3", title: "창업 및 MVP 런칭", desc: "법인 설립, 브랜드 등록\n웹 MVP 베타 오픈\n파트너 장례식장 15곳 계약", status: "active" },
              { quarter: "2026 Q4", title: "앱 출시 + 추모관", desc: "iOS/Android 앱 런칭\n디지털 추모관 서비스\n동물병원 제휴 30곳 달성", status: "planned" },
              { quarter: "2027 Q1~Q2", title: "AI 서비스 + B2B", desc: "AI 펫로스 케어 챗봇 출시\n동물병원 B2B 포털 오픈\n보험사 제휴 1곳 이상", status: "planned" },
              { quarter: "2027 Q3~Q4", title: "지역 확장 + BEP 도달", desc: "인천·경기 북부 파트너 확대\n월 180건+, BEP 근접\n구독 가입자 500명+", status: "planned" },
              { quarter: "2028 이후", title: "전국 스케일업", desc: "전국 5대 도시 확장\n시리즈 A 투자 유치 (15~30억원)\n일본 시장 파일럿 검토", status: "future" },
            ].map((rm, i) => (
              <div key={i} className={`p-4 rounded-2xl border ${rm.status === "active" ? "bg-[rgba(163,223,70,.08)] border-[rgba(163,223,70,.3)]" : "bg-white/4 border-white/7"}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${rm.status === "active" ? "bg-[#A3DF46] text-[#0D0D14] border-[#A3DF46]" : "bg-[#12121E] text-[#8888A0] border-white/20"}`}>
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46]">{rm.quarter}</div>
                    <div className="text-base font-bold text-white">{rm.title}</div>
                  </div>
                </div>
                <div className="text-xs text-[#8888A0] leading-[1.6] whitespace-pre-line pl-[52px]">{rm.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="team" className="relative z-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-16 md:py-[100px]">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">08 / Team</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-4">필요 팀 구성</h2>
          <p className="text-[#8888A0] leading-[1.75] max-w-[540px] mb-8 md:mb-12">
            창업 초기 핵심 6인 체제로 운영하며, 개발은 외주 에이전시와 협업합니다.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { role: "CEO", name: "대표", exp: "전략·파트너십·투자 유치. 반려동물 업계 또는 스타트업 경험 보유자.", icon: "👤" },
              { role: "CTO", name: "기술 책임", exp: "플랫폼 설계·외주 관리. 풀스택 5년+ 또는 스타트업 CTO 경험.", icon: "💻" },
              { role: "CMO", name: "마케팅 책임", exp: "퍼포먼스 마케팅·SNS·콘텐츠. 디지털 광고 3년+ 경험.", icon: "📣" },
              { role: "COO", name: "운영·CS 리드", exp: "파트너 관리·고객 응대. 서비스업 또는 O2O 운영 경험.", icon: "🤝" },
            ].map((t, i) => (
              <div key={i} className="p-5 md:p-7 rounded-[18px] md:rounded-[22px] bg-white/4 border border-white/7 text-center transition-all hover:-translate-y-2 hover:border-[rgba(163,223,70,.2)] hover:bg-[rgba(163,223,70,.04)]">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-[16px] md:rounded-[20px] bg-gradient-to-br from-[rgba(163,223,70,.2)] to-[rgba(163,223,70,.05)] flex items-center justify-center text-lg md:text-xl mx-auto mb-3 md:mb-4">{t.icon}</div>
                <div className="text-xs font-bold tracking-[0.1em] uppercase text-[#A3DF46] mb-1">{t.role}</div>
                <div className="text-sm font-bold text-white mb-1 md:mb-2">{t.name}</div>
                <div className="text-[10px] md:text-xs text-[#8888A0] leading-[1.55]">{t.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

      <section id="invest" className="relative z-10 text-center py-16 md:py-[120px] px-4">
        <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-6 md:mb-8">09 / Business Plan</div>
        <div className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-[-2px] md:tracking-[-3px] leading-[1.2] mb-6 md:mb-8">
          사업<span className="text-[#A3DF46]">계획</span>서
        </div>
        <p className="text-base md:text-lg text-[#8888A0] mb-10 md:mb-20 leading-relaxed">포온과 함께 반려동물 장례 시장을 바꿉니다</p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center">
          <button className="px-8 md:px-12 py-4 md:py-5 bg-[#A3DF46] text-[#0D0D14] font-bold rounded-2xl transition-all hover:bg-[#BEF16E] hover:translate-y-[-2px] shadow-[0_0_40px_rgba(163,223,70,.25)]">
            사업계획 미팅 신청
          </button>
          <button className="px-8 md:px-12 py-4 md:py-5 border border-white/15 text-white rounded-2xl bg-transparent transition-all hover:bg-white/5 hover:translate-y-[-2px]">
            사업계획서 요청
          </button>
        </div>
      </section>

      <section id="contact" className="relative z-10 bg-[#12121E] py-12 md:py-[60px]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10">
          <div className="text-xs tracking-[0.2em] uppercase text-[#A3DF46] font-bold mb-4">10 / Contact</div>
          <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-black leading-[1.05] tracking-[-1px] md:tracking-[-1.5px] mb-8 md:mb-12">연락처</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {[
              { label: "회사명", value: "포온 (Po-On)" },
              { label: "이메일", value: "contact@poon.co.kr" },
              { label: "서비스 지역", value: "서울·경기 관객권" },
            ].map((c, i) => (
              <div key={i} className="p-5 md:p-8 rounded-[18px] md:rounded-[22px] bg-white/4 border border-white/7 text-center transition-all hover:-translate-y-1 hover:border-[rgba(163,223,70,.2)]">
                <div className="text-xs text-[#8888A0] mb-2 md:mb-2.5">{c.label}</div>
                <div className="text-sm md:text-base font-bold text-white">{c.value}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#8888A0] mt-7 md:mt-9">
            본 투자 제안서는 내부 검토 및 투자 유치용입니다. 모든 수치는 추정치이며 실제 결과와 다를 수 있습니다.
          </p>
        </div>
      </section>

      <footer className="px-4 md:px-10 py-6 md:py-8 border-t border-white/6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-xl font-black tracking-[-1px]">
          <span className="text-white">Po-</span><span className="text-[#A3DF46]">On</span>
        </div>
        <div className="text-sm text-[#8888A0]">© 2026 Po-On. All rights reserved.</div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.8deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes line-reveal {
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
