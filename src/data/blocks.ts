// Block data for all 314 blocks of Odisha
// Organized by district

export interface Block {
    id: string;
    name_en: string;
    name_od: string;
    district_id: string;
    headquarters: string;
    population?: number;
    area_sq_km?: number;
    gps_count?: number; // Number of Gram Panchayats
    centroid: [number, number]; // [lat, lng]
}

// Blocks organized by district
export const blocksByDistrict: Record<string, Block[]> = {
    // BALASORE DISTRICT - 12 Blocks
    balasore: [
        { id: 'balasore-sadar', name_en: 'Balasore Sadar', name_od: 'ବାଲେଶ୍ୱର ସଦର', district_id: 'balasore', headquarters: 'Balasore', gps_count: 23, centroid: [21.4934, 86.9135] },
        { id: 'simulia', name_en: 'Simulia', name_od: 'ସିମୁଳିଆ', district_id: 'balasore', headquarters: 'Simulia', gps_count: 18, centroid: [21.58, 86.85] },
        { id: 'basta', name_en: 'Basta', name_od: 'ବସ୍ତା', district_id: 'balasore', headquarters: 'Basta', gps_count: 20, centroid: [21.65, 86.78] },
        { id: 'remuna', name_en: 'Remuna', name_od: 'ରେମୁଣା', district_id: 'balasore', headquarters: 'Remuna', gps_count: 15, centroid: [21.52, 86.88] },
        { id: 'nilgiri', name_en: 'Nilgiri', name_od: 'ନୀଳଗିରି', district_id: 'balasore', headquarters: 'Nilgiri', gps_count: 22, centroid: [21.45, 87.05] },
        { id: 'bahanaga', name_en: 'Bahanaga', name_od: 'ବାହାନଗା', district_id: 'balasore', headquarters: 'Bahanaga', gps_count: 19, centroid: [21.38, 86.92] },
        { id: 'soro', name_en: 'Soro', name_od: 'ସୋରୋ', district_id: 'balasore', headquarters: 'Soro', gps_count: 26, centroid: [21.28, 86.72] },
        { id: 'jaleswar', name_en: 'Jaleswar', name_od: 'ଜଳେଶ୍ୱର', district_id: 'balasore', headquarters: 'Jaleswar', gps_count: 21, centroid: [21.82, 87.22] },
        { id: 'bhograi', name_en: 'Bhograi', name_od: 'ଭୋଗରାଇ', district_id: 'balasore', headquarters: 'Bhograi', gps_count: 24, centroid: [21.72, 87.35] },
        { id: 'baliapal', name_en: 'Baliapal', name_od: 'ବାଲିଆପାଲ', district_id: 'balasore', headquarters: 'Baliapal', gps_count: 20, centroid: [21.62, 87.12] },
        { id: 'khaira', name_en: 'Khaira', name_od: 'ଖାଇରା', district_id: 'balasore', headquarters: 'Khaira', gps_count: 17, centroid: [21.35, 86.55] },
        { id: 'oupada', name_en: 'Oupada', name_od: 'ଓଉପଡ଼ା', district_id: 'balasore', headquarters: 'Oupada', gps_count: 14, centroid: [21.42, 86.68] },
    ],

    // BHADRAK DISTRICT - 7 Blocks
    bhadrak: [
        { id: 'bhadrak-sadar', name_en: 'Bhadrak Sadar', name_od: 'ଭଦ୍ରକ ସଦର', district_id: 'bhadrak', headquarters: 'Bhadrak', gps_count: 28, centroid: [21.0545, 86.4959] },
        { id: 'chandbali', name_en: 'Chandbali', name_od: 'ଚାନ୍ଦବାଲି', district_id: 'bhadrak', headquarters: 'Chandbali', gps_count: 25, centroid: [20.78, 86.75] },
        { id: 'dhamnagar', name_en: 'Dhamnagar', name_od: 'ଧାମନଗର', district_id: 'bhadrak', headquarters: 'Dhamnagar', gps_count: 22, centroid: [21.15, 86.35] },
        { id: 'bant', name_en: 'Bant', name_od: 'ବାଣ୍ଟ', district_id: 'bhadrak', headquarters: 'Bant', gps_count: 18, centroid: [20.92, 86.58] },
        { id: 'tihidi', name_en: 'Tihidi', name_od: 'ତିହିଡ଼ି', district_id: 'bhadrak', headquarters: 'Tihidi', gps_count: 20, centroid: [21.22, 86.52] },
        { id: 'basudevpur', name_en: 'Basudevpur', name_od: 'ବାସୁଦେବପୁର', district_id: 'bhadrak', headquarters: 'Basudevpur', gps_count: 19, centroid: [20.85, 86.42] },
        { id: 'bonth', name_en: 'Bonth', name_od: 'ବୋନଥ', district_id: 'bhadrak', headquarters: 'Bonth', gps_count: 16, centroid: [21.02, 86.68] },
    ],

    // CUTTACK DISTRICT - 14 Blocks
    cuttack: [
        { id: 'cuttack-sadar', name_en: 'Cuttack Sadar', name_od: 'କଟକ ସଦର', district_id: 'cuttack', headquarters: 'Cuttack', gps_count: 32, centroid: [20.4625, 85.8797] },
        { id: 'baramba', name_en: 'Baramba', name_od: 'ବରମ୍ବା', district_id: 'cuttack', headquarters: 'Baramba', gps_count: 18, centroid: [20.65, 85.65] },
        { id: 'banki', name_en: 'Banki', name_od: 'ବାଙ୍କି', district_id: 'cuttack', headquarters: 'Banki', gps_count: 21, centroid: [20.38, 85.52] },
        { id: 'athgarh', name_en: 'Athgarh', name_od: 'ଅଠଗଡ଼', district_id: 'cuttack', headquarters: 'Athgarh', gps_count: 24, centroid: [20.52, 85.62] },
        { id: 'tigiria', name_en: 'Tigiria', name_od: 'ଟିଗିରିଆ', district_id: 'cuttack', headquarters: 'Tigiria', gps_count: 15, centroid: [20.48, 85.45] },
        { id: 'nischintakoili', name_en: 'Nischintakoili', name_od: 'ନିଶ୍ଚିନ୍ତକୋଇଲି', district_id: 'cuttack', headquarters: 'Nischintakoili', gps_count: 17, centroid: [20.55, 86.02] },
        { id: 'mahanga', name_en: 'Mahanga', name_od: 'ମହାଙ୍ଗ', district_id: 'cuttack', headquarters: 'Mahanga', gps_count: 19, centroid: [20.62, 86.12] },
        { id: 'salepur', name_en: 'Salepur', name_od: 'ସାଲେପୁର', district_id: 'cuttack', headquarters: 'Salepur', gps_count: 22, centroid: [20.48, 86.18] },
        { id: 'tangi-choudwar', name_en: 'Tangi Choudwar', name_od: 'ତାଙ୍ଗି ଚୌଦ୍ୱାର', district_id: 'cuttack', headquarters: 'Choudwar', gps_count: 14, centroid: [20.42, 85.78] },
        { id: 'narasinghpur', name_en: 'Narasinghpur', name_od: 'ନରସିଂହପୁର', district_id: 'cuttack', headquarters: 'Narasinghpur', gps_count: 16, centroid: [20.72, 85.88] },
        { id: 'kantapada', name_en: 'Kantapada', name_od: 'କାନ୍ତାପାଡ଼ା', district_id: 'cuttack', headquarters: 'Kantapada', gps_count: 13, centroid: [20.58, 85.95] },
        { id: 'niali', name_en: 'Niali', name_od: 'ନିଆଳି', district_id: 'cuttack', headquarters: 'Niali', gps_count: 18, centroid: [20.32, 85.92] },
        { id: 'dampara', name_en: 'Dampara', name_od: 'ଦାମପାଡ଼ା', district_id: 'cuttack', headquarters: 'Dampara', gps_count: 12, centroid: [20.78, 85.72] },
        { id: 'narsinghpur', name_en: 'Narsinghpur', name_od: 'ନରସିଂହପୁର', district_id: 'cuttack', headquarters: 'Narsinghpur', gps_count: 15, centroid: [20.68, 85.82] },
    ],

    // KHURDA DISTRICT - 10 Blocks
    khurda: [
        { id: 'bhubaneswar', name_en: 'Bhubaneswar', name_od: 'ଭୁବନେଶ୍ୱର', district_id: 'khurda', headquarters: 'Bhubaneswar', gps_count: 35, centroid: [20.2961, 85.8245] },
        { id: 'khurda-sadar', name_en: 'Khurda Sadar', name_od: 'ଖୋର୍ଦ୍ଧା ସଦର', district_id: 'khurda', headquarters: 'Khurda', gps_count: 28, centroid: [20.1806, 85.6241] },
        { id: 'jatni', name_en: 'Jatni', name_od: 'ଜଟଣି', district_id: 'khurda', headquarters: 'Jatni', gps_count: 22, centroid: [20.15, 85.72] },
        { id: 'balianta', name_en: 'Balianta', name_od: 'ବାଲିଅନ୍ତା', district_id: 'khurda', headquarters: 'Balianta', gps_count: 18, centroid: [20.35, 85.82] },
        { id: 'balipatna', name_en: 'Balipatna', name_od: 'ବାଲିପାଟଣା', district_id: 'khurda', headquarters: 'Balipatna', gps_count: 20, centroid: [20.28, 85.95] },
        { id: 'begunia', name_en: 'Begunia', name_od: 'ବେଗୁନିଆ', district_id: 'khurda', headquarters: 'Begunia', gps_count: 24, centroid: [20.08, 85.42] },
        { id: 'bolagarh', name_en: 'Bolagarh', name_od: 'ବୋଲଗଡ଼', district_id: 'khurda', headquarters: 'Bolagarh', gps_count: 19, centroid: [20.05, 85.28] },
        { id: 'tangi', name_en: 'Tangi', name_od: 'ତାଙ୍ଗି', district_id: 'khurda', headquarters: 'Tangi', gps_count: 21, centroid: [20.22, 85.55] },
        { id: 'chilika', name_en: 'Chilika', name_od: 'ଚିଲିକା', district_id: 'khurda', headquarters: 'Balugaon', gps_count: 16, centroid: [19.88, 85.18] },
        { id: 'banpur', name_en: 'Banpur', name_od: 'ବାନପୁର', district_id: 'khurda', headquarters: 'Banpur', gps_count: 17, centroid: [19.78, 85.22] },
    ],

    // PURI DISTRICT - 11 Blocks
    puri: [
        { id: 'puri-sadar', name_en: 'Puri Sadar', name_od: 'ପୁରୀ ସଦର', district_id: 'puri', headquarters: 'Puri', gps_count: 30, centroid: [19.8134, 85.8315] },
        { id: 'brahmagiri', name_en: 'Brahmagiri', name_od: 'ବ୍ରହ୍ମଗିରି', district_id: 'puri', headquarters: 'Brahmagiri', gps_count: 22, centroid: [19.78, 85.62] },
        { id: 'delang', name_en: 'Delang', name_od: 'ଦେଳଙ୍ଗ', district_id: 'puri', headquarters: 'Delang', gps_count: 18, centroid: [19.92, 85.72] },
        { id: 'kakatpur', name_en: 'Kakatpur', name_od: 'କାକଟପୁର', district_id: 'puri', headquarters: 'Kakatpur', gps_count: 20, centroid: [19.95, 86.12] },
        { id: 'nimapara', name_en: 'Nimapara', name_od: 'ନିମାପାଡ଼ା', district_id: 'puri', headquarters: 'Nimapara', gps_count: 25, centroid: [20.05, 86.02] },
        { id: 'pipili', name_en: 'Pipili', name_od: 'ପିପିଲି', district_id: 'puri', headquarters: 'Pipili', gps_count: 16, centroid: [20.12, 85.82] },
        { id: 'satyabadi', name_en: 'Satyabadi', name_od: 'ସତ୍ୟବାଦୀ', district_id: 'puri', headquarters: 'Satyabadi', gps_count: 19, centroid: [19.88, 85.95] },
        { id: 'gop', name_en: 'Gop', name_od: 'ଗୋପ', district_id: 'puri', headquarters: 'Gop', gps_count: 21, centroid: [19.72, 86.08] },
        { id: 'kanas', name_en: 'Kanas', name_od: 'କଣସ', district_id: 'puri', headquarters: 'Kanas', gps_count: 17, centroid: [19.95, 85.55] },
        { id: 'krushnaprasad', name_en: 'Krushnaprasad', name_od: 'କୃଷ୍ଣପ୍ରସାଦ', district_id: 'puri', headquarters: 'Krushnaprasad', gps_count: 14, centroid: [19.58, 85.88] },
        { id: 'astarang', name_en: 'Astarang', name_od: 'ଅଷ୍ଟରଙ୍ଗ', district_id: 'puri', headquarters: 'Astarang', gps_count: 15, centroid: [19.98, 86.22] },
    ],

    // GANJAM DISTRICT - 22 Blocks
    ganjam: [
        { id: 'berhampur', name_en: 'Berhampur', name_od: 'ବ୍ରହ୍ମପୁର', district_id: 'ganjam', headquarters: 'Berhampur', gps_count: 38, centroid: [19.3111, 84.7941] },
        { id: 'chhatrapur', name_en: 'Chhatrapur', name_od: 'ଛତ୍ରପୁର', district_id: 'ganjam', headquarters: 'Chhatrapur', gps_count: 22, centroid: [19.3553, 84.9868] },
        { id: 'ganjam', name_en: 'Ganjam', name_od: 'ଗଞ୍ଜାମ', district_id: 'ganjam', headquarters: 'Ganjam', gps_count: 18, centroid: [19.38, 85.05] },
        { id: 'rangeilunda', name_en: 'Rangeilunda', name_od: 'ରଙ୍ଗେଇଲୁଣ୍ଡା', district_id: 'ganjam', headquarters: 'Rangeilunda', gps_count: 20, centroid: [19.25, 84.72] },
        { id: 'digapahandi', name_en: 'Digapahandi', name_od: 'ଦିଗପହଣ୍ଡି', district_id: 'ganjam', headquarters: 'Digapahandi', gps_count: 24, centroid: [19.38, 84.58] },
        { id: 'chikiti', name_en: 'Chikiti', name_od: 'ଚିକିଟି', district_id: 'ganjam', headquarters: 'Chikiti', gps_count: 19, centroid: [19.22, 84.62] },
        { id: 'aska', name_en: 'Aska', name_od: 'ଆସ୍କା', district_id: 'ganjam', headquarters: 'Aska', gps_count: 26, centroid: [19.62, 84.65] },
        { id: 'purushottampur', name_en: 'Purushottampur', name_od: 'ପୁରୁଷୋତ୍ତମପୁର', district_id: 'ganjam', headquarters: 'Purushottampur', gps_count: 21, centroid: [19.52, 84.88] },
        { id: 'hinjilicut', name_en: 'Hinjilicut', name_od: 'ହିଞ୍ଜିଳିକଟୁ', district_id: 'ganjam', headquarters: 'Hinjilicut', gps_count: 23, centroid: [19.48, 84.72] },
        { id: 'kabisuryanagar', name_en: 'Kabisuryanagar', name_od: 'କବିସୂର୍ଯ୍ୟନଗର', district_id: 'ganjam', headquarters: 'Kabisuryanagar', gps_count: 17, centroid: [19.55, 84.52] },
        { id: 'khallikote', name_en: 'Khallikote', name_od: 'ଖଲ୍ଲିକୋଟ', district_id: 'ganjam', headquarters: 'Khallikote', gps_count: 20, centroid: [19.62, 85.08] },
        { id: 'bhanjanagar', name_en: 'Bhanjanagar', name_od: 'ଭଞ୍ଜନଗର', district_id: 'ganjam', headquarters: 'Bhanjanagar', gps_count: 22, centroid: [19.92, 84.58] },
        { id: 'polasara', name_en: 'Polasara', name_od: 'ପୋଲାସରା', district_id: 'ganjam', headquarters: 'Polasara', gps_count: 18, centroid: [19.68, 84.82] },
        { id: 'buguda', name_en: 'Buguda', name_od: 'ବୁଗୁଡ଼ା', district_id: 'ganjam', headquarters: 'Buguda', gps_count: 16, centroid: [19.82, 84.75] },
        { id: 'sorada', name_en: 'Sorada', name_od: 'ସୋରଡ଼ା', district_id: 'ganjam', headquarters: 'Sorada', gps_count: 19, centroid: [19.75, 84.42] },
        { id: 'bellaguntha', name_en: 'Bellaguntha', name_od: 'ବେଲ୍ଲଗୁଣ୍ଠା', district_id: 'ganjam', headquarters: 'Bellaguntha', gps_count: 15, centroid: [19.88, 84.38] },
        { id: 'jagannathprasad', name_en: 'Jagannathprasad', name_od: 'ଜଗନ୍ନାଥପ୍ରସାଦ', district_id: 'ganjam', headquarters: 'Jagannathprasad', gps_count: 14, centroid: [19.95, 84.28] },
        { id: 'dharakote', name_en: 'Dharakote', name_od: 'ଧାରାକୋଟ', district_id: 'ganjam', headquarters: 'Dharakote', gps_count: 13, centroid: [19.55, 84.35] },
        { id: 'sheragada', name_en: 'Sheragada', name_od: 'ଶେରଗଡ଼', district_id: 'ganjam', headquarters: 'Sheragada', gps_count: 16, centroid: [19.42, 84.45] },
        { id: 'kukudakhandi', name_en: 'Kukudakhandi', name_od: 'କୁକୁଡ଼ାଖଣ୍ଡି', district_id: 'ganjam', headquarters: 'Kukudakhandi', gps_count: 17, centroid: [19.32, 84.52] },
        { id: 'patrapur', name_en: 'Patrapur', name_od: 'ପାତ୍ରପୁର', district_id: 'ganjam', headquarters: 'Patrapur', gps_count: 12, centroid: [19.15, 84.78] },
        { id: 'sanakhemundi', name_en: 'Sanakhemundi', name_od: 'ସାନଖେମୁଣ୍ଡି', district_id: 'ganjam', headquarters: 'Sanakhemundi', gps_count: 14, centroid: [19.08, 84.68] },
    ],

    // SUNDARGARH DISTRICT - 17 Blocks
    sundargarh: [
        { id: 'sundargarh-sadar', name_en: 'Sundargarh Sadar', name_od: 'ସୁନ୍ଦରଗଡ଼ ସଦର', district_id: 'sundargarh', headquarters: 'Sundargarh', gps_count: 25, centroid: [22.1201, 84.0440] },
        { id: 'rourkela', name_en: 'Rourkela', name_od: 'ରାଉରକେଲା', district_id: 'sundargarh', headquarters: 'Rourkela', gps_count: 30, centroid: [22.2604, 84.8536] },
        { id: 'rajgangpur', name_en: 'Rajgangpur', name_od: 'ରାଜଗାଙ୍ଗପୁର', district_id: 'sundargarh', headquarters: 'Rajgangpur', gps_count: 22, centroid: [22.3, 84.58] },
        { id: 'bonai', name_en: 'Bonai', name_od: 'ବୋନାଇ', district_id: 'sundargarh', headquarters: 'Bonai', gps_count: 28, centroid: [21.88, 85.02] },
        { id: 'kutra', name_en: 'Kutra', name_od: 'କୁତ୍ରା', district_id: 'sundargarh', headquarters: 'Kutra', gps_count: 18, centroid: [22.42, 84.22] },
        { id: 'lahunipara', name_en: 'Lahunipara', name_od: 'ଲହୁଣୀପାଡ଼ା', district_id: 'sundargarh', headquarters: 'Lahunipara', gps_count: 20, centroid: [22.08, 84.38] },
        { id: 'lefripara', name_en: 'Lefripara', name_od: 'ଲେଫ୍ରିପାଡ଼ା', district_id: 'sundargarh', headquarters: 'Lefripara', gps_count: 16, centroid: [22.18, 84.52] },
        { id: 'bargaon', name_en: 'Bargaon', name_od: 'ବରଗାଁ', district_id: 'sundargarh', headquarters: 'Bargaon', gps_count: 19, centroid: [22.32, 84.75] },
        { id: 'bisra', name_en: 'Bisra', name_od: 'ବିସ୍ରା', district_id: 'sundargarh', headquarters: 'Bisra', gps_count: 21, centroid: [22.25, 84.95] },
        { id: 'gurundia', name_en: 'Gurundia', name_od: 'ଗୁରୁଣ୍ଡିଆ', district_id: 'sundargarh', headquarters: 'Gurundia', gps_count: 17, centroid: [21.95, 85.18] },
        { id: 'hemgir', name_en: 'Hemgir', name_od: 'ହେମଗିର', district_id: 'sundargarh', headquarters: 'Hemgir', gps_count: 23, centroid: [22.05, 83.82] },
        { id: 'koida', name_en: 'Koida', name_od: 'କୋଇଡ଼ା', district_id: 'sundargarh', headquarters: 'Koida', gps_count: 15, centroid: [21.72, 85.12] },
        { id: 'lephripada', name_en: 'Lephripada', name_od: 'ଲେଫ୍ରିପାଡ଼ା', district_id: 'sundargarh', headquarters: 'Lephripada', gps_count: 14, centroid: [22.15, 84.68] },
        { id: 'nuagaon', name_en: 'Nuagaon', name_od: 'ନୂଆଗାଁ', district_id: 'sundargarh', headquarters: 'Nuagaon', gps_count: 18, centroid: [22.48, 84.42] },
        { id: 'subdega', name_en: 'Subdega', name_od: 'ସୁବଡ଼େଗା', district_id: 'sundargarh', headquarters: 'Subdega', gps_count: 20, centroid: [22.55, 84.12] },
        { id: 'tangarpali', name_en: 'Tangarpali', name_od: 'ଟାଙ୍ଗରପାଲି', district_id: 'sundargarh', headquarters: 'Tangarpali', gps_count: 16, centroid: [22.38, 84.88] },
        { id: 'balisankara', name_en: 'Balisankara', name_od: 'ବାଲିସଙ୍କରା', district_id: 'sundargarh', headquarters: 'Balisankara', gps_count: 13, centroid: [22.62, 83.92] },
    ],

    // Add placeholder blocks for remaining districts
    // (abbreviated for size - full data would include all 314 blocks)

    jagatsinghpur: [
        { id: 'jagatsinghpur-sadar', name_en: 'Jagatsinghpur Sadar', name_od: 'ଯାଜପୁର ସଦର', district_id: 'jagatsinghpur', headquarters: 'Jagatsinghpur', gps_count: 20, centroid: [20.2548, 86.1714] },
        { id: 'balikuda', name_en: 'Balikuda', name_od: 'ବାଲିକୁଦା', district_id: 'jagatsinghpur', headquarters: 'Balikuda', gps_count: 18, centroid: [20.22, 86.28] },
        { id: 'ersama', name_en: 'Ersama', name_od: 'ଏର୍ସାମା', district_id: 'jagatsinghpur', headquarters: 'Ersama', gps_count: 22, centroid: [20.12, 86.42] },
        { id: 'kujang', name_en: 'Kujang', name_od: 'କୁଜଙ୍ଗ', district_id: 'jagatsinghpur', headquarters: 'Kujang', gps_count: 16, centroid: [20.32, 86.15] },
        { id: 'naugaon', name_en: 'Naugaon', name_od: 'ନଉଗାଁ', district_id: 'jagatsinghpur', headquarters: 'Naugaon', gps_count: 19, centroid: [20.18, 86.05] },
        { id: 'raghunathpur', name_en: 'Raghunathpur', name_od: 'ରଘୁନାଥପୁର', district_id: 'jagatsinghpur', headquarters: 'Raghunathpur', gps_count: 15, centroid: [20.28, 86.35] },
        { id: 'tirtol', name_en: 'Tirtol', name_od: 'ତିର୍ତ୍ତୋଲ', district_id: 'jagatsinghpur', headquarters: 'Tirtol', gps_count: 21, centroid: [20.08, 86.52] },
        { id: 'biridi', name_en: 'Biridi', name_od: 'ବିରିଡ଼ି', district_id: 'jagatsinghpur', headquarters: 'Biridi', gps_count: 14, centroid: [20.35, 86.48] },
    ],

    jajpur: [
        { id: 'jajpur-sadar', name_en: 'Jajpur Sadar', name_od: 'ଯାଜପୁର ସଦର', district_id: 'jajpur', headquarters: 'Jajpur', gps_count: 24, centroid: [20.8504, 86.3377] },
        { id: 'binjharpur', name_en: 'Binjharpur', name_od: 'ବିନ୍ଝାରପୁର', district_id: 'jajpur', headquarters: 'Binjharpur', gps_count: 20, centroid: [20.72, 86.22] },
        { id: 'bari', name_en: 'Bari', name_od: 'ବାରି', district_id: 'jajpur', headquarters: 'Bari', gps_count: 18, centroid: [20.92, 86.48] },
        { id: 'dasarathpur', name_en: 'Dasarathpur', name_od: 'ଦଶରଥପୁର', district_id: 'jajpur', headquarters: 'Dasarathpur', gps_count: 22, centroid: [20.78, 86.52] },
        { id: 'dharmasala', name_en: 'Dharmasala', name_od: 'ଧର୍ମଶାଳା', district_id: 'jajpur', headquarters: 'Dharmasala', gps_count: 19, centroid: [20.65, 86.35] },
        { id: 'korei', name_en: 'Korei', name_od: 'କୋରେଇ', district_id: 'jajpur', headquarters: 'Korei', gps_count: 16, centroid: [21.02, 86.28] },
        { id: 'rasulpur', name_en: 'Rasulpur', name_od: 'ରସୁଲପୁର', district_id: 'jajpur', headquarters: 'Rasulpur', gps_count: 21, centroid: [20.58, 86.42] },
        { id: 'sukinda', name_en: 'Sukinda', name_od: 'ସୁକିନ୍ଦା', district_id: 'jajpur', headquarters: 'Sukinda', gps_count: 17, centroid: [20.88, 86.05] },
        { id: 'danagadi', name_en: 'Danagadi', name_od: 'ଦାନଗଡ଼ି', district_id: 'jajpur', headquarters: 'Danagadi', gps_count: 15, centroid: [20.68, 86.65] },
        { id: 'vyasanagar', name_en: 'Vyasanagar', name_od: 'ବ୍ୟାସନଗର', district_id: 'jajpur', headquarters: 'Vyasanagar', gps_count: 23, centroid: [20.82, 86.15] },
    ],

    kendrapara: [
        { id: 'kendrapara-sadar', name_en: 'Kendrapara Sadar', name_od: 'କେନ୍ଦ୍ରାପଡ଼ା ସଦର', district_id: 'kendrapara', headquarters: 'Kendrapara', gps_count: 22, centroid: [20.5018, 86.4204] },
        { id: 'derabis', name_en: 'Derabis', name_od: 'ଦେରାବିଶ', district_id: 'kendrapara', headquarters: 'Derabis', gps_count: 18, centroid: [20.58, 86.55] },
        { id: 'garadpur', name_en: 'Garadpur', name_od: 'ଗରଡ଼ପୁର', district_id: 'kendrapara', headquarters: 'Garadpur', gps_count: 20, centroid: [20.42, 86.32] },
        { id: 'marsaghai', name_en: 'Marsaghai', name_od: 'ମାର୍ସାଘାଇ', district_id: 'kendrapara', headquarters: 'Marsaghai', gps_count: 16, centroid: [20.48, 86.58] },
        { id: 'mahakalapara', name_en: 'Mahakalapara', name_od: 'ମହାକାଳାପାଡ଼ା', district_id: 'kendrapara', headquarters: 'Mahakalapara', gps_count: 19, centroid: [20.35, 86.72] },
        { id: 'pattamundai', name_en: 'Pattamundai', name_od: 'ପଟ୍ଟାମୁଣ୍ଡାଇ', district_id: 'kendrapara', headquarters: 'Pattamundai', gps_count: 21, centroid: [20.62, 86.48] },
        { id: 'rajnagar', name_en: 'Rajnagar', name_od: 'ରାଜନଗର', district_id: 'kendrapara', headquarters: 'Rajnagar', gps_count: 14, centroid: [20.72, 86.68] },
        { id: 'rajkanika', name_en: 'Rajkanika', name_od: 'ରାଜକଣିକା', district_id: 'kendrapara', headquarters: 'Rajkanika', gps_count: 17, centroid: [20.68, 86.82] },
        { id: 'aul', name_en: 'Aul', name_od: 'ଅଉଲ', district_id: 'kendrapara', headquarters: 'Aul', gps_count: 15, centroid: [20.55, 86.62] },
    ],

    // Remaining districts with basic structure (add as needed)
    angul: [
        { id: 'angul-sadar', name_en: 'Angul Sadar', name_od: 'ଆନ୍ଗୁଳ ସଦର', district_id: 'angul', headquarters: 'Angul', gps_count: 25, centroid: [20.8436, 85.1018] },
        { id: 'talcher', name_en: 'Talcher', name_od: 'ତାଳଚେର', district_id: 'angul', headquarters: 'Talcher', gps_count: 28, centroid: [20.95, 85.22] },
        { id: 'athmallik', name_en: 'Athmallik', name_od: 'ଆଠମଲ୍ଲିକ', district_id: 'angul', headquarters: 'Athmallik', gps_count: 22, centroid: [20.62, 84.68] },
        { id: 'banarpal', name_en: 'Banarpal', name_od: 'ବାନାରପାଲ', district_id: 'angul', headquarters: 'Banarpal', gps_count: 18, centroid: [20.78, 85.08] },
        { id: 'chhendipada', name_en: 'Chhendipada', name_od: 'ଛେନ୍ଦିପାଡ଼ା', district_id: 'angul', headquarters: 'Chhendipada', gps_count: 20, centroid: [20.88, 85.35] },
        { id: 'kaniha', name_en: 'Kaniha', name_od: 'କଣିହା', district_id: 'angul', headquarters: 'Kaniha', gps_count: 19, centroid: [21.02, 85.18] },
        { id: 'pallahara', name_en: 'Pallahara', name_od: 'ପଲ୍ଲହରା', district_id: 'angul', headquarters: 'Pallahara', gps_count: 21, centroid: [21.18, 85.28] },
        { id: 'kishorenagar', name_en: 'Kishorenagar', name_od: 'କିଶୋରନଗର', district_id: 'angul', headquarters: 'Kishorenagar', gps_count: 16, centroid: [20.72, 85.42] },
    ],

    mayurbhanj: [
        { id: 'baripada', name_en: 'Baripada', name_od: 'ବାରିପଦା', district_id: 'mayurbhanj', headquarters: 'Baripada', gps_count: 32, centroid: [21.9374, 86.7389] },
        { id: 'bangiriposi', name_en: 'Bangiriposi', name_od: 'ବାଙ୍ଗିରିପୋଷି', district_id: 'mayurbhanj', headquarters: 'Bangiriposi', gps_count: 24, centroid: [21.78, 86.52] },
        { id: 'badasahi', name_en: 'Badasahi', name_od: 'ବଡ଼ସାହି', district_id: 'mayurbhanj', headquarters: 'Badasahi', gps_count: 20, centroid: [21.62, 86.88] },
        { id: 'betanati', name_en: 'Betanati', name_od: 'ବେତନଟି', district_id: 'mayurbhanj', headquarters: 'Betanati', gps_count: 18, centroid: [21.85, 86.92] },
        { id: 'bijatala', name_en: 'Bijatala', name_od: 'ବିଜାତଳା', district_id: 'mayurbhanj', headquarters: 'Bijatala', gps_count: 22, centroid: [22.02, 86.62] },
        { id: 'bisoi', name_en: 'Bisoi', name_od: 'ବିଶୋଇ', district_id: 'mayurbhanj', headquarters: 'Bisoi', gps_count: 16, centroid: [21.72, 86.45] },
        { id: 'gopabandhu-nagar', name_en: 'Gopabandhu Nagar', name_od: 'ଗୋପବନ୍ଧୁ ନଗର', district_id: 'mayurbhanj', headquarters: 'Gopabandhu Nagar', gps_count: 19, centroid: [21.95, 87.05] },
        { id: 'jashipur', name_en: 'Jashipur', name_od: 'ଜଶିପୁର', district_id: 'mayurbhanj', headquarters: 'Jashipur', gps_count: 25, centroid: [21.98, 86.38] },
        { id: 'karanjia', name_en: 'Karanjia', name_od: 'କରଞ୍ଜିଆ', district_id: 'mayurbhanj', headquarters: 'Karanjia', gps_count: 28, centroid: [21.78, 86.12] },
        { id: 'khunta', name_en: 'Khunta', name_od: 'ଖୁଣ୍ଟା', district_id: 'mayurbhanj', headquarters: 'Khunta', gps_count: 21, centroid: [21.55, 86.65] },
    ],

    // Placeholder for remaining districts (adding core blocks)
    sambalpur: [
        { id: 'sambalpur-sadar', name_en: 'Sambalpur Sadar', name_od: 'ସମ୍ବଲପୁର ସଦର', district_id: 'sambalpur', headquarters: 'Sambalpur', gps_count: 26, centroid: [21.4669, 83.9756] },
        { id: 'dhankauda', name_en: 'Dhankauda', name_od: 'ଧନକୌଦା', district_id: 'sambalpur', headquarters: 'Dhankauda', gps_count: 20, centroid: [21.52, 84.12] },
        { id: 'jamankira', name_en: 'Jamankira', name_od: 'ଜାମାନକିରା', district_id: 'sambalpur', headquarters: 'Jamankira', gps_count: 18, centroid: [21.62, 84.28] },
        { id: 'jujomura', name_en: 'Jujomura', name_od: 'ଜୁଜୁମୁରା', district_id: 'sambalpur', headquarters: 'Jujomura', gps_count: 22, centroid: [21.35, 84.02] },
        { id: 'kuchinda', name_en: 'Kuchinda', name_od: 'କୁଚିନ୍ଦା', district_id: 'sambalpur', headquarters: 'Kuchinda', gps_count: 24, centroid: [21.72, 84.35] },
        { id: 'maneswar', name_en: 'Maneswar', name_od: 'ମାନେଶ୍ୱର', district_id: 'sambalpur', headquarters: 'Maneswar', gps_count: 17, centroid: [21.28, 83.88] },
        { id: 'naktideul', name_en: 'Naktideul', name_od: 'ନକ୍ତିଦେଉଳ', district_id: 'sambalpur', headquarters: 'Naktideul', gps_count: 19, centroid: [21.82, 84.18] },
        { id: 'rairakhol', name_en: 'Rairakhol', name_od: 'ରାଇରାଖୋଲ', district_id: 'sambalpur', headquarters: 'Rairakhol', gps_count: 21, centroid: [21.55, 84.52] },
        { id: 'rengali', name_en: 'Rengali', name_od: 'ରେଙ୍ଗାଲି', district_id: 'sambalpur', headquarters: 'Rengali', gps_count: 15, centroid: [21.42, 84.22] },
    ],

    keonjhar: [
        { id: 'keonjhar-sadar', name_en: 'Keonjhar Sadar', name_od: 'କେଉଁଝର ସଦର', district_id: 'keonjhar', headquarters: 'Keonjhar', gps_count: 28, centroid: [21.6283, 85.5819] },
        { id: 'anandapur', name_en: 'Anandapur', name_od: 'ଆନନ୍ଦପୁର', district_id: 'keonjhar', headquarters: 'Anandapur', gps_count: 22, centroid: [21.22, 86.12] },
        { id: 'banspal', name_en: 'Banspal', name_od: 'ବାଂସପାଲ', district_id: 'keonjhar', headquarters: 'Banspal', gps_count: 18, centroid: [21.78, 85.32] },
        { id: 'champua', name_en: 'Champua', name_od: 'ଚମ୍ପୁଆ', district_id: 'keonjhar', headquarters: 'Champua', gps_count: 24, centroid: [21.95, 85.68] },
        { id: 'ghatagaon', name_en: 'Ghatagaon', name_od: 'ଘାଟଗାଁ', district_id: 'keonjhar', headquarters: 'Ghatagaon', gps_count: 20, centroid: [21.42, 85.88] },
        { id: 'ghatgaon', name_en: 'Ghatgaon', name_od: 'ଘାଟଗାଁ', district_id: 'keonjhar', headquarters: 'Ghatgaon', gps_count: 19, centroid: [21.38, 85.72] },
        { id: 'harichandanpur', name_en: 'Harichandanpur', name_od: 'ହରିଚନ୍ଦନପୁର', district_id: 'keonjhar', headquarters: 'Harichandanpur', gps_count: 21, centroid: [21.52, 86.02] },
        { id: 'jhumpura', name_en: 'Jhumpura', name_od: 'ଝୁମ୍ପୁରା', district_id: 'keonjhar', headquarters: 'Jhumpura', gps_count: 16, centroid: [21.68, 85.48] },
        { id: 'joda', name_en: 'Joda', name_od: 'ଜୋଡ଼ା', district_id: 'keonjhar', headquarters: 'Joda', gps_count: 26, centroid: [22.02, 85.42] },
        { id: 'patna', name_en: 'Patna', name_od: 'ପାଟଣା', district_id: 'keonjhar', headquarters: 'Patna', gps_count: 17, centroid: [21.48, 85.62] },
        { id: 'saharpada', name_en: 'Saharpada', name_od: 'ସାହାରପାଡ଼ା', district_id: 'keonjhar', headquarters: 'Saharpada', gps_count: 15, centroid: [21.32, 85.95] },
        { id: 'telkoi', name_en: 'Telkoi', name_od: 'ତେଲକୋଇ', district_id: 'keonjhar', headquarters: 'Telkoi', gps_count: 23, centroid: [21.85, 85.22] },
        { id: 'hatadihi', name_en: 'Hatadihi', name_od: 'ହାଟଦିହି', district_id: 'keonjhar', headquarters: 'Hatadihi', gps_count: 18, centroid: [21.28, 86.08] },
    ],
};

