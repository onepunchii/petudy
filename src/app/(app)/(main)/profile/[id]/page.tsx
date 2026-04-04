"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Grid, Users, Heart } from "lucide-react"; // Icons
import { useRouter } from "next/navigation";
import { getProfileWithPosts, getIsFollowing, followUser, unfollowUser } from "@/actions/social";
import { createClient } from "@/lib/supabase/client";

// Types matching action return
type ProfileData = Awaited<ReturnType<typeof getProfileWithPosts>>;

export default function PublicProfilePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [data, setData] = useState<ProfileData | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    // Unwrap params for Next.js 15+ if needed, but standard prop works for now
    const userId = params.id;

    useEffect(() => {
        const loadProfile = async () => {
            try {
                // Get Current User
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                setCurrentUser(user?.id || null);

                // Fetch Profile Data
                const profileData = await getProfileWithPosts(userId);
                setData(profileData);

                // Check Follow Status
                if (user && user.id !== userId) {
                    const following = await getIsFollowing(userId);
                    setIsFollowing(following);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [userId]);

    const handleFollowToggle = async () => {
        if (!currentUser) {
            alert("로그인이 필요합니다.");
            return;
        }

        // Optimistic UI
        const prev = isFollowing;
        setIsFollowing(!prev);

        if (prev) {
            await unfollowUser(userId);
        } else {
            await followUser(userId);
        }
    };

    if (loading) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">Loading...</div>;
    if (!data) return <div className="min-h-screen bg-bg-main flex items-center justify-center text-white">User not found</div>;

    const { user: profileUser, pets, posts, stats } = data;
    const mainPet = pets[0]; // Assuming first pet is main for now

    return (
        <div className="min-h-screen bg-bg-main text-white pb-20">
            {/* Header */}
            <div className="h-14 flex items-center px-4 border-b border-[#333] sticky top-0 bg-bg-main/80 backdrop-blur-md z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="font-bold text-lg ml-2">{profileUser.nickname}</h1>
            </div>

            {/* Profile Header */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    {/* Avatar */}
                    <div className="relative w-20 h-20">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-foon-lime p-0.5">
                            {mainPet?.profilePhotoUrl ? (
                                <Image src={mainPet.profilePhotoUrl} alt="Profile" width={80} height={80} className="rounded-full w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-full">🐶</div>
                            )}
                        </div>
                        {/* Level/Badge could go here */}
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around ml-4">
                        <div className="text-center">
                            <div className="font-bold text-lg">{stats.postCount}</div>
                            <div className="text-xs text-gray-400">게시물</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg">{stats.followers}</div>
                            <div className="text-xs text-gray-400">팬</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-lg">{stats.following}</div>
                            <div className="text-xs text-gray-400">팔로잉</div>
                        </div>
                    </div>
                </div>

                {/* Bio & Actions */}
                <div className="space-y-3">
                    <div>
                        <h2 className="font-bold text-lg">{mainPet?.petName || "이름없음"}</h2>
                        <p className="text-sm text-gray-300">{mainPet?.breed} • {mainPet?.gender === 'MALE' ? '남아' : '여아'}</p>
                        <p className="text-sm text-gray-400 mt-1">
                            {/* Bio mock for now */}
                            안녕하세요! 우리 {mainPet?.petName}의 일상입니다 🐾
                        </p>
                    </div>

                    {currentUser !== userId && (
                        <button
                            onClick={handleFollowToggle}
                            className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${isFollowing
                                    ? "bg-bg-input text-gray-300 border border-[#333]"
                                    : "bg-foon-lime text-black shadow-[0_0_15px_rgba(163,223,70,0.4)]"
                                }`}
                        >
                            {isFollowing ? "단짝 끊기" : "단짝 맺기"}
                        </button>
                    )}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="border-t border-[#333] flex">
                <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-white text-white">
                    <Grid className="w-5 h-5" />
                </button>
                <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-transparent text-gray-500">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className="relative aspect-square bg-gray-900 group cursor-pointer hover:opacity-90 transition-opacity">
                            <Image
                                src={post.imageUrl}
                                alt={post.caption || "Post"}
                                fill
                                className="object-cover"
                                sizes="33vw"
                            />
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 py-10 text-center text-gray-500 text-sm">
                        아직 게시물이 없어요 📸
                    </div>
                )}
            </div>
        </div>
    );
}
