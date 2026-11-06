import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const origin = (new URL(request.url)).origin;
    const code = searchParams.get("code");
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get("next") ?? "/app"; // default to app home

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Sync User Profile
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                try {
                    const provider = user.app_metadata.provider || 'email';
                    const snsId = user.identities?.find(i => i.provider === provider)?.id || user.id;

                    await db.insert(users).values({
                        id: user.id,
                        email: user.email,
                        nickname: user.user_metadata.full_name || user.user_metadata.name || "사용자",
                        avatarUrl: user.user_metadata.avatar_url,
                        snsProvider: provider.toUpperCase(),
                        snsId: snsId,
                    }).onConflictDoUpdate({
                        target: users.id,
                        set: {
                            email: user.email,
                            nickname: user.user_metadata.full_name || user.user_metadata.name || "사용자",
                            avatarUrl: user.user_metadata.avatar_url,
                        }
                    });
                } catch (err) {
                    console.error("User sync error:", err);
                    // Don't block login if profile sync fails, but log it
                }
            }

            const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
