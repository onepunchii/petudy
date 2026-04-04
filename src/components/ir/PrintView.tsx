"use client";

import { useState, useEffect, useRef } from "react";

const SECTIONS = [
  { id: "hero", title: "Po-On" },
  { id: "brand", title: "브랜드" },
  { id: "problem", title: "Problem" },
  { id: "market", title: "시장" },
  { id: "competition", title: "경쟁" },
  { id: "model", title: "모델" },
  { id: "financial", title: "재무" },
  { id: "roadmap", title: "로드맵" },
  { id: "team", title: "팀" },
  { id: "invest", title: "사업계획" },
  { id: "contact", title: "연락처" },
];

export default function PrintView({ onClose }: { onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentIdx((p) => Math.min(p + 1, SECTIONS.length - 1));
      if (e.key === "ArrowLeft") setCurrentIdx((p) => Math.max(p - 1, 0));
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (contentRef.current) {
      const section = SECTIONS[currentIdx];
      const original = document.getElementById(section.id);
      if (original) {
        contentRef.current.innerHTML = original.innerHTML;
        contentRef.current.scrollTop = 0;
      }
    }
  }, [currentIdx]);

  return (
    <div className="fixed inset-0 bg-[#0D0D14] z-[200] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0D0D14]">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span className="text-white font-medium">인쇄용 보기</span>
          <span className="text-[#8888A0] text-sm">{currentIdx + 1} / {SECTIONS.length}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#8888A0] text-sm">A4 비율로 확인 후 스크린샷/PDF 저장</span>
          <button onClick={() => window.print()} className="px-5 py-2.5 bg-[#A3DF46] text-[#0D0D14] font-bold rounded-xl hover:bg-[#BEF16E]">
            인쇄
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-hidden bg-[#1a1a24]">
        <div
          className="bg-[#0D0D14] border border-white/20 relative"
          style={{
            width: "min(90vw, calc(90vh * 297 / 210))",
            aspectRatio: "297 / 210",
          }}
        >
          <div
            ref={contentRef}
            className="absolute inset-0 overflow-auto"
            style={{ aspectRatio: "297 / 210" }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 py-3 bg-[#0D0D14] border-t border-white/10 overflow-x-auto">
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrentIdx(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              i === currentIdx ? "bg-[#A3DF46] text-[#0D0D14]" : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 py-3 border-t border-white/10 bg-[#0D0D14]">
        <button
          onClick={() => setCurrentIdx((p) => Math.max(p - 1, 0))}
          disabled={currentIdx === 0}
          className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20"
        >
          ← 이전
        </button>
        <span className="text-white font-medium min-w-[120px] text-center">{SECTIONS[currentIdx].title}</span>
        <button
          onClick={() => setCurrentIdx((p) => Math.min(p + 1, SECTIONS.length - 1))}
          disabled={currentIdx === SECTIONS.length - 1}
          className="px-5 py-2 bg-white/10 text-white rounded-lg disabled:opacity-30 hover:bg-white/20"
        >
          다음 →
        </button>
      </div>

      <style jsx global>{`
        @media print {
          body > * { display: none !important; }
        }
      `}</style>
    </div>
  );
}
