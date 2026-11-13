/**
 * 반려동물 장례 비용 비교 (/funeral-homes/cost)
 *
 * 업체가 홈페이지에 공개한 가격만 씁니다. 업체마다 가격표의 기준(체중 구간, 패키지)이 달라서
 * "체중 4kg 아이의 기본 장례"라는 같은 조건으로 맞춰 봅니다.
 *  - 가격 항목명에서 체중 구간을 읽어 4kg 이 들어가는 항목만 고릅니다.
 *  - 기본 장례·화장이 아닌 항목(스톤·봉안·수목장·운구·픽업·야간·체중 추가·비동행·공동 화장 등)은 뺍니다.
 *  - 그중 가장 낮은 금액을 그 업체의 비교 가격으로 씁니다. 원래 항목명·포함 내용·출처·확인일을 함께 보여 줍니다.
 * 지어낸 값은 없습니다. 조건에 맞는 항목이 없으면 비교에서 빼고 따로 알립니다.
 */
import { FUNERAL_HOMES, FUNERAL_SIDO, funeralSidoList, type FuneralHome, type FuneralSidoSlug } from "./funeral-homes";

/** 비교 페이지 주소 */
export const COST_PATH = "/funeral-homes/cost";

/** 비교 기준 체중(kg). 작은 강아지와 고양이를 예로 듭니다 */
export const COST_WEIGHT_KG = 4;

type PriceRow = FuneralHome["prices"][number];

interface WeightRange {
    min: number;
    minInclusive: boolean;
    max: number;
    maxInclusive: boolean;
}

/** 기본 장례·화장 비교에서 빼는 항목 */
const EXCLUDE = /추가|스톤|봉안|납골|하우스|수목|자연장|산골|운구|픽업|야간|심야|비동행|공동|합동|유골|보관|루세떼|메모리얼|염습|분양|1년/;
/** 기간 요금·범위가 아닌 금액은 비교하지 않습니다 */
const PERIODIC = /1일|하루|매월|월\s|연\s|1년|년간/;

const num = (s: string) => Number(s.replace(/,/g, ""));

/** 항목명에서 체중 구간을 읽습니다. 읽지 못하면 null */
export function parseWeightRange(label: string): WeightRange | null {
    const t = label.replace(/\s+/g, " ");
    let m: RegExpMatchArray | null;
    // "1kg 초과 5kg 이하", "10kg 초과~20kg"
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*kg\s*초과\s*~?\s*(\d+(?:\.\d+)?)\s*kg\s*(이하|미만)?/))) {
        return { min: num(m[1]), minInclusive: false, max: num(m[2]), maxInclusive: m[3] !== "미만" };
    }
    // "1~5kg", "5~10kg 미만", "0~1kg", "1kg~5kg", "1kg~4.9kg"
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*(?:kg)?\s*~\s*(\d+(?:\.\d+)?)\s*kg\s*(미만|이하)?/))) {
        return { min: num(m[1]), minInclusive: true, max: num(m[2]), maxInclusive: m[3] !== "미만" };
    }
    // "5kg 이하", "약 15kg 이내", "5kg 기준", "기준 5kg"
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*kg\s*(이하|이내|기준)/)) || (m = t.match(/기준\s*(\d+(?:\.\d+)?)\s*kg/))) {
        return { min: 0, minInclusive: true, max: num(m[1]), maxInclusive: true };
    }
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*kg\s*미만/))) {
        return { min: 0, minInclusive: true, max: num(m[1]), maxInclusive: false };
    }
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*kg\s*이상/))) {
        return { min: num(m[1]), minInclusive: true, max: Infinity, maxInclusive: false };
    }
    if ((m = t.match(/(\d+(?:\.\d+)?)\s*kg\s*초과/))) {
        return { min: num(m[1]), minInclusive: false, max: Infinity, maxInclusive: false };
    }
    return null;
}

const covers = (r: WeightRange, w: number) =>
    (w > r.min || (r.minInclusive && w === r.min)) && (w < r.max || (r.maxInclusive && w === r.max));

