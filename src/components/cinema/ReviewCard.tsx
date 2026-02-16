
import Image from "next/image";
import { MovieReview } from "@/data/movie-reviews";

export default function ReviewCard({ review }: { review: MovieReview }) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row h-full">
            {/* Poster Section */}
            <div className="md:w-2/5 lg:w-1/3 relative h-64 md:h-auto overflow-hidden shrink-0">
                <Image
                    src={review.poster}
                    alt={review.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 border border-slate-200 shadow-sm">
                    {review.releaseYear}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col grow">
                <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 font-display group-hover:text-teal-700 transition-colors">
                                {review.title}
                            </h3>
                            <h4 className="text-xl text-teal-600 odia-text font-medium">
                                {review.titleOdia}
                            </h4>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                            <span className="text-amber-500 text-lg">★</span>
                            <span className="font-bold text-slate-800">{review.rating}</span>
                            <span className="text-slate-400 text-xs">/5</span>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                        {review.genres.map(genre => (
                            <span key={genre} className="text-xs font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                {genre}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4 mb-6 grow">
                    {/* English Review */}
                    <div className="relative pl-4 border-l-2 border-slate-200">
                        <p className="text-slate-600 text-sm leading-relaxed italic">
                            "{review.review.en}"
                        </p>
                    </div>
                    {/* Odia Review */}
                    <div className="relative pl-4 border-l-2 border-teal-200 bg-teal-50/30 py-2 rounded-r-lg">
                        <p className="text-slate-700 odia-text leading-relaxed">
                            "{review.review.od}"
                        </p>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Verdict</span>
                        <p className="font-medium text-slate-900">{review.verdict.en}</p>
                        <p className="text-sm text-slate-600 odia-text">{review.verdict.od}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
