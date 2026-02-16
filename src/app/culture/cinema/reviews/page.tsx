
import { Metadata } from "next";
import Link from "next/link";
import ReviewCard from "@/components/cinema/ReviewCard";
import { movieReviews } from "@/data/movie-reviews";

export const metadata: Metadata = {
    title: "Latest Odia Movie Reviews - Ollywood",
    description: "Read the latest reviews of Odia movies in English and Odia. Honest ratings and verdicts for Ollywood's newest releases.",
};

export default function MovieReviewsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-slate-900 opacity-90"></div>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/images/pattern-grid.png')" }}></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 tracking-tight">
                        Latest Movie Reviews
                    </h1>
                    <p className="text-2xl text-teal-300 odia-text mb-6">
                        ନୂଆ ଓଡ଼ିଆ ସିନେମା ସମୀକ୍ଷା
                    </p>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                        Discover the best of Ollywood. Unbiased reviews, bilingual content, and honest verdicts.
                    </p>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {movieReviews.map((review) => (
                        <div key={review.id} className="h-full">
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-12 border-t border-slate-200 bg-white text-center">
                <p className="text-slate-500 mb-4">Want to explore the history of these films?</p>
                <Link
                    href="/culture/cinema/timeline"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                    <span>📜 View Cinema Timeline</span>
                </Link>
            </section>
        </div>
    );
}
