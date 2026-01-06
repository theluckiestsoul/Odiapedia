import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Timeline of Odisha History",
    description: "Explore the complete history of Odisha from prehistoric times to modern era - ancient civilizations, empires, dynasties, and major events.",
};

interface TimelineEvent {
    year: string;
    era: string;
    title: string;
    titleOdia?: string;
    description: string;
    category: "prehistoric" | "ancient" | "medieval" | "colonial" | "modern";
}

const timelineEvents: TimelineEvent[] = [
    // Prehistoric
    {
        year: "~1,000,000 BCE",
        era: "Prehistoric",
        title: "Early Human Presence",
        description: "Stone Age tools discovered in Mayurbhanj and Keonjhar districts indicate early human habitation in the region.",
        category: "prehistoric",
    },
    {
        year: "~30,000 BCE",
        era: "Prehistoric",
        title: "Paleolithic Settlements",
        description: "Cave paintings and paleolithic artifacts found in Gudahandi (Kalahandi) and Vikramkhol (Jharsuguda).",
        category: "prehistoric",
    },
    {
        year: "~3000 BCE",
        era: "Prehistoric",
        title: "Neolithic Communities",
        description: "Agricultural settlements emerge. Evidence of rice cultivation and domesticated animals.",
        category: "prehistoric",
    },
    // Ancient
    {
        year: "~1500 BCE",
        era: "Ancient",
        title: "Kalinga Mentioned in Texts",
        titleOdia: "କଳିଙ୍ଗ",
        description: "Kalinga first mentioned in ancient texts. The region was known for maritime trade and cultural advancement.",
        category: "ancient",
    },
    {
        year: "~600 BCE",
        era: "Ancient",
        title: "Mahajanapada Period",
        description: "Kalinga emerges as one of the 16 Mahajanapadas (great kingdoms) of ancient India.",
        category: "ancient",
    },
    {
        year: "261 BCE",
        era: "Ancient",
        title: "Kalinga War",
        titleOdia: "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
        description: "Emperor Ashoka's brutal conquest of Kalinga. The bloodshed transformed him to embrace Buddhism and non-violence.",
        category: "ancient",
    },
    {
        year: "~150 BCE",
        era: "Ancient",
        title: "Reign of Kharavela",
        titleOdia: "ଖାରବେଳ",
        description: "The great Jain king Kharavela rules Kalinga. Hathigumpha inscription describes his conquests and achievements.",
        category: "ancient",
    },
    {
        year: "~100 CE",
        era: "Ancient",
        title: "Buddhist Influence",
        description: "Buddhism flourishes. Ratnagiri, Udayagiri, and Lalitgiri become major Buddhist centers.",
        category: "ancient",
    },
    {
        year: "350-550 CE",
        era: "Ancient",
        title: "Mathara Dynasty",
        description: "The Matharas rule coastal Odisha. Sanskrit literature and temple architecture develop.",
        category: "ancient",
    },
    // Medieval
    {
        year: "736-950 CE",
        era: "Medieval",
        title: "Bhaumakara Dynasty",
        description: "Buddhist Bhaumakara kings rule. Women rulers like Tribhuvana Mahadevi I leave their mark.",
        category: "medieval",
    },
    {
        year: "850-1110 CE",
        era: "Medieval",
        title: "Somavamshi Dynasty",
        description: "Temple building reaches its peak. Lingaraj Temple and many Bhubaneswar temples constructed.",
        category: "medieval",
    },
    {
        year: "1077-1147 CE",
        era: "Medieval",
        title: "Anantavarman Chodaganga",
        titleOdia: "ଅନନ୍ତବର୍ମନ ଚୋଡଗଙ୍ଗ",
        description: "Eastern Ganga king begins construction of the Jagannath Temple at Puri.",
        category: "medieval",
    },
    {
        year: "1238-1264 CE",
        era: "Medieval",
        title: "Narasimhadeva I builds Konark",
        titleOdia: "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
        description: "The magnificent Sun Temple at Konark is built - a masterpiece of Kalinga architecture.",
        category: "medieval",
    },
    {
        year: "1361-1434 CE",
        era: "Medieval",
        title: "Gajapati Kingdom",
        titleOdia: "ଗଜପତି ରାଜବଂଶ",
        description: "The Gajapati dynasty rules. Kapilendra Deva expands the kingdom to its greatest extent.",
        category: "medieval",
    },
    {
        year: "1568 CE",
        era: "Medieval",
        title: "Fall to the Mughals",
        description: "Kalapahad's invasion. The Gajapati kingdom falls to the Afghan general.",
        category: "medieval",
    },
    // Colonial
    {
        year: "1751 CE",
        era: "Colonial",
        title: "Maratha Control",
        description: "Marathas take control of Odisha from the Mughals. The region faces economic hardship.",
        category: "colonial",
    },
    {
        year: "1803 CE",
        era: "Colonial",
        title: "British Annexation",
        description: "British East India Company captures Odisha from the Marathas after the Anglo-Maratha War.",
        category: "colonial",
    },
    {
        year: "1817 CE",
        era: "Colonial",
        title: "Paika Rebellion",
        titleOdia: "ପାଇକ ବିଦ୍ରୋହ",
        description: "Bakshi Jagabandhu leads the Paika Rebellion - one of India's first organized uprisings against British rule.",
        category: "colonial",
    },
    {
        year: "1866 CE",
        era: "Colonial",
        title: "Great Odisha Famine",
        titleOdia: "ନଅଙ୍କ ଦୁର୍ଭିକ୍ଷ",
        description: "Devastating famine kills about one-third of the population. British policies blamed for the tragedy.",
        category: "colonial",
    },
    {
        year: "1903 CE",
        era: "Colonial",
        title: "Utkal Sammilani Founded",
        titleOdia: "ଉତ୍କଳ ସମ୍ମିଳନୀ",
        description: "Movement for a separate Odia-speaking state begins. Madhusudan Das leads the effort.",
        category: "colonial",
    },
    // Modern
    {
        year: "1936 CE",
        era: "Modern",
        title: "Odisha State Formed",
        titleOdia: "ଉତ୍କଳ ଦିବସ",
        description: "April 1 - Odisha becomes a separate province. First state formed on linguistic basis in India.",
        category: "modern",
    },
    {
        year: "1947 CE",
        era: "Modern",
        title: "Independence",
        description: "India gains independence. Princely states of Odisha merge with the Indian Union.",
        category: "modern",
    },
    {
        year: "1999 CE",
        era: "Modern",
        title: "Super Cyclone",
        description: "Devastating super cyclone hits coastal Odisha. Over 10,000 lives lost. Major reconstruction follows.",
        category: "modern",
    },
    {
        year: "2011 CE",
        era: "Modern",
        title: "Orissa Renamed Odisha",
        titleOdia: "ଓଡ଼ିଶା",
        description: "The state is officially renamed from Orissa to Odisha. Oriya renamed to Odia.",
        category: "modern",
    },
    {
        year: "2014 CE",
        era: "Modern",
        title: "Odia - Classical Language",
        description: "Odia becomes the 6th language to receive Classical Language status in India.",
        category: "modern",
    },
    {
        year: "2019 CE",
        era: "Modern",
        title: "Cyclone Fani",
        description: "Extremely severe cyclone Fani causes massive destruction. Odisha's disaster management praised globally.",
        category: "modern",
    },
];

