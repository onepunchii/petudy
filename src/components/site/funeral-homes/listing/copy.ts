/**
 * 장례식장 목록(전체·시·도) 페이지 문구와 FAQ.
 * 모든 숫자와 지역 이름은 데이터 모듈(src/lib/site/funeral-homes.ts)에서 계산합니다. 지어낸 사실은 넣지 않습니다.
 * 문구 규칙: 긴 줄표·느낌표·최상급 금지, 한 의도 한 라벨.
 */
import {
    FUNERAL_HOMES,
    FUNERAL_HOMES_CHECKED_AT,
    FUNERAL_REGISTRY_LABEL,
    FUNERAL_SIDO,
    FUNERAL_SIDO_ORDER,
    funeralHomesBySido,
    funeralSidoList,
    sigunguGroups,
    type FuneralHome,
    type FuneralSidoSlug,
    type ServiceKey,
} from "@/lib/site/funeral-homes";
import type { Faq } from "@/lib/site/services";

/** 수도권(포온 상담 지역과 가까운 순) */
export const CAPITAL_SIDO = ["seoul", "gyeonggi", "incheon"] as const satisfies readonly FuneralSidoSlug[];
export const isCapitalSido = (s: FuneralSidoSlug) => (CAPITAL_SIDO as readonly string[]).includes(s);

/** "2026-11-07" -> "2026.11.07" */
export const dotDate = (iso: string) => iso.replaceAll("-", ".");
/** "2026-11-07" -> "2026년 11월 7일" */
export function koDate(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    return `${y}년 ${m}월 ${d}일`;
}
export const CHECKED_DOT = dotDate(FUNERAL_HOMES_CHECKED_AT);
export const CHECKED_KO = koDate(FUNERAL_HOMES_CHECKED_AT);

export type TownGroup = ReturnType<typeof sigunguGroups>[number];

/** 시군구가 있는 묶음인지 (세종처럼 시군구가 없으면 false) */
export const hasTown = (g: TownGroup) => g.homes[0]?.sigungu != null;
/** 화면에 쓰는 묶음 이름. 시군구가 없으면 시·도 이름 */
export const groupLabel = (sido: FuneralSidoSlug, g: TownGroup) => (hasTown(g) ? g.name : FUNERAL_SIDO[sido].name);

/** 시군구가 2곳 이상이라 "시·군·구별" 정리가 의미 있는지 */
export const hasManyTowns = (sido: FuneralSidoSlug) => sigunguGroups(sido).filter(hasTown).length > 1;

/** 시·도 안 업체를 시군구 묶음 순서대로 펼친 목록 (업체 많은 시군구 먼저) */
export const homesInGroupOrder = (sido: FuneralSidoSlug) => sigunguGroups(sido).flatMap((g) => g.homes);

/** "광주시 7곳" 같은 조각 (시군구가 있는 묶음만, 업체 많은 순) */
export function townCounts(sido: FuneralSidoSlug, max = 3) {
    const groups = sigunguGroups(sido).filter(hasTown);
    return { shown: groups.slice(0, max).map((g) => `${g.name} ${g.homes.length}곳`), rest: Math.max(0, groups.length - max) };
}

/**
 * 시·도 안에서 업체가 어디에 있는지 한 문장 (업체 수로만 말합니다).
 * 예: "광주시 7곳, 김포시 5곳, 화성시 4곳, 안산시 3곳 순으로 많고, 그 밖의 10개 지역에도 있습니다."
 */
export function townSentence(sido: FuneralSidoSlug) {
    const n = funeralHomesBySido(sido).length;
    const groups = sigunguGroups(sido).filter(hasTown);
    const { name } = FUNERAL_SIDO[sido];
    if (groups.length === 0) return `${n}곳 모두 ${name}에 있습니다.`;
    if (groups.length === 1) return n === 1 ? `${groups[0].name}에 있는 1곳입니다.` : `${n}곳 모두 ${groups[0].name}에 있습니다.`;

    const multi = groups.filter((g) => g.homes.length > 1);
    const singles = groups.filter((g) => g.homes.length === 1);
    const names = (gs: TownGroup[]) => gs.map((g) => g.name).join(", ");

    if (multi.length === 0) return singles.length <= 5 ? `${names(singles)}에 1곳씩 있습니다.` : `${singles.length}개 지역에 1곳씩 있습니다.`;
    if (multi.length === 1) {
        const m = multi[0];
        if (singles.length === 0) return `${m.name}에 ${m.homes.length}곳이 있습니다.`;
        return `${m.name}에 ${m.homes.length}곳이 있고, ${singles.length <= 5 ? names(singles) : `그 밖의 ${singles.length}개 지역`}에 1곳씩 있습니다.`;
    }
    const lead = multi.slice(0, 4);
    const restCount = groups.length - lead.length;
    const list = lead.map((g) => `${g.name} ${g.homes.length}곳`).join(", ");
    if (restCount === 0) return `${list} 순으로 많습니다.`;
    if (multi.length > lead.length || singles.length > 5) return `${list} 순으로 많고, 그 밖의 ${restCount}개 지역에도 있습니다.`;
    return `${list} 순으로 많고, ${names(singles)}에 1곳씩 있습니다.`;
}

