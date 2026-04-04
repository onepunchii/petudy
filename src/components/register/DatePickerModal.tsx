"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from "lucide-react";

interface DatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: string) => void;
    title?: string;
    initialDate?: string;
}

export default function DatePickerModal({ isOpen, onClose, onSelect, title = "날짜 선택", initialDate }: DatePickerModalProps) {
    const [viewDate, setViewDate] = useState(new Date()); // For navigation (Year/Month)
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);

    // Initialize/Reset view when opening
    useEffect(() => {
        if (isOpen) {
            if (initialDate) {
                const date = new Date(initialDate);
                if (!isNaN(date.getTime())) {
                    setViewDate(date);
                    setSelectedDate(initialDate);
                    return;
                }
            }
            setSelectedDate(null);
            setViewDate(new Date());
        }
    }, [isOpen, initialDate]);

    if (!isOpen) return null;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0-11

    const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setViewDate(new Date(parseInt(e.target.value), month, 1));
    };

    const handleDateClick = (day: number) => {
        // Format: YYYY-MM-DD
        const monthStr = String(month + 1).padStart(2, "0");
        const dayStr = String(day).padStart(2, "0");
        const dateStr = `${year}-${monthStr}-${dayStr}`;
        setSelectedDate(dateStr);
    };

    const handleConfirm = () => {
        if (selectedDate) {
            onSelect(selectedDate);
            onClose();
        }
    };

    // Generate Calendar Grid
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // Year Options (1990 - Current + 1)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1990 + 2 }, (_, i) => currentYear + 1 - i);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in p-4">
            <div className="w-full max-w-[430px] bg-bg-card border border-[#333] rounded-[32px] p-6 pb-10 shadow-2xl animate-zoom-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-[#333] transition-colors">
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-[#333] text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2 group cursor-pointer relative">
                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        >
                            {years.map(y => (
                                <option key={y} value={y} className="text-black">{y}년</option>
                            ))}
                        </select>
                        <div className="text-lg font-bold text-white flex gap-1 group-hover:text-foon-lime transition-colors">
                            <span>{year}년</span>
                            <span>{month + 1}월</span>
                        </div>
                    </div>

                    <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-[#333] text-gray-400 hover:text-white transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Grid */}
                <div className="mb-8">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 mb-2 text-center">
                        {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                            <div key={d} className={`text-sm font-medium py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'}`}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Days */}
                    <div className="grid grid-cols-7 gap-y-2 text-center">
                        {blanks.map((_, i) => (
                            <div key={`blank-${i}`} className="h-10" />
                        ))}
                        {days.map(day => {
                            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                            const isSelected = selectedDate === dateStr;
                            const isToday = dateStr === new Date().toISOString().split('T')[0];

                            return (
                                <button
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium transition-all ${isSelected
                                        ? "bg-foon-lime text-bg-main shadow-[0_0_10px_rgba(163,223,70,0.4)] scale-105 font-bold"
                                        : isToday
                                            ? "border border-foon-lime text-foon-lime font-bold"
                                            : "text-gray-300 hover:bg-[#333] hover:text-white"
                                        }`}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Confirm Button */}
                <button
                    onClick={handleConfirm}
                    disabled={!selectedDate}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${selectedDate
                        ? "bg-foon-lime text-bg-main shadow-[0_4px_14px_rgba(163,223,70,0.4)] hover:bg-[#bbf080] active:scale-[0.98]"
                        : "bg-[#2C2C2E] text-gray-600 border border-[#333] cursor-not-allowed"
                        }`}
                >
                    확인
                </button>
            </div>
        </div>
    );
}
