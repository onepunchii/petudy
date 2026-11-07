# 반려동물 장례식장 디렉터리 페이지 설계 (2026-11-07)

전국 허가 반려동물 장례식장(동물장묘업) 89곳마다 페이지를 만들고, 시·도 목록과 전체 목록, 사이트맵, 네이버 썸네일을 갖춥니다. 디자인과 문구는 `docs/BRAND_SPACE_CONCEPT.md`(1~7장, 사이트)를 따릅니다. 장례 영역이라 **라임, 캐릭터, 3D 아이콘, 이모지를 쓰지 않습니다.**

## 1. 데이터
- `src/lib/site/funeral-homes.ts`: 타입과 도우미(`FUNERAL_HOMES`, `getFuneralHome`, `funeralHomesBySido`, `funeralSidoList`, `sigunguGroups`, `nearestFuneralHomes`, `serviceHighlights`, `SERVICE_LABEL`, `naverMapUrl`, `kakaoMapUrl`, `telHref`, `telE164`, `formatWon`, `facilityTypesShort`, `placeLabel`, `shortPlaceLabel`, 경로 함수, `ogImagePath`).
- 데이터 파일은 `src/lib/site/data/funeral-homes.json` 이고, `node scripts/funeral-homes/build.mjs` 로 다시 만듭니다. 원본은 `data/funeral-homes/` 에 있습니다.
- 사실의 출처:
  - 업체명, 소재지, 전화, 시설 종류: 동물보호관리시스템 공식 목록(`FUNERAL_REGISTRY_URL`).
  - 서비스, 운영 시간, 가격, 주차, 오시는 길: 업체 홈페이지(항목마다 `sourceUrl`). 확인일은 `checkedAt`(2026-11-07)입니다.
- 정확도 주의:
  - 소재지는 번지 없는 도로명·리까지만 있는 곳이 많습니다(`addressComplete=false`).
  - 좌표는 대부분 시·군청 기준 대략값입니다(`geo="approx"`). 거리는 "약 N km(직선)"으로만 쓰고, JSON-LD `geo` 에는 넣지 않습니다.
  - `services.*.status`: `yes`=홈페이지에 안내가 있음, `no`=하지 않는다고 안내함, `unknown`=안내가 없음. unknown 을 "안 함"으로 쓰지 않고 "홈페이지 안내 없음"으로 씁니다.
- 지어낸 정보를 넣지 않습니다. 후기, 별점, 순위, "추천", "인기"는 없습니다. 포온은 이 업체들과 제휴 관계가 아니라는 점을 페이지에 밝힙니다.

## 2. 주소(URL)
| 페이지 | 경로 | 대표 이미지 |
|---|---|---|
| 전체 목록 | `/funeral-homes` | `/og/funeral-homes/square.png` |
| 시·도 목록 | `/funeral-homes/[sido]` (14곳) | `/og/funeral-homes/[sido]/square.png` |
| 업체 상세 | `/funeral-homes/[sido]/[slug]` (89곳) | `/og/funeral-homes/[sido]/[slug]/square.png` + `wide.png` |

- 대표 이미지 라우트와 렌더러는 이미 있습니다(`src/app/og/**`, `src/lib/site/og.tsx`, `src/lib/site/og-cards.ts`).
- 메타데이터는 `metaWithImage()`(`src/lib/site/seo.ts`)로 만듭니다. og:image 정사각형 1200, robots `max-image-preview:large`, canonical 포함입니다.
- 정적 생성: `generateStaticParams` + `dynamicParams = false`.

## 3. 공통 화면 규칙
- **히어로(밤) → 본문(달빛)** 한 번 전환. `Breadcrumbs`(tone onNight)를 히어로 맨 위에 둡니다. 경로는 홈 › 반려동물 장례식장 찾기 › 시·도 › 업체.
- **상세·시·도 목록:** 히어로 오른쪽(모바일은 글자 아래)에 정사각형 대표 이미지를 `<img>` 로 둡니다. src 는 og:image 와 **같은 URL**, 글자로 된 alt 를 붙입니다. 모서리 28px, `ring-1 ring-white/10` 입니다. 네이버·구글이 본문 이미지와 og:image 를 함께 보고 썸네일을 고르기 때문입니다.
- **목차:** `<nav aria-label="목차">` 안 `<ol>` 에 `<a href="#ascii-id">` 를 둡니다. 각 섹션은 `<h2 id="ascii-id" className="scroll-mt-24">` 입니다. 모바일은 히어로 아래 가로 스크롤 알약 줄, lg 이상은 본문 옆 sticky 세로 목록입니다. 순수 서버 HTML로 만들고 JS 스크롤은 쓰지 않습니다. 핵심 정보(주소·전화·운영 시간·가격)는 접지 않고 펼쳐 둡니다.
- **버튼:** 이동은 모두 `<a href>` 입니다.
  - 업체 전화: 라벨 "업체에 전화", `tel:`. "전화 상담"은 포온 번호 전용입니다.
  - 길찾기: "네이버 지도", "카카오맵", 새 창.
  - 홈페이지: "업체 홈페이지", 새 창, `rel="noopener noreferrer"`. 제휴가 아니므로 sponsored 는 붙이지 않습니다.
  - 포온 상담: 기존 `ConsultSection` / `CallButton` 을 씁니다.
