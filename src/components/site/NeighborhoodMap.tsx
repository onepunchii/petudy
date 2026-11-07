import { dongLabel, type Region } from "@/lib/site/regions";

/**
 * 동네 별자리 지도.
 *
 * 실제 지도가 아니라 regions.ts 의 생활권·동네 데이터로 그리는 도식입니다.
 * - 별 하나 = 동네 하나 (regions.ts 의 주요 동네)
 * - 가는 선으로 이어진 별 = 같은 생활권, 별자리 이름 = 생활권 이름
 * - 가운데 고리 = 지역 중심(구·시청 기준. 페이지의 거리 계산 출발점)
 * 별의 위치와 방향은 실제 지리와 무관합니다. 그래서 도로·강·건물처럼 지도로 오해할 만한 것은 그리지 않습니다.
 * 지역 slug 로 시드를 고정해, 같은 지역은 늘 같은 모양이고 지역마다 모양이 다릅니다.
 *
 * - layout="landscape"(기본, 600x440): 데스크톱 히어로 오른쪽 칸용
 * - layout="portrait"(폭 360, 높이는 생활권 수에 따라): 모바일 본문용. 글자가 작아지지 않도록 세로로 쌓습니다
 * - background={false}: 밤 배경 사각형 없이 별만 그립니다(장식용으로 다른 밤 면 위에 겹칠 때)
 * - label="" 이면 장식으로 보고 aria-hidden 처리합니다
 *
 * SVG id(gradient, clipPath)를 쓰지 않습니다. 같은 지역 지도가 한 페이지에 두 번(데스크톱용, 모바일용)
 * 그려져도 id 가 겹치지 않게 하기 위해서입니다.
 */

/** 지도 아래 캡션. 실제 지도로 오해하지 않도록 지도를 보여주는 곳마다 함께 둡니다 */
export const MAP_NOTE = "별 하나가 동네 하나, 선으로 이어진 별이 같은 생활권입니다. 실제 지도가 아니라 생활권을 묶어 그린 그림입니다.";

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

/* 브랜드 토큰 값 (globals.css: night-2, night-3, star, star-2, star-3) */
const COLOR = {
    bg: "#141A2E",
    chip: "#1F2742",
    star: "#EEF1F6",
    star2: "#B4BCCB",
    star3: "#8C95A8",
    line: "rgb(238 241 246 / 0.34)",
};

type Pt = { x: number; y: number };
type Box = { x0: number; y0: number; x1: number; y1: number };

interface Cfg {
    W: number;
    pad: number;
    /** 이름 붙인 별 사이 간격 */
    spacing: number;
    /** 이름 없이 촘촘한 별 사이 간격 */
    dense: number;
    zig: number;
    fDong: number;
    fArea: number;
    fCenter: number;
}

/* 데스크톱 히어로에서 약 500px 폭으로 줄어들므로 글자를 크게 잡습니다(14 → 화면 약 12px) */
const LANDSCAPE: Cfg & { H: number } = { W: 600, H: 440, pad: 24, spacing: 48, dense: 26, zig: 14, fDong: 14, fArea: 16, fCenter: 15 };
const PORTRAIT: Cfg = { W: 360, pad: 22, spacing: 46, dense: 28, zig: 14, fDong: 13, fArea: 14.5, fCenter: 14 };

/** 가로 지도에서 생활권 별자리를 둘 자리. 가운데(지역 중심)는 비워 둡니다. 생활권 수별로 두 가지 배치 */
const SLOTS: Record<number, [number, number][][]> = {
    1: [[[300, 112]], [[300, 330]]],
    2: [
        [[150, 150], [450, 296]],
        [[150, 296], [450, 150]],
    ],
    3: [
        [[150, 126], [450, 138], [300, 352]],
        [[150, 318], [450, 306], [300, 88]],
    ],
    4: [
        [[150, 116], [450, 116], [150, 326], [450, 326]],
        [[300, 80], [126, 232], [474, 232], [300, 372]],
    ],
    5: [
        [[140, 108], [460, 108], [112, 316], [488, 316], [300, 376]],
        [[300, 76], [122, 190], [478, 190], [170, 360], [430, 360]],
    ],
};

/** 글자 폭 대략값 (Pretendard 한글 약 0.95em) */
const textW = (s: string, f: number) => s.length * f * 0.95;

interface Cluster {
    name: string;
    stars: (Pt & { label: string; r: number; above: boolean })[];
    labeled: boolean;
    areaLabel: Pt;
    box: Box;
}

