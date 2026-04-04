"use client";

import { useState, useEffect } from "react";
import { X, Send } from "lucide-react";
import { getPollComments, addPollComment, PollComment } from "@/actions/poll";

interface PollCommentSheetProps {
    pollId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function PollCommentSheet({ pollId, isOpen, onClose }: PollCommentSheetProps) {
    const [comments, setComments] = useState<PollComment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadComments();
        }
    }, [isOpen, pollId]);

    const loadComments = async () => {
        setIsLoading(true);
        const data = await getPollComments(pollId);
        setComments(data);
        setIsLoading(false);
    };

    const handleSubmit = async () => {
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        const res = await addPollComment(pollId, newComment);
        if (res.success) {
            setNewComment("");
            loadComments(); // Refresh
        } else {
            alert(res.message);
        }
        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-end lg:items-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="relative w-full max-w-[500px] lg:rounded-2xl bg-[#1c1c1e] text-white p-6 h-[80vh] flex flex-col rounded-t-[32px] animate-in slide-in-from-bottom duration-300 shadow-2xl border-t border-white/10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">댓글 <span className="text-foon-lime">{comments.length}</span></h3>
                    <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                    {isLoading ? (
                        <div className="text-center text-gray-500 py-10">로딩 중...</div>
                    ) : comments.length > 0 ? (
                        comments.map((comment) => (
                            <div key={comment.id} className="bg-[#2c2c2e] p-4 rounded-xl border border-white/5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-600 overflow-hidden">
                                        {/* Avatar placeholder or image */}
                                        {comment.user?.avatarUrl ? (
                                            <img src={comment.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-foon-lime/20 flex items-center justify-center text-[10px] text-foon-lime font-bold">
                                                {comment.user?.nickname?.[0]}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold text-gray-300">
                                        {comment.user?.nickname}
                                    </span>
                                    <span className="text-[10px] text-gray-600 ml-auto">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-200 leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            첫 번째 댓글을 남겨주세요! 👋
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="mt-4 pt-2 relative">
                    <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        className="w-full bg-[#2c2c2e] text-white pl-4 pr-12 py-3 rounded-full border border-white/10 focus:border-foon-lime focus:outline-none transition-colors"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        disabled={isSubmitting}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!newComment.trim() || isSubmitting}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-foon-lime rounded-full text-black disabled:opacity-50 hover:bg-white transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
