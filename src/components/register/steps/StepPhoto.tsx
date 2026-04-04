import React from "react";
import { Upload } from "lucide-react";

interface StepPhotoProps {
    formData: {
        photo?: string | null;
        [key: string]: any;
    };
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StepPhoto({ formData, onFileSelect }: StepPhotoProps) {
    return (
        <div className="space-y-6 animate-fade-in-up flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">
                프로필 사진을 등록해볼까요?
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8">
                나중에 언제든지 바꿀 수 있어요.
                <br />
                (건너뛰면 기본 이미지가 적용돼요)
            </p>

            <div className="relative w-48 h-48 rounded-full border-2 border-dashed border-gray-600 bg-[#252527] overflow-hidden flex items-center justify-center group hover:border-foon-lime transition-colors cursor-pointer">
                {formData.photo ? (
                    <img
                        src={formData.photo}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-foon-lime transition-colors">
                        <Upload className="w-8 h-8" />
                        <span className="text-xs">사진 선택하기</span>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
}