/** 한 생활권의 별 배치 (원점 기준). 이름 붙임 모드는 한 줄 지그재그, 아니면 여러 줄 뱀 모양 */
function buildCluster(name: string, dongs: string[], labeled: boolean, cfg: Cfg, r: () => number, areaAbove: boolean): Cluster {
    const k = dongs.length;
    const raw: (Pt & { up: boolean })[] = [];
    if (k <= 5) {
        const sp = labeled ? cfg.spacing : cfg.dense;
        const zig = labeled ? cfg.zig : cfg.zig * 0.75;
        const flip = r() < 0.5 ? 1 : -1;
        for (let j = 0; j < k; j++) {
            const up = (j % 2 === 0) === (flip === 1);
            raw.push({ x: (j - (k - 1) / 2) * sp + (r() - 0.5) * 8, y: (up ? -1 : 1) * zig + (r() - 0.5) * 6, up });
        }
    } else {
        const rows = Math.ceil(k / 5);
        const per = Math.ceil(k / rows);
        let idx = 0;
        for (let row = 0; row < rows; row++) {
            const cnt = Math.min(per, k - idx);
            const xs = Array.from({ length: cnt }, (_, j) => (j - (cnt - 1) / 2) * cfg.dense + (row % 2 ? cfg.dense / 2 : 0));
            if (row % 2) xs.reverse(); // 이어지는 선이 뱀 모양으로 한 번에 그려지도록
            for (const x of xs) raw.push({ x: x + (r() - 0.5) * 7, y: (row - (rows - 1) / 2) * cfg.dense + (r() - 0.5) * 7, up: row === 0 });
            idx += cnt;
        }
    }

    const th = (r() - 0.5) * 0.6;
    const cos = Math.cos(th);
    const sin = Math.sin(th);
    const stars = raw.map((p, j) => ({
        x: p.x * cos - p.y * sin,
        y: p.x * sin + p.y * cos,
        above: p.up,
        label: dongLabel(dongs[j]),
        r: j === 0 ? 3.4 : 2.3 + r() * 0.8,
    }));

    // 경계 상자 (별 + 동네 이름)
    const box: Box = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
    const grow = (x0: number, y0: number, x1: number, y1: number) => {
        box.x0 = Math.min(box.x0, x0);
        box.y0 = Math.min(box.y0, y0);
        box.x1 = Math.max(box.x1, x1);
        box.y1 = Math.max(box.y1, y1);
    };
    for (const s of stars) {
        grow(s.x - 6, s.y - 6, s.x + 6, s.y + 6);
        if (labeled) {
            const hw = textW(s.label, cfg.fDong) / 2;
            if (s.above) grow(s.x - hw, s.y - 9 - cfg.fDong, s.x + hw, s.y);
            else grow(s.x - hw, s.y, s.x + hw, s.y + 8 + cfg.fDong);
        }
    }

    // 생활권 이름 (별자리 이름)
    const areaLabel = areaAbove ? { x: 0, y: box.y0 - 10 } : { x: 0, y: box.y1 + cfg.fArea + 6 };
    const aw = textW(name, cfg.fArea) / 2;
    grow(-aw, areaAbove ? areaLabel.y - cfg.fArea : box.y1, aw, areaAbove ? box.y1 : areaLabel.y + 4);

    return { name, stars, labeled, areaLabel, box };
}

function shift(c: Cluster, dx: number, dy: number): Cluster {
    return {
        ...c,
        stars: c.stars.map((s) => ({ ...s, x: s.x + dx, y: s.y + dy })),
        areaLabel: { x: c.areaLabel.x + dx, y: c.areaLabel.y + dy },
        box: { x0: c.box.x0 + dx, y0: c.box.y0 + dy, x1: c.box.x1 + dx, y1: c.box.y1 + dy },
    };
}

/** 상자가 캔버스 안에 들어오도록 밀어 넣기 */
function fit(c: Cluster, W: number, H: number, pad: number) {
    const dx = c.box.x0 < pad ? pad - c.box.x0 : c.box.x1 > W - pad ? W - pad - c.box.x1 : 0;
    const dy = c.box.y0 < pad ? pad - c.box.y0 : c.box.y1 > H - pad ? H - pad - c.box.y1 : 0;
    return dx || dy ? shift(c, dx, dy) : c;
}

/** 겹친 정도(여백 m 포함). 둘 다 양수면 겹침 */
const overlap = (a: Box, b: Box, m: number) => ({
    x: Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) + m,
    y: Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0) + m,
});
const mid = (b: Box) => ({ x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 });

