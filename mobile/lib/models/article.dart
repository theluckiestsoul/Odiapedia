import 'category.dart';

/// Article model
class Article {
  final String slug;
  final String category;
  final String titleEn;
  final String? titleOd;
  final String? titleHi;
  final String descriptionEn;
  final String? descriptionOd;
  final String? descriptionHi;
  final String contentEn;
  final String? contentOd;
  final String? contentHi;
  final String author;
  final DateTime date;
  final String? image;
  final List<String> availableLanguages;

  const Article({
    required this.slug,
    required this.category,
    required this.titleEn,
    this.titleOd,
    this.titleHi,
    required this.descriptionEn,
    this.descriptionOd,
    this.descriptionHi,
    required this.contentEn,
    this.contentOd,
    this.contentHi,
    required this.author,
    required this.date,
    this.image,
    this.availableLanguages = const ['en'],
  });

  String getTitle(Language lang) {
    switch (lang) {
      case Language.en:
        return titleEn;
      case Language.od:
        return titleOd ?? titleEn;
      case Language.hi:
        return titleHi ?? titleEn;
    }
  }

  String getDescription(Language lang) {
    switch (lang) {
      case Language.en:
        return descriptionEn;
      case Language.od:
        return descriptionOd ?? descriptionEn;
      case Language.hi:
        return descriptionHi ?? descriptionEn;
    }
  }

  String getContent(Language lang) {
    switch (lang) {
      case Language.en:
        return contentEn;
      case Language.od:
        return contentOd ?? contentEn;
      case Language.hi:
        return contentHi ?? contentEn;
    }
  }

  bool hasLanguage(Language lang) {
    return availableLanguages.contains(lang.code);
  }

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      slug: json['slug'] ?? '',
      category: json['category'] ?? '',
      titleEn: json['title_en'] ?? json['title'] ?? '',
      titleOd: json['title_od'],
      titleHi: json['title_hi'],
      descriptionEn: json['description_en'] ?? json['description'] ?? '',
      descriptionOd: json['description_od'],
      descriptionHi: json['description_hi'],
      contentEn: json['content_en'] ?? json['content'] ?? '',
      contentOd: json['content_od'],
      contentHi: json['content_hi'],
      author: json['author'] ?? 'Odiapedia Team',
      date: DateTime.tryParse(json['date'] ?? '') ?? DateTime.now(),
      image: json['image'],
      availableLanguages: List<String>.from(json['available_languages'] ?? ['en']),
    );
  }
}
