import Link from "next/link";
import { getAllDistricts } from "@/lib/districts";

export default function DistrictList() {
    const districts = getAllDistricts();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {districts.map((district) => (
                <Link
                    key={district.slug}
                    href={`/district/${district.slug}`}
                    className="group block p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 hover:border-amber-500/50 hover:bg-amber-900/30 transition-all duration-300"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">📍</span>
                        <h3 className="text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors font-display">
                            {district.title}
                        </h3>
                    </div>
                    <div className="flex justify-between text-xs text-amber-500/60 uppercase tracking-wider">
                        <span>{district.headquarters}</span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
