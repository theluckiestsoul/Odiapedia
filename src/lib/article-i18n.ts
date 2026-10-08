/** Interface text of the article template in each article language (audit F17). */
export type UiLang = "en" | "or" | "hi";

const EN = {
    minRead: (n: number) => `${n} min read`,
    updated: "Updated",
    citedSources: (n: number) => `${n} cited sources`,
    by: "By",
    faq: "Frequently asked questions",
    tripH: "Want a trip like this, planned for you?",
    tripP: "Tell us your dates, budget and interests. We share your request only with vetted Odisha travel partners, and only with your consent.",
    tripBtn: "Request a free itinerary",
    sources: "Sources & references",
    noSources: "This article does not list its sources yet. Know a reliable source?",
    sendIt: "Send it to us",
    originalSources: "Sources of the English article this page translates:",
    changes: "Corrections & updates",
    firstPublished: "First published",
    lastUpdated: "Last updated",
    howWe: "How we write and check articles",
    report: "Report an error",
    onThisPage: "On this page",
    planCustom: "Plan a custom Odisha trip",
    freeReq: "Free itinerary request · consent-based",
    start: "Start",
    jumpRecipe: "Jump to recipe",
    quickFacts: "Quick facts",
    nextDates: "Next dates",
    allFestivals: "All Odisha festival dates",
    source: "Source:",
    translationOf: "This page is a translation of",
    theEnglishArticle: "the English article",
    factsChecked: "Its facts were checked against that article's sources.",
    factsNotChecked: "Its facts have not yet been checked against that article's sources.",
    languageNotReviewed: "The wording has not yet been reviewed by a native-speaker editor.",
    abridged: "This version is shorter than the original; the original has the full details.",
};
type Strings = typeof EN;

const OR: Strings = {
    minRead: (n) => `${n} ମିନିଟ୍ ପଢ଼ା`,
    updated: "ଅଦ୍ୟତନ",
    citedSources: (n) => `${n}ଟି ଉତ୍ସ`,
    by: "ଲେଖକ:",
    faq: "ବାରମ୍ବାର ପଚରାଯାଉଥିବା ପ୍ରଶ୍ନ",
    tripH: "ଏପରି ଏକ ଯାତ୍ରା ଆପଣଙ୍କ ପାଇଁ ଯୋଜନା କରାଯାଉ କି?",
    tripP: "ଆପଣଙ୍କ ତାରିଖ, ବଜେଟ୍ ଓ ଆଗ୍ରହ ଜଣାନ୍ତୁ। ଆପଣଙ୍କ ସମ୍ମତି ଥିଲେ ହିଁ ଆମେ ଆପଣଙ୍କ ଅନୁରୋଧ କେବଳ ଯାଞ୍ଚ କରାଯାଇଥିବା ଓଡ଼ିଶା ଭ୍ରମଣ ସହଯୋଗୀଙ୍କ ସହ ବାଣ୍ଟୁ।",
    tripBtn: "ମାଗଣା ଯାତ୍ରା ଯୋଜନା ମାଗନ୍ତୁ",
    sources: "ଉତ୍ସ ଓ ସନ୍ଦର୍ଭ",
    noSources: "ଏହି ଲେଖାର ଉତ୍ସ ଏଯାବତ୍ ଦିଆଯାଇନାହିଁ। ଏକ ବିଶ୍ୱସନୀୟ ଉତ୍ସ ଜାଣିଥିଲେ",
    sendIt: "ଆମକୁ ପଠାନ୍ତୁ",
    originalSources: "ଏହି ପୃଷ୍ଠା ଯେଉଁ ଇଂରାଜୀ ଲେଖାର ଅନୁବାଦ, ସେହି ଲେଖାର ଉତ୍ସ:",
    changes: "ସଂଶୋଧନ ଓ ଅଦ୍ୟତନ",
    firstPublished: "ପ୍ରଥମ ପ୍ରକାଶ",
    lastUpdated: "ଶେଷ ଅଦ୍ୟତନ",
    howWe: "ଆମେ କିପରି ଲେଖୁ ଓ ଯାଞ୍ଚ କରୁ (ଇଂରାଜୀରେ)",
    report: "ତ୍ରୁଟି ଜଣାନ୍ତୁ",
    onThisPage: "ଏହି ପୃଷ୍ଠାରେ",
    planCustom: "ଆପଣଙ୍କ ଓଡ଼ିଶା ଯାତ୍ରାର ଯୋଜନା",
    freeReq: "ମାଗଣା ଅନୁରୋଧ · ଆପଣଙ୍କ ସମ୍ମତିରେ",
    start: "ଆରମ୍ଭ",
    jumpRecipe: "ରନ୍ଧନ ପ୍ରଣାଳୀକୁ ଯାଆନ୍ତୁ",
    quickFacts: "ମୁଖ୍ୟ ତଥ୍ୟ",
    nextDates: "ଆଗାମୀ ତାରିଖ",
    allFestivals: "ଓଡ଼ିଶାର ସମସ୍ତ ପର୍ବ ତାରିଖ",
    source: "ଉତ୍ସ:",
    translationOf: "ଏହି ପୃଷ୍ଠାଟି",
    theEnglishArticle: "ଇଂରାଜୀ ଲେଖାର ଅନୁବାଦ।",
    factsChecked: "ଏହାର ତଥ୍ୟ ସେହି ଲେଖାର ଉତ୍ସ ସହ ଯାଞ୍ଚ କରାଯାଇଛି।",
    factsNotChecked: "ଏହାର ତଥ୍ୟ ସେହି ଲେଖାର ଉତ୍ସ ସହ ଏଯାବତ୍ ଯାଞ୍ଚ ହୋଇନାହିଁ।",
    languageNotReviewed: "ଜଣେ ମାତୃଭାଷୀ ସମ୍ପାଦକ ଏହାର ଭାଷା ଏଯାବତ୍ ସମୀକ୍ଷା କରିନାହାନ୍ତି।",
    abridged: "ଏହା ମୂଳ ଲେଖାର ସଂକ୍ଷିପ୍ତ ରୂପ; ସମ୍ପୂର୍ଣ୍ଣ ବିବରଣୀ ଇଂରାଜୀ ଲେଖାରେ ଅଛି।",
};

