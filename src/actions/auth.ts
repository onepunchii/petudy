"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { LOGIN_NEXT_COOKIE, safeNextPath } from "@/lib/safe-next";

/**
 * 로그인 뒤 돌아갈 경로를 10분짜리 쿠키에 적어 둡니다.
 * redirectTo 에 쿼리를 붙이면 Supabase 의 허용 주소 목록과 어긋날 수 있어 쿠키를 씁니다.
 * /auth/callback 이 읽고 지웁니다.
 */
async function rememberNext(formData?: FormData) {
    const next = safeNextPath(formData?.get("next"), "");
    const store = await cookies();
    if (next) {
        store.set(LOGIN_NEXT_COOKIE, next, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV !== "development",
            path: "/",
            maxAge: 600,
        });
    } else {
        store.delete(LOGIN_NEXT_COOKIE);
    }
}

async function callbackUrl() {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const origin = headersList.get("origin") || `${protocol}://${host}`;
    return `${origin}/auth/callback`;
}

export async function signInWithKakao(formData?: FormData) {
    await rememberNext(formData);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "kakao",
        options: {
            redirectTo: await callbackUrl(),
        },
    });

    if (error) {
        console.error(error);
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }
}

export async function signInWithGoogle(formData?: FormData) {
    await rememberNext(formData);
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: await callbackUrl(),
        },
    });

    if (error) {
        console.error(error);
        throw error;
    }

    if (data.url) {
        redirect(data.url);
    }
}
