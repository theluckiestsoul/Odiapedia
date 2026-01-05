import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Odia Culture",
    description: "Explore the vibrant culture of Odisha - from classical Odissi dance to intricate Pattachitra art, colorful festivals, and ancient traditions.",
};

export default function CulturePage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-6xl mb-6 block">🎭</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Odia Culture
                    </h1>
                    <p className="text-3xl text-gray-600 odia-text mb-6">
                        ଓଡ଼ିଶା ସଂସ୍କୃତି
                    </p>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        A vibrant tapestry of classical dance, music, art, festivals, and traditions
                        that have flourished for millennia.
                    </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Odissi Dance */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">🩰 Odissi Dance</h3>
                            <p className="text-gray-600">
                                One of the eight classical dance forms of India, Odissi originated in the temples
                                of Odisha and is known for its sculptural poses and fluid movements.
                            </p>
                        </div>

                        {/* Pattachitra */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">🎨 Pattachitra Art</h3>
                            <p className="text-gray-600">
                                Traditional cloth-based scroll painting known for its intricate details,
                                mythological narratives, and vibrant natural colors.
                            </p>
                        </div>

                        {/* Festivals */}
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">🎉 Rath Yatra</h3>
                            <p className="text-gray-600">
                                The world-famous Chariot Festival of Lord Jagannath in Puri,
                                attracting millions of devotees from around the globe.
                            </p>
                        </div>

                        {/* Music */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">🎵 Classical Music</h3>
                            <p className="text-gray-600">
                                Odissi music with its unique ragas and talas forms the melodic
                                foundation for the classical dance and temple traditions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-500 text-lg">
                        More detailed content about Odia culture, festivals, arts, and traditions
                        coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
