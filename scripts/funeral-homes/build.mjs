#!/usr/bin/env node
/**
 * 허가 반려동물 장례식장(동물장묘업) 데이터 빌드
 *
 * 입력
 *   data/funeral-homes/registry.json   공식 목록(동물보호관리시스템 동물장묘업 등록(허가) 현황)을 정리한 원본
 *   data/funeral-homes/final/<id>.json 업체 홈페이지에서 확인한 사실(서비스·운영 시간·가격, 출처 URL 포함)
 * 출력
 *   src/lib/site/data/funeral-homes.json  사이트가 읽는 데이터 (slug 포함)
 *
 * 실행: node scripts/funeral-homes/build.mjs
 * 공식 목록을 다시 확인하면 registry.json 과 checkedAt 을 갱신하고 이 스크립트를 다시 돌리세요.
 * slug 는 한 번 정해지면 바꾸지 않습니다(검색엔진에 색인된 주소). 새 업체만 새 slug 를 받습니다.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA = join(ROOT, "data", "funeral-homes");
const OUT = join(ROOT, "src", "lib", "site", "data", "funeral-homes.json");
const SLUG_LOCK = join(DATA, "slugs.json"); // id -> slug (한 번 정한 주소 고정)

const SIDO = {
    서울특별시: "seoul",
    경기도: "gyeonggi",
    인천광역시: "incheon",
    부산광역시: "busan",
    대구광역시: "daegu",
    울산광역시: "ulsan",
    세종특별자치시: "sejong",
    강원특별자치도: "gangwon",
    충청북도: "chungbuk",
    충청남도: "chungnam",
    전북특별자치도: "jeonbuk",
    전남광주통합특별시: "jeonnam-gwangju",
    경상북도: "gyeongbuk",
    경상남도: "gyeongnam",
};

/** 시군구 공식 로마자 표기 (슬러그용) */
const SIGUNGU = {
    광주시: "gwangju", 김포시: "gimpo", 화성시: "hwaseong", 김해시: "gimhae", 기장군: "gijang", 서구: "seo-gu",
    안산시: "ansan", 남양주시: "namyangju", 청주시: "cheongju", 순천시: "suncheon", 나주시: "naju", 용인시: "yongin",
    천안시: "cheonan", 완주군: "wanju", 경산시: "gyeongsan", 양산시: "yangsan", 마포구: "mapo", 목포시: "mokpo",
    여수시: "yeosu", 광산구: "gwangsan", 함평군: "hampyeong", 달서구: "dalseo", 군위군: "gunwi", 북구: "buk-gu",
    울주군: "ulju", 고양시: "goyang", 파주시: "paju", 이천시: "icheon", 안성시: "anseong", 양평군: "yangpyeong",
    양주시: "yangju", 포천시: "pocheon", 여주시: "yeoju", 원주시: "wonju", 강릉시: "gangneung", 제천시: "jecheon",
    옥천군: "okcheon", 영동군: "yeongdong", 공주시: "gongju", 논산시: "nonsan", 예산군: "yesan", 전주시: "jeonju",
    군산시: "gunsan", 남원시: "namwon", 임실군: "imsil", 김천시: "gimcheon", 구미시: "gumi", 문경시: "mungyeong",
    청도군: "cheongdo", 성주군: "seongju", 칠곡군: "chilgok", 창원시: "changwon", 함안군: "haman", 고성군: "goseong",
};

/** 한글 업체명 슬러그 다듬기 (영문 표기가 분명한 이름) */
const NAME_SLUG = {
    리멤버: "remember", 스토리펫: "storypet", 러브펫: "lovepet", 어게인: "again", 스타펫: "starpet", 해피펫: "happypet",
    "반려마루 추모관": "banryeomaru", 아이들랜드: "idleland", "전주 하늘": "jeonju-haneul",
    "순천 반려동물장례식장 하늘별": "haneulbyeol", 하늘소풍: "haneulsopung", "서래안 펫타운": "seoraean-pettown",
    하늘정원: "haneuljeongwon", 센트럴파크: "centralpark",
};


