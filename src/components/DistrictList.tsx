import Link from "next/link";
import { getAllDistricts } from "@/lib/districts";

export default function DistrictList() {
    const districts = getAllDistricts();

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {districts.map((district) => (
                <Link
                    key={district.slug}
                    href={`/district/${district.slug}`}
                    className="group block p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                    <div className="flex items-center gap-4 mb-3">
                        <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">📍</span>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-teal-700 transition-colors font-display leading-tight">
                                {district.title.split(' ')[0]} {/* Show English Name */}
                            </h3>
                            <p className="text-sm text-teal-600 font-medium odia-text opacity-80 group-hover:opacity-100">
                                {district.titleOdia || ''} {/* Show Odia Name if available, or fetch it properly */}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider mt-4 pt-4 border-t border-slate-100 group-hover:border-teal-100">
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            HQ: {district.headquarters}
                        </span>
                        <svg className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                </Link>
            ))}
        </div>
    );
}
