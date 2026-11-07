/**
 * 대표 이미지(og:image) 렌더러. 네이버·구글 검색 썸네일과 공유 미리보기에 쓰입니다.
 *  - 정사각형 1200x1200 (네이버 썸네일·구글 1x1), 와이드 1200x630 (X 카드)
 *  - 사이트와 같은 "먼저 떠나는 여행" 모양: 밤하늘 + 탑승권 카드. 장례 관련이라 라임은 쓰지 않습니다.
 *  - 페이지마다 글자와 별 배치(seed)가 달라 이미지가 서로 겹치지 않습니다(네이버 "고유 이미지" 기준).
 * 서버(Node 런타임) 전용. 글꼴은 src/assets/fonts 의 Pretendard 서브셋(OFL)을 읽습니다.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

const C = {
    night: "#0B1020",
    night2: "#141A2E",
    star: "#EEF1F6",
    star2: "#B4BCCB",
    star3: "#8C95A8",
    pass: "#FCFCFD",
    ink: "#10131A",
    ink2: "#454C5A",
    ink3: "#5F6674",
    perf: "#C9D0DB",
};

let fontsPromise: Promise<{ name: string; data: Buffer; weight: 500 | 600 | 800; style: "normal" }[]> | null = null;
function loadFonts() {
    fontsPromise ??= Promise.all(
        ([
            ["Medium", 500],
            ["SemiBold", 600],
            ["ExtraBold", 800],
        ] as const).map(async ([file, weight]) => ({
            name: "Pretendard",
            data: await readFile(join(process.cwd(), "src/assets/fonts", `Pretendard-${file}-subset.otf`)),
            weight,
            style: "normal" as const,
        })),
    );
    return fontsPromise;
}

/** 문자열 → 0~1 난수열 (같은 seed 는 늘 같은 별 배치) */
function rng(seed: string) {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.codePointAt(0)!, 16777619);
    return () => {
        h += 0x6d2b79f5;
        let t = h;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function Stars({ seed, width, height, count }: { seed: string; width: number; height: number; count: number }) {
    const r = rng(seed);
    const stars = Array.from({ length: count }, () => ({ x: r() * width, y: r() * height * 0.62, s: 1.5 + r() * 2.6, o: 0.25 + r() * 0.7 }));
    // 별자리: 밝은 별 5개를 이은 선 (위쪽 30% 안, 제목과 겹치지 않게)
    const bright = Array.from({ length: 5 }, (_, i) => ({ x: width * (0.55 + r() * 0.38), y: height * (0.05 + i * 0.045 + r() * 0.03) }));
    return (
        <div style={{ position: "absolute", left: 0, top: 0, width, height, display: "flex" }}>
            {stars.map((s, i) => (
                <div
                    key={i}
                    style={{ position: "absolute", left: s.x, top: s.y, width: s.s, height: s.s, borderRadius: 999, background: C.star, opacity: s.o }}
                />
            ))}
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 0 }}>
                <polyline
                    points={bright.map((b) => `${b.x.toFixed(1)},${b.y.toFixed(1)}`).join(" ")}
                    fill="none"
                    stroke={C.star3}
                    strokeOpacity="0.45"
                    strokeWidth="2"
                />
                {bright.map((b, i) => (
                    <circle key={i} cx={b.x} cy={b.y} r={i === 0 ? 6 : 4.5} fill={C.star} fillOpacity={i === 0 ? 1 : 0.85} />
                ))}
            </svg>
        </div>
    );
}

function Logo({ scale = 1 }: { scale?: number }) {
    const s = 52 * scale;
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 14 * scale }}>
            <svg width={s} height={s} viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="15" fill={C.star} />
                <path
                    d="M16 23.5c-4.4-2.9-7-5.6-7-8.7 0-2.2 1.6-3.8 3.6-3.8 1.4 0 2.6.8 3.4 2 .8-1.2 2-2 3.4-2 2 0 3.6 1.6 3.6 3.8 0 3.1-2.6 5.8-7 8.7Z"
                    fill={C.night}
                />
            </svg>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10 * scale }}>
                <span style={{ fontSize: 38 * scale, fontWeight: 800, color: C.star }}>포온</span>
                <span style={{ fontSize: 22 * scale, fontWeight: 600, color: C.star3 }}>po-on</span>
            </div>
        </div>
    );
}

function titleSize(title: string, base: number) {
    const n = title.replace(/\s/g, "").length;
    if (n <= 6) return base * 1.18;
    if (n <= 10) return base * 1.04;
    if (n <= 16) return base * 0.9;
    if (n <= 24) return base * 0.78;
    return base * 0.66;
}

export interface OgCard {
    /** 오른쪽 위 작은 알약 (예: "반려동물 장례식장") */
    kicker: string;
    /** 제목 위 장소 (예: "경기도 김포시") */
    place?: string;
    /** 큰 제목 (업체명, 지역명 등). 2~3줄 */
    title: string;
    /** 탑승권 본문: 작은 라벨 + 값 + 보조 줄 */
    passLabel: string;
    passValue: string;
    passNote?: string;
    /** 탑승권 절취선 너머 (예: 확인일) */
    stubLabel: string;
    stubValue: string;
    /** 별 배치 seed (페이지 경로) */
    seed: string;
}

