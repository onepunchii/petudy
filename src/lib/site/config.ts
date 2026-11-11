/**
 * 포온(po-on) 반려동물 서비스 에이전시 — 사이트 전역 설정
 *
 * ⚠️ TODO 표시가 있는 값은 실제 정보로 교체해야 합니다.
 *    (전화번호, 사업자 정보, 카카오 채널 등은 광고·표시 관련 법령상 실제 값이어야 합니다)
 */

export const SITE = {
    name: "포온",
    brand: "po-on",
    fullName: "포온 반려동물 서비스",
    tagline: "반려동물의 여행을 함께 준비하고 배웅하는 동네 안내소",
    // 메타 description(홈·기본값). SEO 값이라 디자인 작업에서 바꾸지 않습니다
    description:
        "반려동물 장례·미용·호텔·펫시터까지. 포온이 보호자님 동네에서 가장 가까운 등록 업체를 확인해 연결합니다. 서울 25개 구·경기 주요 도시 24시간 상담.",
    // 정식 주소(canonical·사이트맵·OG 기준). 운영 도메인은 Vercel poon 프로젝트의 poon.co.kr 입니다(2026-11-11 배포).
    // foon.app 은 이 사이트가 아닌 주차 페이지라 쓰지 않습니다. 도메인을 옮기면 NEXT_PUBLIC_SITE_URL 로 바꿉니다
    url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://poon.co.kr").replace(/\/$/, ""),

    // TODO: 실제 대표번호로 교체
    phone: "1600-0000",
    phoneHref: "tel:16000000",
    // TODO: 카카오톡 채널 URL로 교체 (없으면 빈 문자열 → 버튼 숨김)
    kakaoUrl: "",
    hours: "연중무휴 24시간 상담",

    // TODO: 사업자 정보 (전자상거래법상 표시 의무)
    company: {
        legalName: "주식회사 포온",
        ceo: "대표자명",
        bizNumber: "000-00-00000",
        mailOrderNumber: "제0000-서울광진-0000호",
        address: "서울특별시 ○○구 ○○로 00",
        email: "help@foon.app",
    },

    /** 서치어드바이저/서치콘솔 소유확인 코드 — 발급 후 환경변수로 설정 */
    verification: {
        naver: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ?? "",
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "",
    },
} as const;

export const absoluteUrl = (path = "/") => `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
