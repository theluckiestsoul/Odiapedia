import DistrictList from "@/components/DistrictList";
import Link from "next/link";

export const metadata = {
    title: "Districts of Odisha - Odiapedia",
    description: "Explore the 30 districts of Odisha, from the coastal plains to the western highlands.",
};

export default function DistrictsPage() {
    return (
        <div className="min-h-screen bg-black text-amber-100 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <Link href="/" className="text-amber-500 hover:text-amber-400 text-sm mb-8 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 font-display text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                        The 30 Districts
                    </h1>
                    <p className="text-xl text-amber-500/70 odia-text">
                        ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-6">
                        <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-2 h-2 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                </div>

                <DistrictList />
            </div>
        </div>
    );
}
