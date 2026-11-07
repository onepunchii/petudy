import { redirect } from "next/navigation";
import RegistrationWizard from "@/components/register/RegistrationWizard";
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

/* 펫패스 만들기. 등록은 로그인한 계정에 저장되므로, 10단계를 채우기 전에 로그인부터 확인합니다 */
export default async function RegisterPage() {
    const user = await getSignedInUser();
    if (!user) redirect(`/login?next=${encodeURIComponent("/register")}`);

    return (
        <div className="flex min-h-full flex-col bg-moon">
            <RegistrationWizard />
        </div>
    );
}
