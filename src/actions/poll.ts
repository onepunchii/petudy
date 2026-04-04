"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface PollOption {
    id: number;
    text: string;
    image_url: string | null;
    vote_count: number;
    percent?: number;
}

export interface Poll {
    id: number;
    title: string;
    description?: string;
    options: PollOption[];
    total_votes: number;
    user_voted_option_id?: number | null; // ID of the option the user voted for
    pollType?: "VS_IMAGE" | "TEXT_CHOICE";
}

export async function getLatestPoll(): Promise<Poll | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch latest OPEN poll
        const { data: pollData, error: pollError } = await supabase
            .from("polls")
            .select("*")
            .eq("status", "OPEN")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (pollError || !pollData) {
            // Return dummy data if no poll exists (for testing/demo)
            // In production, return null or handle empty state
            return {
                id: 0,
                title: "우리 아이 미용 스타일, 어떤 게 더 귀여울까요?",
                options: [
                    { id: 1, text: "곰돌이컷", image_url: "https://images.unsplash.com/photo-1598133894008-61f03db8b555?w=400&h=400&fit=crop", vote_count: 42, percent: 52 },
                    { id: 2, text: "물개컷", image_url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&h=400&fit=crop", vote_count: 38, percent: 48 },
                ],
                total_votes: 80,
                user_voted_option_id: null
            };
        }

        // 2. Fetch Options
        const { data: optionsData, error: optionsError } = await supabase
            .from("poll_options")
            .select("*")
            .eq("poll_id", pollData.id)
            .order("id", { ascending: true });

        if (optionsError) return null;

        // 3. Check if user voted
        let userVotedOptionId = null;
        if (user) {
            const { data: voteData } = await supabase
                .from("poll_votes")
                .select("option_id")
                .eq("poll_id", pollData.id)
                .eq("user_id", user.id)
                .single();

            if (voteData) {
                userVotedOptionId = voteData.option_id;
            }
        }

        // Calculate Totals & Percents
        const options = optionsData || [];
        const totalVotes = options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0);

        const formattedOptions: PollOption[] = options.map((opt: any) => ({
            id: opt.id,
            text: opt.option_text,
            image_url: opt.image_url,
            vote_count: opt.vote_count || 0,
            percent: totalVotes === 0 ? 0 : Math.round(((opt.vote_count || 0) / totalVotes) * 100)
        }));

        return {
            id: pollData.id,
            title: pollData.title,
            options: formattedOptions,
            total_votes: totalVotes,
            user_voted_option_id: userVotedOptionId
        };

    } catch (error) {
        console.error("Error fetching poll:", error);
        return null;
    }
}

export async function votePoll(pollId: number, optionId: number) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        // 1. Check if already voted
        const { data: existingVote } = await supabase
            .from("poll_votes")
            .select("*")
            .eq("poll_id", pollId)
            .eq("user_id", user.id)
            .single();

        if (existingVote) {
            return { success: false, message: "이미 투표에 참여하셨습니다." };
        }

        // 2. Insert Vote
        const { error: voteError } = await supabase
            .from("poll_votes")
            .insert({
                poll_id: pollId,
                option_id: optionId,
                user_id: user.id
            });

        if (voteError) throw voteError;

        // 3. Increment Count (Optimistic or Atomic update)
        // Using RPC or just separate update. For MVP, separate update is fine but less safe.
        // Better: Postgres trigger or RPC. Here simply fetching current + 1.
        // Let's use internal increment if Supabase supports it easily, or just raw RPC.
        // Falling back to simple read-update for MVP speed.

        const { data: option } = await supabase
            .from("poll_options")
            .select("vote_count")
            .eq("id", optionId)
            .single();

        if (option) {
            await supabase
                .from("poll_options")
                .update({ vote_count: (option.vote_count || 0) + 1 })
                .eq("id", optionId);
        }

        revalidatePath("/");
        return { success: true };

    } catch (error) {
        console.error("Vote error:", error);
        return { success: false, message: "투표 중 오류가 발생했습니다." };
    }
}

// ----------------------------------------------------------------------
// NEW: Expansion Features
// ----------------------------------------------------------------------

export async function getPolls(limit = 10, offset = 0, sortBy: 'latest' | 'popular' = 'latest') {
    try {
        const supabase = await createClient();

        // Base Query
        let query = supabase
            .from("polls")
            .select(`
                *,
                poll_options (*)
            `)
            .eq("status", "OPEN");

        // Sort Logic (Server-side for Latest, In-memory/Hybrid for Popular)
        if (sortBy === 'latest') {
            query = query.order("created_at", { ascending: false });
        } else {
            // For popular, we fetch more items and sort in memory for now
            // since we don't have a total_votes column to sort by.
            // Ideally should add total_votes column to polls table.
            // For MVP, limit is higher for popular fetch.
        }

        const { data: pollsData, error } = await query.range(offset, offset + limit * 2); // Fetch double for popular sort buffer if needed

        if (error) throw error;

        const formattedPolls: Poll[] = pollsData.map((p: any) => {
            const options = p.poll_options || [];
            const totalVotes = options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0);

            return {
                id: p.id,
                title: p.title,
                pollType: p.poll_type,
                options: options.map((opt: any) => ({
                    id: opt.id,
                    text: opt.option_text,
                    image_url: opt.image_url,
                    vote_count: opt.vote_count
                })),
                total_votes: totalVotes
            };
        });

        // Apply Popular Sort in Memory
        if (sortBy === 'popular') {
            formattedPolls.sort((a, b) => b.total_votes - a.total_votes);
        }

        // Apply Limit
        return formattedPolls.slice(0, limit);

    } catch (error) {
        console.error("Error fetching polls list:", error);
        return [];
    }
}

