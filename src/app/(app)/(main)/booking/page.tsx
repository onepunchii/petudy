"use client";

import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";

// Mock Data for Bookings
interface Booking {
    id: string;
    serviceType: "TAXI" | "FUNERAL" | "BATH" | "CHECKUP";
    serviceName: string;
    icon: string;
    date: string;
    time: string;
    price: string;
    options: string;
    status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
    petName: string;
}

const MY_BOOKINGS: Booking[] = [
    {
        id: "b1",
        serviceType: "BATH",
        serviceName: "모빌리티 목욕",
        icon: "🛁",
        date: "2024.12.20 (토)",
        time: "14:00",
        price: "55,000원",
        options: "중형견, 스파 추가",
        status: "CONFIRMED",
        petName: "두부"
    },
    {
        id: "b2",
        serviceType: "TAXI",
        serviceName: "펫택시",
        icon: "🚕",
        date: "2024.12.15 (월)",
        time: "09:30",
        price: "12,000원",
        options: "편도, 보호자 동승",
        status: "CONFIRMED",
        petName: "두부"
    },
    {
        id: "b3",
        serviceType: "CHECKUP",
        serviceName: "모빌리티 검진",
        icon: "🩺",
        date: "2024.11.10 (일)",
        time: "11:00",
        price: "150,000원",
        options: "기본 종합 검진",
        status: "COMPLETED",
        petName: "초코"
    }
];

export default function MyBookingsPage() {
    const [activeTab, setActiveTab] = useState<"UPCOMING" | "PAST">("UPCOMING");

    const upcomingBookings = MY_BOOKINGS.filter(b => b.status === "CONFIRMED");
    const pastBookings = MY_BOOKINGS.filter(b => b.status !== "CONFIRMED");

    const displayBookings = activeTab === "UPCOMING" ? upcomingBookings : pastBookings;

    return (
        <div className="min-h-screen bg-bg-main pb-24 text-white">
            {/* Header */}
            <header className="bg-bg-main px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-[#333]">
                <h1 className="text-xl font-bold text-white">내 예약</h1>
            </header>

            {/* Tabs */}
            <div className="px-6 mt-6 mb-6">
                <div className="flex p-1 bg-bg-card rounded-xl border border-[#333]">
                    <button
                        onClick={() => setActiveTab("UPCOMING")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === "UPCOMING"
                            ? "bg-[#333] text-foon-lime shadow-sm"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        이용 예정
                    </button>
                    <button
                        onClick={() => setActiveTab("PAST")}
                        className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === "PAST"
                            ? "bg-[#333] text-foon-lime shadow-sm"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        이용 내역
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="px-6 space-y-4">
                {displayBookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                        <Calendar className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm">예약 내역이 없습니다.</p>
                    </div>
                ) : (
                    displayBookings.map((booking) => (
                        <BookingCard key={booking.id} booking={booking} />
                    ))
                )}
            </div>
        </div>
    );
}

function BookingCard({ booking }: { booking: Booking }) {
    const isPast = booking.status !== "CONFIRMED";

    return (
        <div className="bg-bg-card rounded-[24px] p-6 shadow-lg border border-[#333] relative overflow-hidden group">
            {/* Status Badge */}
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <span className="text-3xl bg-bg-input p-2 rounded-full border border-[#333]">{booking.icon}</span>
                    <div>
                        <h3 className="font-bold text-white text-lg leading-tight mb-1">{booking.serviceName}</h3>
                        <p className="text-xs text-foon-lime font-bold bg-foon-lime/10 px-2 py-0.5 rounded border border-foon-lime/20 inline-block">
                            {booking.petName}
                        </p>
                    </div>
                </div>
                {booking.status === "CONFIRMED" && (
                    <span className="bg-blue-900/40 text-blue-300 border border-blue-800 text-[11px] font-bold px-3 py-1.5 rounded-full">
                        예약 확정
                    </span>
                )}
                {booking.status === "COMPLETED" && (
                    <span className="bg-[#333] text-gray-400 border border-[#444] text-[11px] font-bold px-3 py-1.5 rounded-full">
                        이용 완료
                    </span>
                )}
                {booking.status === "CANCELLED" && (
                    <span className="bg-red-900/20 text-red-400 border border-red-900/50 text-[11px] font-bold px-3 py-1.5 rounded-full">
                        취소됨
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-5">
                <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium text-gray-200 tracking-wide">{booking.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium text-gray-200 tracking-wide">{booking.time}</span>
                </div>

                {/* Divider dotted */}
                <div className="border-t border-dashed border-[#333] my-4" />

                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">선택 옵션</span>
                    <span className="text-gray-300 font-medium text-right max-w-[60%] truncate">{booking.options}</span>
                </div>
                <div className="flex justify-between text-sm items-center mt-1">
                    <span className="text-gray-500">결제 금액</span>
                    <span className="text-white font-bold text-lg">{booking.price}</span>
                </div>
            </div>

            {/* Action Buttons (Only for active bookings) */}
            {!isPast && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <button className="py-3 rounded-xl bg-[#2C2C2E] text-gray-400 text-xs font-bold border border-[#333] hover:bg-[#3A3A3D] hover:text-white transition-colors">
                        문의하기
                    </button>
                    <button className="py-3 rounded-xl bg-foon-lime/20 text-foon-lime text-xs font-bold border border-foon-lime/30 hover:bg-foon-lime/30 transition-colors">
                        변경/취소
                    </button>
                </div>
            )}
        </div>
    );
}
