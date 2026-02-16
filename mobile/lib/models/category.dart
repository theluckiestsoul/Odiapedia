/// Supported languages in the app
enum Language {
  en('en', 'English', '🇬🇧'),
  od('od', 'ଓଡ଼ିଆ', '🇮🇳'),
  hi('hi', 'हिंदी', '🇮🇳');

  final String code;
  final String name;
  final String flag;

  const Language(this.code, this.name, this.flag);

  static Language fromCode(String code) {
    return Language.values.firstWhere(
      (l) => l.code == code,
      orElse: () => Language.en,
    );
  }
}

/// Category model
class Category {
  final String id;
  final String nameEn;
  final String nameOd;
  final String nameHi;
  final String icon;
  final String description;

  const Category({
    required this.id,
    required this.nameEn,
    required this.nameOd,
    required this.nameHi,
    required this.icon,
    required this.description,
  });

  String getName(Language lang) {
    switch (lang) {
      case Language.en:
        return nameEn;
      case Language.od:
        return nameOd;
      case Language.hi:
        return nameHi;
    }
  }

  /// Predefined categories matching the website
  static const List<Category> all = [
    Category(
      id: 'culture',
      nameEn: 'Culture',
      nameOd: 'ସଂସ୍କୃତି',
      nameHi: 'संस्कृति',
      icon: '🎭',
      description: 'Festivals, traditions, and customs',
    ),
    Category(
      id: 'history',
      nameEn: 'History',
      nameOd: 'ଇତିହାସ',
      nameHi: 'इतिहास',
      icon: '🏛️',
      description: 'Historical monuments and events',
    ),
    Category(
      id: 'food',
      nameEn: 'Food',
      nameOd: 'ଖାଦ୍ୟ',
      nameHi: 'भोजन',
      icon: '🍛',
      description: 'Traditional Odia cuisine',
    ),
    Category(
      id: 'language',
      nameEn: 'Language',
      nameOd: 'ଭାଷା',
      nameHi: 'भाषा',
      icon: '📝',
      description: 'Learn Odia language',
    ),
    Category(
      id: 'people',
      nameEn: 'People',
      nameOd: 'ବ୍ୟକ୍ତି',
      nameHi: 'लोग',
      icon: '👤',
      description: 'Notable personalities',
    ),
  ];
}