/** 홈페이지에 해당 서비스 안내가 있는 업체 수 */
export const countWithService = (homes: FuneralHome[], key: ServiceKey) => homes.filter((h) => h.services[key]?.status === "yes").length;
/** 홈페이지에 가격을 공개한 업체 수 */
export const countWithPrices = (homes: FuneralHome[]) => homes.filter((h) => h.prices.length > 0).length;

/** 업체 수 많은 시·도 순 (같으면 목록 순서) */
export function sidoByCount() {
    return [...funeralSidoList()].sort((a, b) => b.count - a.count || FUNERAL_SIDO_ORDER.indexOf(a.slug) - FUNERAL_SIDO_ORDER.indexOf(b.slug));
}

/* ───────── 메타 설명 ───────── */

/**
 * 목록에서 볼 수 있는 정보 이름을 데이터로 만듭니다. 묶음 안에 하나라도 있는 것만 넣습니다.
 * 예: "주소, 전화, 운영 시간, 공개 가격" / 가격을 공개한 곳이 없으면 "주소, 전화, 운영 시간"
 */
export function listTopics(homes: FuneralHome[]) {
    const t = ["주소"];
    if (homes.some((h) => h.phone)) t.push("전화");
    if (homes.some((h) => h.hours)) t.push("운영 시간");
    if (homes.some((h) => h.prices.length > 0)) t.push("공개 가격");
    return t.join(", ");
}

export function hubDescription() {
    const top = sidoByCount()
        .slice(0, 3)
        .map((s) => `${s.short} ${s.count}곳`)
        .join(", ");
    return `동물보호관리시스템 공식 허가 목록 기준 전국 반려동물 장례식장 ${FUNERAL_HOMES.length}곳을 ${funeralSidoList().length}개 시·도별로 정리했습니다(${top} 등). ${listTopics(FUNERAL_HOMES)}. 확인일 ${CHECKED_DOT}.`;
}

export function sidoDescription(sido: FuneralSidoSlug) {
    const n = funeralHomesBySido(sido).length;
    const { name } = FUNERAL_SIDO[sido];
    const { shown, rest } = townCounts(sido, 3);
    const tail = `${listTopics(funeralHomesBySido(sido))}. 확인일 ${CHECKED_DOT}.`;
    if (shown.length > 1) return `${name} 허가 반려동물 장례식장 ${n}곳을 시·군·구별로 정리했습니다. ${shown.join(", ")}${rest ? ` 외 ${rest}개 지역` : ""}. ${tail}`;
    const town = sigunguGroups(sido).find(hasTown)?.name;
    return `${name}${town ? ` ${town}` : ""}의 허가 반려동물 장례식장 ${n}곳을 정리했습니다. ${tail}`;
}

/** 받침이 있으면 "은", 없으면 "는" (한글이 아닌 끝 글자는 "은(는)" 대신 "는") */
const topic = (word: string) => {
    const code = word.charCodeAt(word.length - 1) - 0xac00;
    return code >= 0 && code <= 11171 && code % 28 !== 0 ? "은" : "는";
};

/**
 * 서울 목록 안내 한 문장. 서울 소재 업체가 공식 목록에 화장시설로 올라 있어도 홈페이지에 이동식 장례로 안내된 경우,
 * "서울에는 고정식 화장 시설이 없다"는 /funeral 안내와 함께 읽히도록 데이터(시설 종류, 요약)로 설명합니다.
 */
export function seoulNote(sido: FuneralSidoSlug) {
    if (sido !== "seoul") return null;
    const mobile = funeralHomesBySido("seoul").filter((h) => h.facilityTypes.includes("화장시설") && /이동식/.test(h.summary ?? ""));
    if (!mobile.length) return null;
    const names = mobile.map((h) => h.name).join(", ");
    return `${names}${topic(names)} 공식 목록에 화장시설로 등록되어 있고, 홈페이지에는 이동식 장례로 안내되어 있습니다. 서울에는 고정식 화장 시설이 없어 경기·인천 목록도 함께 보시길 권합니다.`;
}

