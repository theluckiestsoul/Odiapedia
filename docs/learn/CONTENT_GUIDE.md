# Brief: Odiapedia Learn — Level 1 content (English → Odia)

Odiapedia.com is a free bilingual encyclopedia of Odisha. We are building an interactive course that teaches **spoken, everyday Odia** to English speakers (non-Odia adults, Odia diaspora, travellers). Lessons are short (5–10 min), example-heavy, conversation-first. Content is published as **Beta** and native speakers will review it, but it must be as correct and natural as you can make it — standard Odia as spoken in coastal/central Odisha (Cuttack/Bhubaneswar/Puri), the variety textbooks and newspapers use.

## Hard rules
- **Natural, correct Odia only.** Use everyday spoken forms that a Bhubaneswar family would actually say, not stiff literal translations of English. When the spoken form differs from the formal written form (e.g. ମୁଁ ଯାଉଛି / colloquial ମୁଁ ଯାଉଚି), use the standard written spelling of the spoken phrase (ମୁଁ ଯାଉଛି) and mention the colloquial variant in `note` if useful.
- **Unicode Odia script**, correct conjuncts and nukta letters: ଡ଼ (U+0B21 U+0B3C) and ଢ଼, ୟ (ya, U+0B5F) vs ଯ (ja-ya, U+0B2F), ୱ (wa). Use ଁ (chandrabindu) as standard (ମୁଁ, ନାହିଁ, କେଉଁଠି).
- **Politeness:** teach ଆପଣ (formal "you", verb ending -ନ୍ତି/-ନ୍ତୁ) as default for strangers/elders, and ତୁମେ (familiar) for friends/younger people. Mark items with `"register": "formal" | "familiar" | "neutral"` when it matters.
- **Transliteration (`tr`)**: learner-friendly ASCII, lowercase except names, no diacritics. Conventions: long ā → "a" (ଆପଣ → apana), ଇ/ଈ → i, ଉ/ଊ → u, ଏ → e, ଓ → o, ଐ → oi, ଔ → ou, ଶ/ଷ/ସ → s (but write "sh" where speakers clearly say sh? NO — keep "s"), ଚ → ch, ଛ → chh, ଜ/ଯ → j, ୟ → y, ଟ/ତ → t, ଠ/ଥ → th, ଡ/ଦ → d, ଡ଼ → r, ଢ/ଧ → dh, ଣ/ନ → n, ଳ → l, ଂ → ng before k/g else m (ଆପଣଙ୍କ → apananka), ଁ → n (ମୁଁ → mun, ନାହିଁ → nahin), ୱ → w, ବ → b, ଭ → bh, ଫ → ph. Keep the inherent final "a" where Odia pronounces it (ଭାତ → bhata, ନମସ୍କାର → namaskara, ପାଣି → pani). Example: ଆପଣ କେମିତି ଅଛନ୍ତି? → "apana kemiti achhanti?"
- **English (`en`)**: natural English meaning, short. Use `lit` for a literal word-by-word gloss when it helps learning (e.g. ମୋ ନାଁ … → lit "my name …").
- **No invented facts.** Cultural notes must be general and true (e.g. "Odias commonly greet with ନମସ୍କାର with joined palms"). If unsure, leave the note out.
- No mention of Wikipedia, AI or sources inside content.

## Output: one JSON file per unit
src/data/learn/uN.json. UTF-8, valid JSON, exactly this shape:

```json
{
  "id": "u1",
  "title": "Greetings",
  "odia": "ଅଭିବାଦନ",
  "summary": "One sentence: what the learner can do after this unit.",
  "lessons": [
    {
      "id": "u1-l1",
      "title": "Hello and goodbye",
      "odia": "ନମସ୍କାର",
      "goal": "Can-do statement, e.g. 'Greet someone politely and say goodbye.'",
      "context": "1–2 sentences setting a real-life scene.",
      "items": [
        {
          "id": "namaskara",
          "kind": "word" | "phrase",
          "od": "ନମସ୍କାର",
          "tr": "namaskara",
          "en": "hello; greetings (any time of day)",
          "accept_en": ["hello", "greetings", "namaste"],
          "lit": "optional literal gloss",
          "register": "neutral",
          "note": "optional short usage/culture note (≤ 25 words)",
          "emoji": "optional single emoji that pictures the meaning, only if obvious (🙏)"
        }
      ],
      "examples": [
        { "od": "ନମସ୍କାର, ଆପଣ କେମିତି ଅଛନ୍ତି?", "tr": "namaskara, apana kemiti achhanti?", "en": "Hello, how are you?", "uses": ["namaskara", "kemiti"] }
      ],
      "dialogue": {
        "scene": "Short scene title, e.g. 'Meeting a neighbour'",
        "lines": [
          { "who": "Rina", "od": "…", "tr": "…", "en": "…" },
          { "who": "Arun", "od": "…", "tr": "…", "en": "…" }
        ]
      },
      "tip": { "title": "short title", "text": "One grammar or culture point taught through the examples above (≤ 60 words)." }
    }
  ]
}
```

### Sizes per lesson
- `items`: 5–8 new words/phrases. Item `id`s: lowercase ascii slug from the transliteration, unique across the whole course (prefix with the unit if needed, e.g. "u3-maa").
- `examples`: 4–6 example sentences that recombine this lesson's items (and earlier lessons' items). Each example's `uses` lists item ids it contains. Keep examples short (2–7 words) so they work for "arrange the words" exercises — words in `od` must be separated by single spaces, punctuation attached to the preceding word.
- `dialogue`: 4–6 lines between two named people (common Odia names: Rina, Arun, Sita, Prakash, Lipi, Bapi, Mama (uncle) etc.), using mostly this lesson's language.
- `tip`: exactly one.
- `accept_en`: 1–4 alternative English answers a learner might type (lowercase, no punctuation).

## Quality check before finishing
1. Re-read every Odia string: spelling, conjuncts, nukta, chandrabindu, natural word order (Odia is SOV; postpositions; verb agrees with person/politeness).
2. Check every `tr` follows the convention and matches the `od`.
3. Check `uses` ids exist in this or earlier lessons of your unit(s).
4. Validate JSON: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" <file>`.
Then reply with: the lesson ids written, and any items where you are unsure of the correct/natural Odia (one line each).
