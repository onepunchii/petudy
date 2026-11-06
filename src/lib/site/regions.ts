/**
 * 지역 데이터 — 지역 페이지의 "고유한 내용"은 대부분 여기서 나옵니다.
 *
 * 작성 원칙
 * - 행정동은 번호를 뺀 동 이름 기준(예: 자양1~4동 → 자양)으로 "주요 동네"만 묶습니다.
 * - landmarks 는 실제 산책·생활 장소, roads 는 실제 주요 간선도로만 적습니다.
 * - note 는 지역의 지리·생활권 사실만 적고, 확인되지 않은 수치·평판은 쓰지 않습니다.
 * - 좌표(lat/lng)는 구청·시청 인근 대략값입니다. "내 위치로 찾기"의 최근접 지역 계산에 쓰입니다.
 */

export type SidoSlug = "seoul" | "gyeonggi";

export interface RegionArea {
    /** 생활권 이름 (예: "건대입구 생활권") */
    name: string;
    /** 동네 이름 (예: ["자양", "화양"]) — 화면에서는 "자양동"으로 표시 */
    dongs: string[];
}

export interface Region {
    sido: SidoSlug;
    slug: string;
    name: string;
    short: string;
    lat: number;
    lng: number;
    areas: RegionArea[];
    landmarks: string[];
    stations: string[];
    roads: string[];
    neighbors: string[];
    /** 한강·큰 하천과 맞닿아 있는지 (지도 그래픽용) */
    river: boolean;
    note: string;
}

export const SIDO: Record<SidoSlug, { slug: SidoSlug; name: string; short: string }> = {
    seoul: { slug: "seoul", name: "서울특별시", short: "서울" },
    gyeonggi: { slug: "gyeonggi", name: "경기도", short: "경기" },
};

