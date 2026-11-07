"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { APP_ICON_STROKE, AppButton, SheetHeader, SheetPanel, sheetBackdropClass } from "@/components/app/ui";
import { PET_DATE_MIN, todayIso } from "@/lib/pet-rules";
import { cn } from "@/lib/utils";

interface DatePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (date: string) => void;
    title?: string;
    initialDate?: string;
    /** 고를 수 있는 가장 늦은 날 "YYYY-MM-DD" (기본: 오늘, 기기 날짜) */
    maxDate?: string;
    /** 고를 수 있는 가장 이른 날 (기본: 1990-01-01) */
    minDate?: string;
}

/** "YYYY-MM-DD" → 그 달 1일 (현지 시간). new Date("YYYY-MM-DD") 는 UTC 로 읽혀 날짜가 밀릴 수 있어 직접 나눕니다 */
function monthOf(iso: string) {
    const [y, m] = iso.split("-").map(Number);
    return new Date(y, m - 1, 1);
}
const isoOf = (year: number, monthIndex: number, day: number) =>
    `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

export default function DatePickerModal({ isOpen, onClose, onSelect, title = "날짜 선택", initialDate, maxDate, minDate = PET_DATE_MIN }: DatePickerModalProps) {
    const [viewDate, setViewDate] = useState(new Date()); // For navigation (Year/Month)
    const [selectedDate, setSelectedDate] = useState<string | null>(initialDate || null);
    const today = todayIso();
    const max = maxDate && maxDate < today ? maxDate : today;
    const min = minDate;

    // Initialize/Reset view when opening
    useEffect(() => {
        if (isOpen) {
            if (initialDate && /^\d{4}-\d{2}-\d{2}$/.test(initialDate)) {
                setViewDate(monthOf(initialDate));
                setSelectedDate(initialDate);
                return;
            }
            setSelectedDate(null);
            setViewDate(monthOf(todayIso()));
        }
    }, [isOpen, initialDate]);

    if (!isOpen) return null;

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth(); // 0-11

    // 고를 수 있는 범위 밖의 달로는 넘어가지 않습니다
    const maxMonth = monthOf(max);
    const minMonth = monthOf(min);
    const canPrev = new Date(year, month, 1) > minMonth;
    const canNext = new Date(year, month, 1) < maxMonth;
    const clampMonth = (d: Date) => (d > maxMonth ? maxMonth : d < minMonth ? minMonth : d);

    const handlePrevMonth = () => canPrev && setViewDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => canNext && setViewDate(new Date(year, month + 1, 1));

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setViewDate(clampMonth(new Date(parseInt(e.target.value), month, 1)));
    };

    const handleDateClick = (day: number) => {
        const dateStr = isoOf(year, month, day);
        if (dateStr > max || dateStr < min) return;
        setSelectedDate(dateStr);
    };

    const handleConfirm = () => {
        if (selectedDate && selectedDate <= max && selectedDate >= min) {
            onSelect(selectedDate);
            onClose();
        }
    };

    // Generate Calendar Grid
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const blanks = Array(startDay).fill(null);
    const days = Array.from({ length: totalDays }, (_, i) => i + 1);

    // 연도: 고를 수 있는 범위 안에서 최근 연도부터
    const maxYear = maxMonth.getFullYear();
    const minYear = minMonth.getFullYear();
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

    const monthNavClass =
        "flex h-10 w-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink active:translate-y-px disabled:pointer-events-none disabled:opacity-30";

    return (
        <>
            <div className={sheetBackdropClass} aria-hidden />
            <SheetPanel aria-label={title} className="max-h-[92dvh] overflow-y-auto">
                {/* Header */}
                <SheetHeader title={title} onClose={onClose} />

                <div className="px-5 pb-2 pt-4">
                    {/* Navigation */}
                    <div className="mb-4 flex items-center justify-between">
                        <button type="button" onClick={handlePrevMonth} disabled={!canPrev} aria-label="이전 달" className={monthNavClass}>
                            <ChevronLeft className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>

                        <div className="group relative flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 transition-colors hover:bg-paper-2">
                            <select
                                value={year}
                                onChange={handleYearChange}
                                aria-label="연도 선택"
                                className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                            >
                                {years.map(y => (
                                    <option key={y} value={y}>{y}년</option>
                                ))}
                            </select>
                            <div className="flex items-center gap-1 text-[17px] font-bold tabular-nums text-ink">
                                <span>{year}년</span>
                                <span>{month + 1}월</span>
                                <ChevronDown className="h-4 w-4 text-ink-3" strokeWidth={APP_ICON_STROKE} aria-hidden />
                            </div>
                        </div>

                        <button type="button" onClick={handleNextMonth} disabled={!canNext} aria-label="다음 달" className={monthNavClass}>
                            <ChevronRight className="h-5 w-5" strokeWidth={APP_ICON_STROKE} aria-hidden />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="mb-6 rounded-[20px] bg-pass px-2 pb-3 pt-1 ring-1 ring-line/70">
                        {/* Weekday Headers */}
                        <div className="mb-1 grid grid-cols-7 text-center">
                            {['일', '월', '화', '수', '목', '금', '토'].map((d, i) => (
                                <div key={d} className={cn("py-2 text-[13px] font-semibold", i === 0 ? "text-danger" : i === 6 ? "text-pine" : "text-ink-3")}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-y-1 text-center">
                            {blanks.map((_, i) => (
                                <div key={`blank-${i}`} className="h-10" />
                            ))}
                            {days.map(day => {
                                const dateStr = isoOf(year, month, day);
                                const isSelected = selectedDate === dateStr;
                                // 오늘 표시는 기기 날짜 기준 (UTC 로 보면 한국 0~9시에 하루 밀립니다)
                                const isToday = dateStr === today;
                                const isOutOfRange = dateStr > max || dateStr < min;

                                return (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDateClick(day)}
                                        disabled={isOutOfRange}
                                        aria-pressed={isSelected}
                                        aria-current={isToday ? "date" : undefined}
                                        className={cn(
                                            "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-[15px] tabular-nums transition-colors active:translate-y-px",
                                            isOutOfRange
                                                ? "cursor-not-allowed font-medium text-ink-3/40"
                                                : isSelected
                                                    ? "bg-night font-bold text-star"
                                                    : isToday
                                                        ? "font-bold text-pine ring-1 ring-inset ring-pine"
                                                        : "font-medium text-ink hover:bg-paper-2",
                                        )}
                                    >
                                        {day}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <AppButton variant="primary" size="lg" block onClick={handleConfirm} disabled={!selectedDate}>
                        확인
                    </AppButton>
                </div>
            </SheetPanel>
        </>
    );
}
