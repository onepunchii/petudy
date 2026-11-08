import { redirect } from "next/navigation";
import MyPageClient from "@/components/mypage/MyPageClient";
import { createClient } from "@/lib/supabase/server";

/** 로그인한 사용자. 연결 실패(환경 변수 없음·네트워크)도 로그인 안 됨으로 봅니다 */
async function getSignedInUser() {
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        return data.user;
    } catch {
        return null;
    }
}

/* 내 정보. 하단 탭으로 모든 페이지에서 들어오므로, 로그인하지 않았으면 화면을 그리기 전에 서버에서 로그인으로 보냅니다.
 * (화면에서 보내면 기록에 /mypage 가 남아 뒤로 가기가 /mypage ↔ /login 을 맴돕니다) */
export default async function MyPage() {
    const user = await getSignedInUser();
    if (!user) redirect("/login?next=%2Fmypage");
    return <MyPageClient />;
}
