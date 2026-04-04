# foon Project Context

## 1. 프로젝트 목표 (Project Goal)

* **Goal:** Next.js + Supabase 기반의 **반려동물 모빌리티 예약 모바일 웹앱 (Mobile Web App)** 구축
* **Key Focus:**
  * **Mobile First:** 모바일 화면에 최적화된 UX/UI (Touch-friendly, Bottom Sheet, etc.)
  * **User Experience:** 간편 가입, 끊김 없는 예약 경험
  * **Performance:** Vercel Serverless 배포 최적화
* **Workflow:** Context7 & Sequential Thinking 기반의 정밀 코딩

## 2. 기술 스택 (Tech Stack)

* **Frontend & Framework:** Next.js 16.0.10 (App Router), TypeScript
* **Library:** React 19.2.1
* **Styling:** Tailwind CSS 4.0, Radix UI (shadcn/ui), Framer Motion
* **Backend & Database (Supabase):**
  * Auth: Supabase Auth (Kakao, Google OAuth)
  * Database: PostgreSQL
  * Storage: Supabase Storage
  * Realtime: Supabase Realtime
* **ORM:** Drizzle ORM
* **State Management:** TanStack Query (Server State), Zustand (Client State)
* **Deployment:** Vercel

## 3. 현재 진행 상태 (Current Status)

* **Phase:** Phase 1: Environment & Foundation
* **진행 중:** 모바일 최적화 레이아웃 설정 및 라이브러리 설치.
* **완료:** Next.js 프로젝트 생성, 기본 설정, Context 파일 복구.

## 4. 남은 할 일 (To-Do)

- [x] Context & Rules 설정 (with MCP)
* [x] Next.js 프로젝트 초기화 (App Router)
* [ ] Mobile Layout 구성 (Max-width wrapper)
* [ ] 라이브러리 설치 (Supabase, Drizzle, Radix UI 등)
* [ ] Supabase 프로젝트 생성 및 연동
* [ ] Auth (Kakao/Google) 구현

## 5. 아키텍처 및 디렉토리 구조 (Architecture Reference)

```text
foon/
├── app/                        # Next.js App Router
├── components/                 # UI Components (shadcn/ui based)
├── lib/                        # Utils (supabase, db, etc)
├── actions/                    # Server Actions (Auth, Booking)
└── hooks/                      # Custom Hooks
```