/* ───────── FAQ (데이터로만 답합니다) ───────── */

const HOW_TO_VERIFY: Faq = {
    q: "허가받은 업체인지 어떻게 확인하나요?",
    a: `동물보호법에 따라 지자체 허가를 받은 동물장묘업체만 반려동물을 화장할 수 있습니다. 동물보호관리시스템(animal.go.kr)의 동물장묘업 등록(허가) 현황에서 업체명과 소재지로 조회할 수 있어요. 이 목록의 업체는 모두 그 현황에 올라 있는 곳입니다(확인일 ${CHECKED_DOT}).`,
};

export function sidoFaqs(sido: FuneralSidoSlug): Faq[] {
    const n = funeralHomesBySido(sido).length;
    const { short, name } = FUNERAL_SIDO[sido];
    const towns = sigunguGroups(sido).filter(hasTown);

    const seoulExtra =
        sido === "seoul"
            ? (() => {
                  const near = (["gyeonggi", "incheon"] as const).map((s) => ({ s, n: funeralHomesBySido(s).length })).filter((x) => x.n > 0);
                  return near.length ? ` 서울에서 출발하신다면 ${near.map((x) => `${FUNERAL_SIDO[x.s].short} ${x.n}곳`).join(", ")} 목록도 함께 보세요.` : "";
              })()
            : "";

    return [
        {
            q: `${short}에 허가받은 반려동물 장례식장은 몇 곳인가요?`,
            a: `${FUNERAL_REGISTRY_LABEL} 기준 ${name} 소재 업체는 ${n}곳입니다(확인일 ${CHECKED_DOT}).${seoulExtra}`,
        },
        {
            q: towns.length > 1 ? `${short}에서는 어느 지역에 장례식장이 많나요?` : `${short} 장례식장은 어디에 있나요?`,
            a: `공식 목록 기준으로 ${townSentence(sido)} 소재지와 전화번호는 각 업체 페이지에서 볼 수 있어요.`,
        },
        HOW_TO_VERIFY,
    ];
}

export function hubFaqs(): Faq[] {
    const total = FUNERAL_HOMES.length;
    const sidoCount = funeralSidoList().length;
    const top = sidoByCount()
        .slice(0, 4)
        .map((s) => `${s.short} ${s.count}곳`)
        .join(", ");
    const seoul = funeralHomesBySido("seoul");
    const gg = funeralHomesBySido("gyeonggi").length;
    const ic = funeralHomesBySido("incheon").length;
    const priced = countWithPrices(FUNERAL_HOMES);

    const seoulTowns = [...new Set(seoul.map((h) => h.sigungu).filter((t): t is string => Boolean(t)))];
    const seoulAnswer =
        seoul.length > 0
            ? `공식 목록 기준 서울 소재 허가 업체는 ${seoulTowns.length ? `${seoulTowns.join(", ")}에 있는 ` : ""}${seoul.length}곳입니다. 같은 목록에서 경기는 ${gg}곳, 인천은 ${ic}곳이라, 서울에서 출발하신다면 경기·인천 목록도 함께 보세요.`
            : `공식 목록 기준 서울 소재 허가 업체는 없습니다. 같은 목록에서 경기는 ${gg}곳, 인천은 ${ic}곳입니다.`;

    return [
        {
            q: "전국에 허가받은 반려동물 장례식장은 몇 곳인가요?",
            a: `${FUNERAL_REGISTRY_LABEL} 기준 ${total}곳이며 ${sidoCount}개 시·도에 있습니다(확인일 ${CHECKED_DOT}). ${top} 순으로 많습니다.`,
        },
        { q: "서울에도 반려동물 장례식장이 있나요?", a: seoulAnswer },
        {
            q: "장례 비용은 어디서 확인하나요?",
            a: `${total}곳 중 ${priced}곳은 홈페이지에 가격을 공개하고 있어 각 업체 페이지에 정리했습니다. 나머지는 공개 가격이 없어 업체에 직접 문의하셔야 합니다. 체중별 일반적인 범위는 반려동물 장례 비용 가이드에서 볼 수 있어요.`,
        },
        {
            q: "이 목록의 정보는 어디에서 가져왔나요?",
            a: `업체명, 소재지, 전화, 시설 종류는 ${FUNERAL_REGISTRY_LABEL}에서, 서비스와 운영 시간, 가격은 각 업체 홈페이지에서 확인했습니다(확인일 ${CHECKED_DOT}). 업체 사정에 따라 바뀔 수 있어요. 포온은 목록의 업체들과 제휴 관계가 아닙니다.`,
        },
        HOW_TO_VERIFY,
    ];
}
