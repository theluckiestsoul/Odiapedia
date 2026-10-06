/** Timeline of Odia cinema, used by /culture/cinema/timeline. */
import type { TimelineEraInfo, TimelineItem } from "@/components/history/HistoryTimeline";

export const CINEMA_ERAS: TimelineEraInfo[] = [
    {
        "id": "beginning",
        "name": "The beginning",
        "odia": "ଆରମ୍ଭ",
        "span": "1936 – 1959",
        "summary": "Odia cinema began with Sita Bibaha, released at Puri in 1936. Only a handful of films followed over the next two decades.",
        "highlights": [
            "Sita Bibaha, the first Odia film (1936)",
            "Lalita, the second, 13 years later (1949)"
        ]
    },
    {
        "id": "golden",
        "name": "Golden era",
        "odia": "ସୁବର୍ଣ୍ଣ ଯୁଗ",
        "span": "1960 – 1979",
        "summary": "Sri Lokanath wins Odia cinema's first National Film Award, literary adaptations flourish and the first colour Odia film arrives.",
        "highlights": [
            "Sri Lokanath's National Film Award (1960)",
            "Mrinal Sen's Matira Manisha (1966)",
            "Gapa Hele Bi Sata, the first colour Odia film (1976)"
        ]
    },
    {
        "id": "newvoices",
        "name": "New voices",
        "odia": "ନୂଆ ସ୍ୱର",
        "span": "1980 – 1999",
        "summary": "Popular star-driven films run alongside a new art cinema that takes Odia films to international festivals.",
        "highlights": [
            "Maya Miriga at Cannes Critics' Week (1984)"
        ]
    },
    {
        "id": "modern",
        "name": "Modern era",
        "odia": "ଆଧୁନିକ ଯୁଗ",
        "span": "2000 – today",
        "summary": "A new generation of stars, award-winning Sambalpuri-language films, climate stories and a pan-Indian hit.",
        "highlights": [
            "Sala Budha in Sambalpuri (2012)",
            "Kalira Atita (2020)",
            "Daman (2022)"
        ]
    }
];

export const CINEMA_COLOURS: Record<string, string> = {
    "beginning": "#a98a5c",
    "golden": "#e08a1e",
    "newvoices": "#3d578e",
    "modern": "#138a7e"
};

