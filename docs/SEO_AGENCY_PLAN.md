# 포온(po-on) 반려동물 서비스 에이전시 — SEO 사이트 설계

광고 없이 검색 유입을 늘리기 위한 지역 기반 사이트. 코드: `src/app/(site)`, 데이터: `src/lib/site`.

## 1. URL 구조 (현재 사이트맵 102개)

| 페이지 | URL | 개수 | 노리는 검색어 |
|---|---|---|---|
| 홈 | `/` | 1 | 반려동물 장례, 애견미용 (브랜드) |
| 서비스 허브 | `/funeral`, `/grooming` (+준비중 4개는 noindex) | 2 | 반려동물 장례식장, 애견미용 |
| 시·도 허브 | `/funeral/seoul`, `/funeral/gyeonggi` | 2 | **서울 강아지 장례식장** (구 단위보다 검색량 큼) |
| 지역 × 서비스 | `/funeral/seoul/gwangjin` … | 장례 40 (+미용 40 noindex) | 광진구 반려동물 장례식장, 자양동 강아지 장례 |
| 지역 허브 | `/area/seoul/gwangjin` | 40 | 광진구 반려동물 서비스 |
| 가이드 | `/guide/pet-death-first-steps` … | 12 | 강아지 죽으면, 장례 비용, 합법 장례식장, 메모리얼스톤, 펫로스, 미용 주기·가격 |

내부 링크: 푸터 → 전 지역 허브, 서비스 허브 → 전 지역 페이지, 지역 페이지 → 이웃 지역·같은 지역 다른 서비스·가이드.

## 2. 지역 페이지가 "얇은 페이지"가 되지 않게 한 장치

구글 doorway/scaled content 정책, 네이버 유사문서 판독 대응.

- 지역마다 고유 데이터: 생활권·동네·역·도로·산책 장소·지역 설명 (`regions.ts`)
- **허가 장묘업체 소재지까지의 계산 거리** (구청 기준, `facilities.ts`) — 서울에는 화장 시설이 없다는 사실을 "출발지 기준 안내"로 활용
- 문장 변형(variant)과 지역 데이터 기반 FAQ (`local.ts`)
- 지역별 생활권 일러스트 지도 (`NeighborhoodMap`)
- **색인 정책** (`services.ts → indexPolicy`)
  - 장례 `always`: 거리 데이터가 있어 바로 색인
  - 미용 `with-partners`: 해당 지역 15km 안에 제휴 미용실이 생기면 자동 색인·사이트맵 포함

## 3. 출시 전 반드시 할 일

- [ ] `src/lib/site/config.ts`: 대표번호, 카카오 채널, 사업자 정보 (현재 임시값)
- [ ] `NEXT_PUBLIC_SITE_URL` 환경변수 (기본값 `https://foon.app`)
- [ ] 상담 DB 테이블 생성: `npx drizzle-kit generate && npx drizzle-kit migrate` (`agency_leads`), 또는 `LEAD_WEBHOOK_URL` 설정
- [ ] 개인정보처리방침 (`/privacy`) 법무 검토
- [ ] **법률 검토: 장묘업자가 아닌 자의 장례 알선을 제한하는 법안이 2022년 발의됨(통과 여부 미확인).** 에이전시 수익 모델 확정 전 확인 필요
- [ ] 네이버 서치어드바이저·구글 서치콘솔 사이트 등록 → `/sitemap.xml` 제출, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` 설정

## 4. 운영

- 제휴처: `src/lib/site/partners.ts`에 실제 계약 업체만 추가 (허가·등록번호 필수). 지역 페이지에 거리·소요시간이 자동 표시됨
- 허가 업체 현황: 분기마다 동물보호관리시스템에서 다시 확인 → `facilities.ts`의 숫자와 `FACILITY_CHECKED_AT` 갱신
- 서비스 오픈: `services.ts`에서 `status: "live"`로 바꾸면 지역 페이지·사이트맵 자동 생성
- 지역 추가: `regions.ts`에 항목 추가 (경기 광주·안산·평택·군포 등이 다음 후보)
- 콘텐츠 수정 시 `src/app/sitemap.ts`의 `SITE_CONTENT_UPDATED` 갱신

## 5. 다음 단계 제안 (리서치 기반)

1. 허가 장묘업체 프로필 페이지 (수도권 35곳, `/funeral/facility/{slug}`): "김포 강아지 장례식장" 같은 시·군 검색어 대응
2. 경기 광주·안산 등 장묘업체 소재 도시 추가
3. 가이드 확장: 고양이 장례 비용, 안락사 관련 정보성 글(중개는 하지 않음), 지자체 장례비 지원 제도
4. 네이버 블로그 병행 운영 (C-Rank 주제 신뢰도)
5. 실제 후기는 지역 태그와 함께 수집해 지역 페이지에 노출
