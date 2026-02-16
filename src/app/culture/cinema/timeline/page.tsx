import { Metadata } from "next";
import Link from "next/link";
import TimelineView from "@/components/history/TimelineView";
import { cinemaEvents, cinemaEraColors } from "@/data/cinema-timeline";

export const metadata: Metadata = {
    title: "Timeline of Odia Cinema (Ollywood)",
    description: "Explore the journey of Odia Cinema from 1936 to present. Discover the milestones, classics, and modern hits of Ollywood.",
};

export default function CinemaTimelinePage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">🎬</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Timeline of Odia Cinema
                    </h1>
                    <p className="text-3xl text-purple-200 odia-text mb-8">
                        ଓଡ଼ିଆ ଚଳଚ୍ଚିତ୍ରର ଯାତ୍ରା
                    </p>
                    <p className="text-xl text-purple-100/90 max-w-2xl mx-auto leading-relaxed mb-4 font-light">
                        From the first black & white mythological classic 'Sita Bibaha' to the
                        modern pan-Indian success of 'Daman'.
                    </p>
                </div>
            </section>

            {/* Era Legend */}
            <section className="py-8 border-b border-slate-200 bg-white shadow-sm sticky top-16 z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.entries(cinemaEraColors).map(([era, colors]) => (
                            <div key={era} className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                                <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                                <span className="text-slate-600 text-sm capitalize font-medium">{era}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-slate-50 relative">
                <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
                <TimelineView events={cinemaEvents} categoryColors={cinemaEraColors} />
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 font-display">
                        Explore Culture
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/culture"
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-bold transition-colors shadow-lg shadow-purple-600/20"
                        >
                            View All Culture →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
