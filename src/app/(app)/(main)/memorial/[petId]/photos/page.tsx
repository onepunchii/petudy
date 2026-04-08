"use client";

import { ChevronLeft, Plus, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { getMemories, deleteMemory, createMemory } from "@/actions/memorial";

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

    useEffect(() => {
        loadMemories();
    }, []);

    const loadMemories = async () => {
        setLoading(true);
        const result = await getMemories("1");
        if (result.success && result.data) {
            setMemories(result.data as any);
        }
        setLoading(false);
    };

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
        <div className="min-h-screen bg-[#0A0A0B]">
            <header className="sticky top-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/memorial" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold text-white">사진</h1>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="ml-auto p-2 text-foon-lime disabled:opacity-50">
                    {uploading ? (
                        <div className="w-6 h-6 border-2 border-foon-lime border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Plus className="w-6 h-6" />
                    )}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </header>

            <main className="p-4 max-w-[480px] mx-auto">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-foon-lime border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#1e1e20] flex items-center justify-center">
                            <span className="text-4xl">📷</span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">아직 등록된 사진이 없어요</h2>
                        <p className="text-gray-400 text-sm mb-4">추억이 될 사진을 등록해주세요</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-foon-lime text-bg-main font-medium rounded-full"
                        >
                            <Upload className="w-5 h-5" />
                            사진 추가
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2">
                        {memories.map((memory) => (
                            <div key={memory.id} className="relative aspect-square bg-[#1e1e20] rounded-xl overflow-hidden group">
                                <img src={memory.photoUrl} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => handleDelete(memory.id)}
                                        className="p-2 bg-red-500/20 rounded-full text-red-400"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
