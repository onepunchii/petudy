"use server";

import { db } from "@/lib/db";
import { letters, memories, obituaries } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getLetters(petId: string) {
    try {
        const result = await db
            .select()
            .from(letters)
            .where(eq(letters.petId, petId))
            .orderBy(desc(letters.createdAt));
        return { success: true, data: result };
    } catch (error) {
        console.error("getLetters Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function createLetter(petId: string, userId: string, content: string, occasionType: string) {
    try {
        const result = await db.insert(letters).values({
            petId,
            userId,
            content,
            occasionType,
        }).returning();
        return { success: true, data: result[0] };
    } catch (error) {
        console.error("createLetter Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteLetter(letterId: string) {
    try {
        await db.delete(letters).where(eq(letters.id, letterId));
        return { success: true };
    } catch (error) {
        console.error("deleteLetter Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function getMemories(petId: string) {
    try {
        const result = await db
            .select()
            .from(memories)
            .where(eq(memories.petId, petId))
            .orderBy(desc(memories.createdAt));
        return { success: true, data: result };
    } catch (error) {
        console.error("getMemories Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function createMemory(petId: string, userId: string, photoUrl: string, caption?: string) {
    try {
        const result = await db.insert(memories).values({
            petId,
            userId,
            photoUrl,
            caption,
        }).returning();
        return { success: true, data: result[0] };
    } catch (error) {
        console.error("createMemory Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function deleteMemory(memoryId: string) {
    try {
        await db.delete(memories).where(eq(memories.id, memoryId));
        return { success: true };
    } catch (error) {
        console.error("deleteMemory Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function getObituaryByToken(token: string) {
    try {
        const result = await db
            .select()
            .from(obituaries)
            .where(eq(obituaries.shareToken, token))
            .limit(1);
        return { success: true, data: result[0] || null };
    } catch (error) {
        console.error("getObituaryByToken Error:", error);
        return { success: false, error: String(error) };
    }
}

export async function createObituary(petId: string, userId: string, title: string, content: string) {
    try {
        const shareToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
        const result = await db.insert(obituaries).values({
            petId,
            userId,
            title,
            content,
            shareToken,
        }).returning();
        return { success: true, data: result[0], token: shareToken };
    } catch (error) {
        console.error("createObituary Error:", error);
        return { success: false, error: String(error) };
    }
}
