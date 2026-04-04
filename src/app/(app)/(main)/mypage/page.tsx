"use client";

import { deletePetAction, signOutAction } from "@/actions/user";
import { AddPetDialog } from "./add-pet-dialog";
import Image from "next/image";
import { LogOut, Plus, Trash2, User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MyPage() {
    const { data: profile, isLoading } = useProfile();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !profile) {
            router.push("/login"); // Handle unauthorized manually if redirect fails
        }
    }, [isLoading, profile, router]);

    if (isLoading) {
        return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">Loading...</div>; // Replace with Skeleton later
    }

    if (!profile) return null; // Redirecting or waiting for profile

    return <MyPageContent profile={profile} />;
}


// Extracted for clean render
function MyPageContent({ profile }: { profile: any }) {
    return (
        <div className="min-h-screen bg-bg-main p-6 pb-24 space-y-8 text-white">
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">마이페이지</h1>
                <form action={signOutAction}>
                    <button className="text-gray-400 hover:text-red-500 transition-colors bg-[#2C2C2E] p-2 rounded-full border border-[#333]">
                        <LogOut size={18} />
                    </button>
                </form>
            </header>

            {/* Same UI as before */}
            {/* Profile Card */}
            <div className="flex items-center gap-4 bg-bg-card p-5 rounded-[20px] shadow-lg border border-[#333] relative overflow-hidden group">
                {/* ... */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-foon-lime/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

                <div className="w-16 h-16 bg-[#2C2C2E] rounded-full flex items-center justify-center overflow-hidden border-2 border-[#333] group-hover:border-foon-lime transition-colors">
                    {profile.avatarUrl ? (
                        <Image src={profile.avatarUrl} alt="Avatar" width={64} height={64} className="object-cover w-full h-full" />
                    ) : (
                        <User size={30} className="text-gray-500" />
                    )}
                </div>
                <div className="relative z-10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        {profile.nickname}
                        <span className="text-[10px] bg-foon-lime/20 text-foon-lime px-2 py-0.5 rounded-full border border-foon-lime/30">MEMBER</span>
                    </h2>
                    <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
            </div>


        </div>
    );
}

