import PollCreationForm from "@/components/poll/PollCreationForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreatePollPage() {
    return (
        <div className="min-h-screen bg-bg-main text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-bg-main/80 backdrop-blur-md border-b border-white/5 h-14 flex items-center px-4">
                <Link href="/community/petpick" className="p-2 -ml-2 text-white hover:text-gray-300 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
                    투표 만들기
                </h1>
            </header>

            <PollCreationForm />
        </div>
    );
}