export const REGIONS: Region[] = [
    // ─────────────────────────── 서울 동북권 ───────────────────────────
    {
        sido: "seoul", slug: "gwangjin", name: "광진구", short: "광진", lat: 37.5385, lng: 127.0823,
        areas: [
            { name: "건대입구 생활권", dongs: ["자양", "화양"] },
            { name: "구의·광나루 생활권", dongs: ["구의", "광장"] },
            { name: "군자·중곡 생활권", dongs: ["군자", "중곡", "능동"] },
        ],
        landmarks: ["서울어린이대공원", "뚝섬한강공원", "광나루한강공원", "아차산"],
        stations: ["건대입구역", "구의역", "강변역", "광나루역", "군자역", "어린이대공원역"],
        roads: ["강변북로", "동부간선도로", "천호대로"],
        neighbors: ["seongdong", "dongdaemun", "jungnang", "gangdong", "songpa", "guri"],
        river: true,
        note: "건대입구·구의역 일대 원룸·오피스텔 밀집 지역과 광장동 아파트 단지, 중곡동 주택가가 한 구 안에 함께 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "seongdong", name: "성동구", short: "성동", lat: 37.5634, lng: 127.0369,
        areas: [
            { name: "왕십리·행당 생활권", dongs: ["왕십리", "행당", "마장", "사근", "응봉"] },
            { name: "금호·옥수 생활권", dongs: ["금호", "옥수"] },
            { name: "성수 생활권", dongs: ["성수", "송정", "용답"] },
        ],
        landmarks: ["서울숲", "응봉산", "중랑천 산책로", "살곶이 체육공원"],
        stations: ["왕십리역", "성수역", "서울숲역", "뚝섬역", "옥수역", "금호역"],
        roads: ["강변북로", "동부간선도로", "왕십리로"],
        neighbors: ["gwangjin", "jung", "dongdaemun", "yongsan", "gangnam"],
        river: true,
        note: "왕십리 역세권과 금호·옥수의 언덕 아파트 단지, 서울숲을 낀 성수동이 중랑천을 경계로 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "dongdaemun", name: "동대문구", short: "동대문", lat: 37.5744, lng: 127.0396,
        areas: [
            { name: "청량리·제기 생활권", dongs: ["청량리", "제기", "용신"] },
            { name: "전농·답십리 생활권", dongs: ["전농", "답십리"] },
            { name: "장안 생활권", dongs: ["장안"] },
            { name: "회기·이문 생활권", dongs: ["회기", "휘경", "이문"] },
        ],
        landmarks: ["배봉산 근린공원", "중랑천 산책로", "홍릉숲", "답십리 공원"],
        stations: ["청량리역", "회기역", "답십리역", "장한평역", "외대앞역"],
        roads: ["동부간선도로", "내부순환로", "왕산로"],
        neighbors: ["seongdong", "gwangjin", "jungnang", "seongbuk", "jongno"],
        river: false,
        note: "청량리 환승 역세권과 회기·이문 대학가, 장안동 주택가가 중랑천 서쪽으로 길게 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "jungnang", name: "중랑구", short: "중랑", lat: 37.6063, lng: 127.0925,
        areas: [
            { name: "면목 생활권", dongs: ["면목"] },
            { name: "상봉·중화 생활권", dongs: ["상봉", "중화"] },
            { name: "묵·신내 생활권", dongs: ["묵", "신내"] },
            { name: "망우 생활권", dongs: ["망우"] },
        ],
        landmarks: ["중랑천 장미터널", "용마산", "봉화산", "망우역사문화공원"],
        stations: ["상봉역", "망우역", "면목역", "신내역", "중화역", "먹골역"],
        roads: ["동부간선도로", "북부간선도로", "망우로"],
        neighbors: ["dongdaemun", "gwangjin", "nowon", "seongbuk", "guri"],
        river: false,
        note: "중랑천과 용마산·봉화산 사이에 자리해 면목동 주택가와 신내동 아파트 단지가 함께 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "seongbuk", name: "성북구", short: "성북", lat: 37.5894, lng: 127.0167,
        areas: [
            { name: "성북·삼선 생활권", dongs: ["성북", "삼선", "동선"] },
            { name: "돈암·안암·보문 생활권", dongs: ["돈암", "안암", "보문"] },
            { name: "정릉·길음 생활권", dongs: ["정릉", "길음"] },
            { name: "종암·월곡 생활권", dongs: ["종암", "월곡"] },
            { name: "장위·석관 생활권", dongs: ["장위", "석관"] },
        ],
        landmarks: ["개운산", "북한산 정릉 계곡", "오동공원", "성북천"],
        stations: ["성신여대입구역", "한성대입구역", "길음역", "고려대역", "월곡역", "안암역"],
        roads: ["내부순환로", "북부간선도로", "동소문로"],
        neighbors: ["jongno", "dongdaemun", "gangbuk", "jungnang", "nowon"],
        river: false,
        note: "성북동 주택가와 길음·장위 뉴타운 아파트 단지, 안암 대학가가 언덕을 따라 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "gangbuk", name: "강북구", short: "강북", lat: 37.6396, lng: 127.0257,
        areas: [
            { name: "미아·삼양 생활권", dongs: ["미아", "삼양", "송중", "송천", "삼각산"] },
            { name: "번동·수유 생활권", dongs: ["번", "수유"] },
            { name: "우이·인수 생활권", dongs: ["우이", "인수"] },
        ],
        landmarks: ["북서울꿈의숲", "북한산 우이령길", "우이천", "4·19 민주묘지 둘레길"],
        stations: ["미아사거리역", "수유역", "미아역", "4·19민주묘지역"],
        roads: ["내부순환로", "도봉로", "삼양로"],
        neighbors: ["seongbuk", "dobong", "nowon"],
        river: false,
        note: "북한산 자락 아래 우이동·인수동과 미아사거리 역세권, 번동 아파트 단지가 함께 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "dobong", name: "도봉구", short: "도봉", lat: 37.6688, lng: 127.0471,
        areas: [
            { name: "쌍문 생활권", dongs: ["쌍문"] },
            { name: "방학 생활권", dongs: ["방학"] },
            { name: "창동 생활권", dongs: ["창"] },
            { name: "도봉 생활권", dongs: ["도봉"] },
        ],
        landmarks: ["도봉산", "중랑천 산책로", "서울창포원", "초안산"],
        stations: ["창동역", "쌍문역", "방학역", "도봉산역"],
        roads: ["동부간선도로", "도봉로"],
        neighbors: ["gangbuk", "nowon", "uijeongbu"],
        river: false,
        note: "도봉산과 중랑천 사이로 창동·쌍문·방학 아파트 단지가 이어지고, 북쪽으로 의정부와 맞닿은 생활권입니다.",
    },
    {
        sido: "seoul", slug: "nowon", name: "노원구", short: "노원", lat: 37.6542, lng: 127.0568,
        areas: [
            { name: "월계 생활권", dongs: ["월계"] },
            { name: "공릉 생활권", dongs: ["공릉"] },
            { name: "하계·중계 생활권", dongs: ["하계", "중계"] },
            { name: "상계 생활권", dongs: ["상계"] },
        ],
        landmarks: ["경춘선숲길", "불암산", "수락산", "당현천", "중랑천 산책로"],
        stations: ["노원역", "상계역", "중계역", "하계역", "공릉역", "태릉입구역"],
        roads: ["동부간선도로", "북부간선도로", "동일로"],
        neighbors: ["dobong", "gangbuk", "jungnang", "seongbuk", "uijeongbu", "namyangju"],
        river: false,
        note: "상계·중계·하계로 이어지는 대단지 아파트 생활권으로, 경춘선숲길과 당현천 산책로가 동네 사이를 지납니다.",
    },
    // ─────────────────────────── 서울 도심·서북권 ───────────────────────────
    {
        sido: "seoul", slug: "jongno", name: "종로구", short: "종로", lat: 37.5735, lng: 126.979,
        areas: [
            { name: "서촌·부암 생활권", dongs: ["청운효자", "사직", "부암", "평창", "무악", "교남"] },
            { name: "북촌·삼청 생활권", dongs: ["삼청", "가회"] },
            { name: "대학로·혜화 생활권", dongs: ["이화", "혜화"] },
            { name: "창신·숭인 생활권", dongs: ["창신", "숭인"] },
        ],
        landmarks: ["인왕산 자락길", "낙산공원", "북악산 한양도성길", "청계천"],
        stations: ["광화문역", "종로3가역", "혜화역", "경복궁역", "동대문역"],
        roads: ["내부순환로", "율곡로", "종로"],
        neighbors: ["jung", "seodaemun", "seongbuk", "dongdaemun", "eunpyeong"],
        river: false,
        note: "평창·부암동 산자락 주택가와 서촌·북촌 한옥 골목, 혜화·창신의 오래된 주거지가 함께 있는 도심 생활권입니다.",
    },
    {
        sido: "seoul", slug: "jung", name: "중구", short: "중구", lat: 37.5638, lng: 126.9976,
        areas: [
            { name: "명동·회현 생활권", dongs: ["소공", "회현", "명동"] },
            { name: "을지로·필동 생활권", dongs: ["을지로", "필동", "광희"] },
            { name: "신당·약수 생활권", dongs: ["신당", "다산", "약수", "청구", "동화", "황학"] },
            { name: "장충·중림 생활권", dongs: ["장충", "중림"] },
        ],
        landmarks: ["남산공원", "청계천", "서울로7017", "장충단공원"],
        stations: ["시청역", "을지로3가역", "신당역", "약수역", "충무로역", "서울역"],
        roads: ["퇴계로", "을지로", "다산로"],
        neighbors: ["jongno", "yongsan", "seongdong", "seodaemun", "mapo"],
        river: false,
        note: "업무지구 사이로 신당·약수·청구의 아파트와 주택가가 남산 동쪽 자락에 모여 있는 도심 생활권입니다.",
    },
    {
        sido: "seoul", slug: "yongsan", name: "용산구", short: "용산", lat: 37.5326, lng: 126.9905,
        areas: [
            { name: "후암·남영 생활권", dongs: ["후암", "용산2가", "남영"] },
            { name: "청파·효창 생활권", dongs: ["청파", "효창", "원효로", "용문"] },
            { name: "이촌·한강로 생활권", dongs: ["이촌", "한강로"] },
            { name: "이태원·한남 생활권", dongs: ["이태원", "한남", "보광", "서빙고"] },
        ],
        landmarks: ["용산가족공원", "이촌한강공원", "효창공원", "남산 소월길"],
        stations: ["용산역", "삼각지역", "이촌역", "이태원역", "한강진역", "숙대입구역"],
        roads: ["강변북로", "한강대로", "이태원로"],
        neighbors: ["jung", "mapo", "seongdong", "dongjak", "seocho", "gangnam"],
        river: true,
        note: "남산 남쪽 경사지의 후암·이태원·한남 주택가와 한강 변 이촌동 아파트 단지가 함께 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "eunpyeong", name: "은평구", short: "은평", lat: 37.6027, lng: 126.9291,
        areas: [
            { name: "불광·녹번·대조 생활권", dongs: ["불광", "녹번", "대조"] },
            { name: "응암·역촌·신사 생활권", dongs: ["응암", "역촌", "신사"] },
            { name: "갈현·구산 생활권", dongs: ["갈현", "구산"] },
            { name: "증산·수색 생활권", dongs: ["증산", "수색"] },
            { name: "진관 생활권", dongs: ["진관"] },
        ],
        landmarks: ["북한산 둘레길", "불광천 산책로", "봉산", "은평한옥마을"],
        stations: ["연신내역", "불광역", "응암역", "구파발역", "수색역", "녹번역"],
        roads: ["통일로", "내부순환로", "서오릉로"],
        neighbors: ["seodaemun", "mapo", "jongno", "goyang"],
        river: false,
        note: "북한산 서쪽 자락의 진관동 은평뉴타운과 불광천을 따라 이어지는 응암·증산 주택가가 함께 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "seodaemun", name: "서대문구", short: "서대문", lat: 37.5791, lng: 126.9368,
        areas: [
            { name: "신촌·아현 생활권", dongs: ["신촌", "충현", "북아현", "천연"] },
            { name: "연희 생활권", dongs: ["연희"] },
            { name: "홍제·홍은 생활권", dongs: ["홍제", "홍은"] },
            { name: "가좌 생활권", dongs: ["남가좌", "북가좌"] },
        ],
        landmarks: ["안산 자락길", "홍제천 산책로", "독립문공원", "백련산"],
        stations: ["신촌역", "홍제역", "독립문역", "가좌역", "무악재역"],
        roads: ["내부순환로", "성산로", "통일로"],
        neighbors: ["mapo", "eunpyeong", "jongno", "jung"],
        river: false,
        note: "안산을 가운데 두고 신촌 대학가, 연희동 단독주택가, 홍제·가좌 아파트 단지가 둘러싼 생활권입니다.",
    },
    {
        sido: "seoul", slug: "mapo", name: "마포구", short: "마포", lat: 37.5663, lng: 126.9019,
        areas: [
            { name: "공덕·아현 생활권", dongs: ["공덕", "아현", "도화"] },
            { name: "용강·대흥 생활권", dongs: ["용강", "대흥", "염리", "신수"] },
            { name: "홍대·합정 생활권", dongs: ["서교", "합정", "서강"] },
            { name: "망원·연남 생활권", dongs: ["망원", "연남", "성산"] },
            { name: "상암 생활권", dongs: ["상암"] },
        ],
        landmarks: ["망원한강공원", "경의선숲길", "월드컵공원(하늘공원)", "홍제천 산책로"],
        stations: ["공덕역", "홍대입구역", "합정역", "망원역", "디지털미디어시티역", "마포역"],
        roads: ["강변북로", "내부순환로", "마포대로"],
        neighbors: ["seodaemun", "eunpyeong", "yongsan", "yeongdeungpo", "gangseo", "jung"],
        river: true,
        note: "공덕·아현 아파트 단지부터 연남·망원의 골목 주택가, 상암 신도시까지 경의선숲길과 한강을 따라 이어지는 생활권입니다.",
    },
    // ─────────────────────────── 서울 서남권 ───────────────────────────
    {
        sido: "seoul", slug: "gangseo", name: "강서구", short: "강서", lat: 37.5509, lng: 126.8495,
        areas: [
            { name: "염창·등촌 생활권", dongs: ["염창", "등촌"] },
            { name: "화곡·우장산 생활권", dongs: ["화곡", "우장산"] },
            { name: "마곡·가양 생활권", dongs: ["가양", "발산"] },
            { name: "공항·방화 생활권", dongs: ["공항", "방화"] },
        ],
        landmarks: ["서울식물원", "강서한강공원", "우장산공원", "개화산"],
        stations: ["마곡나루역", "발산역", "까치산역", "화곡역", "등촌역", "가양역"],
        roads: ["올림픽대로", "공항대로", "남부순환로"],
        neighbors: ["yangcheon", "mapo", "yeongdeungpo", "gimpo", "bucheon"],
        river: true,
        note: "화곡동 다세대 주택가와 마곡 신도시, 가양·등촌 아파트 단지가 서울식물원과 한강을 끼고 넓게 퍼진 생활권입니다.",
    },
    {
        sido: "seoul", slug: "yangcheon", name: "양천구", short: "양천", lat: 37.517, lng: 126.8665,
        areas: [
            { name: "목동 생활권", dongs: ["목"] },
            { name: "신정 생활권", dongs: ["신정"] },
            { name: "신월 생활권", dongs: ["신월"] },
        ],
        landmarks: ["안양천 산책로", "서서울호수공원", "파리공원", "용왕산"],
        stations: ["오목교역", "목동역", "신정역", "신정네거리역", "양천구청역"],
        roads: ["남부순환로", "서부간선도로", "오목로"],
        neighbors: ["gangseo", "yeongdeungpo", "guro", "bucheon"],
        river: false,
        note: "목동 신시가지 대단지 아파트와 신월·신정동 주택가가 안양천 서쪽에 모여 있는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "guro", name: "구로구", short: "구로", lat: 37.4954, lng: 126.8874,
        areas: [
            { name: "신도림·구로 생활권", dongs: ["신도림", "구로"] },
            { name: "가리봉 생활권", dongs: ["가리봉"] },
            { name: "고척·개봉 생활권", dongs: ["고척", "개봉"] },
            { name: "오류·항동 생활권", dongs: ["오류", "수궁", "항동"] },
        ],
        landmarks: ["안양천 산책로", "푸른수목원", "항동철길", "고척근린공원"],
        stations: ["신도림역", "구로역", "구로디지털단지역", "개봉역", "오류동역"],
        roads: ["서부간선도로", "남부순환로", "경인로"],
        neighbors: ["yangcheon", "yeongdeungpo", "geumcheon", "gwanak", "gwangmyeong", "bucheon"],
        river: false,
        note: "신도림 환승 역세권과 구로디지털단지, 개봉·오류동 주택가, 항동 신규 단지가 안양천을 따라 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "geumcheon", name: "금천구", short: "금천", lat: 37.4569, lng: 126.8955,
        areas: [
            { name: "가산 생활권", dongs: ["가산"] },
            { name: "독산 생활권", dongs: ["독산"] },
            { name: "시흥 생활권", dongs: ["시흥"] },
        ],
        landmarks: ["안양천 산책로", "호암산", "금천한내 산책로", "독산근린공원"],
        stations: ["가산디지털단지역", "독산역", "금천구청역", "석수역"],
        roads: ["서부간선도로", "시흥대로", "남부순환로"],
        neighbors: ["guro", "gwanak", "yeongdeungpo", "gwangmyeong", "anyang"],
        river: false,
        note: "가산디지털단지 업무지구와 독산·시흥동 주택가가 안양천과 호암산 사이에 남북으로 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "yeongdeungpo", name: "영등포구", short: "영등포", lat: 37.5264, lng: 126.8962,
        areas: [
            { name: "여의도 생활권", dongs: ["여의"] },
            { name: "당산·문래 생활권", dongs: ["당산", "양평", "문래"] },
            { name: "영등포 생활권", dongs: ["영등포", "도림"] },
            { name: "신길 생활권", dongs: ["신길"] },
            { name: "대림 생활권", dongs: ["대림"] },
        ],
        landmarks: ["여의도한강공원", "샛강생태공원", "선유도공원", "안양천 산책로"],
        stations: ["영등포역", "여의도역", "당산역", "문래역", "신길역", "대림역"],
        roads: ["올림픽대로", "서부간선도로", "여의대로"],
        neighbors: ["mapo", "yangcheon", "guro", "dongjak", "gwanak", "geumcheon"],
        river: true,
        note: "여의도 업무지구와 당산·문래의 아파트·지식산업센터, 신길·대림 주택가가 한강과 안양천 사이에 모인 생활권입니다.",
    },
    {
        sido: "seoul", slug: "dongjak", name: "동작구", short: "동작", lat: 37.5124, lng: 126.9393,
        areas: [
            { name: "노량진·흑석 생활권", dongs: ["노량진", "흑석"] },
            { name: "상도 생활권", dongs: ["상도"] },
            { name: "사당 생활권", dongs: ["사당"] },
            { name: "대방·신대방 생활권", dongs: ["대방", "신대방"] },
        ],
        landmarks: ["보라매공원", "서달산 둘레길", "노들섬", "까치산 근린공원"],
        stations: ["노량진역", "사당역", "총신대입구역", "숭실대입구역", "신대방삼거리역", "흑석역"],
        roads: ["올림픽대로", "동작대로", "상도로"],
        neighbors: ["yeongdeungpo", "gwanak", "seocho", "yongsan"],
        river: true,
        note: "한강 변 흑석·노량진에서 상도동 언덕 아파트, 사당역 환승권까지 남북으로 길게 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "gwanak", name: "관악구", short: "관악", lat: 37.4784, lng: 126.9516,
        areas: [
            { name: "봉천 생활권", dongs: ["보라매", "청림", "성현", "행운", "청룡", "은천", "중앙", "인헌"] },
            { name: "낙성대·남현 생활권", dongs: ["낙성대", "남현"] },
            { name: "신림 생활권", dongs: ["신림", "서원", "신원", "서림", "신사", "난향", "조원", "대학", "삼성", "미성", "난곡"] },
        ],
        landmarks: ["관악산", "도림천 산책로", "낙성대공원", "관악산 생태공원"],
        stations: ["서울대입구역", "봉천역", "신림역", "낙성대역", "신대방역"],
        roads: ["남부순환로", "관악로", "신림로"],
        neighbors: ["dongjak", "seocho", "geumcheon", "guro", "yeongdeungpo", "anyang"],
        river: false,
        note: "관악산 북쪽 경사지를 따라 봉천·신림의 원룸·다세대 주택가와 아파트 단지가 촘촘하게 모인 생활권입니다.",
    },
    // ─────────────────────────── 서울 동남권 ───────────────────────────
    {
        sido: "seoul", slug: "seocho", name: "서초구", short: "서초", lat: 37.4837, lng: 127.0324,
        areas: [
            { name: "반포·잠원 생활권", dongs: ["반포", "잠원"] },
            { name: "서초 생활권", dongs: ["서초"] },
            { name: "방배 생활권", dongs: ["방배"] },
            { name: "양재·내곡 생활권", dongs: ["양재", "내곡"] },
        ],
        landmarks: ["반포한강공원", "양재천 산책로", "양재시민의숲", "서리풀공원", "우면산"],
        stations: ["고속터미널역", "교대역", "강남역", "양재역", "방배역", "신반포역"],
        roads: ["경부고속도로", "올림픽대로", "강남대로", "남부순환로"],
        neighbors: ["gangnam", "dongjak", "gwanak", "yongsan", "seongnam"],
        river: true,
        note: "반포·잠원 한강 변 아파트와 방배동 주택가, 양재천·우면산을 낀 양재·내곡동이 남북으로 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "gangnam", name: "강남구", short: "강남", lat: 37.5172, lng: 127.0473,
        areas: [
            { name: "압구정·청담 생활권", dongs: ["압구정", "신사", "청담"] },
            { name: "논현·역삼 생활권", dongs: ["논현", "역삼"] },
            { name: "삼성·대치 생활권", dongs: ["삼성", "대치"] },
            { name: "도곡·개포 생활권", dongs: ["도곡", "개포"] },
            { name: "일원·수서·세곡 생활권", dongs: ["일원", "수서", "세곡"] },
        ],
        landmarks: ["양재천 산책로", "도산공원", "대모산", "선정릉"],
        stations: ["강남역", "선릉역", "삼성역", "압구정역", "청담역", "수서역"],
        roads: ["올림픽대로", "영동대로", "테헤란로", "동부간선도로"],
        neighbors: ["seocho", "songpa", "seongdong", "gwangjin", "yongsan", "seongnam"],
        river: true,
        note: "압구정·청담 한강 변에서 대치·도곡 학원가, 양재천 남쪽 개포·일원·수서까지 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "songpa", name: "송파구", short: "송파", lat: 37.5145, lng: 127.1059,
        areas: [
            { name: "잠실 생활권", dongs: ["잠실"] },
            { name: "석촌·송파 생활권", dongs: ["석촌", "송파", "삼전"] },
            { name: "방이·오금·풍납 생활권", dongs: ["방이", "오금", "풍납"] },
            { name: "가락·문정 생활권", dongs: ["가락", "문정", "장지"] },
            { name: "거여·마천·위례 생활권", dongs: ["거여", "마천", "위례"] },
        ],
        landmarks: ["올림픽공원", "석촌호수", "잠실한강공원", "성내천 산책로"],
        stations: ["잠실역", "석촌역", "가락시장역", "문정역", "오금역", "마천역"],
        roads: ["올림픽대로", "송파대로", "동부간선도로", "서울외곽순환고속도로"],
        neighbors: ["gangnam", "gangdong", "gwangjin", "hanam", "seongnam"],
        river: true,
        note: "잠실 대단지와 석촌호수 주변, 올림픽공원 옆 방이·오금, 남쪽 문정·위례 신도시까지 이어지는 생활권입니다.",
    },
    {
        sido: "seoul", slug: "gangdong", name: "강동구", short: "강동", lat: 37.5301, lng: 127.1238,
        areas: [
            { name: "천호·성내 생활권", dongs: ["천호", "성내"] },
            { name: "암사 생활권", dongs: ["암사"] },
            { name: "고덕·명일 생활권", dongs: ["고덕", "명일", "상일", "강일"] },
            { name: "길동·둔촌 생활권", dongs: ["길", "둔촌"] },
        ],
        landmarks: ["광나루한강공원(암사)", "일자산", "고덕천 산책로", "길동생태공원"],
        stations: ["천호역", "강동역", "길동역", "고덕역", "명일역", "암사역"],
        roads: ["올림픽대로", "천호대로", "서울외곽순환고속도로"],
        neighbors: ["songpa", "gwangjin", "hanam", "guri"],
        river: true,
        note: "천호 역세권과 암사·고덕·상일 대단지 아파트, 둔촌동이 한강과 일자산 사이에 모인 생활권으로 동쪽으로 하남과 맞닿아 있습니다.",
    },

    // ─────────────────────────── 경기 ───────────────────────────
    {
        sido: "gyeonggi", slug: "seongnam", name: "성남시", short: "성남", lat: 37.42, lng: 127.1267,
        areas: [
            { name: "분당구", dongs: ["정자", "서현", "수내", "이매", "야탑", "판교", "금곡", "구미"] },
            { name: "수정구", dongs: ["신흥", "태평", "단대", "위례", "복정"] },
            { name: "중원구", dongs: ["성남", "중앙", "금광", "상대원", "하대원"] },
        ],
        landmarks: ["율동공원", "탄천 산책로", "성남 중앙공원", "남한산성"],
        stations: ["판교역", "정자역", "서현역", "야탑역", "모란역", "수내역"],
        roads: ["경부고속도로", "분당수서로", "분당내곡로", "서울외곽순환고속도로"],
        neighbors: ["songpa", "gangnam", "seocho", "yongin", "hanam"],
        river: false,
        note: "분당·판교 신도시와 수정·중원의 구도심이 탄천을 따라 남북으로 이어지고, 북쪽으로 송파·강남과 맞닿은 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "goyang", name: "고양시", short: "고양", lat: 37.6584, lng: 126.832,
        areas: [
            { name: "덕양구", dongs: ["화정", "행신", "삼송", "원흥", "지축", "능곡"] },
            { name: "일산동구", dongs: ["마두", "백석", "장항", "풍산", "식사", "정발산"] },
            { name: "일산서구", dongs: ["주엽", "대화", "탄현", "일산"] },
        ],
        landmarks: ["일산호수공원", "행주산성", "정발산 공원", "북한산 둘레길(덕양)"],
        stations: ["대화역", "주엽역", "정발산역", "백석역", "화정역", "삼송역"],
        roads: ["자유로", "서울외곽순환고속도로", "통일로", "제2자유로"],
        neighbors: ["eunpyeong", "mapo", "paju", "gimpo"],
        river: true,
        note: "일산 신도시와 화정·행신·삼송 택지지구가 자유로·한강을 따라 펼쳐진, 서울 서북쪽과 맞닿은 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "yongin", name: "용인시", short: "용인", lat: 37.2411, lng: 127.1776,
        areas: [
            { name: "수지구", dongs: ["풍덕천", "죽전", "동천", "상현", "성복", "신봉"] },
            { name: "기흥구", dongs: ["구갈", "보정", "동백", "영덕", "서천", "상하"] },
            { name: "처인구", dongs: ["역북", "김량장", "유림", "모현읍", "남사읍"] },
        ],
        landmarks: ["기흥호수공원", "동백호수공원", "탄천 산책로(죽전)", "광교산"],
        stations: ["수지구청역", "죽전역", "기흥역", "동백역", "상현역", "보정역"],
        roads: ["경부고속도로", "영동고속도로", "용인서울고속도로", "42번 국도"],
        neighbors: ["seongnam", "suwon", "hwaseong"],
        river: false,
        note: "서울과 가까운 수지·기흥의 아파트 단지와 넓은 처인구 전원 지역이 함께 있어 동네별 이동 거리 차이가 큰 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "suwon", name: "수원시", short: "수원", lat: 37.2636, lng: 127.0286,
        areas: [
            { name: "영통구", dongs: ["영통", "매탄", "원천", "광교", "망포"] },
            { name: "팔달구", dongs: ["인계", "우만", "화서", "행궁", "매교"] },
            { name: "장안구", dongs: ["정자", "조원", "파장", "율천", "송죽"] },
            { name: "권선구", dongs: ["권선", "세류", "호매실", "금곡", "곡선"] },
        ],
        landmarks: ["광교호수공원", "수원화성 둘레길", "만석공원", "서호공원"],
        stations: ["수원역", "광교중앙역", "영통역", "망포역", "성균관대역", "매탄권선역"],
        roads: ["경부고속도로", "영동고속도로", "수원외곽순환도로", "1번 국도"],
        neighbors: ["yongin", "hwaseong", "anyang"],
        river: false,
        note: "수원화성 주변 구도심과 광교·영통·호매실 택지지구가 4개 구에 나뉘어 있는, 경기 남부의 중심 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "bucheon", name: "부천시", short: "부천", lat: 37.5034, lng: 126.766,
        areas: [
            { name: "원미 권역", dongs: ["중동", "상동", "원미", "심곡", "춘의", "도당"] },
            { name: "소사 권역", dongs: ["소사본", "송내", "범박", "괴안", "옥길"] },
            { name: "오정 권역", dongs: ["오정", "고강", "원종", "성곡"] },
        ],
        landmarks: ["부천중앙공원", "상동호수공원", "원미산", "부천 자연생태공원"],
        stations: ["부천역", "송내역", "중동역", "신중동역", "부천시청역", "소사역"],
        roads: ["경인고속도로", "서울외곽순환고속도로", "경인로"],
        neighbors: ["gangseo", "yangcheon", "guro", "gwangmyeong", "siheung", "gimpo"],
        river: false,
        note: "중동·상동 신도시와 원미·소사 구도심이 촘촘하게 붙어 있어, 도시 안 이동 거리가 짧은 서울 서남쪽 접경 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "anyang", name: "안양시", short: "안양", lat: 37.3943, lng: 126.9568,
        areas: [
            { name: "동안구", dongs: ["평촌", "비산", "호계", "귀인", "부림", "관양"] },
            { name: "만안구", dongs: ["안양", "석수", "박달"] },
        ],
        landmarks: ["안양천 산책로", "학의천 산책로", "평촌중앙공원", "안양예술공원"],
        stations: ["범계역", "평촌역", "인덕원역", "안양역", "명학역", "석수역"],
        roads: ["서울외곽순환고속도로", "경수대로", "평촌대로"],
        neighbors: ["gwanak", "geumcheon", "gwangmyeong", "suwon"],
        river: false,
        note: "평촌 신도시 중심의 동안구와 안양역 일대 구도심인 만안구가 안양천·학의천을 따라 나뉘는 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "namyangju", name: "남양주시", short: "남양주", lat: 37.636, lng: 127.2165,
        areas: [
            { name: "다산·도농 권역", dongs: ["다산", "도농", "지금"] },
            { name: "별내 권역", dongs: ["별내"] },
            { name: "호평·평내 권역", dongs: ["호평", "평내", "화도읍"] },
            { name: "와부·덕소 권역", dongs: ["덕소", "와부읍"] },
            { name: "진접·오남 권역", dongs: ["진접읍", "오남읍"] },
        ],
        landmarks: ["물의정원", "다산중앙공원", "천마산", "북한강 자전거길"],
        stations: ["다산역", "별내역", "평내호평역", "도농역", "덕소역", "진접역"],
        roads: ["경춘북로", "서울양양고속도로", "수도권제1순환고속도로", "6번 국도"],
        neighbors: ["guri", "nowon", "hanam", "uijeongbu"],
        river: true,
        note: "다산·별내·호평 신도시와 북한강 변 와부·조안 지역이 넓게 흩어져 있어, 권역마다 이동 경로가 다른 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "hwaseong", name: "화성시", short: "화성", lat: 37.1995, lng: 126.8313,
        areas: [
            { name: "동탄 권역", dongs: ["동탄", "반송", "능동", "석우", "청계"] },
            { name: "병점·봉담 권역", dongs: ["병점", "진안", "봉담읍"] },
            { name: "향남·남양 권역", dongs: ["향남읍", "남양읍", "새솔"] },
            { name: "서부 권역", dongs: ["송산면", "마도면", "서신면"] },
        ],
        landmarks: ["동탄호수공원", "반석산 둘레길", "궁평항", "남양호"],
        stations: ["동탄역", "병점역", "서동탄역"],
        roads: ["경부고속도로", "평택화성고속도로", "서해안고속도로", "봉담동탄고속도로"],
        neighbors: ["suwon", "yongin"],
        river: false,
        note: "동탄 신도시와 병점·봉담 생활권, 서해안 쪽 전원 지역까지 면적이 매우 넓어 권역별 이동 시간이 크게 달라지는 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "hanam", name: "하남시", short: "하남", lat: 37.5393, lng: 127.2149,
        areas: [
            { name: "미사 권역", dongs: ["미사", "망월", "풍산"] },
            { name: "구도심 권역", dongs: ["신장", "덕풍", "창우"] },
            { name: "감일·위례 권역", dongs: ["감일", "감북", "위례", "춘궁"] },
        ],
        landmarks: ["미사경정공원", "당정뜰", "검단산", "덕풍천 산책로"],
        stations: ["미사역", "하남풍산역", "하남시청역", "하남검단산역"],
        roads: ["올림픽대로", "서울양양고속도로", "중부고속도로", "서울외곽순환고속도로"],
        neighbors: ["gangdong", "songpa", "namyangju", "guri", "seongnam"],
        river: true,
        note: "미사·감일·위례 신도시가 강동·송파와 바로 붙어 있고, 한강 변 미사경정공원을 끼고 있는 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "guri", name: "구리시", short: "구리", lat: 37.5943, lng: 127.1296,
        areas: [
            { name: "인창·수택 권역", dongs: ["인창", "수택", "동구동"] },
            { name: "교문·토평 권역", dongs: ["교문", "토평"] },
            { name: "갈매 권역", dongs: ["갈매"] },
        ],
        landmarks: ["구리한강시민공원", "아차산(구리 방면)", "장자호수공원", "동구릉"],
        stations: ["구리역", "장자호수공원역", "동구릉역", "갈매역"],
        roads: ["강변북로", "북부간선도로", "서울외곽순환고속도로"],
        neighbors: ["gwangjin", "jungnang", "namyangju", "gangdong", "hanam"],
        river: true,
        note: "면적이 작고 광진·중랑과 바로 붙어 있어, 서울 동북부 생활권과 거의 하나처럼 움직이는 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "gwangmyeong", name: "광명시", short: "광명", lat: 37.4786, lng: 126.8646,
        areas: [
            { name: "철산·하안 권역", dongs: ["철산", "하안"] },
            { name: "광명 권역", dongs: ["광명"] },
            { name: "소하·일직 권역", dongs: ["소하", "일직"] },
        ],
        landmarks: ["안양천 산책로", "도덕산", "구름산", "광명동굴"],
        stations: ["철산역", "광명사거리역", "광명역(KTX)"],
        roads: ["서부간선도로", "서해안고속도로", "제2경인고속도로"],
        neighbors: ["guro", "geumcheon", "bucheon", "anyang"],
        river: false,
        note: "안양천 하나를 사이에 두고 구로·금천과 마주 보는 도시로, 철산·하안 아파트 단지와 소하·일직 신규 단지로 나뉩니다.",
    },
    {
        sido: "gyeonggi", slug: "gimpo", name: "김포시", short: "김포", lat: 37.6152, lng: 126.7156,
        areas: [
            { name: "한강신도시 권역", dongs: ["장기", "운양", "구래", "마산"] },
            { name: "풍무·사우 권역", dongs: ["풍무", "사우", "걸포", "북변"] },
            { name: "고촌 권역", dongs: ["고촌읍"] },
            { name: "북부 권역", dongs: ["통진읍", "양촌읍", "대곶면", "하성면"] },
        ],
        landmarks: ["김포한강야생조류생태공원", "금빛수로", "장릉", "애기봉"],
        stations: ["걸포북변역", "풍무역", "사우역", "장기역", "구래역", "고촌역"],
        roads: ["김포한강로", "올림픽대로", "수도권제1순환고속도로", "48번 국도"],
        neighbors: ["gangseo", "bucheon", "goyang"],
        river: true,
        note: "한강신도시와 풍무·사우 원도심, 북쪽 전원 지역이 남북으로 길게 이어지고 남쪽 끝이 강서구와 맞닿은 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "uijeongbu", name: "의정부시", short: "의정부", lat: 37.7381, lng: 127.0337,
        areas: [
            { name: "중심 권역", dongs: ["의정부", "가능", "녹양"] },
            { name: "호원·장암 권역", dongs: ["호원", "장암"] },
            { name: "신곡·민락 권역", dongs: ["신곡", "민락", "송산", "고산"] },
        ],
        landmarks: ["중랑천 산책로", "도봉산 망월사 방면", "직동근린공원", "부용천"],
        stations: ["의정부역", "회룡역", "망월사역", "의정부시청역", "탑석역"],
        roads: ["동부간선도로", "수도권제1순환고속도로", "평화로"],
        neighbors: ["dobong", "nowon", "namyangju"],
        river: false,
        note: "도봉산 북쪽으로 중랑천을 따라 형성된 도시로, 남쪽 호원·장암동이 서울 도봉구와 바로 이어집니다.",
    },
    {
        sido: "gyeonggi", slug: "paju", name: "파주시", short: "파주", lat: 37.76, lng: 126.78,
        areas: [
            { name: "운정 권역", dongs: ["운정", "야당", "목동"] },
            { name: "금촌·교하 권역", dongs: ["금촌", "교하", "동패"] },
            { name: "문산·파주 권역", dongs: ["문산읍", "파주읍", "법원읍"] },
            { name: "조리·탄현 권역", dongs: ["조리읍", "탄현면"] },
        ],
        landmarks: ["운정호수공원", "심학산 둘레길", "헤이리 예술마을", "임진각 평화누리"],
        stations: ["운정역", "야당역", "금촌역", "문산역", "운정중앙역"],
        roads: ["자유로", "서울문산고속도로", "수도권제1순환고속도로"],
        neighbors: ["goyang", "gimpo"],
        river: true,
        note: "운정 신도시와 금촌·문산 원도심, 북쪽 접경 지역까지 범위가 넓어 권역에 따라 이동 시간이 크게 달라지는 도시입니다.",
    },
    {
        sido: "gyeonggi", slug: "siheung", name: "시흥시", short: "시흥", lat: 37.3801, lng: 126.8029,
        areas: [
            { name: "배곧·정왕 권역", dongs: ["배곧", "정왕"] },
            { name: "은계·대야 권역", dongs: ["은계", "대야", "신천"] },
            { name: "장곡·목감 권역", dongs: ["장곡", "능곡", "목감", "연성"] },
        ],
        landmarks: ["갯골생태공원", "배곧한울공원", "물왕호수", "오이도 둘레길"],
        stations: ["시흥시청역", "신천역", "정왕역", "오이도역", "시흥능곡역"],
        roads: ["서해안고속도로", "영동고속도로", "제3경인고속화도로"],
        neighbors: ["bucheon", "gwangmyeong", "anyang"],
        river: false,
        note: "바다를 낀 배곧·정왕과 은계·목감 택지지구, 갯골생태공원 주변 생활권이 동서로 나뉜 도시입니다.",
    },
];