// ── 간단한 국어의 로마자 표기 (음운 변화는 ㄹㄹ 만 반영) ──
const CHO = ["g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj", "ch", "k", "t", "p", "h"];
const JUNG = ["a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe", "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i"];
const JONG = ["", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p", "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t"];
function romanize(text) {
    let out = "";
    let prevJong = -1;
    for (const ch of text) {
        const code = ch.codePointAt(0) - 0xac00;
        if (code < 0 || code > 11171) {
            out += /[a-z0-9]/i.test(ch) ? ch.toLowerCase() : "-";
            prevJong = -1;
            continue;
        }
        const cho = Math.floor(code / 588);
        const jung = Math.floor((code % 588) / 28);
        const jong = code % 28;
        out += (cho === 5 && prevJong === 8 ? "l" : CHO[cho]) + JUNG[jung] + JONG[jong];
        prevJong = jong;
    }
    return out;
}
const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");

function brandOf(r) {
    const core = r.name
        .replace(/\(주\)|㈜|주식회사|\(유\)|\(합\)/g, "")
        .replace(/반려동물|장례식장|장례식|장묘|화장장|추모공원/g, "")
        .replace(new RegExp(`${(r.sigungu ?? "").replace(/[시군구]$/, "")}|${Object.keys(SIDO).map((k) => k.slice(0, 2)).join("|")}|점$`, "g"), "")
        .trim();
    const bare = r.name.replace(/\(주\)|㈜/g, "").trim();
    const branchNo = r.name.match(/(\d)호점/)?.[1];
    const withBranch = (slug) => (branchNo ? `${slug}-${branchNo}` : slug);
    if (NAME_SLUG[bare]) return withBranch(NAME_SLUG[bare]);
    if (r.website) {
        try {
            const host = new URL(r.website).hostname.replace(/^www\./, "");
            // 한글 도메인(퓨니코드 xn--)은 이름 로마자 표기로
            if (/^[\x00-\x7f]+$/.test(host) && !host.includes("xn--")) {
                const label = host.split(".")[0]; // 호스팅 하위 도메인(modoo.at 등)도 첫 마디가 업체 이름
                if (label) return withBranch(clean(label));
            }
        } catch {
            /* 잘못된 URL 은 이름으로 */
        }
    }
    return withBranch(clean(romanize(core || r.name)) || "funeral");
}

const SERVICE_KEYS = [
    "individualCremation", "groupCremation", "viewing", "yeomseup", "columbarium", "treeBurial",
    "memorialStone", "pickup", "allDay", "largeDog", "catSmall",
];
const UNKNOWN = { status: "unknown", note: null, sourceUrl: null };

function normalizePhone(p) {
    if (!p) return null;
    const digits = p.replace(/[^0-9]/g, "");
    if (digits.length < 8) return null;
    return p.trim();
}

function main() {
    const registry = JSON.parse(readFileSync(join(DATA, "registry.json"), "utf8"));
    const finalDir = join(DATA, "final");
    const finals = new Map();
    if (existsSync(finalDir)) {
        for (const f of readdirSync(finalDir)) {
            if (!f.endsWith(".json")) continue;
            const j = JSON.parse(readFileSync(join(finalDir, f), "utf8"));
            finals.set(j.id, j);
        }
    }
    const lock = existsSync(SLUG_LOCK) ? JSON.parse(readFileSync(SLUG_LOCK, "utf8")) : {};
    const used = new Set(Object.values(lock));
    const missingFinal = [];

    const homes = registry.map((r) => {
        const sido = SIDO[r.sido];
        if (!sido) throw new Error(`알 수 없는 시도: ${r.sido} (${r.name})`);
        const sigunguSlug = r.sigungu ? SIGUNGU[r.sigungu] : sido;
        if (!sigunguSlug) throw new Error(`시군구 로마자 표기가 없습니다: ${r.sigungu} (${r.name})`);

        let slug = lock[r.id];
        if (!slug) {
            const base = `${sigunguSlug}-${brandOf(r)}`.replace(/-{2,}/g, "-");
            slug = base;
            for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
            used.add(slug);
            lock[r.id] = slug;
        }

        const fin = finals.get(r.id);
        if (!fin) missingFinal.push(r.id);
        const services = Object.fromEntries(SERVICE_KEYS.map((k) => [k, fin?.services?.[k] ?? UNKNOWN]));

        return {
            id: r.id,
            slug,
            sido,
            sidoName: r.sido,
            sigungu: r.sigungu ?? null,
            sigunguSlug,
            district: r.sigunguDistrict ?? null,
            name: r.name,
            address: r.roadAddress,
            addressComplete: r.addressPrecision !== "road_or_ri_without_number",
            phone: normalizePhone(r.phone),
            website: r.website ?? null,
            facilityTypes: [...new Set(r.facilityTypes)].sort((a, b) => FACILITY_ORDER.indexOf(a) - FACILITY_ORDER.indexOf(b)),
            lat: r.lat,
            lng: r.lng,
            geo: r.geoPrecision === "address" ? "address" : "approx",
            officialListNo: r.officialListNo ?? null,
            services,
            extras: fin?.extras ?? [],
            hours: fin?.hours ?? null,
            prices: fin?.prices ?? [],
            priceFrom: typeof fin?.priceFrom === "number" ? fin.priceFrom : null,
            parking: fin?.parking ?? null,
            access: fin?.access ?? [],
            summary: fin?.summary ?? null,
            cautions: fin?.cautions ?? [],
            checkedAt: r.checkedAt,
            sources: (r.sources ?? []).filter((s) => !/petbyeol/i.test(s.url)),
        };
    });

    // 같은 slug 가 생기면 실패 (시도가 달라도 slug 는 전국에서 하나만)
    const seen = new Map();
    for (const h of homes) {
        if (seen.has(h.slug)) throw new Error(`slug 중복: ${h.slug} (${seen.get(h.slug)} / ${h.name})`);
        seen.set(h.slug, h.name);
    }

    mkdirSync(dirname(OUT), { recursive: true });
    writeFileSync(OUT, JSON.stringify(homes, null, 1) + "\n");
    writeFileSync(SLUG_LOCK, JSON.stringify(lock, null, 1) + "\n");
    console.log(`funeral homes: ${homes.length} -> ${OUT}`);
    if (missingFinal.length) console.log(`홈페이지 정보 없음(${missingFinal.length}): ${missingFinal.join(", ")}`);
}

const FACILITY_ORDER = ["장례식장", "화장시설", "건조장시설", "수분해장시설", "봉안시설"];

main();
