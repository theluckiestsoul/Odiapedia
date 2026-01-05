import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Odia Language",
    description: "Explore the classical Odia language - one of the oldest classical languages of India with over 1000 years of literary tradition.",
};

export default function LanguagePage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">📚</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia Language
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଆ ଭାଷା
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        One of the oldest classical languages of India, Odia has a rich literary tradition
                        spanning over a millennium.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-3xl font-bold text-amber-100 mb-6 font-display">
                            A Classical Language
                        </h2>
                        <p className="text-amber-100/70 mb-8 text-lg leading-relaxed">
                            Odia (ଓଡ଼ିଆ) is an Indo-Aryan language spoken in the Indian state of Odisha.
                            It is the official language of Odisha and has been designated as a classical
                            language of India since 2014.
                        </p>

                        <div className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 rounded-2xl p-8 my-10 border border-blue-800/30">
                            <h3 className="text-2xl font-semibold text-amber-300 mb-6 font-display">
                                Key Facts
                            </h3>
                            <ul className="space-y-4 text-amber-100/80">
                                <li className="flex items-start gap-4">
                                    <span className="text-amber-500 text-xl">✦</span>
                                    <span>6th classical language of India (2014)</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-amber-500 text-xl">✦</span>
                                    <span>Over 50 million native speakers worldwide</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-amber-500 text-xl">✦</span>
                                    <span>Unique curvilinear script evolved for palm leaf writing</span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <span className="text-amber-500 text-xl">✦</span>
                                    <span>Rich literary heritage dating back to the 10th century</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-amber-100/70 text-lg leading-relaxed">
                            The Odia script is known for its distinctive rounded appearance, which evolved
                            to write on palm leaves without tearing them. This unique characteristic makes
                            it one of the most beautiful scripts in the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-amber-100/50 text-lg">
                        More detailed content about Odia language, grammar, literature, and learning resources
                        coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
