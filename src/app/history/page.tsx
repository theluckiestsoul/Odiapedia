import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Odia History",
    description: "Journey through the rich history of Odisha - from ancient Kalinga to medieval kingdoms and the colonial era.",
};

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">🏛️</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Odia History
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଶା ଇତିହାସ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        From the mighty Kalinga Empire to the architectural wonders of the Eastern Ganga dynasty,
                        explore the rich historical tapestry of Odisha.
                    </p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-amber-100 mb-12 text-center font-display">
                        Historical Timeline
                    </h2>

                    <div className="space-y-8">
                        {/* Kalinga Era */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-900/30">
                                    1
                                </div>
                                <div className="w-0.5 h-full bg-gradient-to-b from-amber-600 to-transparent mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-2xl font-bold text-amber-100 font-display">Ancient Kalinga</h3>
                                <p className="text-amber-500/70 text-sm mb-3">261 BCE and before</p>
                                <p className="text-amber-100/70">
                                    The ancient Kalinga kingdom was known for its maritime prowess and fierce independence.
                                    The famous Kalinga War against Emperor Ashoka led to his transformation and embrace of Buddhism.
                                </p>
                            </div>
                        </div>

                        {/* Bhauma-Kara Dynasty */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-900/30">
                                    2
                                </div>
                                <div className="w-0.5 h-full bg-gradient-to-b from-amber-600 to-transparent mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-2xl font-bold text-amber-100 font-display">Bhauma-Kara Dynasty</h3>
                                <p className="text-amber-500/70 text-sm mb-3">736 - 950 CE</p>
                                <p className="text-amber-100/70">
                                    A period of Buddhist influence and cultural flourishing, with significant
                                    contributions to art and architecture.
                                </p>
                            </div>
                        </div>

                        {/* Eastern Ganga Dynasty */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-900/30">
                                    3
                                </div>
                                <div className="w-0.5 h-full bg-gradient-to-b from-amber-600 to-transparent mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-2xl font-bold text-amber-100 font-display">Eastern Ganga Dynasty</h3>
                                <p className="text-amber-500/70 text-sm mb-3">1078 - 1434 CE</p>
                                <p className="text-amber-100/70">
                                    The golden age of Odishan temple architecture, including the construction of the
                                    magnificent Sun Temple at Konark and the Jagannath Temple at Puri.
                                </p>
                            </div>
                        </div>

                        {/* Modern Era */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-bold shadow-lg shadow-amber-900/30">
                                    4
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-amber-100 font-display">Modern Odisha</h3>
                                <p className="text-amber-500/70 text-sm mb-3">1936 - Present</p>
                                <p className="text-amber-100/70">
                                    Formation of Odisha as a separate province on April 1, 1936, making it the first
                                    state formed on linguistic basis in India.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-amber-100/50 text-lg">
                        More detailed content about Odia history, rulers, monuments, and events
                        coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
