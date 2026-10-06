/**
 * Timeline of Odisha history used by /history/timeline.
 * Images are hot-linked from Wikimedia Commons with their author and licence; every image links to its Commons page.
 */

export type TimelineEra = "prehistoric" | "ancient" | "medieval" | "colonial" | "modern";
export type TimelineTheme = "archaeology" | "rulers" | "faith" | "culture" | "conflict" | "nature" | "development";

export interface TimelineImage {
    src: string;
    alt: string;
    credit: string;
    licence: string;
    /** Wikimedia Commons file page */
    page: string;
    w: number;
    h: number;
    /** "contain" for coins, stamps and satellite images that must not be cropped */
    fit?: "contain";
    /** focal point for tall portraits */
    pos?: "top";
}

export interface HistoryEvent {
    id: string;
    year: string;
    era: TimelineEra;
    title: string;
    titleOdia?: string;
    description: string;
    themes: TimelineTheme[];
    image?: TimelineImage;
    links?: { label: string; href: string }[];
}

export interface EraInfo {
    id: TimelineEra;
    name: string;
    odia: string;
    span: string;
    summary: string;
    highlights: string[];
    cover: TimelineImage;
}

export const THEMES: { id: TimelineTheme; label: string }[] = [
    { id: "archaeology", label: "Archaeology" },
    { id: "rulers", label: "Kingdoms & rulers" },
    { id: "faith", label: "Temples & faith" },
    { id: "culture", label: "Language & culture" },
    { id: "conflict", label: "Wars & revolts" },
    { id: "development", label: "Building the state" },
    { id: "nature", label: "Famines & disasters" },
];

export const ERA_COLOURS: Record<TimelineEra, string> = {
    prehistoric: "#a98a5c",
    ancient: "#e08a1e",
    medieval: "#b8522b",
    colonial: "#3d578e",
    modern: "#138a7e",
};

export const ERAS: EraInfo[] = [
    {
        "id": "prehistoric",
        "name": "Prehistoric",
        "odia": "ପ୍ରାଗୈତିହାସିକ",
        "span": "Before c. 1000 BCE",
        "summary": "Stone tools in the hills and river valleys of northern Odisha, rock art in Kalahandi and Jharsuguda, and the first farming settlements mark the long prehistory of the land.",
        "highlights": [
            "Acheulian stone tools in Mayurbhanj, Keonjhar and Sundargarh",
            "Rock art at Gudahandi and Vikramkhol",
            "Neolithic tools and pottery at Kuchai"
        ],
        "cover": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Gudahandi_Rock_painting.jpg/960px-Gudahandi_Rock_painting.jpg",
            "alt": "Rock paintings at Gudahandi, Kalahandi district",
            "credit": "Mamali panda",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Gudahandi_Rock_painting.jpg",
            "w": 960,
            "h": 1506
        }
    },
    {
        "id": "ancient",
        "name": "Ancient",
        "odia": "ପ୍ରାଚୀନ",
        "span": "c. 1000 BCE – 7th century CE",
        "summary": "Kalinga emerges as a seafaring kingdom, is conquered by Ashoka in the war that turned him to Dhamma, rises again under the Jain king Kharavela and becomes a centre of Buddhist learning.",
        "highlights": [
            "Kalinga War, c. 261 BCE",
            "Kharavela's Hathigumpha inscription",
            "Monasteries of Ratnagiri, Lalitgiri and Udayagiri"
        ],
        "cover": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/ShantiSthupa_Dhauli.jpg/960px-ShantiSthupa_Dhauli.jpg",
            "alt": "Shanti Stupa (Peace Pagoda) on Dhauli hill, near the traditional site of the Kalinga War",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:ShantiSthupa_Dhauli.jpg",
            "w": 960,
            "h": 540
        }
    },
    {
        "id": "medieval",
        "name": "Medieval",
        "odia": "ମଧ୍ୟଯୁଗ",
        "span": "8th century – 1803",
        "summary": "The Bhaumakaras, Somavamshis, Eastern Gangas and Suryavamshi Gajapatis build the great temples of Bhubaneswar, Puri and Konark, before Afghan, Mughal and Maratha rule.",
        "highlights": [
            "Lingaraj, Jagannath and Konark temples",
            "Gajapati kingdom at its widest under Kapilendra Deva",
            "Sarala Das's Odia Mahabharata"
        ],
        "cover": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/960px-Konarka_Temple.jpg",
            "alt": "Konark Sun Temple",
            "credit": "Subham9423",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Konarka_Temple.jpg",
            "w": 960,
            "h": 640
        }
    },
    {
        "id": "colonial",
        "name": "Colonial",
        "odia": "ଔପନିବେଶିକ",
        "span": "1803 – 1936",
        "summary": "After the British conquest of 1803, Odisha lives through the Paika Rebellion and the terrible famine of 1866, and builds a movement for a united Odia-speaking province.",
        "highlights": [
            "Paika Rebellion, 1817",
            "Na'anka famine, 1866",
            "Utkal Sammilani, 1903"
        ],
        "cover": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Buxi_Jagabandhu_01.png/960px-Buxi_Jagabandhu_01.png",
            "alt": "Buxi Jagabandhu, leader of the Paika rebellion, from an old sketch",
            "credit": "Prateek Pattanaik",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Buxi_Jagabandhu_01.png",
            "w": 960,
            "h": 561,
            "pos": "top"
        }
    },
    {
        "id": "modern",
        "name": "Modern",
        "odia": "ଆଧୁନିକ",
        "span": "1936 – today",
        "summary": "Odisha becomes a separate province on 1 April 1936, absorbs the princely states, builds Hirakud and Rourkela, and becomes known worldwide for its cyclone preparedness.",
        "highlights": [
            "Utkal Divas, 1 April 1936",
            "Hirakud Dam, 1957",
            "Odia declared a classical language, 2014"
        ],
        "cover": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Hirakud_Dam.jpg/960px-Hirakud_Dam.jpg",
            "alt": "Hirakud Dam on the Mahanadi",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Hirakud_Dam.jpg",
            "w": 960,
            "h": 540
        }
    }
];

