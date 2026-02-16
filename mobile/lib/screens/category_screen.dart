import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../models/category.dart';
import '../models/article.dart';
import '../providers/language_provider.dart';
import '../services/article_service.dart';
import 'article_screen.dart';

class CategoryScreen extends StatelessWidget {
  final Category category;

  const CategoryScreen({super.key, required this.category});

  @override
  Widget build(BuildContext context) {
    final langProvider = context.watch<LanguageProvider>();
    final lang = langProvider.language;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(category.icon, style: const TextStyle(fontSize: 20)),
            const SizedBox(width: 8),
            Text(category.getName(lang)),
          ],
        ),
      ),
      body: FutureBuilder<List<Article>>(
        future: ArticleService.getArticlesByCategory(category.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.primaryAmber),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error_outline, size: 48, color: Colors.red),
                  const SizedBox(height: 16),
                  Text(
                    'Error loading articles',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                ],
              ),
            );
          }

          final articles = snapshot.data ?? [];

          if (articles.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(category.icon, style: const TextStyle(fontSize: 48)),
                  const SizedBox(height: 16),
                  Text(
                    _getNoArticlesText(lang),
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _getComingSoonText(lang),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: articles.length,
            itemBuilder: (context, index) {
              final article = articles[index];
              return _ArticleCard(
                article: article,
                language: lang,
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ArticleScreen(article: article),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _getNoArticlesText(Language lang) {
    return switch (lang) {
      Language.en => 'No articles yet',
      Language.od => 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ଲେଖା ନାହିଁ',
      Language.hi => 'अभी तक कोई लेख नहीं',
    };
  }

  String _getComingSoonText(Language lang) {
    return switch (lang) {
      Language.en => 'Coming soon!',
      Language.od => 'ଶୀଘ୍ର ଆସୁଛି!',
      Language.hi => 'जल्द आ रहा है!',
    };
  }
}

class _ArticleCard extends StatelessWidget {
  final Article article;
  final Language language;
  final VoidCallback onTap;

  const _ArticleCard({
    required this.article,
    required this.language,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Article image or placeholder
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: article.image != null
                    ? ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Image.network(
                          article.image!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => _placeholderIcon(),
                        ),
                      )
                    : _placeholderIcon(),
              ),
              const SizedBox(width: 16),
              // Article info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      article.getTitle(language),
                      style: Theme.of(context).textTheme.titleMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      article.getDescription(language),
                      style: Theme.of(context).textTheme.bodyMedium,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    // Language badges
                    Wrap(
                      spacing: 4,
                      children: article.availableLanguages.map((langCode) {
                        final lang = Language.fromCode(langCode);
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: const Color.fromRGBO(245, 158, 11, 0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            lang.code.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 10,
                              color: AppTheme.primaryAmber,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.chevron_right,
                color: AppTheme.textSecondary,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _placeholderIcon() {
    return const Center(
      child: Icon(
        Icons.article_outlined,
        size: 32,
        color: AppTheme.textSecondary,
      ),
    );
  }
}
