
export interface MovieReview {
    id: string;
    title: string;
    titleOdia: string;
    poster: string;
    rating: number; // 0 to 5
    releaseYear: string;
    director: string;
    genres: string[];
    review: {
        en: string;
        od: string;
    };
    verdict: {
        en: string;
        od: string;
    };
}

export const movieReviews: MovieReview[] = [
    {
        id: "daman",
        title: "Daman",
        titleOdia: "ଦମନ",
        poster: "/images/cinema/daman.png",
        rating: 5,
        releaseYear: "2022",
        director: "Vishal Mourya & Debi Prasad Lenka",
        genres: ["Drama", "Social", "Adventure"],
        review: {
            en: "Daman is not just a film; it's a movement in Odia cinema. Based on a true story, it showcases the relentless efforts of a young doctor in the malaria-infested Malkangiri district. Babushaan delivers a career-defining performance, shedding his chocolate boy image for a gritty, realistic portrayal.",
            od: "ଦମନ କେବଳ ଏକ ଚଳଚ୍ଚିତ୍ର ନୁହେଁ, ଏହା ଓଡ଼ିଆ ସିନେମା ଜଗତରେ ଏକ ଆନ୍ଦୋଳନ। ମାଲକାନଗିରିର ଦୁର୍ଗମ ଅଞ୍ଚଳରେ ଜଣେ ଯୁବ ଡାକ୍ତରଙ୍କର ସଂଘର୍ଷର କାହାଣୀ ଏଥିରେ ବର୍ଣ୍ଣିତ। ବାବୁଶାନଙ୍କର ଅଭିନୟ ଏଥିରେ ଅତ୍ୟନ୍ତ ଉଚ୍ଚକୋଟୀର ହୋଇଛି, ଯାହା ଦର୍ଶକଙ୍କ ମନ ଛୁଇଁଯାଏ।"
        },
        verdict: {
            en: "A Must Watch. The dawn of a new era for Ollywood.",
            od: "ନିଶ୍ଚୟ ଦେଖନ୍ତୁ। ଓଡ଼ିଆ ସିନେମା ପାଇଁ ଏକ ନୂତନ ଯୁଗର ଆରମ୍ଭ।"
        }
    },
    {
        id: "pratikshya",
        title: "Pratikshya",
        titleOdia: "ପ୍ରାତିକ୍ଷ୍ୟା",
        poster: "/images/cinema/pratikshya.png",
        rating: 4.5,
        releaseYear: "2022",
        director: "Anupam Patnaik",
        genres: ["Drama", "Family"],
        review: {
            en: "Inspired by a short story by Gourahari Das, Pratikshya is a poignant tale of a middle-class family's aspirations and the complex father-son bond. Dipanwit Dashmohapatra is outstanding as the struggling son. The film captures the essence of Bhubaneswar life beautifully.",
            od: "ଗୌରହରି ଦାସଙ୍କ ଏକ କ୍ଷୁଦ୍ରଗଳ୍ପ ଉପରେ ଆଧାରିତ, 'ପ୍ରାତିକ୍ଷ୍ୟା' ହେଉଛି ଏକ ମଧ୍ୟବିତ୍ତ ପରିବାରର ସ୍ୱପ୍ନ ଏବଂ ବାପା-ପୁଅ ସମ୍ପର୍କର ଏକ ହୃଦୟସ୍ପର୍ଶୀ କାହାଣୀ। ଦୀପନ୍ୱିତ ଦାଶମହାପାତ୍ରଙ୍କ ଅଭିନୟ ଚମତ୍କାର। ଭୁବନେଶ୍ୱରର ସାଧାରଣ ଜୀବନଯାତ୍ରା ଏଥିରେ ନିଖୁଣ ଭାବରେ ଚିତ୍ରିତ ହୋଇଛି।"
        },
        verdict: {
            en: "Emotional and relatable. A masterpiece of storytelling.",
            od: "ଭାବପ୍ରବଣ ଏବଂ ବାସ୍ତବଧର୍ମୀ। ଏକ ଚମତ୍କାର କାହାଣୀ।"
        }
    },
    {
        id: "pushkara",
        title: "Pushkara",
        titleOdia: "ପୁଷ୍କରା",
        poster: "/images/cinema/pushkara.png",
        rating: 4,
        releaseYear: "2023",
        director: "Subhransu Das",
        genres: ["Drama", "Romance", "Culture"],
        review: {
            en: "Feature debuting director Subhransu Das brings Sabyasachi in a never-seen-before avatar. Set against the backdrop of death rituals and tradition, it's a story of lost love and redemption. The cinematography capturing the river banks is breathtaking.",
            od: "ନିର୍ଦ୍ଦେଶକ ଶୁଭ୍ରାଂଶୁ ଦାସଙ୍କ ଏହି ଚଳଚ୍ଚିତ୍ରରେ ସବ୍ୟସାଚୀଙ୍କୁ ଏକ ସମ୍ପୂର୍ଣ୍ଣ ନୂଆ ରୂପରେ ଦେଖିବାକୁ ମିଳେ। ପରମ୍ପରା ଏବଂ ପ୍ରେମର ଏହି କାହାଣୀ ଦର୍ଶକଙ୍କୁ ବାନ୍ଧି ରଖେ। ଚଳଚ୍ଚିତ୍ରର ଚିତ୍ରନାଟ୍ୟ ଏବଂ ନଦୀ କୂଳର ଦୃଶ୍ୟ ଅତ୍ୟନ୍ତ ମନୋରମ।"
        },
        verdict: {
            en: "Visually stunning and culturally rich.",
            od: "ଦୃଶ୍ୟରାଜି ଚମତ୍କାର ଏବଂ ସାଂସ୍କୃତିକ ଭାବେ ସମୃଦ୍ଧ।"
        }
    }
];
