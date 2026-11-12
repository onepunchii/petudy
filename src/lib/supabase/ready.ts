/**
 * 로그인·DB(Supabase) 연결 값이 들어 있는지. NEXT_PUBLIC_ 값이라 서버와 브라우저 모두에서 같은 값입니다.
 * false 면 로그인 버튼·내 아이 목록 같은 화면은 고장 난 것처럼 보이지 않도록 '준비 중' 안내로 바꿉니다.
 * (2026-11 운영 서버에는 이 값이 없습니다. DB 복구 때 함께 넣습니다)
 */
export const SUPABASE_READY = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
