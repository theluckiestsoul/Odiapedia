
import { TimelineEvent } from "@/components/history/TimelineView";

export const cinemaEvents: TimelineEvent[] = [
    // The Beginning (1930s-1950s)
    {
        year: "1936",
        era: "The Beginning",
        title: "Sita Bibaha",
        titleOdia: "ସୀତା ବିବାହ",
        description: "The first Odia film, directed and produced by Mohan Sundar Deb Goswami, who also acted in it. Released on 28 April 1936 at Laxmi Talkies, Puri, it was made on a budget of about ₹30,000.",
        category: "ancient", // Mapping 'The Beginning' to 'ancient' color scheme for now
        image: "/images/cinema/sita_bibaha.png"
    },
    {
        year: "1949",
        era: "The Beginning",
        title: "Lalita",
        titleOdia: "ଲଳିତା",
        description: "The second Odia film, released 13 years after the first. Directed by Kalyan Gupta.",
        category: "ancient"
    },
    {
        year: "1950",
        era: "The Beginning",
        title: "Saptashajya",
        titleOdia: "ସପ୍ତଶଯ୍ୟା",
        description: "One of the very few Odia films made in the years immediately after Lalita; sources differ on its exact release year.",
        category: "ancient"
    },
    {
        year: "1951",
        era: "The Beginning",
        title: "Roles to Eight",
        titleOdia: "ରୋଲ୍ସ ଟୁ ଏଇଟ୍",
        description: "Also written 'Roles - 28'. Cited as the first Odia film with an English title.",
        category: "ancient"
    },

    // Golden Era (1960s-1970s)
    {
        year: "1960",
        era: "Golden Era",
        title: "Sri Lokanath",
        titleOdia: "ଶ୍ରୀ ଲୋକନାଥ",
        description: "First Odia film to win a National Film Award. Directed by Prafulla Sengupta.",
        category: "medieval" // Mapping 'Golden Era' to 'medieval' color scheme
    },
    {
        year: "1962",
        era: "Golden Era",
        title: "Nua Bou",
        titleOdia: "ନୂଆ ବୋଉ",
        description: "A social drama of village life directed by Prabhat Mukherjee, with Prashanta Nanda in his first lead role. The film was recognised at the National Film Awards.",
        category: "medieval"
    },
    {
        year: "1966",
        era: "Golden Era",
        title: "Matira Manisha",
        titleOdia: "ମାଟିର ମଣିଷ",
        description: "Directed by Mrinal Sen, based on Kalindi Charan Panigrahi's novel about two brothers and their family land. It won the National Film Award for Best Odia Feature Film.",
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
        description: "Prashanta Nanda's directorial debut, with music by Prafulla Kar. It set a box-office record and is known for its music and tragic storytelling.",
        category: "medieval"
    },

    // Commercial & Art Wave (1980s-1990s)
    {
        year: "1984",
        era: "Evolution",
        title: "Dora",
        titleOdia: "ଡୋରା",
        description: "A popular Odia film of the 1980s starring Prashanta Nanda and Mahasweta Ray.",
        category: "colonial" // Mapping 'Evolution' to 'colonial' color scheme
    },
    {
        year: "1984",
        era: "Evolution",
        title: "Maya Miriga",
        titleOdia: "ମାୟା ମିରିଗ",
        description: "Directed by Nirad N. Mohapatra. Screened in the Critics' Week section at Cannes in 1984 and won the National Film Award for Second Best Feature Film. A poignant family drama.",
        category: "colonial",
        image: "/images/cinema/maya_miriga.png"
    },
    {
        year: "2004",
        era: "Modern Era",
        title: "I Love You",
        titleOdia: "ଆଇ ଲଭ୍ ୟୁ",
        description: "Directed by Hara Patnaik. The debut film of Anubhav Mohanty, opposite Namrata Thapa.",
        category: "modern"
    },

    // Modern Era (2000s-Present)
    {
        year: "2012",
        era: "Modern Era",
        title: "Sala Budha",
        titleOdia: "ଶଲା ବୁଢ଼ା",
        description: "Directed by Sabyasachi Mohapatra. A critically acclaimed film in Sambalpuri (Kosli) that won seven Odisha State Film Awards and was selected for the Indian Panorama at IFFI.",
        category: "modern"
    },
    {
        year: "2020",
        era: "Modern Era",
        title: "Kalira Atita",
        titleOdia: "କାଲିର ଅତୀତ",
        description: "Directed by Nila Madhab Panda. Deals with climate change and coastal villages lost to the sea. The director submitted it for Academy Awards consideration.",
        category: "modern"
    },
    {
        year: "2022",
        era: "Modern Era",
        title: "Daman",
        titleOdia: "ଦମନ",
        description: "Directed by Vishal Mourya & Debi Prasad Lenka, starring Babushaan Mohanty. Inspired by Odisha's DAMaN malaria-control programme, it became the highest-grossing Odia film of its time, was released in a Hindi-dubbed version, and won the National Film Award for Best Odia Film.",
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
