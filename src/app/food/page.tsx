import { Metadata } from "next";
import { getAllArticles } from "@/lib/mdx";
import ArticleList from "@/components/ArticleList";

export const metadata: Metadata = {
    title: "Odia Food",
    description: "Discover the unique flavors of Odia cuisine - from temple prasad to coastal delicacies and traditional sweets.",
};

export default function FoodPage() {
    const articles = getAllArticles("food");

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-900 via-teal-800 to-blue-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">🍛</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Odia Cuisine
                    </h1>
                    <p className="text-3xl text-teal-200 odia-text mb-8">
                        ଓଡ଼ିଆ ଖାଦ୍ୟ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-teal-400"></div>
                        <div className="w-3 h-3 rotate-45 bg-teal-400"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-teal-400"></div>
                    </div>
                    <p className="text-xl text-teal-50 max-w-2xl mx-auto leading-relaxed text-shadow-sm">
                        A delightful blend of subtle spices, fresh ingredients, and traditional cooking methods
                        that create unique flavors found nowhere else.
                    </p>
                </div>
            </section>

            {/* Articles Section */}
            {articles.length > 0 && (
                <ArticleList articles={articles} title="Food Articles" />
            )}

            {/* Food Categories */}
            <section className="py-16 bg-slate-100 relative">
                <div className="absolute inset-0 bg-water opacity-5 pointer-events-none"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 font-display border-l-4 border-teal-500 pl-4">Cuisine Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-orange-600 transition-colors">🛕 Mahaprasad</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                The sacred food of Lord Jagannath Temple in Puri, cooked without onion and garlic,
                                served on banana leaves.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-green-600 transition-colors">🍚 Pakhala Bhata</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Fermented rice soaked in water, a summer staple served with fried fish and vegetables.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-pink-600 transition-colors">🍮 Rasagola</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                The legendary sweet that originated in Odisha, made with cottage cheese balls in sugar syrup.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group">
                            <h3 className="text-2xl font-bold text-slate-800 mb-4 font-display group-hover:text-blue-600 transition-colors">🦐 Coastal Seafood</h3>
                            <p className="text-slate-600 leading-relaxed group-hover:text-slate-700">
                                Fresh seafood from the Bay of Bengal prepared with traditional mustard-based curries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
