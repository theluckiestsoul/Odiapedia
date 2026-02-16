
import { TimelineEvent } from "@/components/history/TimelineView";

export const cinemaEvents: TimelineEvent[] = [
    // The Beginning (1930s-1950s)
    {
        year: "1936",
        era: "The Beginning",
        title: "Sita Bibaha",
        titleOdia: "ସୀତା ବିବାହ",
        description: "The first Odia film, directed by Mohan Sundar Deb Goswami. Released at Lakshmi Talkies, Puri. Budget: ₹30,000.",
        category: "ancient", // Mapping 'The Beginning' to 'ancient' color scheme for now
        image: "/images/cinema/sita_bibaha.png"
    },
    {
        year: "1949",
        era: "The Beginning",
        title: "Lalita",
        titleOdia: "ଲଳିତା",
        description: "The second Odia film, released 13 years after the first. Directed by Kali Charan Patnaik.",
        category: "ancient"
    },
    {
        year: "1950",
        era: "The Beginning",
        title: "Saptashajya",
        titleOdia: "ସପ୍ତଶଯ୍ୟା",
        description: "Third Odia film, focused on social issues. Directed by Kalyan Gupta.",
        category: "ancient"
    },
    {
        year: "1951",
        era: "The Beginning",
        title: "Roles to Eight",
        titleOdia: "ରୋଲ୍ସ ଟୁ ଏଇଟ୍",
        description: "First Odia film with an English title. Directed by Kalyan Gupta.",
        category: "ancient"
    },

    // Golden Era (1960s-1970s)
    {
        year: "1960",
        era: "Golden Era",
        title: "Sri Lokanath",
        titleOdia: "ଶ୍ରୀ ଲୋକନାଥ",
        description: "First Odia film to win a National Award. Directed by Prafulla Sengupta.",
        category: "medieval" // Mapping 'Golden Era' to 'medieval' color scheme
    },
    {
        year: "1962",
        era: "Golden Era",
        title: "Nua Bou",
        titleOdia: "ନୂଆ ବୋଉ",
        description: "A landmark social drama directed by Prabhat Mukherjee. Won National Award for Best Regional Film.",
        category: "medieval"
    },
    {
        year: "1967",
        era: "Golden Era",
        title: "Matira Manisha",
        titleOdia: "ମାଟିର ମଣିଷ",
        description: "Directed by legendary Mrinal Sen, based on Kalindi Charan Panigrahi's novel. A masterpiece of Indian parallel cinema.",
        category: "medieval"
    },
    {
        year: "1976",
        era: "Golden Era",
        title: "Gapa Hele Bi Sata",
        titleOdia: "ଗପ ହେଲେ ବି ସତ",
        description: "First Colour film of Odisha. A romantic classic directed by Nagen Ray.",
        category: "medieval",
        image: "/images/cinema/gapa_hele_bi_sata.png"
    },
    {
        year: "1976",
        era: "Golden Era",
        title: "Shesha Shrabana",
        titleOdia: "ଶେଷ ଶ୍ରାବଣ",
        description: "Blockbuster hit directed by Prashant Nanda. Known for its iconic music and tragic storytelling.",
        category: "medieval"
    },

    // Commercial & Art Wave (1980s-1990s)
    {
        year: "1984",
        era: "Evolution",
        title: "Dora",
        titleOdia: "ଡୋରା",
        description: "A massive commercial success directed by Prashant Nanda, marking a new wave of popularity.",
        category: "colonial" // Mapping 'Evolution' to 'colonial' color scheme
    },
    {
        year: "1984",
        era: "Evolution",
        title: "Maya Miriga",
        titleOdia: "ମାୟା ମିରିଗ",
        description: "Directed by Nirad Mohapatra. Screened at Cannes Film Festival (Critics' Week). A poignant family drama.",
        category: "colonial",
        image: "/images/cinema/maya_miriga.png"
    },
    {
        year: "1994",
        era: "Evolution",
        title: "I Love You",
        titleOdia: "ଆଇ ଲଭ୍ ୟୁ",
        description: "Directed by Hara Patnaik. Starring Anubhav Mohanty. Started the trend of remake-driven commercial cinema.",
        category: "colonial"
    },

    // Modern Era (2000s-Present)
    {
        year: "2002",
        era: "Modern Era",
        title: "Stree",
        titleOdia: "ସ୍ତ୍ରୀ",
        description: "Directed by Ravi Kinagi. Won the National Film Award for Best Feature Film in Odia.",
        category: "modern" // Mapping 'Modern Era' to 'modern' color scheme
    },
    {
        year: "2012",
        era: "Modern Era",
        title: "Sala Budha",
        titleOdia: "ଶଲା ବୁଢ଼ା",
        description: "Directed by Sabyasachi Mohapatra. A critically acclaimed film in Sambalpuri dialect.",
        category: "modern"
    },
    {
        year: "2019",
        era: "Modern Era",
        title: "Kalira Atita",
        titleOdia: "କାଲିର ଅତୀତ",
        description: "Directed by Nila Madhab Panda. Dealing with climate change and rising sea levels. Oscar contender.",
        category: "modern"
    },
    {
        year: "2022",
        era: "Modern Era",
        title: "Daman",
        titleOdia: "ଦମନ",
        description: "Directed by Vishal Mourya & Debi Prasad Lenka. A massive pan-Indian success based on a true story of malaria eradication.",
        category: "modern",
        image: "/images/cinema/daman.png"
    }
];

export const cinemaEraColors: Record<string, { bg: string; border: string; dot: string; text: string }> = {
    ancient: { bg: "from-stone-900/50 to-stone-800/50", border: "border-stone-700/50", dot: "bg-stone-500", text: "text-stone-400" },
    medieval: { bg: "from-amber-900/50 to-yellow-900/50", border: "border-amber-700/50", dot: "bg-amber-500", text: "text-amber-400" },
    colonial: { bg: "from-slate-900/50 to-zinc-800/50", border: "border-slate-600/50", dot: "bg-slate-400", text: "text-slate-400" },
    modern: { bg: "from-teal-900/50 to-emerald-900/50", border: "border-teal-700/50", dot: "bg-teal-500", text: "text-teal-400" },
};