- 기존 부품 재사용: `Container`, `SectionTitle`(eyebrow 는 세 섹션에 하나까지), `PassCard`(정보 카드), `FaqList`, `JsonLd`, `Reveal`, `pillClass`/`PillLink`/`CallButton`(장례는 accent white), `FuneralHomeList`/`FuneralHomeRow`(`src/components/site/funeral-homes/FuneralHomeList.tsx`).
- 문구 규칙: 긴 줄표 금지, 최상급·홍보 문구 금지, 한 의도 한 라벨.
  - H1 과 title 에는 검색어를 그대로 씁니다: "{업체명}", "{시·도} 반려동물 장례식장".
  - 여행 은유는 부제에만, 짧게 씁니다.
- 아이콘은 lucide, 선 굵기 `ICON_STROKE`(1.75)입니다.
- 서비스 상태 표시:
  - yes: `Check`(text-pine) + "안내 있음"
  - no: `Minus`(text-ink-3) + "하지 않음"
  - unknown: `CircleHelp`(text-ink-3) + "홈페이지 안내 없음"
  - 색만으로 구분하지 않고 글자를 함께 씁니다.

## 4. 업체 상세 `/funeral-homes/[sido]/[slug]`
title: `{업체명} | {시군구} 반려동물 장례식장` (세종은 시도)
description: `{업체명}: {placeLabel} 허가 동물장묘업({시설 종류}). 운영 시간, 공개 가격, 개별 화장·참관·픽업 안내, 오시는 길. 확인일 2026-11-07.` (실제 있는 항목만)

1. **히어로**: 경로, H1 업체명, 부제 한 줄("{시군구}의 허가 반려동물 장례식장" + 여행 은유 없이 담백하게 가능), 버튼 줄(업체에 전화 [있을 때], 네이버 지도). 오른쪽 정사각형 이미지.
2. **목차** (아래 h2 id 순서)
3. `summary` **한눈에 보기**: PassCard.
   - 본문 `<dl>`: 업체명, 공식 목록 시설 종류, 소재지(번지 없으면 "공식 목록 소재지, 번지 미기재"), 전화, 운영 시간(+출처), 주차, 홈페이지.
   - stub: "공식 허가 목록 등재" + 확인일 + 공식 목록 링크.
   - `summary` 문장이 있으면 카드 위에 문단으로 둡니다.
4. `services` **서비스**: 11개 항목 상태 목록(2열, 메모와 출처 링크). 그 아래 `extras` 목록. 맨 아래 "홈페이지 기준이며 바뀔 수 있어요" 한 줄.
5. `prices` **비용**: 실제 `<table>`(항목, 금액, 포함 내용). 표 아래 출처와 확인일. 가격이 없으면 공개 가격이 없다는 안내와 `/guide/pet-funeral-cost` 링크. `cautions` 는 여기나 summary 에 둡니다.
6. `location` **위치·오시는 길**:
   - 주소, 지도 버튼 2개, access·parking.
   - 서울·경기·인천 업체면 `REGIONS`(src/lib/site/regions.ts) 중 가장 가까운 4곳을 "약 N km, 차로 약 A~B분(직선거리 기준 추정)"으로 보여 주고, 각 지역의 `/funeral/{sido}/{region}` 페이지로 연결합니다.
7. `nearby` **가까운 다른 장례식장**: `nearestFuneralHomes(home, 4, home.id)` → `FuneralHomeList`(거리 포함).
8. `faq` **자주 묻는 질문**: 데이터로만 답하는 3~5개.
   - 허가 업체인가요?
   - 운영 시간은?
   - 비용은?
   - 24시간 가능한가요? (allDay)
   - 화장 과정을 볼 수 있나요? (viewing)
   - 개별 화장인가요?
   unknown 이면 "홈페이지에 안내가 없어 전화로 확인하시길 권합니다" 식으로 답합니다. `FaqList` + `faqLd`.
