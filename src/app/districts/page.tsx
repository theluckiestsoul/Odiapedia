import DistrictList from "@/components/DistrictList";
import Link from "next/link";

export const metadata = {
    title: "Districts of Odisha - Odiapedia",
    description: "Explore the 30 districts of Odisha, from the coastal plains to the western highlands.",
};

export default function DistrictsPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Link href="/" className="text-teal-600 hover:text-teal-500 text-sm mb-8 inline-block font-medium">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 font-display text-slate-900">
                        The 30 Districts
                    </h1>
                    <p className="text-xl text-teal-600 odia-text font-medium">
                        ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-2 h-2 rotate-45 bg-teal-500"></div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                </div>

                <DistrictList />
            </div>
        </div>
    );
}