export const CINEMA_TIMELINE: TimelineItem[] = [
    {
        "id": "sita-bibaha-1936",
        "year": "1936",
        "era": "beginning",
        "title": "Sita Bibaha",
        "titleOdia": "ସୀତା ବିବାହ",
        "description": "The first Odia film, directed and produced by Mohan Sundar Deb Goswami, who also acted in it. Released on 28 April 1936 at Laxmi Talkies, Puri, it was made on a budget of about ₹30,000.",
        "image": {
            "src": "/images/cinema/sita_bibaha.png",
            "alt": "Illustration inspired by Sita Bibaha",
            "credit": "Odiapedia illustration (not a still from the film)",
            "licence": "",
            "page": "",
            "w": 640,
            "h": 640
        }
    },
    {
        "id": "lalita-1949",
        "year": "1949",
        "era": "beginning",
        "title": "Lalita",
        "titleOdia": "ଲଳିତା",
        "description": "The second Odia film, released 13 years after the first. Directed by Kalyan Gupta."
    },
    {
        "id": "saptashajya-1950",
        "year": "1950",
        "era": "beginning",
        "title": "Saptashajya",
        "titleOdia": "ସପ୍ତଶଯ୍ୟା",
        "description": "One of the very few Odia films made in the years immediately after Lalita; sources differ on its exact release year."
    },
    {
        "id": "roles-to-eight-1951",
        "year": "1951",
        "era": "beginning",
        "title": "Roles to Eight",
        "titleOdia": "ରୋଲ୍ସ ଟୁ ଏଇଟ୍",
        "description": "Also written 'Roles - 28'. Cited as the first Odia film with an English title."
    },
    {
        "id": "sri-lokanath-1960",
        "year": "1960",
        "era": "golden",
        "title": "Sri Lokanath",
        "titleOdia": "ଶ୍ରୀ ଲୋକନାଥ",
        "description": "First Odia film to win a National Film Award. Directed by Prafulla Sengupta."
    },
    {
        "id": "nua-bou-1962",
        "year": "1962",
        "era": "golden",
        "title": "Nua Bou",
        "titleOdia": "ନୂଆ ବୋଉ",
        "description": "A social drama of village life directed by Prabhat Mukherjee, with Prashanta Nanda in his first lead role. The film was recognised at the National Film Awards."
    },
    {
        "id": "matira-manisha-1966",
        "year": "1966",
        "era": "golden",
        "title": "Matira Manisha",
        "titleOdia": "ମାଟିର ମଣିଷ",
        "description": "Directed by Mrinal Sen, based on Kalindi Charan Panigrahi's novel about two brothers and their family land. It won the National Film Award for Best Odia Feature Film."
    },
    {
        "id": "gapa-hele-bi-sata-1976",
        "year": "1976",
        "era": "golden",
        "title": "Gapa Hele Bi Sata",
        "titleOdia": "ଗପ ହେଲେ ବି ସତ",
        "description": "First Colour film of Odisha. A romantic classic directed by Nagen Ray.",
        "image": {
            "src": "/images/cinema/gapa_hele_bi_sata.png",
            "alt": "Illustration inspired by Gapa Hele Bi Sata",
            "credit": "Odiapedia illustration (not a still from the film)",
            "licence": "",
            "page": "",
            "w": 640,
            "h": 640
        }
    },
    {
        "id": "shesha-shrabana-1976",
        "year": "1976",
        "era": "golden",
        "title": "Shesha Shrabana",
        "titleOdia": "ଶେଷ ଶ୍ରାବଣ",
        "description": "Prashanta Nanda's directorial debut, with music by Prafulla Kar. It set a box-office record and is known for its music and tragic storytelling."
    },
    {
        "id": "dora-1984",
        "year": "1984",
        "era": "newvoices",
        "title": "Dora",
        "titleOdia": "ଡୋରା",
        "description": "A popular Odia film of the 1980s starring Prashanta Nanda and Mahasweta Ray."
    },
    {
        "id": "maya-miriga-1984",
        "year": "1984",
        "era": "newvoices",
        "title": "Maya Miriga",
        "titleOdia": "ମାୟା ମିରିଗ",
        "description": "Directed by Nirad N. Mohapatra. Screened in the Critics' Week section at Cannes in 1984 and won the National Film Award for Second Best Feature Film. A poignant family drama.",
        "image": {
            "src": "/images/cinema/maya_miriga.png",
            "alt": "Illustration inspired by Maya Miriga",
            "credit": "Odiapedia illustration (not a still from the film)",
            "licence": "",
            "page": "",
            "w": 640,
            "h": 640
        }
    },
    {
        "id": "i-love-you-2004",
        "year": "2004",
        "era": "modern",
        "title": "I Love You",
        "titleOdia": "ଆଇ ଲଭ୍ ୟୁ",
        "description": "Directed by Hara Patnaik. The debut film of Anubhav Mohanty, opposite Namrata Thapa."
    },
    {
        "id": "sala-budha-2012",
        "year": "2012",
        "era": "modern",
        "title": "Sala Budha",
        "titleOdia": "ଶଲା ବୁଢ଼ା",
        "description": "Directed by Sabyasachi Mohapatra. A critically acclaimed film in Sambalpuri (Kosli) that won seven Odisha State Film Awards and was selected for the Indian Panorama at IFFI."
    },
    {
        "id": "kalira-atita-2020",
        "year": "2020",
        "era": "modern",
        "title": "Kalira Atita",
        "titleOdia": "କାଲିର ଅତୀତ",
        "description": "Directed by Nila Madhab Panda. Deals with climate change and coastal villages lost to the sea. The director submitted it for Academy Awards consideration."
    },
    {
        "id": "daman-2022",
        "year": "2022",
        "era": "modern",
        "title": "Daman",
        "titleOdia": "ଦମନ",
        "description": "Directed by Vishal Mourya & Debi Prasad Lenka, starring Babushaan Mohanty. Inspired by Odisha's DAMaN malaria-control programme, it became the highest-grossing Odia film of its time, was released in a Hindi-dubbed version, and won the National Film Award for Best Odia Film.",
        "image": {
            "src": "/images/cinema/daman.png",
            "alt": "Illustration inspired by Daman",
            "credit": "Odiapedia illustration (not a still from the film)",
            "licence": "",
            "page": "",
            "w": 640,
            "h": 640
        }
    }
];
