// Translation strings for English, Odia, and Hindi

export type Language = 'en' | 'od' | 'hi';

export const translations = {
    // Navigation
    nav: {
        learn: { en: 'Learn', od: 'ଶିଖନ୍ତୁ' },
        language: { en: 'Language', od: 'ଭାଷା' },
        culture: { en: 'Culture', od: 'ସଂସ୍କୃତି' },
        history: { en: 'History', od: 'ଇତିହାସ' },
        timeline: { en: 'Timeline', od: 'ସମୟରେଖା' },
        calendar: { en: 'Calendar', od: 'ପଞ୍ଜିକା' },
        food: { en: 'Food', od: 'ଖାଦ୍ୟ' },
        people: { en: 'People', od: 'ଲୋକ' },
        about: { en: 'About', od: 'ବିଷୟରେ' },
        search: { en: 'Search...', od: 'ଖୋଜନ୍ତୁ...' },
    },

    // Homepage
    home: {
        title: { en: 'Odiapedia', od: 'ଓଡ଼ିଆପିଡ଼ିଆ' },
        subtitle: { en: 'Discover Odisha', od: 'ଓଡ଼ିଶା ଆବିଷ୍କାର କରନ୍ତୁ' },
        description: {
            en: 'Your gateway to the rich heritage, vibrant culture, and timeless traditions of Odisha',
            od: 'ଓଡ଼ିଶାର ସମୃଦ୍ଧ ଐତିହ୍ୟ, ରଙ୍ଗୀନ ସଂସ୍କୃତି ଏବଂ କାଳଜୟୀ ପରମ୍ପରାକୁ ଜାଣିବାର ଦ୍ୱାର'
        },
        exploreBtn: { en: 'Start Exploring', od: 'ଆରମ୍ଭ କରନ୍ତୁ' },
        sections: {
            language: {
                title: { en: 'Language', od: 'ଭାଷା' },
                description: {
                    en: 'The classical Odia language, one of the oldest in India with a rich literary tradition spanning millennia.',
                    od: 'ଶାସ୍ତ୍ରୀୟ ଓଡ଼ିଆ ଭାଷା, ଭାରତର ପ୍ରାଚୀନତମ ଭାଷାଗୁଡ଼ିକ ମଧ୍ୟରୁ ଏକ, ହଜାର ବର୍ଷ ପୁରୁଣା ସାହିତ୍ୟିକ ପରମ୍ପରା ସହିତ।'
                }
            },
            culture: {
                title: { en: 'Culture', od: 'ସଂସ୍କୃତି' },
                description: {
                    en: 'Vibrant traditions, classical Odissi dance, intricate Pattachitra art, and sacred festivals.',
                    od: 'ରଙ୍ଗୀନ ପରମ୍ପରା, ଶାସ୍ତ୍ରୀୟ ଓଡ଼ିଶୀ ନୃତ୍ୟ, ସୂକ୍ଷ୍ମ ପଟ୍ଟଚିତ୍ର କଳା ଏବଂ ପବିତ୍ର ପର୍ବ।'
                }
            },
            history: {
                title: { en: 'History', od: 'ଇତିହାସ' },
                description: {
                    en: 'From the mighty Kalinga Empire to the architectural wonders of ancient temple kingdoms.',
                    od: 'ବିଶାଳ କଳିଙ୍ଗ ସାମ୍ରାଜ୍ୟରୁ ପ୍ରାଚୀନ ମନ୍ଦିର ରାଜ୍ୟଗୁଡ଼ିକର ସ୍ଥାପତ୍ୟ ଆଶ୍ଚର୍ଯ୍ୟ ପର୍ଯ୍ୟନ୍ତ।'
                }
            },
            timeline: {
                title: { en: 'Timeline', od: 'ସମୟରେଖା' },
                description: {
                    en: '65+ events from prehistoric caves to modern Odisha — explore a million years of history.',
                    od: 'ପ୍ରାଗଐତିହାସିକ ଗୁହାରୁ ଆଧୁନିକ ଓଡ଼ିଶା ପର୍ଯ୍ୟନ୍ତ ୬୫+ ଘଟଣା — ଏକ ନିୟୁତ ବର୍ଷର ଇତିହାସ ଅନ୍ୱେଷଣ କରନ୍ତୁ।'
                }
            },
            calendar: {
                title: { en: 'Calendar', od: 'ପଞ୍ଜିକା' },
                description: {
                    en: 'Odia Panjika with 12 months, festivals, tithi, nakshatra, and Odia year.',
                    od: '୧୨ ମାସ, ପର୍ବ, ତିଥି, ନକ୍ଷତ୍ର ଏବଂ ଓଡ଼ିଆ ବର୍ଷ ସହିତ ଓଡ଼ିଆ ପଞ୍ଜିକା।'
                }
            },
            food: {
                title: { en: 'Food', od: 'ଖାଦ୍ୟ' },
                description: {
                    en: 'Sacred temple prasad, aromatic coastal curries, and legendary sweets like Rasagola.',
                    od: 'ପବିତ୍ର ମନ୍ଦିର ମହାପ୍ରସାଦ, ସୁଗନ୍ଧିତ ଉପକୂଳୀୟ ତରକାରି ଏବଂ ରସଗୋଲା ପରି କିଂବଦନ୍ତୀ ମିଠା।'
                }
            },
            people: {
                title: { en: 'People', od: 'ଲୋକ' },
                description: {
                    en: 'Remarkable individuals who shaped Odisha\'s identity through arts, freedom, and innovation.',
                    od: 'କଳା, ସ୍ୱାଧୀନତା ଏବଂ ନବସୃଜନ ମାଧ୍ୟମରେ ଓଡ଼ିଶାର ପରିଚୟ ଗଢ଼ିଥିବା ଅସାଧାରଣ ବ୍ୟକ୍ତି।'
                }
            },
            about: {
                title: { en: 'About', od: 'ବିଷୟରେ' },
                description: {
                    en: 'Learn about our mission to preserve and share Odia heritage with the world.',
                    od: 'ଓଡ଼ିଆ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ ଏବଂ ବିଶ୍ୱ ସହ ଅଂଶୀଦାର କରିବା ପାଇଁ ଆମର ଉଦ୍ଦେଶ୍ୟ ବିଷୟରେ ଜାଣନ୍ତୁ।'
                }
            }
        },
        featuredArticles: { en: 'Featured Articles', od: 'ବିଶେଷ ପ୍ରବନ୍ଧ' },
        viewAll: { en: 'View All', od: 'ସମସ୍ତ ଦେଖନ୍ତୁ' },
        dailyWord: { en: 'Daily Odia Word', od: 'ଆଜିର ଓଡ଼ିଆ ଶବ୍ଦ' },
    },

    // Calendar
    calendar: {
        title: { en: 'Odia Calendar', od: 'ଓଡ଼ିଆ ପଞ୍ଜିକା' },
        todayPanchanga: { en: "Today's Panchanga", od: 'ଆଜିର ପଞ୍ଚାଙ୍ଗ' },
        odiaYear: { en: 'Odia Year', od: 'ଓଡ଼ିଆ ବର୍ଷ' },
        odiaMonth: { en: 'Odia Month', od: 'ଓଡ଼ିଆ ମାସ' },
        tithi: { en: 'Tithi', od: 'ତିଥି' },
        paksha: { en: 'Paksha', od: 'ପକ୍ଷ' },
        nakshatra: { en: 'Nakshatra', od: 'ନକ୍ଷତ୍ର' },
        yoga: { en: 'Yoga', od: 'ଯୋଗ' },
        karana: { en: 'Karana', od: 'କରଣ' },
        sunrise: { en: 'Sunrise', od: 'ସୂର୍ଯ୍ୟୋଦୟ' },
        sunset: { en: 'Sunset', od: 'ସୂର୍ଯ୍ୟାସ୍ତ' },
        shukla: { en: 'Shukla (Waxing)', od: 'ଶୁକ୍ଳ ପକ୍ଷ' },
        krishna: { en: 'Krishna (Waning)', od: 'କୃଷ୍ଣ ପକ୍ଷ' },
        twelveMonths: { en: 'Twelve Months', od: 'ବାରମାସ' },
        browsePanjikas: { en: 'Browse Traditional Panjikas', od: 'ପାରମ୍ପରିକ ପଞ୍ଜିକା ଦେଖନ୍ତୁ' },
        openBook: { en: 'Open Book', od: 'ପୁସ୍ତକ ଖୋଲନ୍ତୁ' },
        current: { en: 'Current', od: 'ବର୍ତ୍ତମାନ' },
        weekdays: { en: 'Days of the Week', od: 'ସପ୍ତାହର ଦିନ' },
        nakshatras27: { en: '27 Nakshatras', od: '୨୭ ନକ୍ଷତ୍ର' },
    },

    // Timeline
    timeline: {
        title: { en: 'History of Odisha', od: 'ଓଡ଼ିଶାର ଇତିହାସ' },
        subtitle: { en: 'A Journey Through Time', od: 'ସମୟର ଯାତ୍ରା' },
        description: {
            en: 'From prehistoric caves to modern Odisha — a million years of history',
            od: 'ପ୍ରାଗଐତିହାସିକ ଗୁହାରୁ ଆଧୁନିକ ଓଡ଼ିଶା ପର୍ଯ୍ୟନ୍ତ — ଏକ ନିୟୁତ ବର୍ଷର ଇତିହାସ'
        },
        events: { en: 'events', od: 'ଘଟଣା' },
        eras: {
            prehistoric: { en: 'Prehistoric', od: 'ପ୍ରାଗଐତିହାସିକ' },
            ancient: { en: 'Ancient', od: 'ପ୍ରାଚୀନ' },
            medieval: { en: 'Medieval', od: 'ମଧ୍ୟଯୁଗୀୟ' },
            colonial: { en: 'Colonial', od: 'ଔପନିବେଶିକ' },
            modern: { en: 'Modern', od: 'ଆଧୁନିକ' },
        }
    },

    // Learn
    learn: {
        title: { en: 'Learn Odia', od: 'ଓଡ଼ିଆ ଶିଖନ୍ତୁ' },
        subtitle: { en: 'Start Your Journey', od: 'ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ' },
        description: {
            en: 'Learn the beautiful Odia language with interactive lessons',
            od: 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ପାଠ ସହିତ ସୁନ୍ଦର ଓଡ଼ିଆ ଭାଷା ଶିଖନ୍ତୁ'
        },
        alphabet: { en: 'Alphabet', od: 'ବର୍ଣ୍ଣମାଳା' },
        numbers: { en: 'Numbers', od: 'ସଂଖ୍ୟା' },
        greetings: { en: 'Greetings', od: 'ଅଭିବାଦନ' },
        phrases: { en: 'Common Phrases', od: 'ସାଧାରଣ ବାକ୍ୟ' },
        startLesson: { en: 'Start Lesson', od: 'ପାଠ ଆରମ୍ଭ କରନ୍ତୁ' },
    },

    // Common
    common: {
        readMore: { en: 'Read More', od: 'ଅଧିକ ପଢ଼ନ୍ତୁ' },
        learnMore: { en: 'Learn More', od: 'ଅଧିକ ଜାଣନ୍ତୁ' },
        viewAll: { en: 'View All', od: 'ସମସ୍ତ ଦେଖନ୍ତୁ' },
        backTo: { en: 'Back to', od: 'ପ୍ରତ୍ୟାବର୍ତ୍ତନ' },
        exploreMore: { en: 'Explore More', od: 'ଅଧିକ ଅନ୍ୱେଷଣ' },
        related: { en: 'Related', od: 'ସମ୍ପର୍କିତ' },
        loading: { en: 'Loading...', od: 'ଲୋଡ଼ ହେଉଛି...' },
        errorLoading: { en: 'Error loading content', od: 'ବିଷୟବସ୍ତୁ ଲୋଡ଼ କରିବାରେ ତ୍ରୁଟି' },
    },

    // Footer
    footer: {
        tagline: { en: 'Preserving and sharing Odia heritage', od: 'ଓଡ଼ିଆ ଐତିହ୍ୟର ସଂରକ୍ଷଣ ଏବଂ ଅଂଶୀଦାର' },
        quickLinks: { en: 'Quick Links', od: 'ଦ୍ରୁତ ଲିଙ୍କ' },
        connect: { en: 'Connect With Us', od: 'ଆମ ସହ ସଂଯୋଗ' },
        copyright: { en: 'All rights reserved', od: 'ସର୍ବସ୍ୱତ୍ୱ ସଂରକ୍ଷିତ' },
        madeWithLove: { en: 'Made with ❤️ for Odisha', od: 'ଓଡ଼ିଶା ପାଇଁ ❤️ ସହ ତିଆରି' },
    },

    // Language Toggle
    langToggle: {
        switchTo: { en: 'ଓଡ଼ିଆ', od: 'English' },
        current: { en: 'EN', od: 'ଓ' },
    }
};

// Helper function to get translation
export function t(key: string, lang: Language): string {
    const keys = key.split('.');
    let value: unknown = translations;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, unknown>)[k];
        } else {
            return key; // Return key if translation not found
        }
    }

    if (value && typeof value === 'object' && lang in value) {
        return (value as Record<string, string>)[lang];
    }

    return key;
}
