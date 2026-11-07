"use client";

import { Camera, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getMemories, deleteMemory, createMemory } from "@/actions/memorial";
import { APP_ICON_STROKE, AppBody, AppButton, AppEmpty, AppTopBar, skeletonClass } from "@/components/app/ui";
import { cn } from "@/lib/utils";

interface Memory {
    id: string;
    photoUrl: string;
    caption?: string;
    createdAt: Date;
}

export default function PhotosPage() {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const applyMemories = (result: Awaited<ReturnType<typeof getMemories>>) => {
        if (result.success && result.data) {
            setMemories(result.data as Memory[]);
        }
        setLoading(false);
    };

    // 사진을 올린 뒤 다시 불러올 때
    const loadMemories = async () => {
        setLoading(true);
        applyMemories(await getMemories("1"));
    };

    // 처음 열 때 한 번 불러옵니다 (loading 은 처음부터 true)
    useEffect(() => {
        getMemories("1").then(applyMemories);
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const { url } = await res.json();
                await createMemory("1", "user-id", url);
                loadMemories();
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
        setUploading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        const result = await deleteMemory(id);
        if (result.success) {
            setMemories(memories.filter((m) => m.id !== id));
        }
    };

    return (
        <div className="min-h-full">
            <AppTopBar
                back="/memorial"
                title="사진"
                action={
                    <>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            aria-label="사진 추가"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-star transition-colors hover:bg-white/10 active:translate-y-px disabled:opacity-50"
                        >
                            {uploading ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-star border-t-transparent" aria-hidden />
                            ) : (
                                <Plus className="h-6 w-6" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            )}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </>
                }
            />

            <AppBody>
                {loading ? (
                    <div className="grid grid-cols-2 gap-3" role="status" aria-live="polite">
                        <div className={cn(skeletonClass, "aspect-square")} aria-hidden />
                        <div className={cn(skeletonClass, "aspect-square")} aria-hidden />
                        <div className={cn(skeletonClass, "aspect-square")} aria-hidden />
                        <div className={cn(skeletonClass, "aspect-square")} aria-hidden />
                        <span className="sr-only">사진을 불러오는 중이에요</span>
                    </div>
                ) : memories.length === 0 ? (
                    <AppEmpty
                        icon={<Camera className="h-7 w-7" strokeWidth={APP_ICON_STROKE} aria-hidden />}
                        title={
                            <span role="heading" aria-level={2}>
                                아직 등록된 사진이 없어요
                            </span>
                        }
                        description="추억이 될 사진을 등록해주세요"
                        action={
                            <AppButton variant="primary" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="h-4 w-4" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                사진 추가
                            </AppButton>
                        }
                    />
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {memories.map((memory) => (
                            <div key={memory.id} className="group relative aspect-square overflow-hidden rounded-[20px] bg-paper-2 ring-1 ring-inset ring-line/70">
                                <img src={memory.photoUrl} alt="" className="h-full w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-night/50 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(memory.id)}
                                        aria-label="사진 삭제"
                                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-pass text-danger shadow-[0_8px_20px_-8px_rgb(11_16_32/0.5)] transition-transform active:translate-y-px"
                                    >
                                        <Trash2 className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AppBody>
        </div>
    );
}
