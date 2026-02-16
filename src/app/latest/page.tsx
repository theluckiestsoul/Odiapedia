
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getLatestUpdates, UpdateItem } from "@/lib/updates";

export const metadata: Metadata = {
    title: "Latest Updates - Odiapedia",
    description: "Stay updated with the newest additions to Odiapedia - articles, movie reviews, and historical timelines.",
};

function UpdateCard({ item }: { item: UpdateItem }) {
    return (
        <Link
            href={item.link}
            className="group block bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
        >
            <div className="flex gap-4 md:gap-6 items-start">
                <div className="shrink-0 relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-100">
                    {item.image ? (
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                            {item.type === 'article' ? '📄' : '✨'}
                        </div>
                    )}
                </div>
                <div className="grow">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${item.type === 'review' ? 'bg-amber-100 text-amber-700' :
                                item.type === 'event' ? 'bg-purple-100 text-purple-700' :
                                    'bg-teal-100 text-teal-700'
                            }`}>
                            {item.tag}
                        </span>
                        <span className="text-xs text-slate-400">{item.date}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors mb-1 font-display">
                        {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm line-clamp-2">
                        {item.description}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export default function LatestPage() {
    const updates = getLatestUpdates();

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-slate-900 font-display mb-4">What's New</h1>
                    <p className="text-lg text-slate-600">
                        Track the latest additions to the diary of Odisha.
                    </p>
                </header>

                <div className="space-y-4">
                    {updates.map(item => (
                        <UpdateCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
