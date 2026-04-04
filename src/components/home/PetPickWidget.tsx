"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Check, MessageCircle, Share2 } from "lucide-react";
import { Poll, votePoll, getNextPoll } from "@/actions/poll";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import PollCommentSheet from "../poll/PollCommentSheet";

interface PetPickWidgetProps {
    initialPoll: Poll | null;
    showStar?: boolean;
    enableAutoNext?: boolean;
}

export default function PetPickWidget({ initialPoll, showStar = true, enableAutoNext = true }: PetPickWidgetProps) {
    const [poll, setPoll] = useState<Poll | null>(initialPoll);
    const [isVoting, setIsVoting] = useState(false);
    const [viewedPollIds, setViewedPollIds] = useState<number[]>([]);
    const [isCommentOpen, setIsCommentOpen] = useState(false);

    useEffect(() => {
        if (initialPoll) {
            setViewedPollIds([initialPoll.id]);
        }
    }, [initialPoll]);

    // If user voted, show results immediately
    const hasVoted = !!poll?.user_voted_option_id;

    const handleVote = async (optionId: number) => {
        if (!poll || hasVoted || isVoting) return;

        setIsVoting(true);

        // 1. Optimistic Update
        const newTotal = poll.total_votes + 1;
        const newOptions = poll.options.map(opt => {
            if (opt.id === optionId) {
                return {
                    ...opt,
                    vote_count: opt.vote_count + 1,
                    percent: Math.round(((opt.vote_count + 1) / newTotal) * 100)
                };
            }
            return {
                ...opt,
                percent: Math.round((opt.vote_count / newTotal) * 100)
            };
        });

        setPoll({
            ...poll,
            options: newOptions,
            total_votes: newTotal,
            user_voted_option_id: optionId
        });

        // 2. Server Call
        const res = await votePoll(poll.id, optionId);
        if (!res.success) {
            console.error(res.message);
        }

        // 3. Auto-load Next Poll (Infinite Flow) - ONLY if enabled
        if (enableAutoNext) {
            setTimeout(async () => {
                const nextPoll = await getNextPoll(viewedPollIds);

                if (nextPoll) {
                    setPoll(nextPoll);
                    setViewedPollIds(prev => [...prev, nextPoll.id]);
                    setIsVoting(false);
                } else {
                    setIsVoting(false);
                }
            }, 2000);
        } else {
            setIsVoting(false);
        }
    };

    const handleShare = async () => {
        if (!poll) return;
        const url = window.location.href; // Or specific poll URL
        if (navigator.share) {
            try {
                await navigator.share({
                    title: poll.title,
                    text: '이 펫픽에 투표해주세요!',
                    url: url,
                });
            } catch (err) {
                console.log('Share canceled', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                alert("링크가 복사되었습니다!");
            } catch (err) {
                console.error("Copy failed", err);
            }
        }
    };

    if (!poll) return null;

    return (
        <section className={`bg-bg-card rounded-[32px] p-6 relative overflow-hidden border ${hasVoted ? 'border-foon-lime' : 'border-[#333]'} transition-colors duration-500`}>
            {/* Voted Badge */}
            {hasVoted && (
                <div className="absolute top-0 right-0 bg-foon-lime text-black font-bold text-xs px-3 py-1.5 rounded-bl-2xl z-30 flex items-center gap-1 animate-in fade-in slide-in-from-top-2">
                    <Check className="w-3 h-3" />
                    참여완료
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-bg-input text-foon-lime text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        LIVE
                    </span>
                    <h2 className="text-xl font-bold text-white leading-tight flex items-center gap-1">
                        오늘의 펫픽
                        {showStar && (
                            <div className="w-[60px] h-[60px] -my-4 flex items-center justify-center">
                                <DotLottieReact
                                    src="https://lottie.host/ef31ea2f-3a6a-4176-be9c-146569cc637f/t4OeWfqFOd.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                        )}
                    </h2>
                </div>
                <span className="text-xs text-gray-500">{poll.total_votes.toLocaleString()}명 참여 중</span>
            </div>

            <div key={poll.id} className="animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-lg text-gray-200 font-medium mb-6 text-center">
                    {poll.title}
                </h3>

                {/* Content Container */}
                <div className="flex flex-col gap-4">
                    {/* VS_IMAGE Layout (Original) */}
                    {(!poll.pollType || poll.pollType === "VS_IMAGE") && (
                        <div className="flex gap-3 h-48 relative">
                            {/* VS Badge */}
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-black/80 backdrop-blur-md border border-white/20 rounded-full w-10 h-10 flex items-center justify-center font-black text-foon-lime italic shadow-xl">
                                VS
                            </div>

                            {poll.options.map((option, idx) => {
                                const isSelected = poll.user_voted_option_id === option.id;
                                const isWinner = hasVoted && (option.percent || 0) >= 50;

                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleVote(option.id)}
                                        className={`flex-1 relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 ease-out
                                            ${hasVoted ? 'pointer-events-none' : 'active:scale-95 hover:shadow-[0_0_15px_rgba(163,223,70,0.3)]'}
                                        `}
                                    >
                                        {/* Image Background */}
                                        <div className="absolute inset-0 bg-gray-800">
                                            {option.image_url ? (
                                                <Image
                                                    src={option.image_url}
                                                    alt={option.text}
                                                    fill
                                                    className={`object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-4xl">
                                                    {idx === 0 ? "🅰️" : "🅱️"}
                                                </div>
                                            )}
                                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${hasVoted ? 'opacity-90' : 'opacity-60 group-hover:opacity-40'}`} />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 w-full p-3 z-10 flex flex-col items-center">
                                            <span className={`text-sm font-bold text-white mb-1 transition-all ${isSelected ? 'text-foon-lime scale-110' : ''}`}>
                                                {option.text}
                                            </span>

                                            {hasVoted && (
                                                <div className="w-full space-y-1 animate-in slide-in-from-bottom-2 fade-in duration-500">
                                                    <div className="flex justify-between items-end px-1">
                                                        <span className={`text-2xl font-black italic ${isWinner ? 'text-foon-lime' : 'text-gray-400'}`}>
                                                            {option.percent}%
                                                        </span>
                                                        {isSelected && <Check className="w-4 h-4 text-foon-lime mb-1.5" />}
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${isWinner ? 'bg-foon-lime' : 'bg-gray-500'}`}
                                                            style={{ width: `${option.percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {isSelected && (
                                            <div className="absolute inset-0 border-4 border-foon-lime rounded-2xl animate-pulse" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* TEXT_CHOICE Layout (New Vertical Stack) */}
                    {poll.pollType === "TEXT_CHOICE" && (
                        <div className="flex flex-col gap-3">
                            {poll.options.map((option) => {
                                const isSelected = poll.user_voted_option_id === option.id;
                                const percent = option.percent || 0;
                                const isWinner = hasVoted && percent >= 50; // Determine winner mostly for coloring if needed, or just highlight selected

                                return (
                                    <div
                                        key={option.id}
                                        onClick={() => handleVote(option.id)}
                                        className={`relative w-full p-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border
                                            ${isSelected
                                                ? 'border-foon-lime bg-foon-lime/20'
                                                : 'border-white/10 bg-[#2c2c2e] hover:bg-[#3a3a3c]'
                                            }
                                            ${hasVoted ? 'pointer-events-none' : 'active:scale-98'}
                                        `}
                                    >
                                        {/* Progress Bar Background */}
                                        {hasVoted && (
                                            <div
                                                className={`absolute inset-0 opacity-20 transition-all duration-1000 ease-out ${isSelected ? 'bg-foon-lime' : 'bg-gray-500'}`}
                                                style={{ width: `${percent}%` }}
                                            />
                                        )}

                                        <div className="relative z-10 flex items-center justify-between">
                                            <span className={`font-bold transition-colors ${isSelected ? 'text-foon-lime' : 'text-gray-200'}`}>
                                                {option.text}
                                            </span>

                                            {hasVoted && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-gray-400">{percent}%</span>
                                                    {isSelected && <Check className="w-4 h-4 text-foon-lime" />}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-4 flex justify-between items-center px-1">
                <button
                    onClick={() => setIsCommentOpen(true)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>댓글 달기</span>
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>공유</span>
                    </button>
                </div>
            </div>

            <PollCommentSheet
                pollId={poll.id}
                isOpen={isCommentOpen}
                onClose={() => setIsCommentOpen(false)}
            />
        </section>
    );
}
