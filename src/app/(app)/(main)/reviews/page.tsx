"use client";

import { ChevronLeft, Star } from "lucide-react";
import Link from "next/link";
import { reviews } from "@/lib/data/reviews";

export default function ReviewsPage() {
    return (
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">이용 후기</h1>
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 text-foon-lime fill-foon-lime" />
                            ))}
                        </div>
                        <span className="text-white font-bold">4.9</span>
                        <span className="text-gray-500 text-sm">/ 5.0</span>
                    </div>
                    <p className="text-gray-400 text-sm">총 {reviews.length}개의 후기</p>
                </div>

                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-[#1e1e20] rounded-2xl p-5 border border-white/5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-foon-lime/20 flex items-center justify-center">
                                        <span className="text-lg">👤</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{review.name}</p>
                                        <p className="text-gray-500 text-xs">
                                            {review.petType} · {review.serviceType}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-foon-lime fill-foon-lime" />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {review.content}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-foon-lime/10 border border-foon-lime/20 rounded-2xl text-center">
                    <p className="text-foon-lime font-medium mb-1">정성을 다한 서비스를 경험해보세요</p>
                    <p className="text-gray-400 text-sm">이용 후기를 남겨주세요</p>
                </div>
            </main>
        </div>
    );
}