// ───────────────────────── helpers ─────────────────────────

const bySlug = new Map(REGIONS.map((r) => [`${r.sido}/${r.slug}`, r]));

export const getRegion = (sido: string, slug: string) => bySlug.get(`${sido}/${slug}`);

export const findRegionBySlug = (slug: string) => REGIONS.find((r) => r.slug === slug);

export const regionsBySido = (sido: SidoSlug) => REGIONS.filter((r) => r.sido === sido);

export const regionPath = (r: Pick<Region, "sido" | "slug">) => `${r.sido}/${r.slug}`;

/** "자양" → "자양동", 이미 '동'·'가'로 끝나거나 'XX구' 같은 권역명은 그대로 */
export const dongLabel = (d: string) =>
    /(동|가|읍|면|리|권|구)$/.test(d) || /역|인근/.test(d) ? d : `${d}동`;

export const allDongs = (r: Region) => r.areas.flatMap((a) => a.dongs);

/** 두 좌표 간 직선거리(km) */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const R = 6371;
    const dLat = ((b.lat - a.lat) * Math.PI) / 180;
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * 직선거리 → 차량 예상 소요시간 범위(분).
 * 도로 우회계수 1.35, 한산 시 평균 38km/h ~ 혼잡 시 22km/h 기준의 보수적 추정입니다.
 */
export function estimateDriveMinutes(km: number): [number, number] {
    const road = km * 1.35;
    const fast = Math.max(5, Math.round((road / 38) * 60));
    const slow = Math.max(fast + 5, Math.round((road / 22) * 60));
    return [fast, slow];
}

export function nearestRegion(pos: { lat: number; lng: number }) {
    let best = REGIONS[0];
    let bestD = Infinity;
    for (const r of REGIONS) {
        const d = distanceKm(pos, r);
        if (d < bestD) {
            best = r;
            bestD = d;
        }
    }
    return { region: best, km: bestD };
}
