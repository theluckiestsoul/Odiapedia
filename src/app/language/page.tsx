import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Odia Language",
    description: "Explore the classical Odia language - one of the oldest classical languages of India with over 1000 years of literary tradition.",
};

export default function LanguagePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-6xl mb-6 block">📚</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Odia Language
                    </h1>
                    <p className="text-3xl text-gray-600 odia-text mb-6">
                        ଓଡ଼ିଆ ଭାଷା
                    </p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        One of the oldest classical languages of India, Odia has a rich literary tradition
                        spanning over a millennium.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            A Classical Language
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Odia (ଓଡ଼ିଆ) is an Indo-Aryan language spoken in the Indian state of Odisha.
                            It is the official language of Odisha and has been designated as a classical
                            language of India since 2014.
                        </p>

                        <div className="bg-blue-50 rounded-2xl p-8 my-8">
                            <h3 className="text-xl font-semibold text-blue-900 mb-4">
                                Key Facts
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>6th classical language of India (2014)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Over 50 million native speakers</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Unique curvilinear script</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-blue-500 font-bold">•</span>
                                    <span>Rich literary heritage dating back to 10th century</span>
                                </li>
                            </ul>
                        </div>

                        <p className="text-gray-600">
                            The Odia script is known for its distinctive rounded appearance, which evolved
                            to write on palm leaves without tearing them. This unique characteristic makes
                            it one of the most beautiful scripts in the world.
                        </p>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500 text-lg">
                        More detailed content about Odia language, grammar, literature, and learning resources
                        coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
