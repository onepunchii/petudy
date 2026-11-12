/**
 * 지역 × 서비스 페이지 문구 생성기.
 *
 * 같은 틀에 지역명만 바꿔 끼우면 검색엔진이 "doorway(관문) 페이지"로 보고 순위를 떨어뜨립니다.
 * 그래서 문장마다 그 지역에만 있는 데이터(생활권·동네·랜드마크·역·도로·인접 지역 거리·제휴처 거리)를
 * 근거로 쓰고, 표현도 지역마다 다르게 고르도록(variant) 만들었습니다.
 */
import { SIDO, REGIONS, allDongs, distanceKm, dongLabel, estimateDriveMinutes, getRegion, type Region } from "./regions";
import { nearestPartners } from "./partners";
import { FACILITY_AREAS, type FacilityArea } from "./facilities";
import type { Faq, Service } from "./services";
import { SITE } from "./config";

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
const pick = <T,>(arr: T[], seed: string) => arr[hash(seed) % arr.length];
const join = (xs: string[], sep = "·") => xs.join(sep);
const josa = (word: string, withBatchim: string, without: string) => {
    const last = word.charCodeAt(word.length - 1);
    if (last < 0xac00 || last > 0xd7a3) return without;
    return (last - 0xac00) % 28 ? withBatchim : without;
};
/** 은/는 */
export const eunNeun = (w: string) => w + josa(w, "은", "는");
/** 이/가 */
export const iGa = (w: string) => w + josa(w, "이", "가");
/** 에서 */
const areaHead = (r: Region) => r.areas.map((a) => a.dongs.slice(0, 2).map(dongLabel).join("·"));
/** 산책 장소 이름에 "산책길"을 붙입니다. 이미 길·산책로로 끝나면 그대로 둡니다 (예: "안양천 산책로 산책길" 방지) */
const walkway = (place: string) => (/(산책로|길)$/.test(place) ? place : `${place} 산책길`);
/** 을/를 */
const eulReul = (w: string) => w + josa(w, "을", "를");
/** 빈 문장을 빼고 이어 붙입니다 (끝에 공백이 남지 않도록) */
const sentences = (...xs: (string | false | null | undefined)[]) => xs.filter(Boolean).join(" ");

export interface NeighborInfo {
    region: Region;
    km: number;
}

export function neighborsOf(r: Region): NeighborInfo[] {
    return r.neighbors
        .map((slug) => REGIONS.find((x) => x.slug === slug))
        .filter((x): x is Region => Boolean(x))
        .map((region) => ({ region, km: distanceKm(r, region) }))
        .sort((a, b) => a.km - b.km);
}

export interface FacilityDistance {
    area: FacilityArea;
    km: number;
    minutes: [number, number];
    sameCity: boolean;
}

/** 지역 중심(구·시청)에서 허가 장묘업체 소재 시·군까지의 거리 — 가까운 순 */
export function facilityDistances(r: Region, limit = 5): FacilityDistance[] {
    return FACILITY_AREAS.map((area) => {
        const km = distanceKm(r, area);
        const sameCity = area.name.replace(/^경기 /, "") === r.name;
        return { area, km, minutes: estimateDriveMinutes(Math.max(km, 3)), sameCity };
    })
        .sort((a, b) => a.km - b.km)
        .slice(0, limit);
}

/** 이 지역 페이지를 검색엔진에 색인시킬지 */
export function isIndexable(service: Service, r: Region) {
    if (service.status !== "live") return false;
    if (service.indexPolicy === "always") return true;
    return nearestPartners(r, service.slug, 1).some((p) => p.km < 15);
}

export interface LocalContent {
    title: string;
    description: string;
    h1: [string, string];
    /** 히어로 부제 (한국어 40자 안팎). 여행·배웅 은유는 여기에만 씁니다 */
    subtitle: string;
    lead: string;
    localStory: string;
    proximityTitle: string;
    proximityLead: string;
    scenarios: { title: string; desc: string }[];
    faqs: Faq[];
    partners: ReturnType<typeof nearestPartners>;
    facilities: FacilityDistance[];
    neighbors: NeighborInfo[];
    keywords: string[];
}

