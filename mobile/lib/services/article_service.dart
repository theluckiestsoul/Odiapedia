import '../models/article.dart';

/// Service for fetching articles
/// Currently uses mock data, can be extended to fetch from API
class ArticleService {
  /// Sample articles for demonstration
  static final List<Article> _sampleArticles = [
    Article(
      slug: 'makar-sankranti',
      category: 'culture',
      titleEn: 'Makar Sankranti - The Sun Festival of Odisha',
      titleOd: 'ମକର ସଂକ୍ରାନ୍ତି - ଓଡ଼ିଶାର ସୂର୍ଯ୍ୟ ପର୍ବ',
      titleHi: 'मकर संक्रांति - ओडिशा का सूर्य पर्व',
      descriptionEn: 'Makar Sankranti is a major harvest festival celebrating the Sun\'s transition into Capricorn.',
      descriptionOd: 'ମକର ସଂକ୍ରାନ୍ତି ହେଉଛି ଏକ ପ୍ରମୁଖ ଅମଳ ପର୍ବ ଯାହା ସୂର୍ଯ୍ୟଙ୍କ ମକର ରାଶିକୁ ପ୍ରବେଶକୁ ପାଳନ କରେ।',
      descriptionHi: 'मकर संक्रांति एक प्रमुख फसल उत्सव है जो सूर्य के मकर राशि में प्रवेश का जश्न मनाता है।',
      contentEn: '''
# Makar Sankranti — The Sun Festival of Odisha

**Makar Sankranti** is one of the most important festivals of Odisha, celebrated every year in the month of **Pausha** (January 14-15).

## When is Makar Sankranti Celebrated?

Makar Sankranti is a **solar festival** that falls on **January 14 or 15** every year.

| Year | Date |
|------|------|
| 2026 | January 14 |
| 2027 | January 14 |

## Traditional Pithas

In Odisha, Makar Sankranti is also known as the **"Pitha Festival"**.

- **Chakuli Pitha** — Thin, round rice pancake
- **Manda Pitha** — Steamed dumpling
- **Enduri Pitha** — Steamed in turmeric leaves

> "Makar Sankranti symbolizes new hope, new goals, and new beginnings."

## Famous Melas

- **Chandrabhaga Mela, Konark** — One of the oldest fairs in India
- **Makara Mela, Bhubaneswar** — At Lingaraj Temple
''',
      contentOd: '''
# ମକର ସଂକ୍ରାନ୍ତି — ଓଡ଼ିଶାର ସୂର୍ଯ୍ୟ ପର୍ବ

**ମକର ସଂକ୍ରାନ୍ତି** ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପର୍ବ ମଧ୍ୟରୁ ଏକ, ପ୍ରତି ବର୍ଷ **ପୌଷ** ମାସରେ (ଜାନୁଆରୀ ୧୪-୧୫) ପାଳନ ହୁଏ।

## ମକର ସଂକ୍ରାନ୍ତି କେବେ ପାଳନ ହୁଏ?

ମକର ସଂକ୍ରାନ୍ତି ଏକ **ସୌର ପର୍ବ** ଯାହା ପ୍ରତି ବର୍ଷ **ଜାନୁଆରୀ ୧୪ କିମ୍ବା ୧୫** ରେ ପଡ଼େ।

## ପାରମ୍ପରିକ ପିଠା

ଓଡ଼ିଶାରେ, ମକର ସଂକ୍ରାନ୍ତିକୁ **"ପିଠା ପର୍ବ"** ବୋଲି ମଧ୍ୟ କୁହାଯାଏ।

- **ଚକୁଳି ପିଠା** — ପତଳା, ଗୋଲ ଚାଉଳ ପାନକେକ୍
- **ମଣ୍ଡା ପିଠା** — ବାଷ୍ପରେ ରନ୍ଧା ଡମ୍ପଲିଙ୍ଗ
- **ଏଣ୍ଡୁରି ପିଠା** — ହଳଦୀ ପତ୍ରରେ ବାଷ୍ପରେ ରନ୍ଧା

> "ମକର ସଂକ୍ରାନ୍ତି ନୂତନ ଆଶା, ନୂତନ ଲକ୍ଷ୍ୟ ଏବଂ ନୂତନ ଆରମ୍ଭର ପ୍ରତୀକ।"
''',
      contentHi: '''
# मकर संक्रांति — ओडिशा का सूर्य पर्व

**मकर संक्रांति** ओडिशा के सबसे महत्वपूर्ण त्योहारों में से एक है, जो हर साल **पौष** माह (14-15 जनवरी) में मनाया जाता है।

## मकर संक्रांति कब मनाई जाती है?

मकर संक्रांति एक **सौर पर्व** है जो हर साल **14 या 15 जनवरी** को पड़ता है।

## पारंपरिक पिठा

ओडिशा में, मकर संक्रांति को **"पिठा पर्व"** के नाम से भी जाना जाता है।

- **चकुली पिठा** — पतला, गोल चावल का पैनकेक
- **मंडा पिठा** — भाप में पका डंपलिंग
- **एंदुरी पिठा** — हल्दी के पत्तों में भाप में पका

> "मकर संक्रांति नई आशा, नए लक्ष्य और नई शुरुआत का प्रतीक है।"
''',
      author: 'Odiapedia Team',
      date: DateTime(2026, 1, 8),
      image: 'https://odiapedia.com/images/makar-sankranti-celebration.png',
      availableLanguages: ['en', 'od', 'hi'],
    ),
    Article(
      slug: 'jagannath-temple',
      category: 'history',
      titleEn: 'Jagannath Temple, Puri',
      titleOd: 'ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ',
      titleHi: 'जगन्नाथ मंदिर, पुरी',
      descriptionEn: 'The sacred Jagannath Temple is one of the Char Dham pilgrimage sites.',
      descriptionOd: 'ପବିତ୍ର ଜଗନ୍ନାଥ ମନ୍ଦିର ଚାର ଧାମ ତୀର୍ଥଯାତ୍ରା ସ୍ଥାନ ମଧ୍ୟରୁ ଏକ।',
      descriptionHi: 'पवित्र जगन्नाथ मंदिर चार धाम तीर्थयात्रा स्थलों में से एक है।',
      contentEn: '''
# Jagannath Temple, Puri

The **Jagannath Temple** in Puri is one of the most sacred Hindu temples, dedicated to Lord Jagannath.

## History

Built in the 12th century by King Anantavarman Chodaganga Deva, this magnificent temple stands as a testament to Odia architecture.

## Rath Yatra

The annual **Rath Yatra** (Car Festival) is the most famous festival associated with the temple.
''',
      author: 'Odiapedia Team',
      date: DateTime(2026, 1, 5),
      availableLanguages: ['en'],
    ),
    Article(
      slug: 'rasagola',
      category: 'food',
      titleEn: 'Rasagola - The Sweet of Odisha',
      titleOd: 'ରସଗୋଲା - ଓଡ଼ିଶାର ମିଠା',
      titleHi: 'रसगुल्ला - ओडिशा की मिठाई',
      descriptionEn: 'The iconic Odia sweet with a rich history.',
      descriptionOd: 'ଏକ ସମୃଦ୍ଧ ଇତିହାସ ସହିତ ଆଇକନିକ୍ ଓଡ଼ିଆ ମିଠା।',
      descriptionHi: 'समृद्ध इतिहास वाली प्रतिष्ठित ओडिया मिठाई।',
      contentEn: '''
# Rasagola - The Sweet of Odisha

**Rasagola** (also spelled Rasgulla) is a cheese-based sweet that originated in Odisha.

## Origin

The sweet is deeply connected to the **Jagannath Temple** in Puri, where it is offered to Goddess Lakshmi.

## Recipe

Made from **chhena** (cottage cheese) and cooked in sugar syrup.
''',
      author: 'Odiapedia Team',
      date: DateTime(2026, 1, 3),
      availableLanguages: ['en', 'od'],
    ),
    Article(
      slug: 'odia-alphabet',
      category: 'language',
      titleEn: 'Odia Alphabet',
      titleOd: 'ଓଡ଼ିଆ ବର୍ଣ୍ଣମାଳା',
      titleHi: 'ओडिया वर्णमाला',
      descriptionEn: 'Learn the Odia script and its beautiful curved letters.',
      descriptionOd: 'ଓଡ଼ିଆ ଲିପି ଏବଂ ଏହାର ସୁନ୍ଦର ବକ୍ର ଅକ୍ଷର ଶିଖନ୍ତୁ।',
      descriptionHi: 'ओडिया लिपि और इसके सुंदर घुमावदार अक्षर सीखें।',
      contentEn: '''
# Odia Alphabet

The Odia script is one of the most beautiful writing systems in India.

## Vowels (ସ୍ୱରବର୍ଣ୍ଣ)

| Letter | Romanization | Sound |
|--------|--------------|-------|
| ଅ | a | as in "about" |
| ଆ | ā | as in "father" |
| ଇ | i | as in "bit" |
| ଈ | ī | as in "bee" |

## Consonants (ବ୍ୟଞ୍ଜନବର୍ଣ୍ଣ)

| Letter | Romanization | Sound |
|--------|--------------|-------|
| କ | ka | as in "kite" |
| ଖ | kha | aspirated k |
| ଗ | ga | as in "go" |
''',
      author: 'Odiapedia Team',
      date: DateTime(2026, 1, 1),
      availableLanguages: ['en'],
    ),
    Article(
      slug: 'biju-patnaik',
      category: 'people',
      titleEn: 'Biju Patnaik - The Legendary Leader',
      titleOd: 'ବିଜୁ ପଟ୍ଟନାୟକ - କିମ୍ବଦନ୍ତୀ ନେତା',
      titleHi: 'बीजू पटनायक - महान नेता',
      descriptionEn: 'The life and legacy of Odisha\'s most beloved leader.',
      descriptionOd: 'ଓଡ଼ିଶାର ସବୁଠାରୁ ପ୍ରିୟ ନେତାଙ୍କ ଜୀବନ ଏବଂ ଉତ୍ତରାଧିକାର।',
      descriptionHi: 'ओडिशा के सबसे प्रिय नेता का जीवन और विरासत।',
      contentEn: '''
# Biju Patnaik - The Legendary Leader

**Biju Patnaik** (1916-1997) was a freedom fighter, aviator, and two-time Chief Minister of Odisha.

## Early Life

Born on March 5, 1916, in Cuttack, he showed an early interest in aviation.

## Legacy

The Bhubaneswar airport is named after him, and his birthday is celebrated as a state holiday.
''',
      author: 'Odiapedia Team',
      date: DateTime(2025, 12, 28),
      availableLanguages: ['en'],
    ),
  ];

  /// Get all articles for a category
  static Future<List<Article>> getArticlesByCategory(String category) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    return _sampleArticles
        .where((a) => a.category == category)
        .toList();
  }

  /// Get article by slug
  static Future<Article?> getArticle(String category, String slug) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    try {
      return _sampleArticles.firstWhere(
        (a) => a.category == category && a.slug == slug,
      );
    } catch (e) {
      return null;
    }
  }

  /// Search articles
  static Future<List<Article>> searchArticles(String query) async {
    await Future.delayed(const Duration(milliseconds: 300));
    
    final lowerQuery = query.toLowerCase();
    return _sampleArticles.where((a) {
      return a.titleEn.toLowerCase().contains(lowerQuery) ||
             a.descriptionEn.toLowerCase().contains(lowerQuery) ||
             (a.titleOd?.contains(query) ?? false) ||
             (a.titleHi?.contains(query) ?? false);
    }).toList();
  }
}
