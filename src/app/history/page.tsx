import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Odia History",
    description: "Journey through the rich history of Odisha - from ancient Kalinga to medieval kingdoms and the colonial era.",
};

export default function HistoryPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-amber-50 via-white to-orange-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-6xl mb-6 block">🏛️</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Odia History
                    </h1>
                    <p className="text-3xl text-gray-600 odia-text mb-6">
                        ଓଡ଼ିଶା ଇତିହାସ
                    </p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        From the mighty Kalinga Empire to the architectural wonders of the Eastern Ganga dynasty,
                        explore the rich historical tapestry of Odisha.
                    </p>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Historical Timeline
                    </h2>

                    <div className="space-y-8">
                        {/* Kalinga Era */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                    1
                                </div>
                                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-xl font-bold text-gray-900">Ancient Kalinga</h3>
                                <p className="text-gray-500 text-sm mb-2">261 BCE and before</p>
                                <p className="text-gray-600">
                                    The ancient Kalinga kingdom was known for its maritime prowess and fierce independence.
                                    The famous Kalinga War against Emperor Ashoka led to his transformation and embrace of Buddhism.
                                </p>
                            </div>
                        </div>

                        {/* Bhauma-Kara Dynasty */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                    2
                                </div>
                                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-xl font-bold text-gray-900">Bhauma-Kara Dynasty</h3>
                                <p className="text-gray-500 text-sm mb-2">736 - 950 CE</p>
                                <p className="text-gray-600">
                                    A period of Buddhist influence and cultural flourishing, with significant
                                    contributions to art and architecture.
                                </p>
                            </div>
                        </div>

                        {/* Eastern Ganga Dynasty */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                    3
                                </div>
                                <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                            </div>
                            <div className="flex-1 pb-8">
                                <h3 className="text-xl font-bold text-gray-900">Eastern Ganga Dynasty</h3>
                                <p className="text-gray-500 text-sm mb-2">1078 - 1434 CE</p>
                                <p className="text-gray-600">
                                    The golden age of Odishan temple architecture, including the construction of the
                                    magnificent Sun Temple at Konark and the Jagannath Temple at Puri.
                                </p>
                            </div>
                        </div>

                        {/* Modern Era */}
                        <div className="flex gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                    4
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">Modern Odisha</h3>
                                <p className="text-gray-500 text-sm mb-2">1936 - Present</p>
                                <p className="text-gray-600">
                                    Formation of Odisha as a separate province on April 1, 1936, making it the first
                                    state formed on linguistic basis in India.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500 text-lg">
                        More detailed content about Odia history, rulers, monuments, and events
                        coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
