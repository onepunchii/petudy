import CompanyIntroSidebar from "@/components/layout/sidebars/CompanyIntroSidebar";
import ServiceBannerSidebar from "@/components/layout/sidebars/ServiceBannerSidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex w-full h-full justify-center overflow-hidden">
            {/* Left Banner (Company Info) */}
            <CompanyIntroSidebar />

            {/* Mobile Container (Centered) */}
            <main className="w-full max-w-[512px] bg-bg-main h-[100dvh] shadow-2xl relative overflow-y-auto overflow-x-hidden border-x border-[#121212] z-10 scrollbar-hide">
                {children}
            </main>

            {/* Right Banner (Service/Franchise) */}
            <ServiceBannerSidebar />
        </div>
    );
}
