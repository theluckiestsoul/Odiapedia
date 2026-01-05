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
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">🍛</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia Cuisine
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଆ ଖାଦ୍ୟ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
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
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-amber-100 mb-8 font-display">Cuisine Highlights</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-orange-950/50 to-amber-950/50 rounded-2xl p-8 border border-orange-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🛕 Mahaprasad</h3>
                            <p className="text-amber-100/70">
                                The sacred food of Lord Jagannath Temple in Puri, cooked without onion and garlic,
                                served on banana leaves.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-950/50 to-lime-950/50 rounded-2xl p-8 border border-yellow-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🍚 Pakhala Bhata</h3>
                            <p className="text-amber-100/70">
                                Fermented rice soaked in water, a summer staple served with fried fish and vegetables.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-pink-950/50 to-rose-950/50 rounded-2xl p-8 border border-pink-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🍮 Rasagola</h3>
                            <p className="text-amber-100/70">
                                The legendary sweet that originated in Odisha, made with cottage cheese balls in sugar syrup.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-2xl p-8 border border-blue-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-4 font-display">🦐 Coastal Seafood</h3>
                            <p className="text-amber-100/70">
                                Fresh seafood from the Bay of Bengal prepared with traditional mustard-based curries.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
