import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/category.dart';

/// Language provider for managing app-wide language state
class LanguageProvider extends ChangeNotifier {
  static const String _storageKey = 'odiapedia_language';
  Language _language = Language.en;

  Language get language => _language;

  LanguageProvider() {
    _loadSavedLanguage();
  }

  Future<void> _loadSavedLanguage() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final savedLang = prefs.getString(_storageKey);
      if (savedLang != null) {
        _language = Language.fromCode(savedLang);
        notifyListeners();
      }
    } catch (e) {
      debugPrint('Error loading language: $e');
    }
  }

  Future<void> setLanguage(Language lang) async {
    if (_language == lang) return;
    _language = lang;
    notifyListeners();
    
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_storageKey, lang.code);
    } catch (e) {
      debugPrint('Error saving language: $e');
    }
  }

  void toggleLanguage() {
    // Cycle through: en -> od -> hi -> en
    final nextLang = switch (_language) {
      Language.en => Language.od,
      Language.od => Language.hi,
      Language.hi => Language.en,
    };
    setLanguage(nextLang);
  }
}
