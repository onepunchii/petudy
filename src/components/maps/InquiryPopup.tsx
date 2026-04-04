"use client";

import React, { useState } from 'react';
import Stepper, { Step } from '../../components/maps/Stepper';
import { motion, AnimatePresence } from 'motion/react';

interface InquiryPopupProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: string; // "funeral", "grooming", "camping"
}

export default function InquiryPopup({ isOpen, onClose, initialType }: InquiryPopupProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        type: initialType || 'funeral',
        budget: '',
        message: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#0F0F0F] rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 text-white/30 hover:text-white z-50 p-2 transition-colors focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>

                        <Stepper
                            className="w-full flex flex-col h-full"
                            initialStep={1}
                            onFinalStepCompleted={() => {
                                alert("상담 신청이 완료되었습니다!");
                                onClose();
                            }}
                            backButtonText="이전"
                            nextButtonText="다음"
                            stepCircleContainerClassName="bg-transparent border-none shadow-none w-full max-w-full"
                            stepContainerClassName="w-full px-8 pt-8 pb-4"
                            contentClassName="px-8 min-h-[280px]"
                            footerClassName="px-8 pb-8"
                            backButtonProps={{
                                className: "px-6 py-2 rounded-full text-sm font-medium text-[#666] hover:text-white transition-colors focus:outline-none"
                            }}
                            nextButtonProps={{
                                className: "px-8 py-2 rounded-full bg-[#FF5500] text-white text-sm font-bold shadow-[0_0_20px_rgba(255,85,0,0.3)] hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] hover:bg-[#FF6600] transition-all focus:outline-none"
                            }}
                        >
                            {/* Step 1: Contact Info */}
                            <Step>
                                <div className="flex flex-col gap-6 text-center pt-8">
                                    <h2 className="text-2xl font-bold text-white">기본 정보 입력</h2>
                                    <p className="text-[#B0B0B0] -mt-4 mb-4">원활한 상담을 위해 연락처를 남겨주세요.</p>

                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="이름 (성함)"
                                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5500] focus:outline-none transition-colors"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="연락처 (010-0000-0000)"
                                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5500] focus:outline-none transition-colors"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Step>

                            {/* Step 2: Service Type */}
                            <Step>
                                <div className="flex flex-col gap-6 text-center pt-8">
                                    <h2 className="text-2xl font-bold text-white">관심 서비스 선택</h2>
                                    <p className="text-[#B0B0B0] -mt-4 mb-4">어떤 비즈니스를 계획 중이신가요?</p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {['funeral', 'grooming', 'camping'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => handleInputChange('type', type)}
                                                className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.type === type
                                                    ? 'bg-[#FF5500]/20 border-[#FF5500] text-white'
                                                    : 'bg-[#1A1A1A] border-white/10 text-[#666] hover:bg-white/5'
                                                    }`}
                                            >
                                                {type === 'funeral' && '🕊️'}
                                                {type === 'grooming' && '✂️'}
                                                {type === 'camping' && '🚐'}
                                                <span className="capitalize font-medium block mt-1">
                                                    {type === 'funeral' ? '반려동물 장례' : type === 'grooming' ? '펫 미용/목욕' : '캠핑/유틸리티'}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Step>

                            {/* Step 3: Budget & Details */}
                            <Step>
                                <div className="flex flex-col gap-6 text-center pt-8">
                                    <h2 className="text-2xl font-bold text-white">상담 상세 내용</h2>
                                    <p className="text-[#B0B0B0] -mt-4 mb-4">예산 및 특별 요청사항을 알려주세요.</p>

                                    <div className="space-y-4">
                                        <select
                                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5500] focus:outline-none transition-colors appearance-none"
                                            value={formData.budget}
                                            onChange={(e) => handleInputChange('budget', e.target.value)}
                                        >
                                            <option value="" disabled>예산 범위 선택</option>
                                            <option value="3000-5000">3,000만원 ~ 5,000만원</option>
                                            <option value="5000-8000">5,000만원 ~ 8,000만원</option>
                                            <option value="8000+">8,000만원 이상</option>
                                        </select>

                                        <textarea
                                            rows={4}
                                            placeholder="기타 문의사항이나 요청사항을 자유롭게 적어주세요."
                                            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#FF5500] focus:outline-none transition-colors resize-none"
                                            value={formData.message}
                                            onChange={(e) => handleInputChange('message', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </Step>

                            {/* Step 4: Final Confirmation */}
                            <Step>
                                <div className="flex flex-col gap-6 text-center pt-8">
                                    <div className="w-16 h-16 bg-[#FF5500]/20 text-[#FF5500] rounded-full flex items-center justify-center mx-auto mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">신청 준비 완료!</h2>
                                    <p className="text-[#B0B0B0] -mt-4 mb-4">
                                        입력하신 정보로 담당자가 24시간 이내에 <br /> 연락드려 상세한 상담을 도와드립니다.
                                    </p>

                                    <div className="bg-[#1A1A1A] rounded-xl p-6 text-left space-y-3 text-sm border border-white/5">
                                        <div className="flex justify-between">
                                            <span className="text-[#666]">이름:</span>
                                            <span className="text-white">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666]">연락처:</span>
                                            <span className="text-white">{formData.phone}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[#666]">관심 서비스:</span>
                                            <span className="text-[#FF5500] font-bold capitalize">{formData.type}</span>
                                        </div>
                                    </div>
                                </div>
                            </Step>

                        </Stepper>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
