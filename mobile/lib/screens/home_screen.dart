import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/theme.dart';
import '../providers/language_provider.dart';
import '../models/category.dart';
import 'category_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final langProvider = context.watch<LanguageProvider>();
    final lang = langProvider.language;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          lang == Language.od ? 'ଓଡ଼ିଆପିଡ଼ିଆ' : 'Odiapedia',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            color: AppTheme.primaryAmber,
          ),
        ),
        actions: [
          // Language Toggle
          _LanguageToggleButton(
            language: lang,
            onToggle: langProvider.toggleLanguage,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Welcome text
              Text(
                _getWelcomeTitle(lang),
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 8),
              Text(
                _getWelcomeSubtitle(lang),
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),

              // Categories Grid
              Text(
                _getCategoriesTitle(lang),
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1.2,
                ),
                itemCount: Category.all.length,
                itemBuilder: (context, index) {
                  final category = Category.all[index];
                  return _CategoryCard(
                    category: category,
                    language: lang,
                    onTap: () => Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => CategoryScreen(category: category),
                      ),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _getWelcomeTitle(Language lang) {
    return switch (lang) {
      Language.en => 'Welcome to Odiapedia',
      Language.od => 'ଓଡ଼ିଆପିଡ଼ିଆରେ ସ୍ୱାଗତ',
      Language.hi => 'ओडियापीडिया में आपका स्वागत है',
    };
  }

  String _getWelcomeSubtitle(Language lang) {
    return switch (lang) {
      Language.en => 'Explore the rich culture, history, and heritage of Odisha',
      Language.od => 'ଓଡ଼ିଶାର ସମୃଦ୍ଧ ସଂସ୍କୃତି, ଇତିହାସ ଏବଂ ଐତିହ୍ୟକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ',
      Language.hi => 'ओडिशा की समृद्ध संस्कृति, इतिहास और विरासत का अन्वेषण करें',
    };
  }

  String _getCategoriesTitle(Language lang) {
    return switch (lang) {
      Language.en => 'Explore',
      Language.od => 'ଅନୁସନ୍ଧାନ',
      Language.hi => 'अन्वेषण करें',
    };
  }
}

class _LanguageToggleButton extends StatelessWidget {
  final Language language;
  final VoidCallback onToggle;

  const _LanguageToggleButton({
    required this.language,
    required this.onToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onToggle,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: const Color.fromRGBO(245, 158, 11, 0.15),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: const Color.fromRGBO(245, 158, 11, 0.3),
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.language, size: 16, color: AppTheme.primaryAmber),
              const SizedBox(width: 6),
              Text(
                language.name,
                style: const TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.primaryAmber,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final Category category;
  final Language language;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.category,
    required this.language,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                category.icon,
                style: const TextStyle(fontSize: 32),
              ),
              const SizedBox(height: 12),
              Text(
                category.getName(language),
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: AppTheme.textPrimary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                category.description,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  fontSize: 11,
                ),
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
