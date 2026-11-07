/**
 * 서비스 정의 — 에이전시가 연결하는 반려동물 서비스.
 *
 * status
 *  - "live": 서비스 허브 + 전 지역 페이지 생성, 사이트맵 포함
 *  - "soon": 서비스 허브(대기 신청)만 생성. 제휴처가 없는 상태에서 지역 페이지를
 *            대량 생성하면 '얇은 페이지(doorway)'로 판단될 수 있어 일부러 막아둡니다.
 *            제휴처가 확보되면 "live"로 바꾸기만 하면 지역 페이지·사이트맵이 자동 생성됩니다.
 */

export type ServiceSlug = "funeral" | "grooming" | "hotel" | "petsitter" | "pet-taxi" | "training";
export type ServiceTone = "dusk" | "clay" | "pine";

export interface Faq {
    q: string;
    a: string;
}

export interface PriceRow {
    label: string;
    range: string;
    note?: string;
}

export interface Service {
    slug: ServiceSlug;
    name: string;
    short: string;
    /** 대표 검색어 (지역명 뒤에 붙는 형태) */
    keyword: string;
    /** 함께 쓰이는 검색어 — 본문·메타 키워드에 자연스럽게 분산 */
    altKeywords: string[];
    status: "live" | "soon";
    /**
     * 지역 페이지 색인 정책
     *  - "always": 제휴처가 없어도 색인 (지역별 고유 데이터가 충분한 경우 — 장례는 허가업체 소재지 거리 데이터가 있음)
     *  - "with-partners": 그 지역 근처에 제휴처가 1곳 이상 있을 때만 색인·사이트맵 포함, 없으면 noindex
     */
    indexPolicy: "always" | "with-partners";
    tone: ServiceTone;
    icon: "flower" | "scissors" | "home" | "hand" | "car" | "award";
    /** 동물보호법상 영업 종류 — 에이전시는 해당 허가·등록 업체만 연결 */
    license: { kind: string; type: "허가" | "등록"; desc: string };
    available24h: boolean;
    tagline: string;
    intro: string;
    process: { title: string; desc: string }[];
    prices: PriceRow[];
    priceNote: string;
    checklist: { title: string; items: string[] };
    faqs: Faq[];
    guideSlugs: string[];
}