export interface CreatePollData {
    title: string;
    type: "VS_IMAGE" | "TEXT_CHOICE";
    options: {
        text: string;
        image?: string;
    }[];
}

export async function createPoll(data: CreatePollData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, message: "Unauthorized" };

        // 1. Create Poll
        const { data: newPoll, error: pollError } = await supabase
            .from("polls")
            .insert({
                creator_id: user.id,
                title: data.title,
                poll_type: data.type,
                status: "OPEN"
            })
            .select()
            .single();

        if (pollError) throw pollError;

        // 2. Create Options
        const optionsToInsert = data.options.map(opt => ({
            poll_id: newPoll.id,
            option_text: opt.text,
            image_url: opt.image || null,
            vote_count: 0
        }));

        const { error: optionError } = await supabase
            .from("poll_options")
            .insert(optionsToInsert);

        if (optionError) throw optionError;

        revalidatePath("/");
        revalidatePath("/community/petpick");

        return { success: true, pollId: newPoll.id };

    } catch (error: any) {
        console.error("Create poll error:", error);
        return { success: false, message: error.message || "Failed to create poll" };
    }
}

export async function getNextPoll(excludeIds: number[]): Promise<Poll | null> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch ids of open polls not in exclude list
        let query = supabase
            .from("polls")
            .select("id")
            .eq("status", "OPEN");

        if (excludeIds.length > 0) {
            query = query.not("id", "in", `(${excludeIds.join(',')})`);
        }

        const { data: candidatePolls, error } = await query;

        if (error || !candidatePolls || candidatePolls.length === 0) {
            return null; // No more polls
        }

        // 2. Randomly select one ID
        const randomIndex = Math.floor(Math.random() * candidatePolls.length);
        const nextPollId = candidatePolls[randomIndex].id;

        // 3. Reuse getLatestPoll logic or fetch specifically
        // For simplicity, let's just fetch full details for this ID
        // Note: Ideally we refactor 'getLatestPoll' to 'getPollById' but duplicating logic for MVP speed is okay.

        const { data: pollData } = await supabase
            .from("polls")
            .select("*")
            .eq("id", nextPollId)
            .single();

        if (!pollData) return null;

        const { data: optionsData } = await supabase
            .from("poll_options")
            .select("*")
            .eq("poll_id", pollData.id)
            .order("id", { ascending: true });

        // Check vote status
        let userVotedOptionId = null;
        if (user) {
            const { data: voteData } = await supabase
                .from("poll_votes")
                .select("option_id")
                .eq("poll_id", pollData.id)
                .eq("user_id", user.id)
                .single();
            if (voteData) userVotedOptionId = voteData.option_id;
        }

        const options = optionsData || [];
        const totalVotes = options.reduce((acc: number, curr: any) => acc + (curr.vote_count || 0), 0);
        const formattedOptions: PollOption[] = options.map((opt: any) => ({
            id: opt.id,
            text: opt.option_text,
            image_url: opt.image_url,
            vote_count: opt.vote_count || 0,
            percent: totalVotes === 0 ? 0 : Math.round(((opt.vote_count || 0) / totalVotes) * 100)
        }));

        return {
            id: pollData.id,
            title: pollData.title,
            options: formattedOptions,
            total_votes: totalVotes,
            user_voted_option_id: userVotedOptionId
        };

    } catch (error) {
        console.error("Error fetching next poll:", error);
        return null;
    }
}

// ----------------------------------------------------------------------
// Comments
// ----------------------------------------------------------------------

export interface PollComment {
    id: number;
    pollId: number;
    userId: string;
    content: string;
    createdAt: string;
    user?: {
        nickname: string | null;
        avatarUrl: string | null;
    };
}

export async function getPollComments(pollId: number): Promise<PollComment[]> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("poll_comments")
            .select(`
                *,
                user:users (nickname, avatar_url)
            `)
            .eq("poll_id", pollId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data.map((c: any) => ({
            id: c.id,
            pollId: c.poll_id,
            userId: c.user_id,
            content: c.content,
            createdAt: c.created_at,
            user: {
                nickname: c.user?.nickname || "익명",
                avatarUrl: c.user?.avatar_url
            }
        }));

    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}

export async function addPollComment(pollId: number, content: string) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, message: "로그인이 필요합니다." };

        const { error } = await supabase
            .from("poll_comments")
            .insert({
                poll_id: pollId,
                user_id: user.id,
                content: content
            });

        if (error) throw error;

        revalidatePath("/");

        return { success: true };

    } catch (error: any) {
        console.error("Error adding comment:", error);
        return { success: false, message: error.message || "댓글 등록 실패" };
    }
}
