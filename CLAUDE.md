# gstack

Use the `/browse` skill from gstack for all web browsing. Never use `mcp__claude-in-chrome__*` tools.

## Model Routing Strategy

### 역할별 최적 모델

| 역할 | 기본 모델 | 승격 조건 |
|------|----------|----------|
| **Frontend Worker** | MiniMax M2.7 | 디자인 의도 해석 어렵거나 UX 판단 많이 필요한 작업 → gpt-5.4 |
| **Backend Worker** | MiniMax M2.7 | 복잡한 리팩터링, 트랜잭션/동시성, 테스트 안정화 → gpt-5.3-codex |
| **Codex Specialist** | gpt-5.3-codex | 정밀 수술 담당 (동시성, 리팩토링, 위험 영역) |
| **Reviewer** | gpt-5.4 | 구현 품질보다 "의도와 아키텍처의 불일치" 잡기 |
| **Spec Writer/Planner** | gpt-5.4 | 여러 팀 산출물 연결 and 추상화 능력 중요 |
| **Bug Hunter/Log Analyst** | MiniMax M2.7 | 공식 자료가 이 영역 직접 강조 |
| **QA/Testcase Generator** | MiniMax M2.7 | 예외: flaky test 원인 분석, 미묘한 회귀 판단 → gpt-5.4 |

### 라우팅 규칙

- **M2.7**: 메인 생산직 - 대부분의 구현 요청 먼저
- **gpt-5.3-codex**: 실패 비용 큰 핵심 코드 (정밀 수술)
- **gpt-5.4**: 모호한 요구사항, 팀 간 조정, 최종 승인 (팀장 겸 심사관)
- **Escalation**: 리뷰에서 막힌 작업만 상위 모델로 재할당

### 권장 팀 구성

- Lead 1명: gpt-5.4
- Frontend workers 2~4명: MiniMax M2.7
- Backend workers 2~4명: MiniMax M2.7
- Codex specialist 1~2명: gpt-5.3-codex
- Reviewer 1명: gpt-5.4

---

## Multi-Agent 오케스트레이션 시스템

### 조직도

- **Executive Lead**: gpt-5.4
- **Frontend Lead**: gpt-5.4
- **Backend Lead**: gpt-5.3-codex
- **Frontend Workers**: MiniMax M2.7
- **Backend Workers**: MiniMax M2.7
- **QA/Harness Workers**: MiniMax M2.7
- **Code Reviewer**: gpt-5.4
- **Refactor Specialist**: gpt-5.3-codex

### 역할 정의

#### Executive Lead / gpt-5.4
요구사항 분해, 작업 우선순위, 팀 배정, 최종 승인만 담당합니다.

#### Frontend Lead / gpt-5.4
UI 구조, 사용자 흐름, 컴포넌트 경계, 디자인 일관성 판단을 맡습니다.

#### Backend Lead / gpt-5.3-codex
API 계약, 데이터 모델, 서비스 경계, 실패 처리 기준을 정합니다.

#### Workers / MiniMax M2.7
실제 구현, 파일 수정, 테스트 초안, 반복 수정 작업을 맡습니다.

#### Code Reviewer / gpt-5.4
PR 리뷰, 회귀 위험, 프론트/백 인터페이스 충돌을 잡습니다.

#### Refactor Specialist / gpt-5.3-codex
큰 리팩터링, 테스트 안정화, 복잡한 버그 수정을 맡습니다.

#### QA Worker / MiniMax M2.7
테스트 생성, acceptance criteria 검증, 실패 요약, 회귀 분류를 맡습니다.

### 추천 라우팅 규칙

| 작업 유형 | 모델 |
|----------|------|
| 새 기능 초안 생성 | MiniMax M2.7 |
| 단순 UI 수정 | MiniMax M2.7 |
| 반복 CRUD/API 작업 | MiniMax M2.7 |
| 복잡한 상태관리, UX 의도 해석 | gpt-5.4 |
| 서비스 레이어 리팩터링 | gpt-5.3-codex |
| flaky test 수정 | gpt-5.3-codex |
| 코드리뷰 / 설계 충돌 판단 | gpt-5.4 |
| 로그 요약 / 실패 원인 분류 | MiniMax M2.7 |

### 실행 플로우

1. Executive Lead가 요구사항을 frontend, backend, qa 작업 단위로 분해합니다.
2. 각 Lead가 작업을 더 작은 티켓으로 나눕니다.
3. 구현 티켓은 기본적으로 MiniMax M2.7 worker에게 보냅니다.
4. worker 결과가 불안정하거나 수정 난이도가 높으면 gpt-5.3-codex로 승격합니다.
5. 여러 팀 결과가 합쳐질 때는 gpt-5.4 reviewer가 최종 검토합니다.
6. merge 전 체크리스트와 회귀 점검은 qa worker가 수행합니다.

### 승격 규칙

- 한 작업이 2회 이상 실패하면 MiniMax M2.7 → gpt-5.3-codex
- 설계 해석이 엇갈리면 Lead → gpt-5.4
- UI와 API 계약이 충돌하면 gpt-5.4가 arbitration
- 대형 리팩터링, 핵심 결제/인증/권한 로직은 처음부터 gpt-5.3-codex

### 표준 출력 포맷

모든 agent output은 다음 4개 필드로 표준화:
- `task`: 작업 내용
- `files`: 변경 파일 목록
- `risks`: 식별된 위험 요소
- `next_step`: 다음 단계

### 파일 소유 규칙

- 한 티켓당 한 owner
- worker끼리 같은 파일 직접 수정 금지
- 공용 계약 파일은 Lead 승인 후 수정
- frontend, backend, shared contracts, tests를 분리해서 소유권을 줍니다

---

## Available Skills

- `/office-hours` - Product idea reframing session
- `/plan-ceo-review` - CEO-level strategy review
- `/plan-eng-review` - Architecture and engineering review
- `/plan-design-review` - Design planning review
- `/design-consultation` - Design system consultation
- `/design-shotgun` - Quick design iterations
- `/design-html` - HTML/CSS implementation
- `/review` - Code review
- `/ship` - Ship and deploy workflow
- `/land-and-deploy` - Landing and deployment
- `/canary` - Canary release testing
- `/benchmark` - Performance benchmarking
- `/browse` - Headless browser for QA testing
- `/connect-chrome` - Connect to Chrome browser
- `/qa` - QA testing and bug finding
- `/qa-only` - QA testing (report only)
- `/design-review` - Design audit and review
- `/setup-browser-cookies` - Import browser cookies
- `/setup-deploy` - Setup deployment
- `/retro` - Weekly engineering retrospective
- `/investigate` - Bug investigation
- `/document-release` - Post-ship documentation update
- `/codex` - Independent code review
- `/cso` - Customer support overview
- `/autoplan` - Automatic planning
- `/careful` - Safety mode for destructive commands
- `/freeze` - Lock edits to directory
- `/guard` - Combined careful + freeze
- `/unfreeze` - Remove directory lock
- `/gstack-upgrade` - Upgrade gstack
- `/learn` - Learning session
