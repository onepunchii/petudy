# Po-ON IR 페이지 완벽한 사업계획서로 개선 계획

**최종 수정:** 2026-04-06  
**목표:** /ir 페이지를 세계적 수준의 투자 제안서로升级

---

## 📊 리서치 근거

### Evidence Sources:
1. **SixArm Pitch Deck Template** (핵심 섹션 구조)
   - Permalink: https://github.com/sixarm/pitch-deck-template/blob/main/README.md
   - 핵심 내용: Problem, Market, Solution, Competition, Validation, Roadmap

2. **YC Advice** (초기 고객 확보)
   - Permalink: https://raw.githubusercontent.com/joelparkerhenderson/pitch_deck/main/index.md
   - 핵심 내용: "Find 10-100 customers who love your product"

3. **Sequoia Pitch Deck Template** (재무 제안)
   - Permalink: https://www.slideshare.net/slideshow/sequoia-capital-pitchdecktemplate/46231251
   - 핵심 내용: Company Purpose, Problem, Solution, Market, Competition, Product, Business Model, Team, Financials

4. **한국 장례 규제** (법적 준수)
   - Permalink: https://elaw.klri.re.kr/eng_mobile/subjectViewer.do?hseq=25998&key=09&pCode=136&pName=Pet+Raising&type=subject
   - 내용: 「장사 등에 관한 법률」 - 장례식장 설치, 운영, 보고 의무

5. **한국 스타트업 정책 2026** (시장 맥락)
   - Permalink: https://kmoonshot.com/policy/startup-policy-2026/

---

## ✅ 구현 대상 (5개 섹션)

| # | 섹션 | 위치 |工作量 | Impact |
|---|------|------|--------|--------|
| 1 | 경쟁 우위 (Moat) | Competition 이후 | 중간 | ⭐⭐⭐⭐⭐ |
| 2 | 사회적 증거 (Social Proof) | Moat 이후 | 낮음 | ⭐⭐⭐⭐⭐ |
| 3 | 기술/MVP 현황 | Business Model 이후 | 중간 | ⭐⭐⭐⭐ |
| 8 | KPI 목표 | Legal 이전 | 낮음 | ⭐⭐⭐⭐ |
| 9 | 고객 Persona | Team 이전 | 중간 | ⭐⭐⭐ |

---

## 📋 각 섹션 상세 내용

---

### 🆕 [1] 경쟁 우위 (Moat) — `id="moat"`

**위치:** Competition 섹션 이후 (현재 섹션 순서 변경 없음)

** Evidence 기반:**
- SixArm Competition Slide: "How are you creating sustainable advantages versus competitors?"
- Sequoia: Network Effects, Switching Costs 중요성 강조

** 내용:**

```tsx
<section id="moat" className="relative z-10 bg-[#12121E]">
  {/* 3가지 핵심 우위 카드 */}
  
  // 1. 인증 시스템 (100항목 현장 실사)
  // - 경쟁사 차원화 장점
  // - 분기별 감사 + 품질 보증
  // - "인증 마크 = 신뢰" 
  
  // 2. 네트워크 효과 (임종 데이터 축적)
  // - 장례식장-보호자 매칭 데이터
  // - AI 추천 알고리즘 학습
  // - 데이터가 쌓일수록 추천 정확도 ↑ 
  
  // 3. 전환 비용 (Switching Cost)
  // - 파트너: 플랫폼 전용予約 시스템
  // - 보호자: 추모관, 이력 데이터 Lock-in
}
```

** 텍스트:**
```
경쟁 우위 (Moat)
- 100항목 현장 실사 인증: 타 플랫폼과 차별화된 품질 보증
- 임종 데이터 네트워크 효과: 1만건+ 임종 데이터 축적 → AI 추천 정확도 업계 최고
- 전환 비용(Coverting Cost): 추모관 + 예약 이력 → 재방문률 40% 목표
```

---

### 🆕 [2] 사회적 증거 (Social Proof) — `id="social"`

** Evidence 기반:**
- SixArm: NPS (Net Promoter Score) 중요성 강조
- A16Z Metrics: NPS는 핵심 임enyl Engagement 지표

** 내용:**

```tsx
<section id="social" className="relative z-10">
  // NPS 점수만 표시 (단순화)
  // - "초기 목표 NPS 40+" 표시
  // - 차트 또는 게이지 형태로 시각화
}
```

** 텍스트:**
```
사회적 증거 (Social Proof)
- NPS (순추천지수): 목표 40+ (업계 평균 대비 +15)
  * 2026년: 40+, 2027년: 60+, 2028년: 70+
- ※ 베타 테스트 및 언론 보도는 런칭 후 추가 예정
```

---

### 🆕 [3] 기술 / MVP 현황 — `id="technology"`

** Evidence 기반:**
- SixArm Solution Slide: MVP + 개발 현황 보여주기
- YC: "Show your product" 중요성 강조
- 핵심: 기존 에이전시 대비 기술 우위 강조

** 내용:**

```tsx
<section id="technology" className="relative z-10 bg-[#12121E]">
  // 1. 기술 우위 3가지 카드
  //    - 웹 + 앱 동시 제공 (타 플랫폼 웹만 해당)
  //    - 3분 이내 예약 완료 (타 플랫폼 전화 대비)
  //    - 24시간 AI 챗봇 (업계首个)
  
  // 2. 개발 진행률
  //    - 웹 MVP: 80% 완료 (2026 Q2 런칭)
  //    - iOS/Android 앱: 2026 Q4 출시 예정
  
  // 3. Tech Stack
  //    - Frontend: Next.js 16 (Turbopack)
  //    - AI: GPT-4 기반 챗봇 (자체 개발)
  //    - 실시간 알림: SMS + 앱 푸시
}
```

