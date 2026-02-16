import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:provider/provider.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../config/theme.dart';
import '../models/article.dart';
import '../models/category.dart';
import '../providers/language_provider.dart';

class ArticleScreen extends StatelessWidget {
  final Article article;

  const ArticleScreen({super.key, required this.article});

  @override
  Widget build(BuildContext context) {
    final langProvider = context.watch<LanguageProvider>();
    final lang = langProvider.language;

    return Scaffold(
      appBar: AppBar(
        title: Text(article.getTitle(lang)),
        actions: [
          // Language selector for article
          if (article.availableLanguages.length > 1)
            PopupMenuButton<Language>(
              icon: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Color.fromRGBO(245, 158, 11, 0.15), // primaryAmber with opacity
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.translate, size: 16, color: AppTheme.primaryAmber),
                    const SizedBox(width: 4),
                    Text(
                      lang.code.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.primaryAmber,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
              itemBuilder: (context) {
                return article.availableLanguages.map((langCode) {
                  final l = Language.fromCode(langCode);
                  return PopupMenuItem<Language>(
                    value: l,
                    child: Row(
                      children: [
                        Text(l.flag),
                        const SizedBox(width: 8),
                        Text(l.name),
                        if (l == lang)
                          const Padding(
                            padding: EdgeInsets.only(left: 8),
                            child: Icon(Icons.check, size: 16, color: AppTheme.primaryAmber),
                          ),
                      ],
                    ),
                  );
                }).toList();
              },
              onSelected: (selectedLang) {
                langProvider.setLanguage(selectedLang);
              },
            ),
          // Share button
          IconButton(
            icon: const Icon(Icons.share),
            onPressed: () => _shareArticle(context, lang),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Article image
            if (article.image != null)
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.network(
                  article.image!,
                  width: double.infinity,
                  height: 200,
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => Container(
                    height: 200,
                    color: AppTheme.surfaceColor,
                    child: const Center(
                      child: Icon(Icons.image_not_supported, size: 48),
                    ),
                  ),
                ),
              ),
            const SizedBox(height: 16),

            // Article title
            Text(
              article.getTitle(lang),
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 8),

            // Author and date
            Row(
              children: [
                const Icon(Icons.person_outline, size: 16, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  article.author,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(width: 16),
                const Icon(Icons.calendar_today, size: 16, color: AppTheme.textSecondary),
                const SizedBox(width: 4),
                Text(
                  _formatDate(article.date),
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Language selector widget (like website)
            if (article.availableLanguages.length > 1) ...[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.language, color: AppTheme.primaryAmber),
                    const SizedBox(width: 8),
                    Text(
                      _getReadInText(lang),
                      style: const TextStyle(color: AppTheme.textSecondary),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Row(
                        children: article.availableLanguages.map((langCode) {
                          final l = Language.fromCode(langCode);
                          final isSelected = l == lang;
                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: GestureDetector(
                              onTap: () => langProvider.setLanguage(l),
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 6,
                                ),
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppTheme.primaryAmber
                                      : Colors.transparent,
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(
                                    color: isSelected
                                        ? AppTheme.primaryAmber
                                        : AppTheme.borderColor,
                                  ),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(l.flag),
                                    const SizedBox(width: 4),
                                    Text(
                                      l.name,
                                      style: TextStyle(
                                        color: isSelected
                                            ? AppTheme.darkBackground
                                            : AppTheme.textPrimary,
                                        fontWeight: isSelected
                                            ? FontWeight.bold
                                            : FontWeight.normal,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),
            ],

            // Divider
            const Divider(color: AppTheme.borderColor),
            const SizedBox(height: 16),

            // Article content (Markdown)
            MarkdownBody(
              data: article.getContent(lang),
              styleSheet: _getMarkdownStyle(context),
              onTapLink: (text, href, title) {
                if (href != null) {
                  launchUrl(Uri.parse(href));
                }
              },
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  String _getReadInText(Language lang) {
    return switch (lang) {
      Language.en => 'Read in:',
      Language.od => 'ଏଥିରେ ପଢ଼ନ୍ତୁ:',
      Language.hi => 'इसमें पढ़ें:',
    };
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }

  void _shareArticle(BuildContext context, Language lang) {
    Share.share(
      '${article.getTitle(lang)}\n\nRead more on Odiapedia: https://odiapedia.com/${article.category}/${article.slug}',
      subject: article.getTitle(lang),
    );
  }

  MarkdownStyleSheet _getMarkdownStyle(BuildContext context) {
    return MarkdownStyleSheet(
      h1: Theme.of(context).textTheme.headlineLarge,
      h2: Theme.of(context).textTheme.headlineMedium?.copyWith(
        color: AppTheme.primaryAmber,
      ),
      h3: Theme.of(context).textTheme.titleLarge,
      p: Theme.of(context).textTheme.bodyLarge,
      blockquote: Theme.of(context).textTheme.bodyLarge?.copyWith(
        color: AppTheme.textSecondary,
        fontStyle: FontStyle.italic,
      ),
      blockquoteDecoration: BoxDecoration(
        border: Border(
          left: BorderSide(
            color: AppTheme.primaryAmber,
            width: 4,
          ),
        ),
      ),
      tableHead: const TextStyle(fontWeight: FontWeight.bold),
      tableBody: Theme.of(context).textTheme.bodyMedium,
      tableBorder: TableBorder.all(color: AppTheme.borderColor),
      code: TextStyle(
        backgroundColor: AppTheme.surfaceColor,
        color: AppTheme.primaryAmber,
        fontFamily: 'monospace',
      ),
      codeblockDecoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(8),
      ),
      a: const TextStyle(color: AppTheme.primaryAmber),
    );
  }
}
