import { Metadata } from "next";
import Link from "next/link";
import TimelineView, { TimelineEvent } from "@/components/history/TimelineView";

export const metadata: Metadata = {
    alternates: { canonical: "/history/timeline" },
    title: "Timeline of Odisha History",
    description: "Explore the complete history of Odisha from prehistoric times to modern era - ancient civilizations, empires, dynasties, and major events.",
};

const timelineEvents: TimelineEvent[] = [
    // Prehistoric Era
    {
        year: "Lower Palaeolithic",
        era: "Prehistoric",
        title: "Early Human Presence",
        description: "Lower Palaeolithic (Acheulian) stone tools found in Mayurbhanj, Keonjhar, Sundargarh and Sambalpur districts show very early human presence; exact dates are uncertain.",
        category: "prehistoric",
    },
    {
        year: "Upper Palaeolithic",
        era: "Prehistoric",
        title: "Prehistoric Rock Art",
        description: "Rock carvings and paintings attributed to the Upper Palaeolithic are reported from the Gudahandi hills in Kalahandi district.",
        category: "prehistoric",
    },
    {
        year: "Date debated",
        era: "Prehistoric",
        title: "Vikramkhol Rock Markings",
        description: "Rock markings at Vikramkhol near Belpahar (Jharsuguda), studied by K. P. Jayaswal in the 1930s, were tentatively dated by him to about 1500 BCE. Scholars still debate their age and whether they are writing at all.",
        category: "prehistoric",
    },
    {
        year: "Neolithic",
        era: "Prehistoric",
        title: "Neolithic Communities",
        description: "Neolithic tools such as hoes, chisels and grinding stones, along with pottery, are found at sites such as Kuchai near Baripada, pointing to early farming communities.",
        category: "prehistoric",
    },
    // Ancient Era
    {
        year: "1st millennium BCE",
        era: "Ancient",
        title: "Kalinga in Early Literature",
        titleOdia: "କଳିଙ୍ଗ",
        description: "Kalinga is named as a kingdom in early Sanskrit, Buddhist and Jain literature, including the Mahabharata. Its maritime links with Southeast Asia developed over the following centuries.",
        category: "ancient",
    },
    {
        year: "Legendary period",
        era: "Ancient",
        title: "Legendary Kings of Kalinga",
        description: "According to tradition, epic and Buddhist texts name several early kings of Kalinga; these accounts are legendary and cannot be dated reliably.",
        category: "ancient",
    },
    {
        year: "c. 6th century BCE",
        era: "Ancient",
        title: "Age of the Mahajanapadas",
        description: "Kalinga is not among the sixteen Mahajanapadas listed in the Buddhist Anguttara Nikaya, but early Buddhist and Jain texts mention it as a distinct kingdom in this period.",
        category: "ancient",
    },
    {
        year: "c. 350 BCE",
        era: "Ancient",
        title: "Nanda Empire Conquest",
        description: "Mahapadma Nanda of Magadha is presumed to have conquered Kalinga. Kharavela's Hathigumpha inscription later refers to a Nanda king who opened a canal and carried away a Jain image from Kalinga.",
        category: "ancient",
    },
    {
        year: "Late 4th century BCE",
        era: "Ancient",
        title: "Kalinga Outside Mauryan Rule",
        description: "After the fall of the Nandas, Kalinga appears to have remained independent of the Mauryas until Ashoka's conquest; how it left Nanda control is not recorded.",
        category: "ancient",
    },
    {
        year: "c. 261 BCE",
        era: "Ancient",
        title: "Kalinga War",
        titleOdia: "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
        description: "Emperor Ashoka conquers Kalinga. His Rock Edict XIII records that 150,000 people were deported and 100,000 killed, and expresses his remorse; afterwards he turns to the policy of Dhamma and becomes a committed patron of Buddhism.",
        category: "ancient",
        image: "/images/timeline/kalinga-war.png"
    },
    {
        year: "c. 3rd century BCE",
        era: "Ancient",
        title: "Dhauli Peace Edicts",
        titleOdia: "ଧଉଳି ଶିଳାଲେଖ",
        description: "Ashoka's rock edicts are engraved at Dhauli near Bhubaneswar, including the two Separate Kalinga Edicts on the fair treatment of his subjects. Edict XIII, which describes the war, is not included there.",
        category: "ancient",
    },
    {
        year: "Late 3rd century BCE",
        era: "Ancient",
        title: "Independence from Mauryas",
        description: "Mauryan power declines after Ashoka's death (c. 232 BCE), and Kalinga regains its independence; the exact date is not known.",
        category: "ancient",
    },
    {
        year: "c. 2nd-1st century BCE",
        era: "Ancient",
        title: "Mahameghavahana Dynasty",
        description: "The Mahameghavahana (Chedi) dynasty is established in Kalinga.",
        category: "ancient",
    },
    {
        year: "c. 1st century BCE",
        era: "Ancient",
        title: "Reign of Kharavela",
        titleOdia: "ଖାରବେଳ",
        description: "The Jain king Kharavela rules Kalinga (his dates are debated). The Hathigumpha inscription at Udayagiri records his campaigns, his extension of an old canal, his patronage of the arts and of Jain monks, and says a Yavana (Greek) king withdrew to Mathura on hearing of his advance.",
        category: "ancient",
    },
    {
        year: "c. 1st-13th century CE",
        era: "Ancient",
        title: "Buddhist Diamond Triangle",
        description: "Lalitgiri's Buddhist establishment goes back to around the early centuries CE; Ratnagiri and Udayagiri flourish later, especially from about the 5th-7th to the 12th-13th centuries, as major monasteries and centres of learning.",
        category: "ancient",
    },
    {
        year: "c. 350 CE",
        era: "Ancient",
        title: "Samudragupta's Southern Campaign",
        description: "Samudragupta's Allahabad Pillar inscription records that he defeated kings of the region, including Mahendra of Kosala, on his southern campaign; they were released and reinstated rather than annexed.",
        category: "ancient",
    },
    {
        year: "c. 4th-5th century CE",
        era: "Ancient",
        title: "Mathara Dynasty",
        description: "The Matharas rule southern Kalinga from Pishtapura; their kingdom probably extended between the Mahanadi and Godavari rivers.",
        category: "ancient",
    },
    {
        year: "c. 6th-8th century CE",
        era: "Ancient",
        title: "Shailodbhava Dynasty",
        description: "The Shailodbhava dynasty rules with capital at Kongoda. Shaivism flourishes.",
        category: "ancient",
    },
    {
        year: "c. 639 CE",
        era: "Ancient",
        title: "Hiuen-Tsang Visits Odra",
        description: "Chinese pilgrim Hiuen-Tsang visits Odra (Odisha), documenting its Buddhist monasteries and culture.",
        category: "ancient",
    },
    {
        year: "c. 650 CE",
        era: "Ancient",
        title: "Parashurameshvara Temple",
        description: "One of the oldest surviving temples in Bhubaneswar is built by Sailodbhava rulers.",
        category: "ancient",
    },
    // Medieval Era
    {
        year: "c. 8th-10th century CE",
        era: "Medieval",
        title: "Bhaumakara Dynasty",
        description: "The Bhaumakara kings rule much of coastal Odisha. The early rulers were Buddhist, and the dynasty is notable for its several ruling queens.",
        category: "medieval",
    },
    {
        year: "c. 846 CE",
        era: "Medieval",
        title: "Queen Tribhuvana Mahadevi I",
        titleOdia: "ତ୍ରିଭୁବନ ମହାଦେବୀ",
        description: "Tribhuvana Mahadevi I, widow of Shantikara I, rules the Bhaumakara kingdom; her Dhenkanal inscription records her reign. She is often described as one of the earliest women rulers in Odisha's history.",
        category: "medieval",
    },
    {
        year: "c. 882 CE",
        era: "Medieval",
        title: "Somavamshi Dynasty Founded",
        description: "Janmejaya I establishes the Somavamshi dynasty. Great temple-building era begins.",
        category: "medieval",
    },
    {
        year: "10th-11th century CE",
        era: "Medieval",
        title: "Mukteshwar & Rajarani Temples",
        description: "The Mukteshwar Temple (10th century), often called the 'gem of Odishan architecture', and the Rajarani Temple (c. 11th century) are built in Bhubaneswar.",
        category: "medieval",
    },
    {
        year: "11th century CE",
        era: "Medieval",
        title: "Lingaraj Temple Construction",
        titleOdia: "ଲିଙ୍ଗରାଜ ମନ୍ଦିର",
        description: "The Lingaraj Temple, traditionally attributed to Somavamshi rulers, is built; it is the largest temple in Bhubaneswar.",
        category: "medieval",
    },
    {
        year: "11th century CE",
        era: "Medieval",
        title: "Rise of the Eastern Gangas",
        titleOdia: "ଗଙ୍ଗ ବଂଶ",
        description: "The Eastern Gangas, rulers of Kalinga from Kalinganagara (near Mukhalingam) since about the 5th century, grow in power; under Anantavarman Chodaganga they extend their rule over Odisha.",
        category: "medieval",
        image: "/images/timeline/odissi-dance.png"
    },
    {
        year: "c. 1078-1147 CE",
        era: "Medieval",
        title: "Anantavarman Chodaganga",
        titleOdia: "ଅନନ୍ତବର୍ମନ ଚୋଡଗଙ୍ଗ",
        description: "Anantavarman Chodaganga conquers Utkala and rules from the Ganga to the Godavari. He is credited with beginning the present Jagannath Temple at Puri.",
        category: "medieval",
    },
    {
        year: "12th century CE",
        era: "Medieval",
        title: "Jagannath Temple Built",
        titleOdia: "ଜଗନ୍ନାଥ ମନ୍ଦିର",
        description: "The present Jagannath Temple at Puri is built in the 12th century. Construction is credited to Anantavarman Chodaganga; sources differ on its completion date and on the role of his successors. It is one of the four Char Dham pilgrimage sites.",
        category: "medieval",
    },
    {
        year: "c. 1211 CE",
        era: "Medieval",
        title: "Capital Shifts to Cuttack",
        titleOdia: "କଟକ",
        description: "Cuttack (Kataka) becomes the capital under the Eastern Ganga king Anangabhima Deva III (r. c. 1211-1238); a fort-settlement existed there earlier.",
        category: "medieval",
    },
    {
        year: "1238-1264 CE",
        era: "Medieval",
        title: "Narasimhadeva I",
        description: "Eastern Ganga king who builds the Konark Sun Temple and campaigns successfully against the Turkic governors of Bengal.",
        category: "medieval",
    },
    {
        year: "c. 1250 CE",
        era: "Medieval",
        title: "Konark Sun Temple Built",
        titleOdia: "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
        description: "The Sun Temple at Konark is built in the form of a giant chariot with 24 wheels. It was inscribed as a UNESCO World Heritage Site in 1984.",
        category: "medieval",
        image: "/images/timeline/konark-wheel.png"
    },
    {
        year: "1278 CE",
        era: "Medieval",
        title: "Ananta Vasudeva Temple",
        description: "Built by Chandrika Devi, daughter of Anangabhima Deva III. One of the few major Vaishnava temples in Bhubaneswar, a city dominated by Shiva temples.",
        category: "medieval",
    },
    {
        year: "1434-35 CE",
        era: "Medieval",
        title: "Suryavamsi Gajapati Dynasty Founded",
        titleOdia: "ଗଜପତି ରାଜବଂଶ",
        description: "Kapilendra Deva takes the throne from the last Eastern Ganga king and founds the Suryavamsi Gajapati dynasty.",
        category: "medieval",
    },
    {
        year: "1435-1467 CE",
        era: "Medieval",
        title: "Kapilendra Deva's Conquests",
        titleOdia: "କପିଳେନ୍ଦ୍ର ଦେବ",
        description: "Kapilendra Deva's campaigns extend the kingdom from the Ganga in the north deep into the Deccan and the south, close to the greatest territorial extent of any Odishan state.",
        category: "medieval",
    },
    {
        year: "15th century CE",
        era: "Medieval",
        title: "Sarala Mahabharata",
        description: "Sarala Dasa composes the Odia Mahabharata, a free retelling rather than a literal translation and a foundational work of Odia literature.",
        category: "medieval",
    },
    {
        year: "1513 CE",
        era: "Medieval",
        title: "Vijayanagara Invasion",
        description: "Krishnadevaraya of Vijayanagara captures the Gajapati fort of Udayagiri (in present-day Andhra Pradesh) from Prataparudra Deva, beginning a long war that weakens the Gajapatis.",
        category: "medieval",
    },
    {
        year: "1541 CE",
        era: "Medieval",
        title: "Bhoi Dynasty",
        description: "Govinda Vidyadhara seizes the throne from the Suryavamsi Gajapatis and founds the Bhoi dynasty.",
        category: "medieval",
    },
    {
        year: "1568 CE",
        era: "Medieval",
        title: "Fall of Independent Odisha",
        description: "Mukunda Deva, the last independent Hindu king of Odisha, is killed amid rebellion, and Afghan forces of Sulaiman Karrani of Bengal, with the general Kalapahad, take control of Odisha by the end of 1568.",
        category: "medieval",
    },
    {
        year: "1576 CE",
        era: "Medieval",
        title: "Battle of Rajmahal",
        description: "The Mughals defeat Daud Khan Karrani at the Battle of Rajmahal. Afghan chiefs continue to hold Odisha for some years afterwards.",
        category: "medieval",
    },
    {
        year: "1592 CE",
        era: "Medieval",
        title: "Akbar Annexes Odisha",
        description: "Akbar's general Man Singh defeats the Afghans, and Odisha is annexed to the Mughal Empire as part of the Bengal Subah.",
        category: "medieval",
    },
    {
        year: "Early 17th century CE",
        era: "Medieval",
        title: "Orissa Becomes a Separate Subah",
        description: "Odisha is separated from Bengal as its own Mughal province (subah). Sources differ on the date, crediting either Jahangir or Shah Jahan.",
        category: "medieval",
    },
    {
        year: "1751 CE",
        era: "Medieval",
        title: "Maratha Control",
        description: "Unable to stop Maratha raids, Alivardi Khan, Nawab of Bengal, cedes Odisha to Raghoji I Bhonsle of Nagpur. Maratha rule lasts until 1803.",
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
        description: "Jayi Rajguru, minister of the Raja of Khurda, leads an early armed resistance to British rule. He is captured and executed by the British in 1806.",
        category: "colonial",
    },
    {
        year: "1817 CE",
        era: "Colonial",
        title: "Paika Rebellion",
        titleOdia: "ପାଇକ ବିଦ୍ରୋହ",
        description: "Bakshi Jagabandhu leads the Paika militia uprising against the British, often described as one of the earliest organised armed rebellions against Company rule.",
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
        description: "The Na'anka famine kills about one million people, roughly a third of the population of the Odisha division; failures of the colonial administration were widely blamed. The newspaper 'Utkal Dipika' is founded the same year.",
        category: "colonial",
    },
    {
        year: "1868 CE",
        era: "Colonial",
        title: "Ravenshaw College Founded",
        description: "Founded in Cuttack with intermediate classes at the Cuttack Zilla School; it became a first-grade college in 1876 and was named Ravenshaw College in 1878 after Commissioner T. E. Ravenshaw.",
        category: "colonial",
    },
    {
        year: "1898 CE",
        era: "Colonial",
        title: "Fakir Mohan Senapati",
        titleOdia: "ଫକୀରମୋହନ ସେନାପତି",
        description: "Fakir Mohan Senapati publishes 'Rebati', considered the first Odia short story. He is regarded as the father of modern Odia literature.",
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
        description: "Satyagrahis march to Inchudi on the Balasore coast to make salt in defiance of the salt law, making it the main centre of the Salt Satyagraha in Odisha during the Civil Disobedience Movement.",
        category: "colonial",
    },
    // Modern Era
    {
        year: "April 1, 1936",
        era: "Modern",
        title: "Odisha State Formed",
        titleOdia: "ଉତ୍କଳ ଦିବସ",
        description: "Odisha becomes a separate province, often described as the first in India formed on a linguistic basis. The day is celebrated as Utkal Divas.",
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
        year: "1943 CE",
        era: "Modern",
        title: "Utkal University",
        description: "Utkal University, the oldest university in Odisha, is established on 27 November 1943. Its Vani Vihar campus in Bhubaneswar was inaugurated in 1963.",
        category: "modern",
    },
    {
        year: "1946 CE",
        era: "Modern",
        title: "Hirakud Dam Foundation",
        description: "Governor Sir Hawthorne Lewis lays the foundation stone of the Hirakud Dam on 15 March 1946.",
        category: "modern",
    },
    {
        year: "1947 CE",
        era: "Modern",
        title: "Independence",
        description: "India gains independence on 15 August 1947. Odisha's princely states merge with the province from 1 January 1948, a process completed with Mayurbhanj in 1949.",
        category: "modern",
    },
    {
        year: "1948 CE",
        era: "Modern",
        title: "All India Radio Cuttack",
        description: "All India Radio opens its Cuttack station, the first radio station in Odisha.",
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
        year: "1950s",
        era: "Modern",
        title: "Odisha Board of Secondary Education",
        description: "The Board of Secondary Education, Odisha, constituted under a 1953 state education act, takes charge of secondary education and examinations.",
        category: "modern",
    },
    {
        year: "1957 CE",
        era: "Modern",
        title: "Hirakud Dam Inaugurated",
        description: "The Hirakud Dam on the Mahanadi, completed in 1953, is inaugurated by Prime Minister Jawaharlal Nehru on 13 January 1957. Including its dykes it is about 25.8 km long, among the longest earthen dams in the world.",
        category: "modern",
    },
    {
        year: "1959 CE",
        era: "Modern",
        title: "Rourkela Steel Plant",
        titleOdia: "ରାଉରକେଲା ଇସ୍ପାତ କାରଖାନା",
        description: "President Rajendra Prasad inaugurates the first blast furnace of Rourkela Steel Plant on 3 February 1959. Built with West German collaboration, it was India's first integrated public-sector steel plant.",
        category: "modern",
        image: "/images/timeline/modern-odisha.png"
    },
    {
        year: "1961 CE",
        era: "Modern",
        title: "Orissa State Electricity Board",
        description: "The Orissa State Electricity Board (OSEB) is set up to manage power generation and supply in the state.",
        category: "modern",
    },
    {
        year: "1999 CE",
        era: "Modern",
        title: "Super Cyclone",
        description: "A super cyclone strikes coastal Odisha on 29 October 1999, killing nearly 10,000 people. The disaster led to major changes in the state's disaster preparedness.",
        category: "modern",
    },
    {
        year: "2000 CE",
        era: "Modern",
        title: "Naveen Patnaik Era Begins",
        titleOdia: "ନବୀନ ପଟ୍ଟନାୟକ",
        description: "Naveen Patnaik becomes Chief Minister in March 2000 and leads BJD governments for 24 years, until June 2024.",
        category: "modern",
    },
    {
        year: "2011 CE",
        era: "Modern",
        title: "Orissa Renamed Odisha",
        titleOdia: "ଓଡ଼ିଶା",
        description: "From 1 November 2011 the state is officially renamed from Orissa to Odisha, and the language from Oriya to Odia, closer to the native pronunciation.",
        category: "modern",
    },
    {
        year: "2013 CE",
        era: "Modern",
        title: "Cyclone Phailin",
        description: "Very severe cyclonic storm Phailin strikes in October 2013. The evacuation of nearly a million people keeps the death toll low, and Odisha's disaster management is widely praised.",
        category: "modern",
    },
    {
        year: "2014 CE",
        era: "Modern",
        title: "Odia - Classical Language",
        description: "Odia becomes the sixth language to receive Classical Language status in India (February 2014), recognising its long and independent literary tradition.",
        category: "modern",
    },
    {
        year: "2018 CE",
        era: "Modern",
        title: "Men's Hockey World Cup",
        titleOdia: "ହକି ବିଶ୍ୱକପ",
        description: "Bhubaneswar hosts the Men's Hockey World Cup at Kalinga Stadium. The same year the Odisha government begins sponsoring India's national hockey teams.",
        category: "modern",
    },
    {
        year: "2019 CE",
        era: "Modern",
        title: "Cyclone Fani",
        description: "Extremely severe cyclonic storm Fani makes landfall near Puri on 3 May 2019. The evacuation of more than a million people is praised internationally.",
        category: "modern",
    },
    {
        year: "2023 CE",
        era: "Modern",
        title: "Balasore Train Tragedy",
        description: "A three-train collision near Bahanaga Bazar station in Balasore district on 2 June 2023 kills 296 people and injures about 1,200, one of India's worst rail accidents.",
        category: "modern",
    },
    {
        year: "2024 CE",
        era: "Modern",
        title: "New Government",
        description: "After 24 years of BJD rule, the BJP forms the government in Odisha, with Mohan Charan Majhi as Chief Minister (June 2024).",
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
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900 to-laterite-900"></div>
                <div className="absolute inset-0 bg-water opacity-20 mix-blend-soft-light"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-7xl mb-6 block animate-float">📜</span>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 font-display">
                        Timeline of Odisha
                    </h1>
                    <p className="text-3xl text-laterite-200 odia-text mb-8">
                        ଓଡ଼ିଶାର ଇତିହାସ
                    </p>
                    <p className="text-xl text-laterite-100/90 max-w-2xl mx-auto leading-relaxed mb-4 font-light">
                        From prehistoric caves to modern achievements — explore the rich and tumultuous
                        history of Kalinga and Odisha, from the Stone Age to the present day.
                    </p>
                    <p className="text-laterite-300 text-sm font-medium tracking-wide uppercase">
                        {eventCount} historical events documented
                    </p>
                </div>
            </section>

            {/* Era Legend */}
            <section className="py-8 border-b border-slate-200 bg-white shadow-sm sticky top-16 z-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {Object.entries(categoryColors).map(([era, colors]) => (
                            <div key={era} className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                                <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                                <span className="text-slate-600 text-sm capitalize font-medium">{era}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-16 bg-slate-50 relative">
                <div className="absolute inset-0 pattern-grid opacity-5 pointer-events-none"></div>
                <TimelineView events={timelineEvents} categoryColors={categoryColors} />
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 font-display">
                        Explore More History
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/history/konark-sun-temple"
                            className="px-6 py-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-slate-700 hover:text-orange-700 transition-all shadow-sm hover:shadow-md"
                        >
                            🏛️ Konark Temple
                        </Link>
                        <Link
                            href="/history/jagannath-temple"
                            className="px-6 py-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-slate-700 hover:text-orange-700 transition-all shadow-sm hover:shadow-md"
                        >
                            🛕 Jagannath Temple
                        </Link>
                        <Link
                            href="/history/lingaraj-temple"
                            className="px-6 py-3 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-slate-700 hover:text-orange-700 transition-all shadow-sm hover:shadow-md"
                        >
                            🕉️ Lingaraj Temple
                        </Link>
                        <Link
                            href="/history"
                            className="px-6 py-3 bg-laterite-600 hover:bg-laterite-700 rounded-xl text-white font-bold transition-colors shadow-lg shadow-laterite-600/20"
                        >
                            View All History →
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