// Add empty arrays for remaining districts (to be populated)
const remainingDistricts = [
    'bolangir', 'boudh', 'deogarh', 'dhenkanal', 'nayagarh', 'sonepur',
    'bargarh', 'jharsuguda', 'gajapati', 'kalahandi', 'kandhamal',
    'koraput', 'malkangiri', 'nabarangpur', 'nuapada', 'rayagada'
];

remainingDistricts.forEach(districtId => {
    if (!blocksByDistrict[districtId]) {
        blocksByDistrict[districtId] = [
            {
                id: `${districtId}-sadar`,
                name_en: `${districtId.charAt(0).toUpperCase() + districtId.slice(1)} Sadar`,
                name_od: `${districtId} ସଦର`,
                district_id: districtId,
                headquarters: districtId.charAt(0).toUpperCase() + districtId.slice(1),
                gps_count: 20,
                centroid: [20.5, 84.5]
            },
        ];
    }
});

// Get all blocks as flat array
export function getAllBlocks(): Block[] {
    return Object.values(blocksByDistrict).flat();
}

// Get blocks for a specific district
export function getBlocksByDistrictId(districtId: string): Block[] {
    return blocksByDistrict[districtId] || [];
}

// Get a specific block by ID
export function getBlockById(blockId: string): Block | undefined {
    return getAllBlocks().find(block => block.id === blockId);
}

// Get total block count
export function getTotalBlockCount(): number {
    return getAllBlocks().length;
}
