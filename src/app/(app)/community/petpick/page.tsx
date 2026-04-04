import { getPolls } from "@/actions/poll";
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import PetPickWidget from "@/components/home/PetPickWidget";
import PetPickAnimation from "@/components/ui/PetPickAnimation";

export const dynamic = "force-dynamic";

export default async function PollListPage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
    const { sort } = await searchParams;
    const sortType = sort === "popular" ? "popular" : "latest";
    const polls = await getPolls(50, 0, sortType);

    return (
        <div className="min-h-screen bg-bg-main text-white relative">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
                    펫픽 커뮤니티
                </h1>
            </header>

            {/* Content */}
            <div className="p-6 space-y-8 pb-32">
                <div className="flex items-end justify-between">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold flex items-center gap-1">
                            진행 중인 투표
                            <div className="w-[60px] h-[60px] -my-4 flex items-center justify-center">
                                <PetPickAnimation />
                            </div>
                        </h2>
                        <p className="text-gray-400 text-sm">
                            다른 보호자님들의 고민을 해결해주세요!
                        </p>
                    </div>

                    {/* Check Sort UI */}
                    <div className="flex bg-[#2c2c2e] rounded-lg p-1 text-xs font-bold">
                        <Link
                            href="/community/petpick?sort=latest"
                            className={`px-3 py-1.5 rounded-md transition-colors ${sortType === 'latest' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            최신순
                        </Link>
                        <Link
                            href="/community/petpick?sort=popular"
                            className={`px-3 py-1.5 rounded-md transition-colors ${sortType === 'popular' ? 'bg-[#3a3a3c] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            투표순
                        </Link>
                    </div>
                </div>

                <div className="space-y-12">
                    {polls.length > 0 ? (
                        polls.map((poll) => (
                            <PetPickWidget
                                key={poll.id}
                                initialPoll={poll}
                                showStar={false}
                                enableAutoNext={false}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center text-gray-500">
                            진행 중인 투표가 없습니다.<br />
                            첫 번째 투표를 만들어보세요!
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Link href="/community/petpick/create">
                    <button className="w-14 h-14 bg-foon-lime rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(163,223,70,0.5)] active:scale-95 transition-transform">
                        <Plus className="w-7 h-7 text-bg-main" />
                    </button>
                </Link>
            </div>
        </div>
    );
}