export const SERVICES: Service[] = [
    {
        slug: "funeral",
        name: "반려동물 장례",
        short: "장례",
        keyword: "반려동물 장례식장",
        altKeywords: ["강아지 장례식장", "반려동물 장례", "고양이 장례", "강아지 화장", "애견 장례", "반려동물 화장"],
        status: "live",
        indexPolicy: "always",
        tone: "dusk",
        icon: "flower",
        license: {
            kind: "동물장묘업",
            type: "허가",
            desc: "동물보호법에 따라 지자체 허가를 받은 동물장묘업체만 반려동물을 화장할 수 있습니다. 포온은 허가 업체만 연결합니다.",
        },
        available24h: true,
        tagline: "떠나는 날, 가장 가까운 허가 장례식장에서 배웅할 수 있도록",
        intro:
            "아이가 떠난 직후에는 무엇부터 해야 할지 막막합니다. 포온은 보호자님이 계신 동네와 지금 시간대의 이동 여건을 확인해, 오늘 배웅할 수 있는 허가 장례식장과 픽업 방법, 예상 비용을 한 번에 안내합니다.",
        process: [
            { title: "상담 접수", desc: "계신 동네, 아이 체중, 원하시는 시간만 알려 주세요. 상담은 24시간 받습니다." },
            { title: "가까운 허가 업체 확인", desc: "이동 시간, 당일 예약 가능 여부, 픽업 가능 여부를 함께 비교해 안내합니다." },
            { title: "안치·이동", desc: "직접 모시고 가셔도 되고, 운구(픽업) 차량을 요청하셔도 됩니다." },
            { title: "추모·염습", desc: "추모실에서 마지막 인사를 나누는 동안, 장례지도사가 아이의 몸을 단정하게 정리합니다." },
            { title: "개별 화장·참관", desc: "다른 아이와 섞이지 않는 개별 화장을 보호자님이 곁에서 직접 지켜볼 수 있습니다." },
            { title: "유골 인도", desc: "유골함, 메모리얼스톤, 봉안당 안치 가운데 원하시는 방식으로 모십니다. 결정은 천천히 하셔도 됩니다." },
        ],
        prices: [
            { label: "기본 장례 (5kg 미만)", range: "20만 ~ 30만 원", note: "추모실·염습·개별 화장·기본 유골함 포함 기준" },
            { label: "기본 장례 (5~10kg)", range: "30만 ~ 40만 원", note: "체중 구간별 추가 비용 발생" },
            { label: "기본 장례 (10~20kg)", range: "40만 ~ 60만 원" },
            { label: "기본 장례 (20kg 이상)", range: "60만 원 ~", note: "대형견은 업체별 편차가 큼" },
            { label: "수의·관 (선택)", range: "5만 ~ 30만 원" },
            { label: "메모리얼스톤 (선택)", range: "30만 ~ 70만 원", note: "체중·개수에 따라 상이" },
            { label: "운구(픽업) 차량 (선택)", range: "3만 ~ 12만 원", note: "출발지와 업체 간 거리·시간대 기준" },
        ],
        priceNote:
            "서울·경기 허가 업체들이 공개한 가격 범위를 정리한 참고값입니다. 실제 금액은 업체, 체중, 선택 항목에 따라 달라지며 상담할 때 연결 업체의 확정 견적을 먼저 알려 드립니다.",
        checklist: {
            title: "장례식장 결정 전 꼭 확인할 것",
            items: [
                "동물장묘업 허가 업체인지 (동물보호관리시스템에서 직접 조회할 수 있습니다)",
                "개별 화장인지, 화장 전 과정을 참관할 수 있는지",
                "기본 비용에 포함된 항목과 선택 항목이 구분돼 있는지",
                "오늘 진행할 수 있는 시간과 이동(픽업) 방법",
                "유골 인도 방식과 소요 시간",
            ],
        },
        faqs: [
            {
                q: "아이가 방금 떠났어요. 지금 무엇부터 해야 하나요?",
                a: "서두르지 않으셔도 됩니다. 몸을 바르게 눕혀 눈과 입을 살며시 감겨 주고, 수건으로 감싼 뒤 시원한 곳에 두세요. 여름철이거나 장례까지 시간이 걸린다면 얼음팩을 수건에 싸서 배와 등 쪽에 대 주면 됩니다. 그다음 포온에 연락 주시면 가까운 장례식장과 시간을 바로 확인해 드립니다.",
            },
            {
                q: "반려동물을 집 마당이나 산에 묻어도 되나요?",
                a: "현행법상 반려동물 사체를 땅에 묻는 것은 허용되지 않습니다. 합법적인 방법은 생활폐기물로 배출, 동물병원 위탁 처리, 허가받은 동물장묘업체에서의 장례(화장 등) 세 가지입니다.",
            },
            {
                q: "당일 장례가 가능한가요?",
                a: "대부분의 허가 장례식장은 사전 예약 없이 당일 진행이 가능합니다. 다만 시간대마다 예약 상황이 달라, 포온이 지금 바로 진행할 수 있는 곳을 확인해 안내합니다.",
            },
            {
                q: "개별 화장과 공동 화장은 어떻게 다른가요?",
                a: "개별 화장은 한 아이만 단독으로 화장해 유골을 온전히 돌려받는 방식입니다. 공동 화장은 여러 아이를 함께 화장하기 때문에 유골을 돌려받을 수 없습니다. 포온은 개별 화장과 전 과정 참관이 가능한 업체를 먼저 연결합니다.",
            },
            {
                q: "직접 이동하기 어려우면 어떻게 하나요?",
                a: "운구(픽업) 서비스를 이용할 수 있습니다. 출발 위치와 시간에 따라 가능 여부와 비용이 달라, 상담할 때 함께 확인해 드립니다.",
            },
            {
                q: "장례 후 동물등록은 어떻게 하나요?",
                a: "등록된 반려견이 죽으면 30일 이내에 시·군·구청 또는 정부24에서 등록 말소 신고를 해야 하며, 하지 않으면 과태료가 부과될 수 있습니다. 장례식장에서 받는 장례(화장) 증명서를 첨부하면 됩니다.",
            },
            {
                q: "포온에 따로 내는 수수료가 있나요?",
                a: "상담과 업체 연결은 무료입니다. 장례 비용은 연결된 장례식장에 직접 결제하시며, 포온이 안내한 견적 외에 추가 비용을 요구받으면 바로 알려 주세요.",
            },
        ],
        guideSlugs: [
            "pet-death-first-steps",
            "pet-funeral-cost",
            "licensed-pet-crematorium-check",
            "pet-body-legal-options",
            "individual-vs-group-cremation",
            "pet-ashes-options",
            "cat-funeral",
            "pet-registration-cancel",
            "pet-loss-care",
        ],
    },
    {
        slug: "grooming",
        name: "반려동물 미용",
        short: "미용",
        keyword: "애견미용",
        altKeywords: ["강아지 미용", "애견미용실", "고양이 미용", "펫미용", "반려견 미용", "가위컷"],
        status: "live",
        indexPolicy: "with-partners",
        tone: "clay",
        icon: "scissors",
        license: {
            kind: "동물미용업",
            type: "등록",
            desc: "동물보호법상 반려동물 미용은 지자체에 등록한 동물미용업체만 영업할 수 있습니다. 포온은 등록 업체만 연결합니다.",
        },
        available24h: false,
        tagline: "산책길에 들르기 좋은, 우리 아이에게 맞는 미용실로",
        intro:
            "미용실은 가까울수록 아이도 보호자도 덜 지칩니다. 포온은 보호자님 동네에서 오가기 편한 등록 미용업체 가운데 아이의 견종, 체중, 성향(예민함, 노령, 피부 상태)에 맞는 곳을 골라 예약까지 연결합니다.",
        process: [
            { title: "상담 접수", desc: "동네, 견종·묘종, 체중, 원하는 스타일과 아이 성향을 알려 주세요." },
            { title: "맞춤 미용실 추천", desc: "오가는 거리, 1:1 미용 여부, 예민한 아이를 맡아 본 경험을 기준으로 추천합니다." },
            { title: "예약 확정", desc: "원하시는 날짜와 시간, 예상 비용을 확인한 뒤 예약을 잡아 드립니다." },
            { title: "미용 진행", desc: "데려가기 어려우시면 미용실 픽업이 가능한지도 함께 확인해 드립니다." },
        ],
        prices: [
            { label: "목욕 + 위생미용 (소형견)", range: "3만 ~ 5만 원", note: "발바닥·항문·배 부분 정리 포함" },
            { label: "전체 클리핑 (소형견)", range: "4만 ~ 7만 원" },
            { label: "가위컷 (소형견)", range: "7만 ~ 12만 원", note: "스타일·털 상태에 따라 상이" },
            { label: "중·대형견 미용", range: "8만 원 ~", note: "체중·견종별 편차가 큼" },
            { label: "고양이 미용", range: "8만 ~ 15만 원", note: "무마취 진행 여부 확인 필요" },
            { label: "엉킴·스파·약욕 (선택)", range: "1만 ~ 3만 원 추가" },
        ],
        priceNote:
            "서울·경기 일반 미용실이 공개한 가격 범위를 정리한 참고값입니다. 실제 금액은 미용실, 체중, 털 상태에 따라 달라지며 예약 전에 확정 금액을 먼저 알려 드립니다.",
        checklist: {
            title: "미용실 고르기 전 확인할 것",
            items: [
                "동물미용업 등록 업체인지",
                "1:1 미용인지, 여러 아이를 동시에 맡는지",
                "미용 과정을 보호자가 볼 수 있는지 (CCTV 또는 참관)",
                "노령견, 예민한 아이, 피부질환이 있는 아이를 맡아 본 경험",
                "미용 중 상처가 생겼을 때의 대응 기준",
            ],
        },
        faqs: [
            { q: "첫 미용은 언제부터 하나요?", a: "일반적으로 기초 예방접종을 마친 뒤 시작합니다. 처음에는 목욕과 위생미용처럼 짧은 미용으로 미용실 환경에 익숙해지게 하는 것을 권합니다." },
            { q: "미용은 얼마나 자주 해야 하나요?", a: "털이 계속 자라는 견종(푸들, 비숑, 말티즈 등)은 보통 4~8주 간격으로 전체 미용을 하고, 그 사이 2~4주 간격으로 위생미용을 많이 합니다. 아이의 털 상태와 생활에 맞춰 상담해 드립니다." },
            { q: "예민한 아이도 맡길 수 있을까요?", a: "1:1 미용, 짧게 나눠 하는 미용, 보호자 동반처럼 예민한 아이를 배려할 수 있는 미용실을 따로 골라 안내합니다. 상담할 때 아이의 성향을 자세히 알려 주세요." },
            { q: "고양이 미용은 마취를 하나요?", a: "미용실에서는 마취를 할 수 없습니다. 마취가 필요한 경우 동물병원에서 진행해야 하며, 무마취 미용이 가능한지는 고양이 성향에 따라 미용사와 상의해 결정합니다." },
            { q: "포온을 통하면 더 비싼가요?", a: "아니요. 상담과 연결은 무료이고, 비용은 미용실 가격 그대로 미용실에 직접 결제합니다." },
        ],
        guideSlugs: ["dog-grooming-cycle", "dog-grooming-price", "cat-grooming-anesthesia"],
    },
    {
        slug: "hotel",
        name: "반려동물 호텔·위탁",
        short: "호텔",
        keyword: "애견호텔",
        altKeywords: ["강아지 호텔", "애견 위탁", "반려견 호텔", "고양이 호텔", "펫호텔"],
        status: "soon",
        indexPolicy: "with-partners",
        tone: "pine",
        icon: "home",
        license: { kind: "동물위탁관리업", type: "등록", desc: "보호자 대신 반려동물을 맡아 돌보는 영업은 동물위탁관리업 등록이 필요합니다." },
        available24h: false,
        tagline: "집을 비우는 날에도, 가까운 곳에서 편히 머물 수 있도록",
        intro: "여행이나 출장, 입원처럼 집을 비워야 할 때 동네에서 가까운 등록 위탁관리업체를 연결합니다. 지금은 제휴처를 모으는 중이며, 상담을 남겨 주시면 우리 동네에서 연결을 시작할 때 먼저 알려 드립니다.",
        process: [
            { title: "상담 접수", desc: "맡길 기간, 아이 정보, 특이사항을 알려주세요." },
            { title: "가까운 시설 추천", desc: "CCTV, 24시간 상주 여부, 아이별 분리 공간을 기준으로 안내합니다." },
            { title: "예약·입실", desc: "예방접종 기록과 평소 사료·약을 준비해 입실합니다." },
        ],
        prices: [{ label: "소형견 1박", range: "3만 ~ 6만 원", note: "시설·서비스에 따라 상이" }],
        priceNote: "일반적인 공개 가격 범위 참고값입니다.",
        checklist: { title: "호텔 고르기 전 확인할 것", items: ["동물위탁관리업 등록 여부", "야간 상주 인원", "CCTV·사진 공유", "아이별 분리 공간"] },
        faqs: [{ q: "언제 오픈하나요?", a: "지역별 제휴처가 확보되는 대로 차례로 엽니다. 상담을 남겨 주시면 우리 동네에서 시작할 때 알려 드립니다." }],
        guideSlugs: [],
    },
    {
        slug: "petsitter",
        name: "펫시터·방문 돌봄",
        short: "펫시터",
        keyword: "펫시터",
        altKeywords: ["방문 펫시터", "강아지 돌봄", "고양이 방문 탁묘", "산책 대행"],
        status: "soon",
        indexPolicy: "with-partners",
        tone: "pine",
        icon: "hand",
        license: { kind: "동물위탁관리업 등", type: "등록", desc: "시설에서 맡아 돌보는 영업은 동물위탁관리업 등록 대상입니다. 방문형 펫시터는 업체 소속·신원 확인·배상책임보험 가입 여부를 함께 확인해 연결합니다." },
        available24h: false,
        tagline: "아이가 가장 편한 집에서, 이웃처럼 찾아오는 돌봄",
        intro: "낯선 곳이 힘든 아이를 위해 집으로 찾아가는 방문 돌봄과 산책을 연결합니다. 지금은 제휴처를 모으는 중입니다.",
        process: [
            { title: "상담 접수", desc: "방문 일정, 아이 정보, 돌봄 범위를 알려주세요." },
            { title: "펫시터 매칭", desc: "신원이 확인된 업체 소속 펫시터를 동네 기준으로 연결합니다." },
            { title: "방문·리포트", desc: "방문 후 사진과 돌봄 기록을 받아보세요." },
        ],
        prices: [{ label: "1회 방문 (30~60분)", range: "2만 ~ 4만 원" }],
        priceNote: "일반적인 공개 가격 범위 참고값입니다.",
        checklist: { title: "펫시터 맡기기 전 확인할 것", items: ["업체 소속·신원 확인 여부", "배상책임보험 가입 여부", "사전 대면 상담 여부", "돌봄 기록 공유 방식"] },
        faqs: [{ q: "언제 오픈하나요?", a: "지역별 제휴처가 확보되는 대로 차례로 엽니다." }],
        guideSlugs: [],
    },
    {
        slug: "pet-taxi",
        name: "펫택시·반려동물 이동",
        short: "펫택시",
        keyword: "펫택시",
        altKeywords: ["반려동물 택시", "애견 택시", "동물병원 이동", "반려동물 운송"],
        status: "soon",
        indexPolicy: "with-partners",
        tone: "pine",
        icon: "car",
        license: { kind: "동물운송업", type: "등록", desc: "반려동물을 유상으로 운송하는 영업은 동물운송업 등록이 필요합니다." },
        available24h: false,
        tagline: "병원 가는 길, 미용 가는 길을 반려동물 전용 차량으로",
        intro: "대중교통을 타기 어려운 아이를 위해 등록 운송업체의 반려동물 전용 차량을 연결합니다. 지금은 제휴처를 모으는 중입니다.",
        process: [
            { title: "상담 접수", desc: "출발지·도착지·시간을 알려주세요." },
            { title: "차량 배정", desc: "등록 운송업체 차량을 배정합니다." },
            { title: "이동", desc: "케이지·안전벨트를 갖춘 차량으로 이동합니다." },
        ],
        prices: [{ label: "기본 요금", range: "업체·거리별 상이" }],
        priceNote: "일반적인 참고값입니다.",
        checklist: { title: "펫택시 이용 전 확인할 것", items: ["동물운송업 등록 여부", "케이지·안전장치", "보호자 동승 가능 여부"] },
        faqs: [{ q: "언제 오픈하나요?", a: "지역별 제휴처가 확보되는 대로 차례로 엽니다." }],
        guideSlugs: [],
    },
    {
        slug: "training",
        name: "반려견 훈련·교육",
        short: "훈련",
        keyword: "강아지 훈련",
        altKeywords: ["반려견 교육", "애견 훈련소", "방문 훈련", "분리불안 교육"],
        status: "soon",
        indexPolicy: "with-partners",
        tone: "pine",
        icon: "award",
        license: { kind: "반려동물행동지도사 등", type: "등록", desc: "국가자격 반려동물행동지도사 등 자격 보유 여부를 확인해 연결합니다." },
        available24h: false,
        tagline: "짖음·분리불안·산책 고민, 집 가까운 훈련사와 함께",
        intro: "생활 속 행동 고민을 동네 가까운 훈련사와 함께 풀어 갈 수 있도록 연결합니다. 지금은 제휴처를 모으는 중입니다.",
        process: [
            { title: "상담 접수", desc: "고민되는 행동과 아이 정보를 알려주세요." },
            { title: "훈련사 매칭", desc: "방문·센터 교육 중 맞는 방식을 안내합니다." },
            { title: "교육 진행", desc: "보호자와 함께하는 교육으로 진행됩니다." },
        ],
        prices: [{ label: "방문 교육 1회", range: "업체별 상이" }],
        priceNote: "일반적인 참고값입니다.",
        checklist: { title: "훈련사 고르기 전 확인할 것", items: ["자격 보유 여부", "교육 방식(강압 훈련 여부)", "사후 관리"] },
        faqs: [{ q: "언제 오픈하나요?", a: "지역별 제휴처가 확보되는 대로 차례로 엽니다." }],
        guideSlugs: [],
    },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const liveServices = () => SERVICES.filter((s) => s.status === "live");

export const TONE: Record<ServiceTone, { fg: string; bg: string; soft: string; text: string }> = {
    dusk: { fg: "text-dusk", bg: "bg-dusk", soft: "bg-dusk-soft", text: "text-dusk" },
    clay: { fg: "text-clay", bg: "bg-clay", soft: "bg-clay-soft", text: "text-clay" },
    pine: { fg: "text-pine", bg: "bg-pine", soft: "bg-pine-soft", text: "text-pine" },
};