export const TIMELINE: HistoryEvent[] = [
    {
        "id": "early-human-presence",
        "year": "Lower Palaeolithic",
        "era": "prehistoric",
        "title": "Early Human Presence",
        "description": "Lower Palaeolithic (Acheulian) stone tools found in Mayurbhanj, Keonjhar, Sundargarh and Sambalpur districts show very early human presence; exact dates are uncertain.",
        "themes": ["archaeology"]
    },
    {
        "id": "prehistoric-rock-art",
        "year": "Upper Palaeolithic",
        "era": "prehistoric",
        "title": "Prehistoric Rock Art",
        "description": "Rock carvings and paintings attributed to the Upper Palaeolithic are reported from the Gudahandi hills in Kalahandi district.",
        "themes": ["archaeology", "culture"],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Gudahandi_Rock_painting.jpg/960px-Gudahandi_Rock_painting.jpg",
            "alt": "Rock paintings at Gudahandi, Kalahandi district",
            "credit": "Mamali panda",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Gudahandi_Rock_painting.jpg",
            "w": 960,
            "h": 1506
        }
    },
    {
        "id": "vikramkhol-rock-markings",
        "year": "Date debated",
        "era": "prehistoric",
        "title": "Vikramkhol Rock Markings",
        "description": "Rock markings at Vikramkhol near Belpahar (Jharsuguda), studied by K. P. Jayaswal in the 1930s, were tentatively dated by him to about 1500 BCE. Scholars still debate their age and whether they are writing at all.",
        "themes": ["archaeology", "culture"],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Bikramkhol_.jpg",
            "alt": "Rock markings at Vikramkhol near Belpahar",
            "credit": "Mamali panda",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Bikramkhol_.jpg",
            "w": 907,
            "h": 605,
            "fit": "contain"
        }
    },
    {
        "id": "neolithic-communities",
        "year": "Neolithic",
        "era": "prehistoric",
        "title": "Neolithic Communities",
        "description": "Neolithic tools such as hoes, chisels and grinding stones, along with pottery, are found at sites such as Kuchai near Baripada, pointing to early farming communities.",
        "themes": ["archaeology"]
    },
    {
        "id": "kalinga-in-early-literature",
        "year": "1st millennium BCE",
        "era": "ancient",
        "title": "Kalinga in Early Literature",
        "titleOdia": "କଳିଙ୍ଗ",
        "description": "Kalinga is named as a kingdom in early Sanskrit, Buddhist and Jain literature, including the Mahabharata. Its maritime links with Southeast Asia developed over the following centuries.",
        "themes": [
            "culture"
        ],
        "links": [
            {
                "label": "Odisha's maritime history",
                "href": "/history/odisha-maritime-history"
            }
        ]
    },
    {
        "id": "legendary-kings-of-kalinga",
        "year": "Legendary period",
        "era": "ancient",
        "title": "Legendary Kings of Kalinga",
        "description": "According to tradition, epic and Buddhist texts name several early kings of Kalinga; these accounts are legendary and cannot be dated reliably.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "age-of-the-mahajanapadas",
        "year": "c. 6th century BCE",
        "era": "ancient",
        "title": "Age of the Mahajanapadas",
        "description": "Kalinga is not among the sixteen Mahajanapadas listed in the Buddhist Anguttara Nikaya, but early Buddhist and Jain texts mention it as a distinct kingdom in this period.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "nanda-empire-conquest",
        "year": "c. 350 BCE",
        "era": "ancient",
        "title": "Nanda Empire Conquest",
        "description": "Mahapadma Nanda of Magadha is presumed to have conquered Kalinga. Kharavela's Hathigumpha inscription later refers to a Nanda king who opened a canal and carried away a Jain image from Kalinga.",
        "themes": [
            "rulers",
            "conflict"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/I12_1karshapana_Maghada_1ar_%288482307176%29.jpg/960px-I12_1karshapana_Maghada_1ar_%288482307176%29.jpg",
            "alt": "Silver punch-marked karshapana of Magadha, Nanda period",
            "credit": "Jean-Michel Moullec",
            "licence": "CC BY 2.0",
            "page": "https://commons.wikimedia.org/wiki/File:I12_1karshapana_Maghada_1ar_%288482307176%29.jpg",
            "w": 960,
            "h": 482,
            "fit": "contain"
        }
    },
    {
        "id": "kalinga-outside-mauryan-rule",
        "year": "Late 4th century BCE",
        "era": "ancient",
        "title": "Kalinga Outside Mauryan Rule",
        "description": "After the fall of the Nandas, Kalinga appears to have remained independent of the Mauryas until Ashoka's conquest; how it left Nanda control is not recorded.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "kalinga-war",
        "year": "c. 261 BCE",
        "era": "ancient",
        "title": "Kalinga War",
        "titleOdia": "କଳିଙ୍ଗ ଯୁଦ୍ଧ",
        "description": "Emperor Ashoka conquers Kalinga. His Rock Edict XIII records that 150,000 people were deported and 100,000 killed, and expresses his remorse; afterwards he turns to the policy of Dhamma and becomes a committed patron of Buddhism.",
        "themes": [
            "conflict"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/ShantiSthupa_Dhauli.jpg/960px-ShantiSthupa_Dhauli.jpg",
            "alt": "Shanti Stupa (Peace Pagoda) on Dhauli hill, near the traditional site of the Kalinga War",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:ShantiSthupa_Dhauli.jpg",
            "w": 960,
            "h": 540
        },
        "links": [
            {
                "label": "The Kalinga War",
                "href": "/history/kalinga-war-en"
            }
        ]
    },
    {
        "id": "dhauli-peace-edicts",
        "year": "c. 3rd century BCE",
        "era": "ancient",
        "title": "Dhauli Peace Edicts",
        "titleOdia": "ଧଉଳି ଶିଳାଲେଖ",
        "description": "Ashoka's rock edicts are engraved at Dhauli near Bhubaneswar, including the two Separate Kalinga Edicts on the fair treatment of his subjects. Edict XIII, which describes the war, is not included there.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rock_inscription_of_the_edicts_of_Asoka_and_the_sculpture_of_elephant_N-OR-59.jpg/960px-Rock_inscription_of_the_edicts_of_Asoka_and_the_sculpture_of_elephant_N-OR-59.jpg",
            "alt": "Ashoka's rock edict and the rock-cut elephant at Dhauli",
            "credit": "Duraionly",
            "licence": "CC BY-SA 3.0",
            "page": "https://commons.wikimedia.org/wiki/File:Rock_inscription_of_the_edicts_of_Asoka_and_the_sculpture_of_elephant_N-OR-59.jpg",
            "w": 960,
            "h": 720
        },
        "links": [
            {
                "label": "The Kalinga War",
                "href": "/history/kalinga-war-en"
            }
        ]
    },
    {
        "id": "independence-from-mauryas",
        "year": "Late 3rd century BCE",
        "era": "ancient",
        "title": "Independence from Mauryas",
        "description": "Mauryan power declines after Ashoka's death (c. 232 BCE), and Kalinga regains its independence; the exact date is not known.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "mahameghavahana-dynasty",
        "year": "c. 2nd-1st century BCE",
        "era": "ancient",
        "title": "Mahameghavahana Dynasty",
        "description": "The Mahameghavahana (Chedi) dynasty is established in Kalinga.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Khandagari_and_Udaygiri_featured_image.jpg/960px-Khandagari_and_Udaygiri_featured_image.jpg",
            "alt": "Udayagiri and Khandagiri caves, Bhubaneswar",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Khandagari_and_Udaygiri_featured_image.jpg",
            "w": 960,
            "h": 457
        },
        "links": [
            {
                "label": "Kharavela",
                "href": "/history/kharavela"
            }
        ]
    },
    {
        "id": "reign-of-kharavela",
        "year": "c. 1st century BCE",
        "era": "ancient",
        "title": "Reign of Kharavela",
        "titleOdia": "ଖାରବେଳ",
        "description": "The Jain king Kharavela rules Kalinga (his dates are debated). The Hathigumpha inscription at Udayagiri records his campaigns, his extension of an old canal, his patronage of the arts and of Jain monks, and says a Yavana (Greek) king withdrew to Mathura on hearing of his advance.",
        "themes": [
            "rulers",
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Hathigumpha_inscription_%282020%29.jpg/960px-Hathigumpha_inscription_%282020%29.jpg",
            "alt": "Kharavela's Hathigumpha inscription, Udayagiri",
            "credit": "Kevin Standage",
            "licence": "CC BY-SA 2.0",
            "page": "https://commons.wikimedia.org/wiki/File:Hathigumpha_inscription_%282020%29.jpg",
            "w": 960,
            "h": 540
        },
        "links": [
            {
                "label": "Kharavela",
                "href": "/history/kharavela"
            },
            {
                "label": "Udayagiri & Khandagiri caves",
                "href": "/history/udayagiri-khandagiri"
            }
        ]
    },
    {
        "id": "buddhist-diamond-triangle",
        "year": "c. 1st-13th century CE",
        "era": "ancient",
        "title": "Buddhist Diamond Triangle",
        "description": "Lalitgiri's Buddhist establishment goes back to around the early centuries CE; Ratnagiri and Udayagiri flourish later, especially from about the 5th-7th to the 12th-13th centuries, as major monasteries and centres of learning.",
        "themes": ["faith", "archaeology"],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Ratnagiri_roof-top_view.jpg/960px-Ratnagiri_roof-top_view.jpg",
            "alt": "Buddhist monastery remains at Ratnagiri",
            "credit": "Mitrabhanu.panda",
            "licence": "CC BY-SA 3.0",
            "page": "https://commons.wikimedia.org/wiki/File:Ratnagiri_roof-top_view.jpg",
            "w": 960,
            "h": 720
        },
        "links": [
            {
                "label": "The Buddhist Diamond Triangle",
                "href": "/culture/golden-triangle"
            }
        ]
    },
    {
        "id": "samudragupta-s-southern-campaign",
        "year": "c. 350 CE",
        "era": "ancient",
        "title": "Samudragupta's Southern Campaign",
        "description": "Samudragupta's Allahabad Pillar inscription records that he defeated kings of the region, including Mahendra of Kosala, on his southern campaign; they were released and reinstated rather than annexed.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/SamudraguptaCoin.png/960px-SamudraguptaCoin.png",
            "alt": "Gold coin of Samudragupta",
            "credit": "PHGCOM",
            "licence": "CC BY-SA 3.0",
            "page": "https://commons.wikimedia.org/wiki/File:SamudraguptaCoin.png",
            "w": 960,
            "h": 941,
            "fit": "contain"
        }
    },
    {
        "id": "mathara-dynasty",
        "year": "c. 4th-5th century CE",
        "era": "ancient",
        "title": "Mathara Dynasty",
        "description": "The Matharas rule southern Kalinga from Pishtapura; their kingdom probably extended between the Mahanadi and Godavari rivers.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "shailodbhava-dynasty",
        "year": "c. 6th-8th century CE",
        "era": "ancient",
        "title": "Shailodbhava Dynasty",
        "description": "The Shailodbhava dynasty rules with capital at Kongoda. Shaivism flourishes.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "hiuen-tsang-visits-odra",
        "year": "c. 639 CE",
        "era": "ancient",
        "title": "Hiuen-Tsang Visits Odra",
        "description": "Chinese pilgrim Hiuen-Tsang visits Odra (Odisha), documenting its Buddhist monasteries and culture.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Xuanzang_w.jpg/960px-Xuanzang_w.jpg",
            "alt": "Traditional depiction of the pilgrim Xuanzang (Hiuen-Tsang)",
            "credit": "Unknown author",
            "licence": "Public domain",
            "page": "https://commons.wikimedia.org/wiki/File:Xuanzang_w.jpg",
            "w": 960,
            "h": 2148,
            "pos": "top"
        }
    },
    {
        "id": "parashurameshvara-temple",
        "year": "c. 650 CE",
        "era": "ancient",
        "title": "Parashurameshvara Temple",
        "description": "One of the oldest surviving temples in Bhubaneswar is built by Sailodbhava rulers.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Parsurameswara_temple_complex.jpg/960px-Parsurameswara_temple_complex.jpg",
            "alt": "Parashurameshvara temple, Bhubaneswar",
            "credit": "Teamdetourodisha",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Parsurameswara_temple_complex.jpg",
            "w": 960,
            "h": 639
        }
    },
    {
        "id": "bhaumakara-dynasty",
        "year": "c. 8th-10th century CE",
        "era": "medieval",
        "title": "Bhaumakara Dynasty",
        "description": "The Bhaumakara kings rule much of coastal Odisha. The early rulers were Buddhist, and the dynasty is notable for its several ruling queens.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Baitala_Deula_or_Tini-mundia_deula.jpg/960px-Baitala_Deula_or_Tini-mundia_deula.jpg",
            "alt": "Vaital Deul, Bhubaneswar (8th century)",
            "credit": "Sanjeeb Behera 45",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Baitala_Deula_or_Tini-mundia_deula.jpg",
            "w": 960,
            "h": 1280
        }
    },
    {
        "id": "queen-tribhuvana-mahadevi-i",
        "year": "c. 846 CE",
        "era": "medieval",
        "title": "Queen Tribhuvana Mahadevi I",
        "titleOdia": "ତ୍ରିଭୁବନ ମହାଦେବୀ",
        "description": "Tribhuvana Mahadevi I, widow of Shantikara I, rules the Bhaumakara kingdom; her Dhenkanal inscription records her reign. She is often described as one of the earliest women rulers in Odisha's history.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "somavamshi-dynasty-founded",
        "year": "c. 882 CE",
        "era": "medieval",
        "title": "Somavamshi Dynasty Founded",
        "description": "Janmejaya I establishes the Somavamshi dynasty. Great temple-building era begins.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "mukteshwar-rajarani-temples",
        "year": "10th-11th century CE",
        "era": "medieval",
        "title": "Mukteshwar & Rajarani Temples",
        "description": "The Mukteshwar Temple (10th century), often called the 'gem of Odishan architecture', and the Rajarani Temple (c. 11th century) are built in Bhubaneswar.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Muktesvar_Temple.jpg/960px-Muktesvar_Temple.jpg",
            "alt": "Mukteshvara temple, Bhubaneswar",
            "credit": "Robin Mohapatra",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Muktesvar_Temple.jpg",
            "w": 960,
            "h": 708
        }
    },
    {
        "id": "lingaraj-temple-construction",
        "year": "11th century CE",
        "era": "medieval",
        "title": "Lingaraj Temple Construction",
        "titleOdia": "ଲିଙ୍ଗରାଜ ମନ୍ଦିର",
        "description": "The Lingaraj Temple, traditionally attributed to Somavamshi rulers, is built; it is the largest temple in Bhubaneswar.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Lingaraj_Temple_%2C_Bhubaneswar.jpg/960px-Lingaraj_Temple_%2C_Bhubaneswar.jpg",
            "alt": "Lingaraja temple, Bhubaneswar",
            "credit": "Satyakam Parthasarathy",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Lingaraj_Temple_%2C_Bhubaneswar.jpg",
            "w": 960,
            "h": 1280
        },
        "links": [
            {
                "label": "Lingaraj Temple",
                "href": "/history/lingaraj-temple"
            }
        ]
    },
    {
        "id": "rise-of-the-eastern-gangas",
        "year": "11th century CE",
        "era": "medieval",
        "title": "Rise of the Eastern Gangas",
        "titleOdia": "ଗଙ୍ଗ ବଂଶ",
        "description": "The Eastern Gangas, rulers of Kalinga from Kalinganagara (near Mukhalingam) since about the 5th century, grow in power; under Anantavarman Chodaganga they extend their rule over Odisha.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Eastern_Ganga_fanam_Chodaganga.png",
            "alt": "Gold fanam of Anantavarman Chodaganga (1128 CE)",
            "credit": "Amshpatten",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Eastern_Ganga_fanam_Chodaganga.png",
            "w": 500,
            "h": 258,
            "fit": "contain"
        },
        "links": [
            {
                "label": "Eastern Ganga dynasty",
                "href": "/history/eastern-ganga-dynasty"
            }
        ]
    },
    {
        "id": "anantavarman-chodaganga",
        "year": "c. 1078-1147 CE",
        "era": "medieval",
        "title": "Anantavarman Chodaganga",
        "titleOdia": "ଅନନ୍ତବର୍ମନ ଚୋଡଗଙ୍ଗ",
        "description": "Anantavarman Chodaganga conquers Utkala and rules from the Ganga to the Godavari. He is credited with beginning the present Jagannath Temple at Puri.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Chodaganga_Deva.jpg/960px-Chodaganga_Deva.jpg",
            "alt": "Sculpture of Chodaganga Deva at Chudangasahi, Puri",
            "credit": "Deepak Kumar Nayak",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Chodaganga_Deva.jpg",
            "w": 960,
            "h": 1279,
            "pos": "top"
        },
        "links": [
            {
                "label": "Eastern Ganga dynasty",
                "href": "/history/eastern-ganga-dynasty"
            }
        ]
    },
    {
        "id": "jagannath-temple-built",
        "year": "12th century CE",
        "era": "medieval",
        "title": "Jagannath Temple Built",
        "titleOdia": "ଜଗନ୍ନାଥ ମନ୍ଦିର",
        "description": "The present Jagannath Temple at Puri is built in the 12th century. Construction is credited to Anantavarman Chodaganga; sources differ on its completion date and on the role of his successors. It is one of the four Char Dham pilgrimage sites.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Shri_Jagannath_temple.jpg/960px-Shri_Jagannath_temple.jpg",
            "alt": "Shri Jagannath temple, Puri",
            "credit": "Prachites",
            "licence": "CC BY-SA 3.0",
            "page": "https://commons.wikimedia.org/wiki/File:Shri_Jagannath_temple.jpg",
            "w": 960,
            "h": 606
        },
        "links": [
            {
                "label": "Jagannath Temple",
                "href": "/history/jagannath-temple"
            },
            {
                "label": "Ratha Yatra",
                "href": "/culture/rath-yatra"
            }
        ]
    },
    {
        "id": "gita-govinda",
        "year": "12th century CE",
        "era": "medieval",
        "title": "Gita Govinda",
        "titleOdia": "ଗୀତଗୋବିନ୍ଦ",
        "description": "Jayadeva composes the Sanskrit Gita Govinda, a lyrical poem on Radha and Krishna. In Odisha it is closely tied to the Jagannath Temple, where its songs became part of temple ritual and later of Odissi dance; scholars have long debated whether Jayadeva came from Odisha or Bengal.",
        "themes": [
            "faith",
            "culture"
        ],
        "links": [
            {
                "label": "Jayadeva",
                "href": "/people/jayadeva"
            }
        ]
    },
    {
        "id": "capital-shifts-to-cuttack",
        "year": "c. 1211 CE",
        "era": "medieval",
        "title": "Capital Shifts to Cuttack",
        "titleOdia": "କଟକ",
        "description": "Cuttack (Kataka) becomes the capital under the Eastern Ganga king Anangabhima Deva III (r. c. 1211-1238); a fort-settlement existed there earlier.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Entrance_of_Barabati_fort.jpg/960px-Entrance_of_Barabati_fort.jpg",
            "alt": "Gateway of Barabati fort, Cuttack",
            "credit": "Rajeshjena453",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Entrance_of_Barabati_fort.jpg",
            "w": 960,
            "h": 636
        }
    },
    {
        "id": "narasimhadeva-i",
        "year": "1238-1264 CE",
        "era": "medieval",
        "title": "Narasimhadeva I",
        "description": "Eastern Ganga king who builds the Konark Sun Temple and campaigns successfully against the Turkic governors of Bengal.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Narasingha_deva.jpg/960px-Narasingha_deva.jpg",
            "alt": "Depiction of Narasimhadeva I",
            "credit": "Ashok3932",
            "licence": "CC0",
            "page": "https://commons.wikimedia.org/wiki/File:Narasingha_deva.jpg",
            "w": 960,
            "h": 1200,
            "pos": "top"
        },
        "links": [
            {
                "label": "Konark Sun Temple",
                "href": "/history/konark-sun-temple"
            }
        ]
    },
    {
        "id": "konark-sun-temple-built",
        "year": "c. 1250 CE",
        "era": "medieval",
        "title": "Konark Sun Temple Built",
        "titleOdia": "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",
        "description": "The Sun Temple at Konark is built in the form of a giant chariot with 24 wheels. It was inscribed as a UNESCO World Heritage Site in 1984.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/960px-Konarka_Temple.jpg",
            "alt": "Konark Sun Temple",
            "credit": "Subham9423",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Konarka_Temple.jpg",
            "w": 960,
            "h": 640
        },
        "links": [
            {
                "label": "Konark Sun Temple",
                "href": "/history/konark-sun-temple"
            }
        ]
    },
    {
        "id": "ananta-vasudeva-temple",
        "year": "1278 CE",
        "era": "medieval",
        "title": "Ananta Vasudeva Temple",
        "description": "Built by Chandrika Devi, daughter of Anangabhima Deva III. One of the few major Vaishnava temples in Bhubaneswar, a city dominated by Shiva temples.",
        "themes": [
            "faith"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Ananta_Vasudev.jpg/960px-Ananta_Vasudev.jpg",
            "alt": "Ananta Vasudeva temple, Bhubaneswar",
            "credit": "Satyabrata",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Ananta_Vasudev.jpg",
            "w": 960,
            "h": 640
        }
    },
    {
        "id": "suryavamsi-gajapati-dynasty-founded",
        "year": "1434-35 CE",
        "era": "medieval",
        "title": "Suryavamsi Gajapati Dynasty Founded",
        "titleOdia": "ଗଜପତି ରାଜବଂଶ",
        "description": "Kapilendra Deva takes the throne from the last Eastern Ganga king and founds the Suryavamsi Gajapati dynasty.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Gajapati_Kapilendradeva.jpg/960px-Gajapati_Kapilendradeva.jpg",
            "alt": "Image of Gajapati Kapilendra Deva",
            "credit": "Prachites",
            "licence": "CC BY-SA 3.0",
            "page": "https://commons.wikimedia.org/wiki/File:Gajapati_Kapilendradeva.jpg",
            "w": 960,
            "h": 1280,
            "pos": "top"
        }
    },
    {
        "id": "kapilendra-deva-s-conquests",
        "year": "1435-1467 CE",
        "era": "medieval",
        "title": "Kapilendra Deva's Conquests",
        "titleOdia": "କପିଳେନ୍ଦ୍ର ଦେବ",
        "description": "Kapilendra Deva's campaigns extend the kingdom from the Ganga in the north deep into the Deccan and the south, close to the greatest territorial extent of any Odishan state.",
        "themes": [
            "rulers",
            "conflict"
        ]
    },
    {
        "id": "sarala-mahabharata",
        "year": "15th century CE",
        "era": "medieval",
        "title": "Sarala Mahabharata",
        "description": "Sarala Dasa composes the Odia Mahabharata, a free retelling rather than a literal translation and a foundational work of Odia literature.",
        "themes": [
            "culture"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Painting_of_Sarala_Dasa.jpg/960px-Painting_of_Sarala_Dasa.jpg",
            "alt": "Painting of Sarala Dasa, Sanskruti Bhawan, Bhubaneswar",
            "credit": "Prateek Pattanaik",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Painting_of_Sarala_Dasa.jpg",
            "w": 960,
            "h": 1399,
            "pos": "top"
        },
        "links": [
            {
                "label": "Sarala Das",
                "href": "/people/sarala-das"
            },
            {
                "label": "Odia literature milestones",
                "href": "/language/odia-literature-milestones"
            }
        ]
    },
    {
        "id": "vijayanagara-invasion",
        "year": "1513 CE",
        "era": "medieval",
        "title": "Vijayanagara Invasion",
        "description": "Krishnadevaraya of Vijayanagara captures the Gajapati fort of Udayagiri (in present-day Andhra Pradesh) from Prataparudra Deva, beginning a long war that weakens the Gajapatis.",
        "themes": [
            "conflict"
        ]
    },
    {
        "id": "bhoi-dynasty",
        "year": "1541 CE",
        "era": "medieval",
        "title": "Bhoi Dynasty",
        "description": "Govinda Vidyadhara seizes the throne from the Suryavamsi Gajapatis and founds the Bhoi dynasty.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "fall-of-independent-odisha",
        "year": "1568 CE",
        "era": "medieval",
        "title": "Fall of Independent Odisha",
        "description": "Mukunda Deva, the last independent Hindu king of Odisha, is killed amid rebellion, and Afghan forces of Sulaiman Karrani of Bengal, with the general Kalapahad, take control of Odisha by the end of 1568.",
        "themes": [
            "rulers",
            "conflict"
        ]
    },
    {
        "id": "battle-of-rajmahal",
        "year": "1576 CE",
        "era": "medieval",
        "title": "Battle of Rajmahal",
        "description": "The Mughals defeat Daud Khan Karrani at the Battle of Rajmahal. Afghan chiefs continue to hold Odisha for some years afterwards.",
        "themes": [
            "conflict"
        ]
    },
    {
        "id": "akbar-annexes-odisha",
        "year": "1592 CE",
        "era": "medieval",
        "title": "Akbar Annexes Odisha",
        "description": "Akbar's general Man Singh defeats the Afghans, and Odisha is annexed to the Mughal Empire as part of the Bengal Subah.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Govardhan._Akbar_With_Lion_and_Calf_ca._1630%2C_Metmuseum_%28cropped%29.jpg/960px-Govardhan._Akbar_With_Lion_and_Calf_ca._1630%2C_Metmuseum_%28cropped%29.jpg",
            "alt": "Akbar, Mughal painting by Govardhan, c. 1630",
            "credit": "Govardhan (Metropolitan Museum of Art)",
            "licence": "Public domain",
            "page": "https://commons.wikimedia.org/wiki/File:Govardhan._Akbar_With_Lion_and_Calf_ca._1630%2C_Metmuseum_%28cropped%29.jpg",
            "w": 960,
            "h": 1296,
            "pos": "top"
        }
    },
    {
        "id": "orissa-becomes-a-separate-subah",
        "year": "Early 17th century CE",
        "era": "medieval",
        "title": "Orissa Becomes a Separate Subah",
        "description": "Odisha is separated from Bengal as its own Mughal province (subah). Sources differ on the date, crediting either Jahangir or Shah Jahan.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "maratha-control",
        "year": "1751 CE",
        "era": "medieval",
        "title": "Maratha Control",
        "description": "Unable to stop Maratha raids, Alivardi Khan, Nawab of Bengal, cedes Odisha to Raghoji I Bhonsle of Nagpur. Maratha rule lasts until 1803.",
        "themes": [
            "rulers"
        ],
        "links": [
            {
                "label": "Brief history of Odisha",
                "href": "/history/odisha-history-brief"
            }
        ]
    },
    {
        "id": "british-annexation",
        "year": "1803 CE",
        "era": "colonial",
        "title": "British Annexation",
        "description": "British East India Company captures Puri, Cuttack, and Baleshwar from Marathas. Lord Wellesley's expansion.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "jayi-rajguru-s-revolt",
        "year": "1804 CE",
        "era": "colonial",
        "title": "Jayi Rajguru's Revolt",
        "titleOdia": "ଜୟୀ ରାଜଗୁରୁ",
        "description": "Jayi Rajguru, minister of the Raja of Khurda, leads an early armed resistance to British rule. He is captured and executed by the British in 1806.",
        "themes": [
            "conflict"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Jayi_Rajaguru_01.png/960px-Jayi_Rajaguru_01.png",
            "alt": "Jayi Rajguru, from an old sketch",
            "credit": "Prateek Pattanaik",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Jayi_Rajaguru_01.png",
            "w": 960,
            "h": 1277,
            "pos": "top"
        },
        "links": [
            {
                "label": "The Paika Rebellion",
                "href": "/history/paika-rebellion"
            }
        ]
    },
    {
        "id": "paika-rebellion",
        "year": "1817 CE",
        "era": "colonial",
        "title": "Paika Rebellion",
        "titleOdia": "ପାଇକ ବିଦ୍ରୋହ",
        "description": "Bakshi Jagabandhu leads the Paika militia uprising against the British, often described as one of the earliest organised armed rebellions against Company rule.",
        "themes": [
            "conflict"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Buxi_Jagabandhu_01.png/960px-Buxi_Jagabandhu_01.png",
            "alt": "Buxi Jagabandhu, leader of the Paika rebellion, from an old sketch",
            "credit": "Prateek Pattanaik",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Buxi_Jagabandhu_01.png",
            "w": 960,
            "h": 561,
            "pos": "top"
        },
        "links": [
            {
                "label": "The Paika Rebellion",
                "href": "/history/paika-rebellion"
            }
        ]
    },
    {
        "id": "cuttack-mission-press",
        "year": "1837 CE",
        "era": "colonial",
        "title": "Cuttack Mission Press",
        "description": "First printing press established in Odisha, beginning the era of printed Odia literature.",
        "themes": [
            "culture",
            "development"
        ]
    },
    {
        "id": "sepoy-mutiny-in-odisha",
        "year": "1857 CE",
        "era": "colonial",
        "title": "Sepoy Mutiny in Odisha",
        "titleOdia": "ସିପାହୀ ବିଦ୍ରୋହ",
        "description": "Veer Surendra Sai leads the revolt in western Odisha. Imprisoned for 37 years for his resistance.",
        "themes": [
            "conflict"
        ],
        "links": [
            {
                "label": "Veer Surendra Sai",
                "href": "/people/veer-surendra-sai"
            }
        ]
    },
    {
        "id": "great-odisha-famine",
        "year": "1866 CE",
        "era": "colonial",
        "title": "Great Odisha Famine",
        "titleOdia": "ନଅଙ୍କ ଦୁର୍ଭିକ୍ଷ",
        "description": "The Na'anka famine kills about one million people, roughly a third of the population of the Odisha division; failures of the colonial administration were widely blamed. The newspaper 'Utkal Dipika' is founded the same year.",
        "themes": [
            "culture",
            "nature"
        ]
    },
    {
        "id": "ravenshaw-college-founded",
        "year": "1868 CE",
        "era": "colonial",
        "title": "Ravenshaw College Founded",
        "description": "Founded in Cuttack with intermediate classes at the Cuttack Zilla School; it became a first-grade college in 1876 and was named Ravenshaw College in 1878 after Commissioner T. E. Ravenshaw.",
        "themes": [
            "culture"
        ]
    },
    {
        "id": "fakir-mohan-senapati",
        "year": "1898 CE",
        "era": "colonial",
        "title": "Fakir Mohan Senapati",
        "titleOdia": "ଫକୀରମୋହନ ସେନାପତି",
        "description": "Fakir Mohan Senapati publishes 'Rebati', considered the first Odia short story. He is regarded as the father of modern Odia literature.",
        "themes": [
            "culture"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Fakir_Mohan_Senapati_1993_stamp_of_India.jpg",
            "alt": "Fakir Mohan Senapati on a 1993 Indian stamp",
            "credit": "India Post, Government of India",
            "licence": "GODL-India",
            "page": "https://commons.wikimedia.org/wiki/File:Fakir_Mohan_Senapati_1993_stamp_of_India.jpg",
            "w": 699,
            "h": 937,
            "fit": "contain"
        },
        "links": [
            {
                "label": "Fakir Mohan Senapati",
                "href": "/people/fakir-mohan-senapati"
            }
        ]
    },
    {
        "id": "utkal-sammilani-founded",
        "year": "1903 CE",
        "era": "colonial",
        "title": "Utkal Sammilani Founded",
        "titleOdia": "ଉତ୍କଳ ସମ୍ମିଳନୀ",
        "description": "Movement for separate Odia-speaking state begins. Madhusudan Das leads the Odia nationalist movement.",
        "themes": [
            "culture"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Madhusudan_Das.jpg/960px-Madhusudan_Das.jpg",
            "alt": "Madhusudan Das, founder of the Utkal Sammilani",
            "credit": "Purnachandra Bhashakosha",
            "licence": "CC0",
            "page": "https://commons.wikimedia.org/wiki/File:Madhusudan_Das.jpg",
            "w": 960,
            "h": 1424,
            "pos": "top"
        },
        "links": [
            {
                "label": "Madhusudan Das",
                "href": "/people/madhusudan-das"
            }
        ]
    },
    {
        "id": "bihar-orissa-province",
        "year": "1912 CE",
        "era": "colonial",
        "title": "Bihar-Orissa Province",
        "description": "Odisha is combined with Bihar as a separate province, separated from Bengal.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "salt-satyagraha-at-inchudi",
        "year": "1930 CE",
        "era": "colonial",
        "title": "Salt Satyagraha at Inchudi",
        "description": "Satyagrahis march to Inchudi on the Balasore coast to make salt in defiance of the salt law, making it the main centre of the Salt Satyagraha in Odisha during the Civil Disobedience Movement.",
        "themes": [
            "conflict"
        ]
    },
    {
        "id": "odisha-state-formed",
        "year": "April 1, 1936",
        "era": "modern",
        "title": "Odisha State Formed",
        "titleOdia": "ଉତ୍କଳ ଦିବସ",
        "description": "Odisha becomes a separate province, often described as the first in India formed on a linguistic basis. The day is celebrated as Utkal Divas.",
        "themes": [
            "rulers"
        ],
        "links": [
            {
                "label": "Utkal Divas",
                "href": "/culture/utkal-divas"
            },
            {
                "label": "Madhusudan Das",
                "href": "/people/madhusudan-das"
            }
        ]
    },
    {
        "id": "first-odia-film",
        "year": "1936 CE",
        "era": "modern",
        "title": "First Odia Film",
        "description": "'Sita Bibaha' - the first Odia film is released, marking the birth of Ollywood.",
        "themes": [
            "culture"
        ],
        "links": [
            {
                "label": "Odia cinema timeline",
                "href": "/culture/cinema/timeline"
            }
        ]
    },
    {
        "id": "utkal-university",
        "year": "1943 CE",
        "era": "modern",
        "title": "Utkal University",
        "description": "Utkal University, the oldest university in Odisha, is established on 27 November 1943. Its Vani Vihar campus in Bhubaneswar was inaugurated in 1963.",
        "themes": [
            "culture"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Utkal_University_administrative_building.jpg/960px-Utkal_University_administrative_building.jpg",
            "alt": "Utkal University, Vani Vihar",
            "credit": "Sri Sankalpa Mishra",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Utkal_University_administrative_building.jpg",
            "w": 960,
            "h": 720
        }
    },
    {
        "id": "hirakud-dam-foundation",
        "year": "1946 CE",
        "era": "modern",
        "title": "Hirakud Dam Foundation",
        "description": "Governor Sir Hawthorne Lewis lays the foundation stone of the Hirakud Dam on 15 March 1946.",
        "themes": [
            "development"
        ]
    },
    {
        "id": "independence",
        "year": "1947 CE",
        "era": "modern",
        "title": "Independence",
        "description": "India gains independence on 15 August 1947. Odisha's princely states merge with the province from 1 January 1948, a process completed with Mayurbhanj in 1949.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "all-india-radio-cuttack",
        "year": "1948 CE",
        "era": "modern",
        "title": "All India Radio Cuttack",
        "description": "All India Radio opens its Cuttack station, the first radio station in Odisha.",
        "themes": [
            "culture",
            "development"
        ]
    },
    {
        "id": "odisha-in-republic-india",
        "year": "1950 CE",
        "era": "modern",
        "title": "Odisha in Republic India",
        "description": "Odisha becomes a state of the Republic of India with 13 districts.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "odisha-board-of-secondary-education",
        "year": "1950s",
        "era": "modern",
        "title": "Odisha Board of Secondary Education",
        "description": "The Board of Secondary Education, Odisha, constituted under a 1953 state education act, takes charge of secondary education and examinations.",
        "themes": [
            "culture"
        ]
    },
    {
        "id": "hirakud-dam-inaugurated",
        "year": "1957 CE",
        "era": "modern",
        "title": "Hirakud Dam Inaugurated",
        "description": "The Hirakud Dam on the Mahanadi, completed in 1953, is inaugurated by Prime Minister Jawaharlal Nehru on 13 January 1957. Including its dykes it is about 25.8 km long, among the longest earthen dams in the world.",
        "themes": [
            "development"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Hirakud_Dam.jpg/960px-Hirakud_Dam.jpg",
            "alt": "Hirakud Dam on the Mahanadi",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Hirakud_Dam.jpg",
            "w": 960,
            "h": 540
        }
    },
    {
        "id": "rourkela-steel-plant",
        "year": "1959 CE",
        "era": "modern",
        "title": "Rourkela Steel Plant",
        "titleOdia": "ରାଉରକେଲା ଇସ୍ପାତ କାରଖାନା",
        "description": "President Rajendra Prasad inaugurates the first blast furnace of Rourkela Steel Plant on 3 February 1959. Built with West German collaboration, it was India's first integrated public-sector steel plant.",
        "themes": [
            "development"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/RSP_Administrative_Building.png/960px-RSP_Administrative_Building.png",
            "alt": "Rourkela Steel Plant administrative building",
            "credit": "SahooXII",
            "licence": "CC BY-SA 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:RSP_Administrative_Building.png",
            "w": 960,
            "h": 720
        }
    },
    {
        "id": "orissa-state-electricity-board",
        "year": "1961 CE",
        "era": "modern",
        "title": "Orissa State Electricity Board",
        "description": "The Orissa State Electricity Board (OSEB) is set up to manage power generation and supply in the state.",
        "themes": [
            "development"
        ]
    },
    {
        "id": "super-cyclone",
        "year": "1999 CE",
        "era": "modern",
        "title": "Super Cyclone",
        "description": "A super cyclone strikes coastal Odisha on 29 October 1999, killing nearly 10,000 people. The disaster led to major changes in the state's disaster preparedness.",
        "themes": [
            "nature"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/05B_1999-10-29_0600Z.png/500px-05B_1999-10-29_0600Z.png",
            "alt": "Satellite image of the 1999 super cyclone over Odisha, 29 October 1999",
            "credit": "EUMETSAT (Meteosat-5)",
            "licence": "Attribution",
            "page": "https://commons.wikimedia.org/wiki/File:05B_1999-10-29_0600Z.png",
            "w": 500,
            "h": 625,
            "fit": "contain"
        }
    },
    {
        "id": "naveen-patnaik-era-begins",
        "year": "2000 CE",
        "era": "modern",
        "title": "Naveen Patnaik Era Begins",
        "titleOdia": "ନବୀନ ପଟ୍ଟନାୟକ",
        "description": "Naveen Patnaik becomes Chief Minister in March 2000 and leads BJD governments for 24 years, until June 2024.",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/0/07/Naveen_Patnaik_%28white_background%29.jpg",
            "alt": "Naveen Patnaik",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Naveen_Patnaik_%28white_background%29.jpg",
            "w": 400,
            "h": 400,
            "pos": "top"
        }
    },
    {
        "id": "orissa-renamed-odisha",
        "year": "2011 CE",
        "era": "modern",
        "title": "Orissa Renamed Odisha",
        "titleOdia": "ଓଡ଼ିଶା",
        "description": "From 1 November 2011 the state is officially renamed from Orissa to Odisha, and the language from Oriya to Odia, closer to the native pronunciation.",
        "themes": [
            "rulers"
        ]
    },
    {
        "id": "cyclone-phailin",
        "year": "2013 CE",
        "era": "modern",
        "title": "Cyclone Phailin",
        "description": "Very severe cyclonic storm Phailin strikes in October 2013. The evacuation of nearly a million people keeps the death toll low, and Odisha's disaster management is widely praised.",
        "themes": [
            "nature"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Phailin_2013-10-11_2010Z.jpg/960px-Phailin_2013-10-11_2010Z.jpg",
            "alt": "Cyclone Phailin approaching Odisha, 11 October 2013",
            "credit": "NASA",
            "licence": "Public domain",
            "page": "https://commons.wikimedia.org/wiki/File:Phailin_2013-10-11_2010Z.jpg",
            "w": 960,
            "h": 1216,
            "fit": "contain"
        }
    },
    {
        "id": "odia-classical-language",
        "year": "2014 CE",
        "era": "modern",
        "title": "Odia - Classical Language",
        "description": "Odia becomes the sixth language to receive Classical Language status in India (February 2014), recognising its long and independent literary tradition.",
        "themes": [
            "culture"
        ],
        "links": [
            {
                "label": "Odia as a classical language",
                "href": "/language/odia-classical-language"
            },
            {
                "label": "History of the Odia script",
                "href": "/language/odia-script-history"
            }
        ]
    },
    {
        "id": "men-s-hockey-world-cup",
        "year": "2018 CE",
        "era": "modern",
        "title": "Men's Hockey World Cup",
        "titleOdia": "ହକି ବିଶ୍ୱକପ",
        "description": "Bhubaneswar hosts the Men's Hockey World Cup at Kalinga Stadium. The same year the Odisha government begins sponsoring India's national hockey teams.",
        "themes": [
            "culture"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Opening_Ceremony_Hockey_World_Cup_2018_%2861%29.jpg/960px-Opening_Ceremony_Hockey_World_Cup_2018_%2861%29.jpg",
            "alt": "Opening ceremony, Hockey World Cup 2018, Bhubaneswar",
            "credit": "Government of Odisha",
            "licence": "CC BY 4.0",
            "page": "https://commons.wikimedia.org/wiki/File:Opening_Ceremony_Hockey_World_Cup_2018_%2861%29.jpg",
            "w": 960,
            "h": 641
        }
    },
    {
        "id": "cyclone-fani",
        "year": "2019 CE",
        "era": "modern",
        "title": "Cyclone Fani",
        "description": "Extremely severe cyclonic storm Fani makes landfall near Puri on 3 May 2019. The evacuation of more than a million people is praised internationally.",
        "themes": [
            "nature"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Fani_2019-05-02_1657Z.jpg/960px-Fani_2019-05-02_1657Z.jpg",
            "alt": "Cyclone Fani over the Bay of Bengal, 2 May 2019",
            "credit": "NASA (Terra MODIS)",
            "licence": "Public domain",
            "page": "https://commons.wikimedia.org/wiki/File:Fani_2019-05-02_1657Z.jpg",
            "w": 960,
            "h": 1260,
            "fit": "contain"
        }
    },
    {
        "id": "balasore-train-tragedy",
        "year": "2023 CE",
        "era": "modern",
        "title": "Balasore Train Tragedy",
        "description": "A three-train collision near Bahanaga Bazar station in Balasore district on 2 June 2023 kills 296 people and injures about 1,200, one of India's worst rail accidents.",
        "themes": [
            "nature"
        ]
    },
    {
        "id": "new-government",
        "year": "2024 CE",
        "era": "modern",
        "title": "New Government",
        "description": "After 24 years of BJD rule, the BJP forms the government in Odisha, with Mohan Charan Majhi as Chief Minister (June 2024).",
        "themes": [
            "rulers"
        ],
        "image": {
            "src": "https://upload.wikimedia.org/wikipedia/commons/4/42/Shri_Mohan_Charan_Majhi.jpg",
            "alt": "Mohan Charan Majhi",
            "credit": "Prime Minister's Office",
            "licence": "GODL-India",
            "page": "https://commons.wikimedia.org/wiki/File:Shri_Mohan_Charan_Majhi.jpg",
            "w": 535,
            "h": 652,
            "pos": "top"
        }
    }
];
