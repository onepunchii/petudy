-- 반려동물 생일을 비워 둘 수 있게 합니다 (2026-11-07)
-- 등록 화면에서 생일은 선택 항목인데 pets.birth_date 가 NOT NULL 이라 생일 없이 등록하면 저장이 실패했습니다.
--
-- 실행: Supabase 대시보드 > SQL Editor 에서 한 번 실행합니다. 여러 번 실행해도 안전합니다.
-- drizzle/meta 스냅샷이 실제 DB 와 어긋나 있어(이미 만든 테이블이 스냅샷에 없음) drizzle-kit generate 로
-- 만들면 관계없는 CREATE TABLE 이 섞입니다. 그래서 이 한 줄만 따로 둡니다.
-- 새 프로젝트를 schema.ts 로 만들면(drizzle-kit push) 처음부터 NULL 허용이라 실행할 필요가 없습니다.
ALTER TABLE "pets" ALTER COLUMN "birth_date" DROP NOT NULL;