/** 별자리끼리, 그리고 지역 중심 이름표(keep)와 겹치지 않도록 덜 겹친 축으로 밀어냅니다 */
function separate(list: Cluster[], keep: Box, W: number, H: number, pad: number) {
    const m = 10;
    let cs = list;
    for (let it = 0; it < 10; it++) {
        let moved = false;
        cs = cs.map((c) => {
            const o = overlap(c.box, keep, m);
            if (o.x <= 0 || o.y <= 0) return c;
            moved = true;
            const d = mid(c.box);
            const k = mid(keep);
            return fit(o.x < o.y ? shift(c, d.x < k.x ? -o.x : o.x, 0) : shift(c, 0, d.y < k.y ? -o.y : o.y), W, H, pad);
        });
        for (let i = 0; i < cs.length; i++) {
            for (let j = i + 1; j < cs.length; j++) {
                const o = overlap(cs[i].box, cs[j].box, m);
                if (o.x <= 0 || o.y <= 0) continue;
                moved = true;
                const a = mid(cs[i].box);
                const b = mid(cs[j].box);
                const s = (v: number) => (v < 0 ? -1 : 1);
                if (o.x < o.y) {
                    const dir = s(b.x - a.x);
                    cs[i] = fit(shift(cs[i], (-dir * o.x) / 2, 0), W, H, pad);
                    cs[j] = fit(shift(cs[j], (dir * o.x) / 2, 0), W, H, pad);
                } else {
                    const dir = s(b.y - a.y);
                    cs[i] = fit(shift(cs[i], 0, (-dir * o.y) / 2), W, H, pad);
                    cs[j] = fit(shift(cs[j], 0, (dir * o.y) / 2), W, H, pad);
                }
            }
        }
        if (!moved) break;
    }
    return cs;
}

function layoutLandscape(region: Region, labeled: boolean, r: () => number) {
    const cfg = LANDSCAPE;
    const { W, H } = cfg;
    const n = Math.min(region.areas.length, 5);
    const center = { x: W / 2 + (r() - 0.5) * 24, y: H / 2 + (r() - 0.5) * 16 };
    const variants = SLOTS[n] ?? SLOTS[5];
    const slots = variants[Math.floor(r() * variants.length)];
    const offset = Math.floor(r() * n);
    const jit = n >= 5 ? 10 : 18;
    const placed = region.areas.slice(0, 5).map((a, i) => {
        const [sx, sy] = slots[(i + offset) % n];
        const x = sx + (r() - 0.5) * 2 * jit;
        const y = sy + (r() - 0.5) * 2 * jit;
        const c = buildCluster(a.name, a.dongs, labeled, cfg, r, y < center.y);
        return fit(shift(c, x, y), W, H, cfg.pad);
    });
    // 지역 중심 고리 + 아래 이름표 자리
    const hw = textW(region.name, cfg.fCenter) / 2 + 13;
    const keep: Box = { x0: center.x - hw, y0: center.y - 14, x1: center.x + hw, y1: center.y + 44 };
    const clusters = separate(placed, keep, W, H, cfg.pad);
    return { W, H, center, centerLabelBelow: true, clusters, cfg };
}

function layoutPortrait(region: Region, labeled: boolean, r: () => number) {
    const cfg = PORTRAIT;
    const { W, pad } = cfg;
    const n = region.areas.length;
    const centerAt = Math.floor(n / 2); // 생활권 사이 가운데 줄에 지역 중심
    const leftFirst = r() < 0.5;
    const gap = 12;
    let cursor = pad + 4;
    let center: Pt = { x: W / 2, y: 0 };
    const clusters: Cluster[] = [];
    region.areas.forEach((a, i) => {
        if (i === centerAt) {
            center = { x: W / 2 - 34 + (r() - 0.5) * 30, y: cursor + 22 };
            cursor += 44 + gap;
        }
        const c = buildCluster(a.name, a.dongs, labeled, cfg, r, true);
        const left = (i % 2 === 0) === leftFirst;
        const x = W * (left ? 0.38 : 0.62) + (r() - 0.5) * 24;
        const placed = fit(shift(c, x, cursor - c.box.y0), W, Infinity, pad);
        clusters.push(placed);
        cursor = placed.box.y1 + gap;
    });
    if (centerAt >= n) {
        center = { x: W / 2 - 34, y: cursor + 22 };
        cursor += 44 + gap;
    }
    return { W, H: Math.ceil(cursor - gap + pad + 4), center, centerLabelBelow: false, clusters, cfg };
}