const categoryColors: Record<string, { bg: string; border: string; dot: string }> = {
    prehistoric: { bg: "from-stone-900/50 to-stone-800/50", border: "border-stone-700/50", dot: "bg-stone-500" },
    ancient: { bg: "from-amber-900/50 to-yellow-900/50", border: "border-amber-700/50", dot: "bg-amber-500" },
    medieval: { bg: "from-orange-900/50 to-red-900/50", border: "border-orange-700/50", dot: "bg-orange-500" },
    colonial: { bg: "from-slate-900/50 to-zinc-800/50", border: "border-slate-600/50", dot: "bg-slate-400" },
    modern: { bg: "from-emerald-900/50 to-green-900/50", border: "border-emerald-700/50", dot: "bg-emerald-500" },
};

export default function TimelinePage() {
    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-amber-950/30 via-black to-black"></div>
                <div className="absolute inset-0 pattern-overlay opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block">📜</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-amber-100 mb-4 font-display">
                        Timeline of Odisha
                    </h1>
                    <p className="text-3xl text-amber-500/80 odia-text mb-8">
                        ଓଡ଼ିଶାର ଇତିହାସ
                    </p>
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed">
                        From prehistoric caves to modern achievements — explore the rich and tumultuous
                        history of Kalinga/Odisha spanning over a million years.
                    </p>
                </div>
            </section>

            {/* Era Legend */}
            <section className="py-8 border-b border-amber-900/20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.entries(categoryColors).map(([era, colors]) => (
                            <div key={era} className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                                <span className="text-amber-100/60 text-sm capitalize">{era}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-600/50 via-amber-500/30 to-amber-600/50 transform md:-translate-x-1/2"></div>

                        {/* Events */}
                        <div className="space-y-8">
                            {timelineEvents.map((event, index) => {
                                const colors = categoryColors[event.category];
                                const isLeft = index % 2 === 0;

                                return (
                                    <div
                                        key={index}
                                        className={`relative flex items-start gap-6 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"
                                            }`}
                                    >
                                        {/* Dot */}
                                        <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full border-2 border-black transform -translate-x-1/2 z-10 flex items-center justify-center">
                                            <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                                        </div>

                                        {/* Content */}
                                        <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-8 md:text-right" : "md:pl-8"}`}>
                                            <div className={`bg-gradient-to-br ${colors.bg} rounded-xl p-6 border ${colors.border}`}>
                                                <span className="text-amber-400 font-mono text-sm">{event.year}</span>
                                                <span className="text-amber-500/50 text-xs ml-2">• {event.era}</span>
                                                <h3 className="text-xl font-semibold text-amber-100 mt-2">
                                                    {event.title}
                                                </h3>
                                                {event.titleOdia && (
                                                    <p className="text-amber-500/70 odia-text text-sm mt-1">
                                                        {event.titleOdia}
                                                    </p>
                                                )}
                                                <p className="text-amber-100/60 text-sm mt-3 leading-relaxed">
                                                    {event.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-b from-black to-neutral-950 border-t border-amber-900/20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold text-amber-100 mb-6 font-display">
                        Explore More History
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/history/konark-sun-temple"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🏛️ Konark Temple
                        </Link>
                        <Link
                            href="/history/jagannath-temple"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🛕 Jagannath Temple
                        </Link>
                        <Link
                            href="/history/lingaraj-temple"
                            className="px-6 py-3 bg-amber-900/30 hover:bg-amber-900/50 border border-amber-700/30 rounded-xl text-amber-100 transition-colors"
                        >
                            🕉️ Lingaraj Temple
                        </Link>
                        <Link
                            href="/history"
                            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-black font-medium transition-colors"
                        >
                            View All History →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