export async function squareOg(card: OgCard) {
    const W = 1200;
    const H = 1200;
    const pad = 84;
    const cardW = W - pad * 2;
    const stubW = 270;
    const perfX = cardW - stubW;
    return new ImageResponse(
        (
            <div
                style={{
                    width: W,
                    height: H,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: pad,
                    background: `linear-gradient(180deg, ${C.night} 0%, ${C.night} 55%, ${C.night2} 100%)`,
                    fontFamily: "Pretendard",
                    position: "relative",
                }}
            >
                <Stars seed={card.seed} width={W} height={H} count={70} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Logo />
                    <div
                        style={{
                            display: "flex",
                            fontSize: 26,
                            fontWeight: 600,
                            color: C.star2,
                            border: "2px solid rgba(238,241,246,0.24)",
                            borderRadius: 999,
                            padding: "12px 26px",
                        }}
                    >
                        {card.kicker}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 40 }}>
                    {card.place && <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: C.star2 }}>{card.place}</div>}
                    <div
                        style={{
                            display: "flex",
                            fontSize: titleSize(card.title, 104),
                            fontWeight: 800,
                            color: C.star,
                            lineHeight: 1.16,
                            letterSpacing: "-0.03em",
                            wordBreak: "keep-all",
                            maxWidth: cardW,
                        }}
                    >
                        {card.title}
                    </div>
                </div>

                <div style={{ display: "flex", position: "relative", width: cardW, marginTop: 48 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 12,
                            width: perfX,
                            padding: "40px 44px",
                            background: C.pass,
                            borderRadius: "34px 0 0 34px",
                        }}
                    >
                        <span style={{ fontSize: 25, fontWeight: 600, color: C.ink3 }}>{card.passLabel}</span>
                        <span style={{ fontSize: 40, fontWeight: 800, color: C.ink, letterSpacing: "-0.02em" }}>{card.passValue}</span>
                        {card.passNote && <span style={{ fontSize: 27, fontWeight: 500, color: C.ink2 }}>{card.passNote}</span>}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: 10,
                            width: stubW,
                            padding: "40px 36px",
                            background: C.pass,
                            borderRadius: "0 34px 34px 0",
                            borderLeft: `3px dashed ${C.perf}`,
                        }}
                    >
                        <span style={{ fontSize: 24, fontWeight: 600, color: C.ink3 }}>{card.stubLabel}</span>
                        <span style={{ fontSize: 34, fontWeight: 800, color: C.ink }}>{card.stubValue}</span>
                    </div>
                    {/* 절취선 양 끝 반원 홈 */}
                    <div style={{ position: "absolute", left: perfX - 20, top: -20, width: 40, height: 40, borderRadius: 999, background: C.night2 }} />
                    <div style={{ position: "absolute", left: perfX - 20, bottom: -20, width: 40, height: 40, borderRadius: 999, background: C.night2 }} />
                </div>
            </div>
        ),
        { width: W, height: H, fonts: await loadFonts() },
    );
}

export async function wideOg(card: OgCard) {
    const W = 1200;
    const H = 630;
    const pad = 60;
    return new ImageResponse(
        (
            <div
                style={{
                    width: W,
                    height: H,
                    display: "flex",
                    padding: pad,
                    gap: 48,
                    background: C.night,
                    fontFamily: "Pretendard",
                    position: "relative",
                }}
            >
                <Stars seed={card.seed} width={W} height={H} count={46} />
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                    <Logo scale={0.85} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {card.place && <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: C.star2 }}>{card.place}</div>}
                        <div
                            style={{
                                display: "flex",
                                fontSize: titleSize(card.title, 70),
                                fontWeight: 800,
                                color: C.star,
                                lineHeight: 1.16,
                                letterSpacing: "-0.03em",
                                wordBreak: "keep-all",
                            }}
                        >
                            {card.title}
                        </div>
                    </div>
                    <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: C.star3 }}>{card.kicker}</div>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 12,
                        width: 360,
                        padding: "36px 34px",
                        background: C.pass,
                        borderRadius: 30,
                        alignSelf: "flex-end",
                    }}
                >
                    <span style={{ fontSize: 21, fontWeight: 600, color: C.ink3 }}>{card.passLabel}</span>
                    <span style={{ fontSize: 30, fontWeight: 800, color: C.ink }}>{card.passValue}</span>
                    {card.passNote && <span style={{ fontSize: 22, fontWeight: 500, color: C.ink2 }}>{card.passNote}</span>}
                    <div style={{ display: "flex", marginTop: 14, paddingTop: 16, borderTop: `3px dashed ${C.perf}`, gap: 12, alignItems: "baseline" }}>
                        <span style={{ fontSize: 20, fontWeight: 600, color: C.ink3 }}>{card.stubLabel}</span>
                        <span style={{ fontSize: 24, fontWeight: 800, color: C.ink }}>{card.stubValue}</span>
                    </div>
                </div>
            </div>
        ),
        { width: W, height: H, fonts: await loadFonts() },
    );
}