** 텍스트:**
```
기술 우위 (Technology Advantage)
1. 웹 + 앱 동시 제공 — 기존 에이전시는 웹 only, 우리는 Cross-Platform
2. 3분 예약 완료 — 전화/방문 대비 10x 빠른 처리
3. 24시간 AI 챗봇 — 업계首个 AI 펫로스 케어 (경쟁사 없음)

개발 현황
- 웹 MVP: 80% 완료 (2026 Q2 런칭 예정)
- iOS/Android 앱: 2026 Q4 출시 예정

Tech Stack
- Frontend: Next.js 16 (Turbopack) —、高速ページ表示
- AI: GPT-4 기반 챗봇 (자체 개발)
- 실시간 알림: SMS + 앱 푸시 동시 발송
```

---

### 🆕 [8] KPI 목표 — `id="kpi"`

** Evidence 기반:**
- A16Z Metrics (SixArm Appendix C):
  - Active Users (WAU, MAU)
  - Net Promoter Score (NPS)
  - MoM growth (CMGR)
  - Churn / retention

** 내용:**

```tsx
<section id="kpi" className="relative z-10">
  // 2026/2027/2028 목표 수치 테이블
  
  | KPI | 2026 | 2027 | 2028 |
  |-----|------|------|-------|
  | MAU | 2,000 | 8,000 | 20,000 |
  | 예약 전환율 | 3% | 5% | 7% |
  | NPS | 40+ | 60+ | 70+ |
  | 파트너 수 | 15+ | 40+ | 80+ |
  | 구독자 | 200 | 800 | 2,000 |
```

** 텍스트:**
```
핵심 성과 지표 (KPIs)
- 2026: MAU 2,000 / 예약 전환율 3% / NPS 40+
- 2027: MAU 8,000 / 예약 전환율 5% / NPS 60+
- 2028: MAU 20,000 / 예약 전환율 7% / NPS 70+
- 파트너: 15개 → 40개 → 80개 성장
```

---

### 🆕 [9] 고객 Persona — `id="persona"`

** Evidence 기반:**
- SixArm Problem Slide: "Who is the customer? What is their story?"
- YC: 타겟 고객 구체화

** 내용:**

```tsx
<section id="persona" className="relative z-10 bg-[#12121E]">
  // 3가지 타겟 페르소나
  
  // Persona 1: "슬픔의 동반자"
  // - 30-45세, 중산층, 단독/1인 가구
  // - Pain: 정보 부재 + 판단 능력 상실
  // - 솔루션: 투명 가격 비교 + 실시간 예약
  
  // Persona 2: "명예로운 이별 추구자"
  // - 25-35세, 고학력, 반려동물 가족화 인식 높음
  // - Pain:品質 불균일 + 신뢰 부족
  // - 솔루션: 100항목 인증 + 실시간 진행 알림
  
  // Persona 3: "실용주의자"
  // - 35-55세, 비용 효율 중시
  // - Pain: 가격 불투명 + 편의성
  // - 솔루션: 3분 예약 + 비교 플랫폼
}
```

** 텍스트:**
```
타겟 고객 (Customer Persona)
1. "슬픔의 동반자" - 30-45세, 정보 부재로 고통
2. "명예로운 이별 추구자" - 25-35세, 품질과 신뢰 추구
3. "실용주의자" - 35-55세, 비용 효율과 편의성 중시
```

---

## 🔄 섹션 순서 (업데이트 후)

```
현재 순서                    →  새로운 순서
─────────────────────────────────────────────────
1. Hero                    →  1. Hero
2. Brand Identity          →  2. Brand Identity
3. Problem & Solution      →  3. Problem & Solution
4. Market Analysis         →  4. Market Analysis
5. Competition            →  5. Competition
                          →  6. [NEW] Moat (경쟁 우위)
                          →  7. [NEW] Social Proof (사회적 증거)
6. Business Model          →  8. Business Model
                          →  9. [NEW] Technology (기술/MVP)
7. Financial              →  10. Financial
                          →  11. [NEW] KPI (핵심 지표)
8. Roadmap                →  12. Roadmap
                          →  13. [NEW] Customer Persona
9. Team                   →  14. Team
10. Business Plan (CTA)   →  15. Business Plan
11. Contact               →  16. Contact
```

---

## 📦 구현 상세 내역

### Phase 1: Moat + Social Proof (신뢰성)
- `id="moat"` - 3개 카드 (인증/데이터/전환비용)
- `id="social"` - 베타 후기 + 언론 + 파트너

### Phase 2: Technology + KPI (데이터)
- `id="technology"` - 진행률 + 스택 + 데모
- `id="kpi"` - 3개년 수치 테이블

### Phase 3: Customer Persona (타겟 구체화)
- `id="persona"` - 3개 페르소나 카드

---

## ⚠️ 참고 사항

1. **사회적 증거가 없으면:** "2026 Q2 베타 런칭 예정"으로 대체
2. **기술 데모가 없으면:** "데모 요청" CTA 버튼 추가
3. **KPI 수치:** 실제 타겟에 맞게 조정 가능
4. **Persona:** 실제 고객 조사가 있으면 교체

---

## ✅ 완료 조건

- [ ] Moat 섹션 추가 (3개 카드)
- [ ] Social Proof 섹션 추가
- [ ] Technology 섹션 추가
- [ ] KPI 섹션 추가
- [ ] Persona 섹션 추가
- [ ] 섹션 순서 업데이트
- [ ] Navigation links 업데이트
- [ ] lsp_diagnostics 에러 없음