const HI: Strings = {
    minRead: (n) => `${n} मिनट`,
    updated: "अद्यतन",
    citedSources: (n) => `${n} स्रोत`,
    by: "लेखक:",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    tripH: "क्या आप ऐसी यात्रा की योजना बनवाना चाहते हैं?",
    tripP: "अपनी तारीखें, बजट और रुचियाँ बताइए। आपकी सहमति होने पर ही हम आपका अनुरोध केवल जाँचे-परखे ओडिशा यात्रा साझेदारों के साथ साझा करते हैं।",
    tripBtn: "मुफ़्त यात्रा योजना माँगें",
    sources: "स्रोत और संदर्भ",
    noSources: "इस लेख के स्रोत अभी जोड़े नहीं गए हैं। कोई विश्वसनीय स्रोत जानते हैं?",
    sendIt: "हमें भेजें",
    originalSources: "यह पृष्ठ जिस अंग्रेज़ी लेख का अनुवाद है, उसके स्रोत:",
    changes: "सुधार और अद्यतन",
    firstPublished: "पहली बार प्रकाशित",
    lastUpdated: "अंतिम अद्यतन",
    howWe: "हम लेख कैसे लिखते और जाँचते हैं (अंग्रेज़ी में)",
    report: "त्रुटि बताएँ",
    onThisPage: "इस पृष्ठ पर",
    planCustom: "अपनी ओडिशा यात्रा की योजना",
    freeReq: "मुफ़्त अनुरोध · आपकी सहमति से",
    start: "शुरू करें",
    jumpRecipe: "विधि पर जाएँ",
    quickFacts: "मुख्य तथ्य",
    nextDates: "आगामी तिथियाँ",
    allFestivals: "ओडिशा के सभी पर्वों की तिथियाँ",
    source: "स्रोत:",
    translationOf: "यह पृष्ठ",
    theEnglishArticle: "अंग्रेज़ी लेख का अनुवाद है।",
    factsChecked: "इसके तथ्य उस लेख के स्रोतों से जाँचे गए हैं।",
    factsNotChecked: "इसके तथ्य अभी उस लेख के स्रोतों से नहीं जाँचे गए हैं।",
    languageNotReviewed: "इसकी भाषा की समीक्षा अभी किसी मातृभाषी संपादक ने नहीं की है।",
    abridged: "यह मूल लेख का संक्षिप्त रूप है; पूरी जानकारी अंग्रेज़ी लेख में है।",
};

export function articleStrings(lang: UiLang): Strings {
    return lang === "or" ? OR : lang === "hi" ? HI : EN;
}

/** Changelog notes written in English on translated pages, shown in the page's language. */
const NOTE_TRANSLATIONS: Record<string, Partial<Record<UiLang, string>>> = {
    "Fact-checked against the English article's sources; factual errors corrected.": {
        or: "ଇଂରାଜୀ ଲେଖାର ଉତ୍ସ ସହ ତଥ୍ୟ ଯାଞ୍ଚ କରାଯାଇଛି; ତଥ୍ୟଗତ ତ୍ରୁଟି ସଂଶୋଧିତ ହୋଇଛି।",
        hi: "अंग्रेज़ी लेख के स्रोतों से तथ्य जाँचे गए; तथ्यात्मक त्रुटियाँ ठीक की गईं।",
    },
    "Fact-checked against the cited sources; factual errors corrected, unsupported claims removed or attributed, and references added.": {
        or: "ଉଲ୍ଲିଖିତ ସୂତ୍ର ସହ ତଥ୍ୟ ଯାଞ୍ଚ କରାଯାଇଛି; ତଥ୍ୟଗତ ତ୍ରୁଟି ସଂଶୋଧିତ, ଅସମର୍ଥିତ ଦାବି ହଟାଯାଇଛି ବା ସୂତ୍ର ସହ ଦର୍ଶାଯାଇଛି, ଏବଂ ସନ୍ଦର୍ଭ ଯୋଡ଼ାଯାଇଛି।",
        hi: "उद्धृत स्रोतों से तथ्य जाँचे गए; त्रुटियाँ ठीक की गईं, असमर्थित दावे हटाए गए या स्रोत सहित दिए गए, और संदर्भ जोड़े गए।",
    },
};
export function noteIn(lang: UiLang, note: string): string {
    return NOTE_TRANSLATIONS[note]?.[lang] ?? note;
}
export const FACT_CHECK_NOTE = "Fact-checked against the English article's sources; factual errors corrected.";