export function NeighborhoodMap({
    region,
    className,
    label,
    layout = "landscape",
    background = true,
}: {
    region: Region;
    className?: string;
    /** 접근성 이름. "" 이면 장식으로 처리(aria-hidden) */
    label?: string;
    layout?: "landscape" | "portrait";
    /** false 면 밤 배경 사각형 없이 별만 */
    background?: boolean;
}) {
    const r = rng(region.slug);
    const labeled = Math.max(...region.areas.map((a) => a.dongs.length)) <= 5;
    const m = layout === "portrait" ? layoutPortrait(region, labeled, r) : layoutLandscape(region, labeled, r);
    const { W, H, center, cfg } = m;

    // 배경의 작은 별 (일부만 아주 천천히 반짝임, reduced-motion 이면 멈춤)
    const dust = Array.from({ length: layout === "portrait" ? 34 : 48 }, (_, i) => ({
        x: 24 + r() * (W - 48),
        y: 24 + r() * (H - 48),
        rad: 0.5 + r() * 0.8,
        o: 0.16 + r() * 0.36,
        tw: i % 8 === 0,
        delay: Math.round(r() * 9),
    }));

    const nameW = textW(region.name, cfg.fCenter) + 26;
    const pill = m.centerLabelBelow
        ? { x: center.x - nameW / 2, y: center.y + 16 }
        : { x: center.x + 16, y: center.y - 13 };

    const a11y =
        label === ""
            ? { "aria-hidden": true as const }
            : {
                  role: "img" as const,
                  "aria-label":
                      label ??
                      `${region.name} 동네 별자리 그림. 실제 지도가 아니라 생활권을 묶어 보여주는 도식입니다. ${region.areas
                          .map((a) => `${a.name}: ${a.dongs.map(dongLabel).join(", ")}`)
                          .join(". ")}`,
              };

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className={className} {...a11y}>
            {background && <rect x="0.5" y="0.5" width={W - 1} height={H - 1} rx="28" fill={COLOR.bg} stroke="rgb(238 241 246 / 0.1)" />}

            {dust.map((d, i) => (
                <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.rad}
                    fill={COLOR.star}
                    opacity={d.o}
                    className={d.tw ? "motion-safe:animate-[site-twinkle_9s_ease-in-out_infinite_alternate]" : undefined}
                    style={d.tw ? { animationDelay: `-${d.delay}s` } : undefined}
                />
            ))}

            {m.clusters.map((c) => (
                <g key={c.name}>
                    {c.stars.length > 1 && (
                        <polyline
                            points={c.stars.map((s) => `${s.x.toFixed(1)},${s.y.toFixed(1)}`).join(" ")}
                            fill="none"
                            stroke={COLOR.line}
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                        />
                    )}
                    {c.stars.map((s, j) => (
                        <g key={s.label}>
                            {j === 0 && <circle cx={s.x} cy={s.y} r="7.5" fill={COLOR.star} opacity="0.1" />}
                            <circle cx={s.x} cy={s.y} r={s.r} fill={COLOR.star}>
                                <title>{s.label}</title>
                            </circle>
                            {c.labeled && (
                                <text
                                    x={s.x}
                                    y={s.above ? s.y - 9 : s.y + 8 + cfg.fDong * 0.82}
                                    textAnchor="middle"
                                    fontSize={cfg.fDong}
                                    fill={COLOR.star2}
                                >
                                    {s.label}
                                </text>
                            )}
                        </g>
                    ))}
                    <text x={c.areaLabel.x} y={c.areaLabel.y} textAnchor="middle" fontSize={cfg.fArea} fontWeight="700" fill={COLOR.star}>
                        {c.name}
                    </text>
                </g>
            ))}

            {/* 지역 중심 (구·시청 기준) */}
            <circle cx={center.x} cy={center.y} r="12" fill={COLOR.star} opacity="0.14" className="pin-pulse" />
            <circle cx={center.x} cy={center.y} r="7.5" fill="none" stroke={COLOR.star} strokeWidth="1.5" />
            <circle cx={center.x} cy={center.y} r="2.6" fill={COLOR.star} />
            <rect x={pill.x} y={pill.y} width={nameW} height={26} rx="13" fill={COLOR.chip} />
            <text x={pill.x + nameW / 2} y={pill.y + 17.5} textAnchor="middle" fontSize={cfg.fCenter} fontWeight="700" fill={COLOR.star}>
                {region.name}
            </text>
        </svg>
    );
}