9. `sources` **출처와 정보 수정**: 공식 목록 링크, 사용한 홈페이지 URL(중복 제거), 확인일, "포온은 이 업체와 제휴 관계가 아닙니다", "정보가 다르면 알려 주세요" → `/contact`.
10. 기존 `ConsultSection`(장례 서비스)로 마무리.
- JSON-LD:
  - `breadcrumbLd`
  - LocalBusiness: 화장시설이 있으면 `["LocalBusiness","Crematorium"]`. name, address(PostalAddress: streetAddress=소재지, addressRegion=시도, addressLocality=시군구, addressCountry "KR"), telephone(`telE164`), url(우리 페이지 절대 URL), image(정사각형 절대 URL), sameAs(홈페이지가 있을 때). geo, 별점, 가격대는 넣지 않습니다.
  - WebPage + primaryImageOfPage
  - FAQPage

## 5. 시·도 목록 `/funeral-homes/[sido]`
title: `{시도 short} 반려동물 장례식장 {n}곳 | 허가 업체 목록`
- **히어로**: H1 `{시도 이름} 반려동물 장례식장 {n}곳`, 부제, 버튼(우리 동네 찾기 → #list, 전화 상담), 오른쪽 정사각형 이미지.
- **목차**: 시군구 묶음 앵커. id 는 `sigunguSlug`. 같은 slug 가 여러 시도에 있어도 페이지 안에서는 하나뿐입니다.
- **시군구별 묶음**: `sigunguGroups(sido)` 를 h2 `{시군구} ({n}곳)`로, 그 아래 `FuneralHomeList`.
- 서울·경기·인천이면 "출발하는 동네 기준 안내" 링크(`/funeral/seoul`, `/funeral/gyeonggi`)를 둡니다.
- **FAQ 3개**(데이터 기반: 몇 곳인지, 어느 시군에 많은지, 허가 업체 확인 방법) + `faqLd`.
- **다른 시·도 바로가기**: `funeralSidoList()`.
- JSON-LD: breadcrumb, CollectionPage(혹은 ItemList: url 만, image 없이).

## 6. 전체 목록 `/funeral-homes`
title: `전국 반려동물 장례식장 {89}곳 | 허가 업체 시·도별 목록`
- **히어로**: H1 "전국 반려동물 장례식장 찾기", 부제 "공식 허가 목록 {89}곳을 시·도별로 정리했습니다", 버튼(우리 동네 찾기 → #sido, 전화 상담), 오른쪽 정사각형 이미지.
- **시·도 바로가기**: 14개 시·도를 표처럼 정리(이름, 곳 수, 대표 시군 2~3개)하고 각 `/funeral-homes/[sido]` 로 연결합니다. 같은 카드 3장 나란히 금지이므로 구분선 목록이나 표로 만듭니다.
- **수도권(서울·경기·인천) 전체 목록**: 시도별 h2 + `FuneralHomeList`. 포온 서비스 지역이라 먼저 보여 줍니다.
- **고르기 전에 확인할 것**: 허가 확인, 개별/합동 화장, 참관, 추가 비용. 가이드 링크 3개(`licensed-pet-crematorium-check`, `individual-vs-group-cremation`, `pet-funeral-cost`).
- **FAQ** + `faqLd`.
- JSON-LD: breadcrumb, CollectionPage.

## 7. 사이트 연결
- 헤더·푸터 메뉴에 "장례식장 찾기"(`/funeral-homes`)를 넣습니다.
- `/funeral` 허브, `/funeral/[sido]`, `/funeral/[sido]/[region]` 페이지:
  - 허가 업체 표·문단 근처에 실제 업체 목록 링크를 둡니다.
  - 지역 페이지에는 그 지역 중심에서 가까운 업체 4곳을 `FuneralHomeList`(거리 포함)로 보여 줍니다.
- 가이드 `licensed-pet-crematorium-check` 등 장례 가이드 하단에 "전국 허가 장례식장 목록" 링크를 둡니다.
- 사이트맵:
  - `/sitemap.xml` 은 인덱스입니다(Route Handler, force-static).
  - 하위 사이트맵은 `/sitemap/{pages,services,areas,guides,funeral-homes}.xml` 입니다(`generateSitemaps`).
  - funeral-homes 사이트맵 항목에는 `images: [정사각형 이미지 절대 URL]` 을 넣습니다.
  - lastModified 는 실제 수정일(장례식장은 checkedAt)입니다.
- JSON-LD `breadcrumbLd` 의 첫 항목 이름 "홈"은 네이버 가이드에 따라 "포온"으로 바꿉니다. 화면의 경로 표시는 그대로 둡니다.
- 가이드 페이지의 og:image 는 표지 그림(`/brand/guides/{slug}.webp`)으로 둡니다.
