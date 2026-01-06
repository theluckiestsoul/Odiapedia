import { Metadata } from "next";
import Link from "next/link";
import TimelineView, { TimelineEvent } from "@/components/history/TimelineView";

export const metadata: Metadata = {
    title: "Timeline of Odisha History",
    description: "Explore the complete history of Odisha from prehistoric times to modern era - ancient civilizations, empires, dynasties, and major events.",
};

const timelineEvents: TimelineEvent[] = [
    // Prehistoric Era
    {
        year: "~1,000,000 BCE",
        era: "Prehistoric",
        title: "Early Human Presence",
        description: "Stone Age tools discovered in Mayurbhanj and Keonjhar districts indicate early human habitation.",
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
        year: "~10,000 BCE",
        era: "Prehistoric",
        title: "Vikramkhol Rock Inscriptions",
        description: "Ancient rock inscriptions discovered - possibly one of the oldest human writings in the region.",
        category: "prehistoric",
    },
    {
        year: "~3000 BCE",
        era: "Prehistoric",
        title: "Neolithic Communities",
        description: "Agricultural settlements emerge with evidence of rice cultivation and domesticated animals.",
        category: "prehistoric",
    },
    // Ancient Era
    {
        year: "~1100 BCE",
        era: "Ancient",
        title: "Early Kalinga Dynasties",
        titleOdia: "କଳିଙ୍ଗ",
        description: "Early Kalinga dynasties emerge. The region develops maritime trade with Southeast Asia.",
        category: "ancient",
    },
    {
        year: "~700 BCE",
        era: "Ancient",
        title: "Suryavamsha of Kalinga",
        description: "The Suryavamsha dynasty rules Kalinga, establishing it as a significant power.",
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
        year: "350 BCE",
        era: "Ancient",
        title: "Nanda Empire Conquest",
        description: "Kalinga is conquered by Mahapadmananda and integrated into the Nanda Empire.",
        category: "ancient",
    },
    {
        year: "322 BCE",
        era: "Ancient",
        title: "Independence from Nanda",
        description: "Kalinga breaks away from the Nanda Empire after Chandragupta Maurya's rebellion.",
        category: "ancient",
    },
    {
        year: "261 BCE",
        era: "Ancient",
        title: "Kalinga War",
        titleOdia: "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
        description: "Emperor Ashoka's brutal conquest kills 100,000+ warriors. The bloodshed transforms him to embrace Buddhism and non-violence. One of history's most significant wars.",
        category: "ancient",
        image: "/images/timeline/kalinga-war.png"
    },
    {
        year: "260 BCE",
        era: "Ancient",
        title: "Dhauli Peace Edicts",
        titleOdia: "ଧଉଳି ଶିଳାଲେଖ",
        description: "Ashoka erects rock edicts at Dhauli proclaiming his new policy of Dhamma (righteousness) and non-violence.",
        category: "ancient",
    },
    {
        year: "224 BCE",
        era: "Ancient",
        title: "Independence from Mauryas",
        description: "Kalinga regains independence from the Mauryan Empire during the rule of Dasharatha.",
        category: "ancient",
    },
    {
        year: "~150 BCE",
        era: "Ancient",
        title: "Mahameghavahana Dynasty",
        description: "The Mahameghavahana (Chedi) dynasty is established in Kalinga.",
        category: "ancient",
    },
    {
        year: "~100 BCE",
        era: "Ancient",
        title: "Reign of Kharavela",
        titleOdia: "ଖାରବେଳ",
        description: "The great Jain king Kharavela rules Kalinga. Hathigumpha inscription at Udayagiri describes his conquests. He builds canals, patronizes arts, and defeats Greek invaders.",
        category: "ancient",
    },
    {
        year: "~100 CE",
        era: "Ancient",
        title: "Buddhist Diamond Triangle",
        description: "Ratnagiri, Udayagiri, and Lalitgiri flourish as major Buddhist monasteries and learning centers.",
        category: "ancient",
    },
    {
        year: "350 CE",
        era: "Ancient",
        title: "Gupta Conquest",
        description: "Kalinga is conquered by Samudragupta and becomes part of the Gupta Empire.",
        category: "ancient",
    },
    {
        year: "350-550 CE",
        era: "Ancient",
        title: "Mathara Dynasty",
        description: "The Matharas rule coastal Odisha. Sanskrit literature and early temple architecture develop.",
        category: "ancient",
    },
    {
        year: "6th Century CE",
        era: "Ancient",
        title: "Shailodbhava Dynasty",
        description: "The Shailodbhava dynasty rules with capital at Kongoda. Shaivism flourishes.",
        category: "ancient",
    },
    {
        year: "639 CE",
        era: "Ancient",
        title: "Hiuen-Tsang Visits Odra",
        description: "Chinese pilgrim Hiuen-Tsang visits Odra (Odisha), documenting its Buddhist monasteries and culture.",
        category: "ancient",
    },
    {
        year: "650 CE",
        era: "Ancient",
        title: "Parashurameshvara Temple",
        description: "One of the oldest surviving temples in Bhubaneswar is built by Sailodbhava rulers.",
        category: "ancient",
    },
    // Medieval Era
    {
        year: "736-950 CE",
        era: "Medieval",
        title: "Bhaumakara Dynasty",
        description: "Buddhist Bhaumakara kings rule Odisha. Notable for powerful queens and religious tolerance.",
        category: "medieval",
    },
    {
        year: "845 CE",
        era: "Medieval",
        title: "Queen Tribhuvana Mahadevi I",
        titleOdia: "ତ୍ରିଭୁବନ ମହାଦେବୀ",
        description: "First female ruler of Odisha. She rules the Bhaumakara kingdom with distinction.",
        category: "medieval",
    },
    {
        year: "882 CE",
        era: "Medieval",
        title: "Somavamshi Dynasty Founded",
        description: "Janmejaya I establishes the Somavamshi dynasty. Great temple-building era begins.",
        category: "medieval",
    },
    {
        year: "900-1000 CE",
        era: "Medieval",
        title: "Mukteshwar & Rajarani Temples",
        description: "Exquisite temples built in Bhubaneswar, showcasing the 'Gem of Odishan architecture'.",
        category: "medieval",
    },
    {
        year: "1000 CE",
        era: "Medieval",
        title: "Lingaraj Temple Construction",
        titleOdia: "ଲିଙ୍ଗରାଜ ମନ୍ଦିର",
        description: "The majestic Lingaraj Temple is completed - the largest and most important temple in Bhubaneswar.",
        category: "medieval",
    },
    {
        year: "1038 CE",
        era: "Medieval",
        title: "Eastern Ganga Dynasty",
        titleOdia: "ଗଙ୍ଗ ବଂଶ",
        description: "The Eastern Ganga dynasty is established, beginning one of Odisha's most glorious periods.",
        category: "medieval",
        image: "/images/timeline/odissi-dance.png"
    },
    {
        year: "1077-1147 CE",
        era: "Medieval",
        title: "Anantavarman Chodaganga",
        titleOdia: "ଅନନ୍ତବର୍ମନ ଚୋଡଗଙ୍ଗ",
        description: "Greatest Ganga king. Begins construction of Jagannath Temple at Puri. Expands empire from Ganga to Godavari rivers.",
        category: "medieval",
    },
    {
        year: "1135 CE",
        era: "Medieval",
        title: "Capital Shifts to Cuttack",
        titleOdia: "କଟକ",
        description: "Chodagangadeva shifts the capital from Kalinganagara to Kataka (Cuttack).",
        category: "medieval",
    },
    {
        year: "1174 CE",
        era: "Medieval",
        title: "Jagannath Temple Completed",
        titleOdia: "ଜଗନ୍ନାଥ ମନ୍ଦିର",
        description: "The Jagannath Temple at Puri is completed by Ananga Bhima Deva III. Becomes one of the four sacred Char Dhams.",
        category: "medieval",
    },
    {
        year: "1238-1264 CE",
        era: "Medieval",
        title: "Narasimhadeva I",
        description: "Great warrior king who builds the Konark Sun Temple and defeats the Delhi Sultanate's invasion attempts.",
        category: "medieval",
    },
    {
        year: "1250 CE",
        era: "Medieval",
        title: "Konark Sun Temple Built",
        titleOdia: "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
        description: "The magnificent Sun Temple at Konark is built as a giant chariot with 24 wheels. Now a UNESCO World Heritage Site.",
        category: "medieval",
        image: "/images/timeline/konark-wheel.png"
    },
    {
        year: "1278 CE",
        era: "Medieval",
        title: "Ananta Vasudeva Temple",
        description: "Built by Queen Chandrika. The only temple in Bhubaneswar dedicated to Vishnu.",
        category: "medieval",
    },
    {
        year: "1434 CE",
        era: "Medieval",
        title: "Gajapati Dynasty Founded",
        titleOdia: "ଗଜପତି ରାଜବଂଶ",
        description: "Kapilendra Deva overthrows the Gangas and establishes the Gajapati dynasty.",
        category: "medieval",
    },
    {
        year: "1435-1467 CE",
        era: "Medieval",
        title: "Kapilendra Deva's Conquests",
        titleOdia: "କପିଳେନ୍ଦ୍ର ଦେବ",
        description: "Greatest Gajapati king. Expands empire from Ganga to Kaveri. Odisha reaches its maximum territorial extent.",
        category: "medieval",
    },
    {
        year: "~1467 CE",
        era: "Medieval",
        title: "Sarala Mahabharata",
        description: "Sarala Dasa writes the Odia Mahabharata, one of the earliest Mahabharata translations in any Indian language.",
        category: "medieval",
    },
    {
        year: "1513 CE",
        era: "Medieval",
        title: "Vijayanagara Invasion",
        description: "Krishnadevaraya of Vijayanagara invades Udayagiri, weakening the Gajapatis.",
        category: "medieval",
    },
    {
        year: "1541 CE",
        era: "Medieval",
        title: "Bhoi Dynasty",
        description: "Govinda Vidyadhara founds the Bhoi dynasty after the decline of the Gajapatis.",
        category: "medieval",
    },
    {
        year: "1568 CE",
        era: "Medieval",
        title: "Fall of Independent Odisha",
        description: "Kalapahad, Afghan general from Bengal Sultanate, invades. Last king Mukunda Deva is killed. End of independent Odia rule.",
        category: "medieval",
    },
    {
        year: "1576 CE",
        era: "Medieval",
        title: "Mughal Rule Begins",
        description: "Battle of Raj Mahal. Odisha comes under Mughal rule, administered as part of Bengal Subah.",
        category: "medieval",
    },
    {
        year: "1592 CE",
        era: "Medieval",
        title: "Akbar Annexes Odisha",
        description: "Emperor Akbar formally annexes Odisha into the Mughal Empire as part of Bengal Subah.",
        category: "medieval",
    },
    {
        year: "1606 CE",
        era: "Medieval",
        title: "Jahangir Separates Odisha",
        description: "Emperor Jahangir separates Odisha from Bengal, giving it distinct administrative status.",
        category: "medieval",
    },
    {
        year: "1751 CE",
        era: "Medieval",
        title: "Maratha Control",
        description: "Marathas defeat the Mughals and take control of Odisha. Period of economic hardship follows.",
        category: "medieval",
    },
    // Colonial Era
    {
        year: "1803 CE",
        era: "Colonial",
        title: "British Annexation",
        description: "British East India Company captures Puri, Cuttack, and Baleshwar from Marathas. Lord Wellesley's expansion.",
        category: "colonial",
    },
    {
        year: "1804 CE",
        era: "Colonial",
        title: "Jayi Rajguru's Revolt",
        titleOdia: "ଜୟୀ ରାଜଗୁରୁ",
        description: "First uprising against British rule in Odisha. Jayi Rajguru tortured and killed by the British.",
        category: "colonial",
    },
    {
        year: "1817 CE",
        era: "Colonial",
        title: "Paika Rebellion",
        titleOdia: "ପାଇକ ବିଦ୍ରୋହ",
        description: "Bakshi Jagabandhu leads the Paika militia uprising against the British - one of India's first organized rebellions.",
        category: "colonial",
    },
    {
        year: "1837 CE",
        era: "Colonial",
        title: "Cuttack Mission Press",
        description: "First printing press established in Odisha, beginning the era of printed Odia literature.",
        category: "colonial",
    },
    {
        year: "1857 CE",
        era: "Colonial",
        title: "Sepoy Mutiny in Odisha",
        titleOdia: "ସିପାହୀ ବିଦ୍ରୋହ",
        description: "Veer Surendra Sai leads the revolt in western Odisha. Imprisoned for 37 years for his resistance.",
        category: "colonial",
    },
    {
        year: "1866 CE",
        era: "Colonial",
        title: "Great Odisha Famine",
        titleOdia: "ନଅଙ୍କ ଦୁର୍ଭିକ୍ଷ",
        description: "Devastating Na'anka famine kills 1/3 of the population (1+ million). British policies blamed. 'Utkal Dipika' newspaper founded same year.",
        category: "colonial",
    },
    {
        year: "1875 CE",
        era: "Colonial",
        title: "Ravenshaw College Founded",
        description: "Odisha's premier educational institution founded in Cuttack, named after T.E. Ravenshaw.",
        category: "colonial",
    },
    {
        year: "1882 CE",
        era: "Colonial",
        title: "Fakir Mohan Senapati",
        titleOdia: "ଫକୀରମୋହନ ସେନାପତି",
        description: "Fakir Mohan Senapati publishes 'Rebati', the first Odia short story. Father of modern Odia literature.",
        category: "colonial",
    },
    {
        year: "1903 CE",
        era: "Colonial",
        title: "Utkal Sammilani Founded",
        titleOdia: "ଉତ୍କଳ ସମ୍ମିଳନୀ",
        description: "Movement for separate Odia-speaking state begins. Madhusudan Das leads the Odia nationalist movement.",
        category: "colonial",
    },
    {
        year: "1912 CE",
        era: "Colonial",
        title: "Bihar-Orissa Province",
        description: "Odisha is combined with Bihar as a separate province, separated from Bengal.",
        category: "colonial",
    },
    {
        year: "1930 CE",
        era: "Colonial",
        title: "Salt Satyagraha at Inchudi",
        description: "Gopabandhu Das leads the Salt March at Inchudi beach, Balasore, as part of Gandhi's Civil Disobedience Movement.",
        category: "colonial",
    },
    // Modern Era
    {
        year: "April 1, 1936",
        era: "Modern",
        title: "Odisha State Formed",
        titleOdia: "ଉତ୍କଳ ଦିବସ",
        description: "Odisha becomes a separate province - the first state in India formed on linguistic basis. This day is celebrated as Utkal Divas.",
        category: "modern",
    },
    {
        year: "1936 CE",
        era: "Modern",
        title: "First Odia Film",
        description: "'Sita Bibaha' - the first Odia film is released, marking the birth of Ollywood.",
        category: "modern",
    },
    {
        year: "1946 CE",
        era: "Modern",
        title: "Hirakud Dam Foundation",
        description: "Foundation stone laid for Hirakud Dam - one of the world's longest earthen dams.",
        category: "modern",
    },
    {
        year: "1947 CE",
        era: "Modern",
        title: "Independence",
        description: "India gains independence. 26 princely states of Odisha merge with the Indian Union.",
        category: "modern",
    },
    {
        year: "1948 CE",
        era: "Modern",
        title: "All India Radio Cuttack",
        description: "AIR establishes its station in Cuttack, bringing radio to Odisha.",
        category: "modern",
    },
    {
        year: "1950 CE",
        era: "Modern",
        title: "Odisha in Republic India",
        description: "Odisha becomes a state of the Republic of India with 13 districts.",
        category: "modern",
    },
    {
        year: "1956 CE",
        era: "Modern",
        title: "Odisha Board of Secondary Education",
        description: "BSE Odisha is formed to regulate secondary education in the state.",
        category: "modern",
    },
    {
        year: "1957 CE",
        era: "Modern",
        title: "Hirakud Dam Completed",
        description: "Asia's longest dam is completed on Mahanadi River. Inaugurated by PM Jawaharlal Nehru.",
        category: "modern",
    },
    {
        year: "1958 CE",
        era: "Modern",
        title: "Rourkela Steel Plant",
        titleOdia: "ରାଉରକେଲା ଇସ୍ପାତ କାରଖାନା",
        description: "Rourkela Steel Plant (RSP) is established - first public sector steel plant with German collaboration.",
        category: "modern",
        image: "/images/timeline/modern-odisha.png"
    },
    {
        year: "1961 CE",
        era: "Modern",
        title: "Odisha Legislative Assembly",
        description: "Bidhan Saudha building is inaugurated. Odisha State Electricity Board (OSEB) is set up.",
        category: "modern",
    },
    {
        year: "1975 CE",
        era: "Modern",
        title: "Utkal University",
        description: "Utkal University becomes one of the major universities in Eastern India.",
        category: "modern",
    },
    {
        year: "1999 CE",
        era: "Modern",
        title: "Super Cyclone",
        description: "Devastating super cyclone hits coastal Odisha on October 29. Over 10,000 lives lost. Major reconstruction follows.",
        category: "modern",
    },
    {
        year: "2000 CE",
        era: "Modern",
        title: "Naveen Patnaik Era Begins",
        titleOdia: "ନବୀନ ପଟ୍ଟନାୟକ",
        description: "Naveen Patnaik becomes Chief Minister, beginning two decades of BJD rule and transformation.",
        category: "modern",
    },
    {
        year: "2011 CE",
        era: "Modern",
        title: "Orissa Renamed Odisha",
        titleOdia: "ଓଡ଼ିଶା",
        description: "The state is officially renamed from Orissa to Odisha. Oriya renamed to Odia (closer to original pronunciation).",
        category: "modern",
    },
    {
        year: "2013 CE",
        era: "Modern",
        title: "Cyclone Phailin",
        description: "Extremely severe cyclone. Massive evacuation of 1 million people saves lives. Odisha's disaster management praised.",
        category: "modern",
    },
    {
        year: "2014 CE",
        era: "Modern",
        title: "Odia - Classical Language",
        description: "Odia becomes the 6th language to receive Classical Language status in India, recognizing its 1000+ year literary heritage.",
        category: "modern",
    },
    {
        year: "2018 CE",
        era: "Modern",
        title: "Men's Hockey World Cup",
        titleOdia: "ହକି ବିଶ୍ୱକପ",
        description: "Bhubaneswar hosts the Men's Hockey World Cup at Kalinga Stadium. Odisha becomes India's hockey hub.",
        category: "modern",
    },
    {
        year: "2019 CE",
        era: "Modern",
        title: "Cyclone Fani",
        description: "Extremely severe cyclone Fani causes massive destruction in May. Odisha's evacuation of 1.5 million people praised globally.",
        category: "modern",
    },
    {
        year: "2023 CE",
        era: "Modern",
        title: "Balasore Train Tragedy",
        description: "One of India's worst train accidents occurs near Balasore. 296 lives lost, 1200 injured.",
        category: "modern",
    },
    {
        year: "2024 CE",
        era: "Modern",
        title: "New Government",
        description: "Political change after 24 years. BJP-led government takes charge in Odisha.",
        category: "modern",
    },
];

const categoryColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
    prehistoric: { bg: "from-stone-900/50 to-stone-800/50", border: "border-stone-700/50", dot: "bg-stone-500", text: "text-stone-400" },
    ancient: { bg: "from-amber-900/50 to-yellow-900/50", border: "border-amber-700/50", dot: "bg-amber-500", text: "text-amber-400" },
    medieval: { bg: "from-orange-900/50 to-red-900/50", border: "border-orange-700/50", dot: "bg-orange-500", text: "text-orange-400" },
    colonial: { bg: "from-slate-900/50 to-zinc-800/50", border: "border-slate-600/50", dot: "bg-slate-400", text: "text-slate-400" },
    modern: { bg: "from-emerald-900/50 to-green-900/50", border: "border-emerald-700/50", dot: "bg-emerald-500", text: "text-emerald-400" },
};

export default function TimelinePage() {
    const eventCount = timelineEvents.length;

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
                    <p className="text-xl text-amber-100/70 max-w-2xl mx-auto leading-relaxed mb-4">
                        From prehistoric caves to modern achievements — explore the rich and tumultuous
                        history of Kalinga/Odisha spanning over a million years.
                    </p>
                    <p className="text-amber-500/60 text-sm">
                        {eventCount} historical events documented
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
                <TimelineView events={timelineEvents} categoryColors={categoryColors} />
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