/** "30만 원", "32만 5천 원", "250,000원" → 원. 기간 요금이나 읽지 못하는 값은 null */
export function parseWon(amount: string): number | null {
    const t = amount.replace(/\s+/g, "");
    if (PERIODIC.test(amount)) return null;
    // "21만~24만 원" 처럼 범위면 낮은 쪽(그 금액부터)
    let m = t.match(/^(\d+(?:\.\d+)?)만(?:(\d+)천)?(?:원)?(?=~|원)/);
    if (m) return Math.round(Number(m[1]) * 10000 + (m[2] ? Number(m[2]) * 1000 : 0));
    m = t.match(/^([\d,]+)원/);
    if (m) return num(m[1]);
    return null;
}

export interface CostPick {
    home: FuneralHome;
    /** 비교 가격(원) */
    won: number;
    /** 비교에 쓴 가격표 항목 그대로 */
    row: PriceRow;
    /** 금액이 범위(21만~24만 원)거나 '부터'라 낮은 쪽을 썼는지 */
    from: boolean;
    /** 같은 업체의 체중 추가 요금 안내(있으면 그대로) */
    surcharge: PriceRow | null;
}

/** 한 업체의 "4kg 아이 기본 장례" 가격. 조건에 맞는 항목이 없으면 null */
export function costPick(home: FuneralHome, weight = COST_WEIGHT_KG): CostPick | null {
    let best: { won: number; row: PriceRow } | null = null;
    for (const row of home.prices) {
        if (EXCLUDE.test(row.label)) continue;
        const range = parseWeightRange(row.label);
        if (!range || !covers(range, weight)) continue;
        const won = parseWon(row.amount);
        if (won === null) continue;
        if (!best || won < best.won) best = { won, row };
    }
    if (!best) return null;
    const surcharge = home.prices.find((p) => /추가/.test(p.label) && /kg/.test(p.label + p.amount)) ?? null;
    return { home, won: best.won, row: best.row, from: /~|부터/.test(best.row.amount), surcharge };
}

const median = (xs: number[]) => {
    const s = [...xs].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
};

export interface SidoCost {
    sido: FuneralSidoSlug;
    name: string;
    short: string;
    /** 그 시·도의 허가 업체 수 */
    total: number;
    /** 비교 가격을 낸 업체(싼 순) */
    picks: CostPick[];
    /** 가격은 공개했지만 4kg 기본 장례 조건이 따로 없는 업체 */
    otherPriced: FuneralHome[];
    /** 가격을 공개하지 않은 업체 수 */
    unpriced: number;
    min: number | null;
    median: number | null;
    max: number | null;
}

/** 시·도별 비교 (업체가 있는 시·도만, 목록 순서 그대로) */
export function costBySido(): SidoCost[] {
    return funeralSidoList().map(({ slug, count }) => {
        const homes = FUNERAL_HOMES.filter((h) => h.sido === slug);
        const picks = homes
            .map((h) => costPick(h))
            .filter((p): p is CostPick => p !== null)
            .sort((a, b) => a.won - b.won || a.home.name.localeCompare(b.home.name, "ko"));
        const pickedIds = new Set(picks.map((p) => p.home.id));
        const otherPriced = homes.filter((h) => !pickedIds.has(h.id) && h.prices.length > 0);
        const wons = picks.map((p) => p.won);
        return {
            sido: slug,
            name: FUNERAL_SIDO[slug].name,
            short: FUNERAL_SIDO[slug].short,
            total: count,
            picks,
            otherPriced,
            unpriced: homes.filter((h) => h.prices.length === 0).length,
            min: wons.length ? Math.min(...wons) : null,
            median: wons.length ? median(wons) : null,
            max: wons.length ? Math.max(...wons) : null,
        };
    });
}

/** 전국 요약 */
export function costSummary() {
    const all = costBySido().flatMap((s) => s.picks.map((p) => p.won));
    const seen = FUNERAL_HOMES.flatMap((h) => h.prices.map((p) => p.seenAt)).filter(Boolean).sort();
    return {
        compared: all.length,
        total: FUNERAL_HOMES.length,
        min: all.length ? Math.min(...all) : null,
        median: all.length ? median(all) : null,
        max: all.length ? Math.max(...all) : null,
        /** 가격을 확인한 날 중 가장 최근 */
        seenAt: seen.length ? seen[seen.length - 1] : null,
    };
}
