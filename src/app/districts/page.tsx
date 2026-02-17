
import DistrictList from "@/components/DistrictList";
import Link from "next/link";

export const metadata = {
    title: "Districts of Odisha - Odiapedia",
    description: "Explore the 30 districts of Odisha, from the coastal plains to the western highlands.",
};

export default function DistrictsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-teal-200 hover:text-white mb-8 transition-colors text-sm font-medium bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/20">
                        <span>←</span> Back to Home
                    </Link>

                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display leading-tight">
                        The 30 Districts
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8 font-medium">
                        ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା
                    </p>

                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-300"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>

                    <p className="text-xl text-teal-100 max-w-2xl mx-auto leading-relaxed font-light">
                        Explore the diverse geography, culture, and administrative divisions of Odisha.
                    </p>
                </div>
            </section>

            {/* List Section */}
            <section className="py-16 bg-slate-50 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <DistrictList />
                </div>
            </section>
        </div>
    );
}
