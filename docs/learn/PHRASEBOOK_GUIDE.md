# Brief: Odiapedia Learn — Real-life phrasebook

Read docs/learn/CONTENT_GUIDE.md first: all of its hard rules (natural correct Odia, Unicode, politeness, transliteration convention, no invented facts) apply here too.

The phrasebook is for travellers and newcomers who need a phrase *right now*. Each phrase must be something a person would really say in that situation in Odisha, in polite form (ଆପଣ) unless the situation is clearly familiar.

## Output
Write `src/data/learn/phrasebook.json`:

```json
{
  "categories": [
    {
      "id": "auto-taxi",
      "title": "Auto & taxi",
      "odia": "ଅଟୋ ଓ ଟାକ୍ସି",
      "icon": "one emoji",
      "intro": "One sentence on when you'd use these.",
      "phrases": [
        {
          "id": "auto-how-much-to",
          "od": "… ଯିବା ପାଇଁ କେତେ ନେବେ?",
          "tr": "… jiba pain kete nebe?",
          "en": "How much will you charge to go to …?",
          "intents": ["fare", "price", "how much", "cost to go"],
          "note": "optional (≤ 20 words), e.g. how to fill the blank"
        }
      ]
    }
  ]
}
```

Categories (in this order, 10–14 phrases each, most useful first):
1. `essentials` Essentials (yes/no, please, thank you, sorry, I don't understand, do you speak English/Hindi, slowly please, what is this called in Odia)
2. `auto-taxi` Auto & taxi
3. `train-bus` Train & bus
4. `directions` Asking the way
5. `food` Eating out & food
6. `shopping` Shopping & bargaining
7. `hotel` Hotel & stay
8. `temple` Temples (e.g. visiting Puri/Lingaraj: where to leave shoes, can I go inside, where is the prasad/Mahaprasad counter, photography allowed? — phrases only, no claims about rules)
9. `health` Doctor & pharmacy
10. `emergency` Emergencies (help, call the police, call an ambulance, fire, I lost my phone/wallet, I am lost)
11. `family` Meeting family & elders (respectful phrases a guest or in-law would use)
12. `work` At work & office

`intents`: 3–6 lowercase English search phrases describing what the user wants to say (used for "search by intent"). Phrase ids: lowercase ascii, unique, prefixed by category id.
Use "…" (U+2026) for a slot the user fills, in both `od` and `tr`.

Quality check as in the main brief, validate JSON, then reply with the counts per category and any phrases you are unsure about (one line each).
