"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Type, Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { createPoll } from "@/actions/poll";
import { uploadPetPhoto } from "@/actions/storage";

type PollType = "VS_IMAGE" | "TEXT_CHOICE";

export default function PollCreationForm() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [pollType, setPollType] = useState<PollType>("VS_IMAGE");
    const [isLoading, setIsLoading] = useState(false);

    // Image Mode State
    const [imageA, setImageA] = useState("");
    const [imageB, setImageB] = useState("");
    const [textA, setTextA] = useState("");
    const [textB, setTextB] = useState("");
    const [isUploadingA, setIsUploadingA] = useState(false);
    const [isUploadingB, setIsUploadingB] = useState(false);

    const fileInputARef = useRef<HTMLInputElement>(null);
    const fileInputBRef = useRef<HTMLInputElement>(null);

    // Text Mode State
    const [options, setOptions] = useState(["", ""]);

    // Helper: Convert to WebP
    const convertToWebP = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Canvas context not available"));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error("WebP conversion failed"));
                }, "image/webp", 0.8);
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, side: "A" | "B") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const setUrl = side === "A" ? setImageA : setImageB;
        const setUploading = side === "A" ? setIsUploadingA : setIsUploadingB;

        try {
            setUploading(true);

            // 1. Convert to WebP
            const webpBlob = await convertToWebP(file);
            const webpFile = new File([webpBlob], `${file.name.split('.')[0]}.webp`, { type: 'image/webp' });

            // 2. Upload
            const formData = new FormData();
            formData.append("file", webpFile);

            const res = await uploadPetPhoto(formData);
            if (res.success && res.url) {
                setUrl(res.url);
            } else {
                alert(res.error || "이미지 업로드 실패");
            }
        } catch (error) {
            console.error("Upload failed:", error);
            alert("이미지 변환 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return alert("질문을 입력해주세요.");
        setIsLoading(true);

        const payload = {
            title,
            type: pollType,
            options: [] as { text: string; image?: string }[]
        };

        if (pollType === "VS_IMAGE") {
            if (!imageA || !imageB || !textA || !textB) {
                setIsLoading(false);
                return alert("이미지와 선택지 이름을 모두 입력해주세요.");
            }
            payload.options = [
                { text: textA, image: imageA },
                { text: textB, image: imageB }
            ];
        } else {
            const validOptions = options.filter(o => o.trim());
            if (validOptions.length < 2) {
                setIsLoading(false);
                return alert("최소 2개의 선택지를 입력해주세요.");
            }
            payload.options = validOptions.map(text => ({ text }));
        }

        const res = await createPoll(payload);
        if (res.success) {
            router.push("/community/petpick");
        } else {
            alert(res.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="p-6 space-y-8 pb-32">
            {/* Type Selector */}
            <div className="flex bg-[#2c2c2e] p-1 rounded-xl">
                <button
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${pollType === "VS_IMAGE" ? "bg-[#3a3a3c] text-white shadow-md" : "text-gray-500"}`}
                    onClick={() => setPollType("VS_IMAGE")}
                >
                    <ImageIcon className="w-4 h-4" />
                    사진 투표
                </button>
                <button
                    className={`flex-1 py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${pollType === "TEXT_CHOICE" ? "bg-[#3a3a3c] text-white shadow-md" : "text-gray-500"}`}
                    onClick={() => setPollType("TEXT_CHOICE")}
                >
                    <Type className="w-4 h-4" />
                    텍스트 투표
                </button>
            </div>

            {/* Question Input */}
            <div>
                <label className="block text-sm font-bold text-gray-400 mb-2">질문</label>
                <input
                    type="text"
                    placeholder="예: 우리 강아지 미용 스타일 골라주세요!"
                    className="w-full bg-[#1c1c1e] text-white p-4 rounded-xl border border-white/10 focus:border-foon-lime focus:outline-none"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            {/* Builder Area */}
            {pollType === "VS_IMAGE" ? (
                <div className="flex gap-4">
                    {/* Option A */}
                    <div className="flex-1 space-y-3">
                        <div
                            onClick={() => fileInputARef.current?.click()}
                            className="aspect-square bg-[#1c1c1e] rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:border-foon-lime cursor-pointer relative overflow-hidden group transition-colors"
                        >
                            {isUploadingA ? (
                                <Loader2 className="w-8 h-8 animate-spin text-foon-lime" />
                            ) : imageA ? (
                                <>
                                    <img src={imageA} alt="A" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-xs">사진 1</span>
                                </>
                            )}
                            <input
                                ref={fileInputARef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "A")}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="선택지 A 이름"
                            className="w-full bg-transparent border-b border-white/20 py-2 text-center focus:border-foon-lime focus:outline-none"
                            value={textA}
                            onChange={(e) => setTextA(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center font-black text-foon-lime italic text-xl">VS</div>

                    {/* Option B */}
                    <div className="flex-1 space-y-3">
                        <div
                            onClick={() => fileInputBRef.current?.click()}
                            className="aspect-square bg-[#1c1c1e] rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 hover:border-foon-lime cursor-pointer relative overflow-hidden group transition-colors"
                        >
                            {isUploadingB ? (
                                <Loader2 className="w-8 h-8 animate-spin text-foon-lime" />
                            ) : imageB ? (
                                <>
                                    <img src={imageB} alt="B" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Camera className="w-8 h-8 text-white" />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Camera className="w-8 h-8 mb-2" />
                                    <span className="text-xs">사진 2</span>
                                </>
                            )}
                            <input
                                ref={fileInputBRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(e, "B")}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="선택지 B 이름"
                            className="w-full bg-transparent border-b border-white/20 py-2 text-center focus:border-foon-lime focus:outline-none"
                            value={textB}
                            onChange={(e) => setTextB(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-400">선택지 (가로형)</label>
                    <div className="flex flex-wrap gap-3">
                        {options.map((opt, idx) => (
                            <div key={idx} className="flex-1 min-w-[140px] flex items-center gap-2">
                                <span className="text-foon-lime font-bold w-6">{idx + 1}</span>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        className="w-full bg-[#1c1c1e] p-3 rounded-lg border border-white/10 pr-10"
                                        placeholder={`옵션 ${idx + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            const newOpts = [...options];
                                            newOpts[idx] = e.target.value;
                                            setOptions(newOpts);
                                        }}
                                    />
                                    {options.length > 2 && (
                                        <button
                                            onClick={() => {
                                                const newOpts = options.filter((_, i) => i !== idx);
                                                setOptions(newOpts);
                                            }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {options.length < 4 && (
                        <button
                            className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:border-foon-lime hover:text-foon-lime transition-colors flex items-center justify-center gap-2"
                            onClick={() => setOptions([...options, ""])}
                        >
                            + 항목 추가
                        </button>
                    )}
                </div>
            )}

            {/* Submit Button */}
            <button
                disabled={isLoading || isUploadingA || isUploadingB}
                onClick={handleSubmit}
                className="w-full bg-foon-lime text-bg-main font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(163,223,70,0.4)] active:scale-95 disabled:opacity-50 transition-all"
            >
                {isLoading ? "등록 중..." : (
                    <>
                        <Send className="w-5 h-5" />
                        투표 올리기
                    </>
                )}
            </button>
        </div>
    );
}