export function buildLocal(service: Service, r: Region): LocalContent {
    const dongs = allDongs(r);
    const firstAreas = areaHead(r);
    const lm = r.landmarks;
    const partners = nearestPartners(r, service.slug);
    const facilities = service.slug === "funeral" ? facilityDistances(r) : [];
    const neighbors = neighborsOf(r);
    const office = `${r.name}청`;
    const nearNames = neighbors.slice(0, 3).map((n) => n.region.name);
    const seed = `${service.slug}:${r.slug}`;
    /** pick(…, seed) 가 고르는 번호 (h1·lead 의 세 갈래와 같음) */
    const variant = hash(seed) % 3;
    const fromWhere = `${dongLabel(dongs[0])}부터 ${dongLabel(dongs[dongs.length - 1])}까지`;

    const keywords = [
        `${r.name} ${service.keyword}`,
        `${r.short} ${service.keyword}`,
        ...service.altKeywords.slice(0, 4).map((k) => `${r.name} ${k}`),
        ...dongs.slice(0, 4).map((d) => `${dongLabel(d)} ${service.altKeywords[0]}`),
    ];

    if (service.slug === "funeral") {
        const travelFaq: Faq = partners.length
            ? {
                  q: `${r.name}에서 가장 가까운 장례식장까지 얼마나 걸리나요?`,
                  a: `${r.name} 중심 기준으로 가장 가까운 제휴 장례식장(${partners[0].partner.name})까지 직선 약 ${partners[0].km.toFixed(1)}km, 차량으로 약 ${partners[0].minutes[0]}~${partners[0].minutes[1]}분 거리입니다. 출발하시는 동네와 시간대에 따라 달라지니 상담할 때 지금 기준으로 다시 확인해 드립니다.`,
              }
            : {
                  q: `${r.name}에서 장례식장까지 얼마나 걸리나요?`,
                  a: `${facilities[0].sameCity ? `${r.name} 안에도 허가 장묘업체가 있어 동네에 따라 가까운 거리에서 진행할 수 있습니다. ` : ""}${r.name}청 기준으로 허가 장묘업체가 모여 있는 ${facilities
                      .slice(0, 3)
                      .map((f) => `${f.area.name}(직선 약 ${Math.round(f.km)}km)`)
                      .join(", ")} 방면이 가깝습니다. 주로 ${join(r.roads.slice(0, 2), "·")}를 이용하며, 출퇴근 시간에는 같은 거리도 두 배 가까이 걸릴 수 있어 상담할 때 지금 시간 기준으로 다시 확인해 드립니다.`,
              };

        return {
            title: `${r.name} 반려동물 장례식장 · 강아지·고양이 장례${SITE.open24h ? " 24시간" : ""} 안내`,
            description: `${r.name} ${join(dongs.slice(0, 5).map(dongLabel), "·")} 등 ${r.short} 전 지역 강아지·고양이 장례 상담. 가장 가까운 허가 장례식장 방면(${facilities
                .slice(0, 2)
                .map((f) => f.area.name)
                .join("·")}), 픽업, 체중별 예상 비용을${SITE.open24h ? " 24시간" : ""} 안내합니다.`,
            h1: [`${r.name} 반려동물 장례식장,`, pick(["가장 가까운 곳에서 마지막 인사를", "우리 동네에서 가까운 곳으로", "지금 바로 갈 수 있는 곳으로"], seed)],
            // h1·lead 와 같은 variant 번호를 쓰되, 같은 페이지에서 표현이 겹치지 않는 부제를 짝지었습니다
            // (h1 둘째 줄에 "가까운 곳"이 들어가는 0·1번에는 부제에서 "가까운"을 다시 쓰지 않음)
            subtitle: [
                `함께 걷던 ${walkway(lm[0])}, 떠나는 날도 곁에 있겠습니다`,
                "아이가 먼저 떠나는 여행, 차분하게 배웅할 수 있도록",
                `${r.name} 어느 동네에서 출발하든, 함께 길을 찾겠습니다`,
            ][variant],
            lead: pick(
                [
                    `${fromWhere}, ${r.name} 어디에 계시든 지금 위치와 시간대의 교통 상황을 함께 살펴 오늘 배웅할 수 있는 허가 장례식장을 안내합니다.`,
                    `${join(firstAreas.slice(0, 3), ", ")} 등 ${r.name} 어느 동네에서 연락 주셔도, 지금 시간에 실제로 오가기 편한 허가 장례식장부터 찾아 드립니다.`,
                    `${eulReul(walkway(lm[0]))} 함께 걷던 아이를 배웅하는 날, ${r.name}에서 무리 없이 닿을 수 있는 허가 장례식장으로 연결합니다.`,
                ],
                seed,
            ),
            localStory: `${r.note} 그래서 같은 ${r.name}${josa(r.name, "이라도", "라도")} 어느 생활권에서 출발하느냐에 따라 편한 이동 경로가 다릅니다. ${r.stations.slice(0, 3).join("·")} 인근이라면 ${r.roads[0]} 진입이 쉬운지, ${lm[1] ?? lm[0]} 주변이라면 골목 진출입이 편한지를 함께 살펴 안내합니다.`,
            proximityTitle: `${r.name} ${r.areas.length}개 생활권, 어디서 출발해도 괜찮습니다`,
            proximityLead: sentences(
                "아래 동네 어디에서 연락 주셔도 출발 위치를 기준으로 방문·픽업 방법을 안내합니다.",
                nearNames.length > 0 && `${join(nearNames, "·")} 경계에 계셔도 같은 방법으로 안내합니다.`,
            ),
            scenarios: [
                { title: "곧 준비가 필요할 것 같아요", desc: `나이가 많거나 아픈 아이라면 ${r.short} 근처 업체와 절차·비용을 미리 함께 알아 두세요. 그날이 조금 덜 막막해집니다.` },
                { title: "방금 아이가 떠났어요", desc: "안치 방법부터 차분히 안내하고, 오늘 바로 진행할 수 있는 시간을 확인합니다." },
                {
                    title: "직접 이동이 어려워요",
                    desc: `${dongLabel(dongs[0])}에서든 ${dongLabel(dongs[dongs.length - 1])}에서든, 출발하실 곳을 알려 주시면 운구(픽업) 가능 여부와 비용을 확인합니다.`,
                },
                { title: "가까운 곳을 비교하고 싶어요", desc: `${r.name}에서 오가는 시간, 비용, 참관 여부를 나란히 놓고 비교해 드립니다.` },
            ],
            faqs: [
                travelFaq,
                {
                    q: `${join(dongs.slice(0, 3).map(dongLabel), ", ")}에서도 픽업이 되나요?`,
                    a: `네. ${r.name} ${r.areas.map((a) => a.name).join(", ")} 모두 픽업 상담이 가능합니다. 다만 시간대와 업체 일정에 따라 가능 여부와 비용이 달라, 상담할 때 확인해 드립니다.`,
                },
                {
                    q: `밤이나 새벽에도 ${r.name}에서 장례를 진행할 수 있나요?`,
                    a: `${SITE.open24h ? "상담은 24시간 받습니다. " : ""}장례 진행 시간은 업체마다 달라, 밤에는 아이를 안전하게 안치하는 방법을 먼저 안내하고 가장 빨리 진행할 수 있는 시간을 잡아 드립니다.`,
                },
                {
                    q: `${r.name}에서 동물등록 말소 신고는 어디서 하나요?`,
                    a: `반려견이 죽은 날부터 30일 이내에 ${office} 동물 관련 부서를 방문하거나 정부24 온라인으로 신고할 수 있습니다. 장례식장에서 발급하는 장례(화장) 증명서를 첨부하면 되고, 기한을 넘기면 과태료가 부과될 수 있습니다.`,
                },
                ...(r.sido === "seoul"
                    ? [
                          {
                              q: `${r.name}에도 반려동물 화장 시설이 있나요?`,
                              a: `서울에는 용도지역·거리 제한 때문에 고정식 반려동물 화장 시설이 없습니다. 그래서 ${r.name}에서도 대부분 경기도·인천의 허가 장례식장으로 이동해 진행하며, ${r.name}에서는 ${facilities[0].area.name}·${facilities[1].area.name} 방면이 상대적으로 가깝습니다. 포온은 출발 동네와 시간대를 기준으로 이동이 편한 곳을 안내합니다.`,
                          },
                      ]
                    : []),
            ],
            partners,
            facilities,
            neighbors,
            keywords,
        };
    }

    if (service.slug === "grooming") {
        return {
            title: `${r.name} 애견미용 · 우리 동네 가까운 미용실 연결`,
            description: `${r.name} ${join(dongs.slice(0, 5), "·")} 강아지·고양이 미용. 산책 동선에서 가까운 등록 미용업체 중 1:1 미용, 예민한 아이 대응이 가능한 곳을 골라 예약까지 연결합니다.`,
            // H1 은 SEO 값이라 기존 문구 그대로 둡니다(둘째 줄 포함)
            h1: [`${r.name} 애견미용,`, pick(["산책길에서 가까운 미용실로", "우리 아이 맞춤 미용실 연결", "동네에서 편하게 다니는 곳으로"], seed)],
            // h1 둘째 줄에 "미용실"이 들어가는 0·1번 부제에는 "미용실"을 다시 쓰지 않음
            subtitle: [
                `${r.short} 생활권 안에서, 자주 다니기 편한 곳을 골라 드립니다`,
                `${walkway(lm[0])}에 들르기 좋은 곳을 찾아 드립니다`,
                "다음 산책이 가벼워지도록, 털 관리는 가까운 곳에서",
            ][variant],
            lead: pick(
                [
                    `${join(lm.slice(0, 2), "·")} 산책 동선 가까이, ${r.name}에서 아이 견종과 성향에 맞는 등록 미용실을 찾아 예약까지 연결합니다.`,
                    `${join(firstAreas.slice(0, 3), ", ")} 등 ${r.name} 어디에 사시든, 걸어서 또는 차로 금방 닿는 미용실을 골라 드립니다.`,
                    `미용실은 가까워야 자주 다닐 수 있습니다. ${fromWhere}, ${r.name} 보호자님께 맞는 미용실을 찾아 드립니다.`,
                ],
                seed,
            ),
            localStory: `${r.note} 미용을 마치고 바로 ${lm[0]}${josa(lm[0], "이나", "나")} ${lm[2] ?? lm[1] ?? lm[0]} 산책을 가거나, ${r.stations[0]} 근처에서 볼일을 보는 동안 맡기는 경우가 많아 생활 동선 안의 미용실을 먼저 추천합니다.`,
            proximityTitle: `${r.name} 동네별 미용실 연결`,
            proximityLead: sentences(
                "아래 동네 기준으로 가까운 미용실을 안내합니다.",
                nearNames.length > 0 && `${join(nearNames, "·")} 쪽이 더 가까우시면 그쪽도 함께 비교해 드립니다.`,
            ),
            scenarios: [
                { title: "첫 미용이에요", desc: "짧은 위생미용부터 천천히 익숙해질 수 있는 미용실을 추천합니다." },
                { title: "예민하거나 노령견이에요", desc: "1:1 미용, 보호자 동반, 짧게 나눠 진행할 수 있는 곳을 찾습니다." },
                { title: "가위컷 스타일을 원해요", desc: `원하는 스타일 사진을 보여 주고 상담할 수 있는 ${r.short} 근처 미용실을 안내합니다.` },
                { title: "고양이 미용이 필요해요", desc: "고양이 미용 경험이 있는 미용실만 따로 골라 연결합니다." },
            ],
            faqs: [
                {
                    q: `${r.name} 애견미용 가격은 보통 얼마인가요?`,
                    a: `소형견 기준 목욕+위생미용 3~5만 원, 전체 클리핑 4~7만 원, 가위컷 7~12만 원 선이 일반적입니다. ${r.name} 안에서도 미용실마다 차이가 있어, 아이 정보를 알려 주시면 확정 금액을 먼저 확인해 드립니다.`,
                },
                {
                    q: `${join(dongs.slice(0, 3).map(dongLabel), ", ")} 근처에 1:1 미용실이 있나요?`,
                    a: `${r.name} 생활권별로 1:1 미용이 가능한 곳을 확인해 안내합니다. 원하시는 날짜와 시간대를 알려 주시면 예약할 수 있는 곳 위주로 추천해 드립니다.`,
                },
                {
                    q: `${lm[0]} 근처에서 미용 끝나고 바로 산책할 수 있을까요?`,
                    a: `가능합니다. 미용 직후에는 피부가 예민할 수 있어 가벼운 산책을 권하며, 동선상 가까운 미용실을 먼저 추천해 드립니다.`,
                },
            ],
            partners,
            facilities,
            neighbors,
            keywords,
        };
    }

    // soon 서비스 (지역 페이지는 생성되지 않지만 안전하게 기본값 제공)
    return {
        title: `${r.name} ${service.keyword}`,
        description: `${r.name} ${service.name} 연결 서비스 준비 중`,
        h1: [`${r.name} ${service.name}`, "곧 연결을 시작합니다"],
        subtitle: service.tagline,
        lead: service.intro,
        localStory: r.note,
        proximityTitle: `${r.name} 동네`,
        proximityLead: "",
        scenarios: [],
        faqs: service.faqs,
        partners,
        facilities,
        neighbors,
        keywords,
    };
}

/** 지역 허브(서비스 전체) 페이지 문구 */
export function buildAreaHub(r: Region) {
    const dongs = allDongs(r);
    return {
        title: `${r.name} 반려동물 서비스 · 장례·미용 가까운 곳 연결`,
        description: `${r.name} ${join(dongs.slice(0, 6), "·")} 반려동물 장례, 애견미용 등 우리 동네 가까운 등록 업체를 포온이 확인해 연결합니다.`,
        /** 히어로 부제 (40자 안팎) */
        subtitle: pick(
            [
                `${r.name} 어디서 출발하든, 가까운 곳부터 찾아 드립니다`,
                `함께 사는 날도 배웅하는 날도, ${r.name} 가까이에서`,
                `${walkway(r.landmarks[0])}에서 멀지 않은 곳으로 안내합니다`,
            ],
            `area:${r.slug}`,
        ),
        lead: `${r.note} 포온은 ${r.name} 보호자님이 필요한 순간 가까운 허가·등록 업체를 찾을 수 있도록 생활권 단위로 안내합니다.`,
    };
}

export const sidoName = (r: Region) => SIDO[r.sido].name;
export { getRegion };
