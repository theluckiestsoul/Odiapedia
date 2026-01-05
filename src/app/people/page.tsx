import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Notable People",
    description: "Meet the remarkable individuals who have shaped Odisha's identity - from ancient poets to modern leaders.",
};

export default function PeoplePage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">👥</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Notable People
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ମହାନ ବ୍ୟକ୍ତିତ୍ୱ
                    </p>
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600"></div>
                        <div className="w-3 h-3 rotate-45 bg-amber-500"></div>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600"></div>
                    </div>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        Discover the inspiring stories of individuals who have contributed to Odisha&apos;s
                        rich cultural, literary, and social heritage.
                    </p>
                </div>
            </section>

            {/* People Grid */}
            <section className="py-16 bg-black relative">
                <div className="absolute inset-0 pattern-overlay opacity-10"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Poets & Writers */}
                        <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 rounded-2xl p-8 border border-indigo-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">✍️ Poets & Writers</h3>
                            <ul className="space-y-5">
                                <li>
                                    <p className="font-semibold text-amber-300">Sarala Das</p>
                                    <p className="text-amber-100/60 text-sm">15th century poet, author of Odia Mahabharata</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Fakir Mohan Senapati</p>
                                    <p className="text-amber-100/60 text-sm">Father of modern Odia literature</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Gopabandhu Das</p>
                                    <p className="text-amber-100/60 text-sm">Poet, freedom fighter, social reformer</p>
                                </li>
                            </ul>
                        </div>

                        {/* Freedom Fighters */}
                        <div className="bg-gradient-to-br from-orange-950/50 to-red-950/50 rounded-2xl p-8 border border-orange-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🇮🇳 Freedom Fighters</h3>
                            <ul className="space-y-5">
                                <li>
                                    <p className="font-semibold text-amber-300">Jayee Rajguru</p>
                                    <p className="text-amber-100/60 text-sm">First martyr of Odisha</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Veer Surendra Sai</p>
                                    <p className="text-amber-100/60 text-sm">Legendary freedom fighter</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Biju Patnaik</p>
                                    <p className="text-amber-100/60 text-sm">Freedom fighter and Chief Minister</p>
                                </li>
                            </ul>
                        </div>

                        {/* Artists */}
                        <div className="bg-gradient-to-br from-pink-950/50 to-rose-950/50 rounded-2xl p-8 border border-pink-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🎨 Artists & Performers</h3>
                            <ul className="space-y-5">
                                <li>
                                    <p className="font-semibold text-amber-300">Kelucharan Mohapatra</p>
                                    <p className="text-amber-100/60 text-sm">Legendary Odissi dancer and guru</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Sanjukta Panigrahi</p>
                                    <p className="text-amber-100/60 text-sm">Renowned Odissi exponent</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Akshaya Mohanty</p>
                                    <p className="text-amber-100/60 text-sm">Legendary playback singer</p>
                                </li>
                            </ul>
                        </div>

                        {/* Modern Leaders */}
                        <div className="bg-gradient-to-br from-blue-950/50 to-cyan-950/50 rounded-2xl p-8 border border-blue-800/30 card-hover">
                            <h3 className="text-2xl font-bold text-amber-100 mb-6 font-display">🌟 Modern Icons</h3>
                            <ul className="space-y-5">
                                <li>
                                    <p className="font-semibold text-amber-300">Sam Pitroda</p>
                                    <p className="text-amber-100/60 text-sm">Telecom pioneer</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Dutee Chand</p>
                                    <p className="text-amber-100/60 text-sm">Olympic sprinter</p>
                                </li>
                                <li>
                                    <p className="font-semibold text-amber-300">Pradipta Kumar Mohapatra</p>
                                    <p className="text-amber-100/60 text-sm">Distinguished civil servant</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coming Soon Section */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-amber-100/50 text-lg">
                        More detailed biographies and stories coming soon...
                    </p>
                </div>
            </section>
        </div>
    );
}
