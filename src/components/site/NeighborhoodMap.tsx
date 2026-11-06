import { dongLabel, type Region } from "@/lib/site/regions";

/**
 * 지역마다 모양이 다른 "우리 동네" 일러스트 지도.
 * 실제 지도가 아니라 지역 slug 로 시드를 고정한 도식이며, 생활권·동네·산책 장소를 한눈에 보여줍니다.
 * (실제 지도 API 를 붙이기 전까지 사진 대신 쓰는 지역 대표 이미지 역할)
 */
function rng(seed: string) {
    let a = [...seed].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 2166136261);
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const W = 600;
const H = 440;

export function NeighborhoodMap({ region, className, label }: { region: Region; className?: string; label?: string }) {
    const r = rng(region.slug);
    const cx = W / 2;
    const cy = H / 2 - 6;

    // 주요 도로 3~4개
    const mainRoads = Array.from({ length: 3 + Math.floor(r() * 2) }, (_, i) => {
        const ang = (i / 4) * Math.PI + r() * 0.5;
        const len = 520;
        const ox = cx + (r() - 0.5) * 160;
        const oy = cy + (r() - 0.5) * 120;
        return {
            x1: ox - Math.cos(ang) * len,
            y1: oy - Math.sin(ang) * len,
            x2: ox + Math.cos(ang) * len,
            y2: oy + Math.sin(ang) * len,
        };
    });

    // 골목 격자
    const tilt = (r() - 0.5) * 0.5;
    const minor: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = -6; i <= 6; i++) {
        const off = i * 46 + r() * 10;
        minor.push({
            x1: cx + off * Math.cos(tilt) - 400 * Math.sin(tilt),
            y1: cy + off * Math.sin(tilt) + 400 * Math.cos(tilt),
            x2: cx + off * Math.cos(tilt) + 400 * Math.sin(tilt),
            y2: cy + off * Math.sin(tilt) - 400 * Math.cos(tilt),
        });
        minor.push({
            x1: cx - 400 * Math.cos(tilt) - off * Math.sin(tilt),
            y1: cy - 400 * Math.sin(tilt) + off * Math.cos(tilt),
            x2: cx + 400 * Math.cos(tilt) - off * Math.sin(tilt),
            y2: cy + 400 * Math.sin(tilt) + off * Math.cos(tilt),
        });
    }

    // 강 (한강·큰 하천 접경 지역)
    const riverY = H - 70 - r() * 30;
    const river = `M -20 ${riverY + 30} C ${W * 0.25} ${riverY - 40 + r() * 30}, ${W * 0.6} ${riverY + 50 - r() * 30}, ${W + 20} ${riverY - 10} L ${W + 20} ${H + 20} L -20 ${H + 20} Z`;

    // 공원 (랜드마크 수만큼, 최대 3개)
    const parks = region.landmarks.slice(0, 3).map((name, i) => {
        const ang = r() * Math.PI * 2;
        const dist = 120 + r() * 70;
        const x = Math.min(W - 70, Math.max(70, cx + Math.cos(ang) * dist * 1.3));
        const y = Math.min((region.river ? riverY - 20 : H - 50), Math.max(60, cy + Math.sin(ang) * dist * 0.8));
        return { name, x, y, rx: 38 + r() * 26, ry: 22 + r() * 16, rot: r() * 60 - 30, i };
    });

    // 생활권 클러스터를 중심 둘레에 배치
    const n = region.areas.length;
    const start = r() * Math.PI * 2;
    const areas = region.areas.map((a, i) => {
        const ang = start + (i / n) * Math.PI * 2;
        const rx = n <= 2 ? 150 : 175;
        const ry = n <= 2 ? 95 : 115;
        const x = Math.min(W - 95, Math.max(95, cx + Math.cos(ang) * rx));
        const y = Math.min(H - 70, Math.max(56, cy + Math.sin(ang) * ry));
        return { ...a, x, y };
    });

    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            className={className}
            {...(label === ""
                ? { "aria-hidden": true }
                : { role: "img", "aria-label": label ?? `${region.name} 생활권 안내도: ${region.areas.map((a) => a.name).join(", ")}` })}
        >
            <defs>
                <clipPath id={`clip-${region.slug}`}>
                    <rect width={W} height={H} rx="28" />
                </clipPath>
            </defs>
            <g clipPath={`url(#clip-${region.slug})`}>
                <rect width={W} height={H} fill="#ECE7DD" />
                {minor.map((l, i) => (
                    <line key={i} {...l} stroke="#F7F4EE" strokeWidth="5" />
                ))}
                {parks.map((p) => (
                    <ellipse key={p.name} cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} transform={`rotate(${p.rot} ${p.x} ${p.y})`} fill="#CFE0D3" />
                ))}
                {region.river && <path d={river} fill="#CAD9E0" />}
                {mainRoads.map((l, i) => (
                    <g key={i}>
                        <line {...l} stroke="#E0D8C9" strokeWidth="16" strokeLinecap="round" />
                        <line {...l} stroke="#FFFFFF" strokeWidth="11" strokeLinecap="round" />
                    </g>
                ))}
                {parks.map((p) => (
                    <text key={`t-${p.name}`} x={p.x} y={p.y + 4} textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#3E6A55">
                        {p.name.length > 9 ? `${p.name.slice(0, 9)}…` : p.name}
                    </text>
                ))}

                {areas.map((a) => {
                    const shown = a.dongs.slice(0, 4).map(dongLabel);
                    const w = Math.max(a.name.length * 13 + 24, ...shown.map((d) => d.length * 12 + 20));
                    const h = 30 + shown.length * 19;
                    return (
                        <g key={a.name} transform={`translate(${a.x - w / 2} ${a.y - h / 2})`}>
                            <rect width={w} height={h} rx="14" fill="#FFFFFF" fillOpacity="0.92" stroke="#D8D1C4" />
                            <text x={w / 2} y="20" textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1B1A17">
                                {a.name}
                            </text>
                            {shown.map((d, j) => (
                                <text key={d} x={w / 2} y={40 + j * 19} textAnchor="middle" fontSize="12" fill="#4B4842">
                                    {d}
                                </text>
                            ))}
                        </g>
                    );
                })}

                {/* 중심 핀 */}
                <circle cx={cx} cy={cy} r="20" fill="#1F4A3E" fillOpacity="0.25" className="pin-pulse" />
                <circle cx={cx} cy={cy} r="11" fill="#1F4A3E" stroke="#fff" strokeWidth="3" />
                <g transform={`translate(${cx} ${cy - 26})`}>
                    <rect x={-(region.name.length * 8 + 22)} y="-24" width={region.name.length * 16 + 44} height="28" rx="14" fill="#1B1A17" />
                    <text x="0" y="-5" textAnchor="middle" fontSize="13.5" fontWeight="700" fill="#fff">
                        {region.name}
                    </text>
                </g>
            </g>
        </svg>
    );
}
