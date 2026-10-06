"""
Builds the Odia ↔ English dictionary data used by /language/dictionary.

Source: Purnachandra Ordia Bhashakosha (Gopal Chandra Praharaj, 1931–1940; public domain), as digitised by the
Digital Dictionaries of South Asia (University of Chicago) and structured by OdiaNLP
(https://github.com/OdiaNLP/dictionary, MIT licence, data/Odia_structured_wordlist_full.json).
Only the dictionary's own Odia and English glosses are used — no machine translation.

Output: public/data/dict/o-<n>.json  entry shards keyed by the headword's first letter
        public/data/dict/e-<letter>.json  English word → [shard, index] lookups
        public/data/dict/index.json  shard map + counts
Usage: python3 scripts/build-dictionary.py /path/to/Odia_structured_wordlist_full.json
"""
import sys, os, re, json, collections, unicodedata

SRC = sys.argv[1] if len(sys.argv) > 1 else '/tmp/odict/data/Odia_structured_wordlist_full.json'
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'data', 'dict')
os.makedirs(OUT, exist_ok=True)

ODIA = re.compile(r'[଀-୿]')
STOP = set('a an the of to or and in on by for with as at be is are was from that this which one any some not its it his her their into who whose being used kind sort'.split())

def clean_head(k):
    k = unicodedata.normalize('NFC', k).strip().strip("'\"()[]{}.,;:—-– ")
    return k

def senses(meaning):
    """Split '1। ଓଡ଼ିଆ—1. English. 2। …' into [(odia, english)]."""
    meaning = meaning.replace('‌', '').strip()
    parts = re.split(r'(?:^|\s)\d+\s*।\s*', meaning)
    out = []
    for p in parts:
        p = p.strip()
        if not p: continue
        if '—' in p:
            od, en = p.split('—', 1)
        else:
            od, en = p, ''
        en = re.sub(r'^\s*\d+\.\s*', '', en)
        # English gloss ends where Odia text (a quoted verse / example) starts
        m = ODIA.search(en)
        if m: en = en[:m.start()]
        en = re.sub(r'\(\s*$', '', en).strip(' —-;,(')
        od = od.strip(' —-;,')
        if len(od) > 140: od = od[:137].rsplit(' ', 1)[0] + '…'
        if len(en) > 180: en = en[:177].rsplit(' ', 1)[0] + '…'
        if od or en: out.append([od, en])
    return out[:8]

data = json.load(open(SRC))
entries = []
for k, v in data.items():
    w = clean_head(k)
    if not w or not ODIA.match(w): continue
    sens = []; gram = ''
    for d in v.get('word_details') or []:
        if not gram and d.get('juktakhyara'): gram = re.split(r'[—(]', d['juktakhyara'])[0].strip()[:40]
        sens += senses(d.get('meaning') or '')
    if not sens: continue
    entries.append({'w': w, 'p': (v.get('pronunciation') or '').strip(), 'g': gram, 's': sens[:8]})

entries.sort(key=lambda e: e['w'])
# Shard by first character (vowel signs never start a word); large letters are split further by 2nd character.
by_first = collections.defaultdict(list)
for e in entries: by_first[e['w'][0]].append(e)
shards = {}   # key prefix -> shard id
files = []
for ch, es in sorted(by_first.items()):
    if len(es) > 2500:
        by2 = collections.defaultdict(list)
        for e in es: by2[e['w'][:2]].append(e)
        groups = []; cur = []; keys = []
        for k2, g in sorted(by2.items()):
            if cur and len(cur) + len(g) > 2500:
                groups.append((keys, cur)); cur = []; keys = []
            cur += g; keys.append(k2)
        if cur: groups.append((keys, cur))
        for keys, g in groups:
            sid = len(files); files.append(g)
            for k2 in keys: shards[k2] = sid
    else:
        sid = len(files); files.append(es); shards[ch] = sid

for sid, es in enumerate(files):
    json.dump(es, open(os.path.join(OUT, f'o-{sid}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))

# English index: each gloss phrase and its significant words → entries
# How often each headword is used inside the dictionary's own Odia definitions — a proxy for how common it is.
FREQ = collections.Counter(tok for es in files for e in es for od, _ in e['s'] for tok in re.findall(r'[\u0B00-\u0B7F]+', od))
eng = collections.defaultdict(dict)   # term -> {(sid, i): score}; lower score = better match
def add(term, ref, score):
    cur = eng[term].get(ref)
    if cur is None or score < cur: eng[term][ref] = score
for sid, es in enumerate(files):
    for i, e in enumerate(es):
        if len(e['w']) < 2: continue   # single letters (ର, ପ …) carry grammatical senses, not vocabulary
        for k, (od, en) in enumerate(e['s']):
            for phrase in re.split(r'[;,]', en):
                ph = re.sub(r'\([^)]*\)', '', phrase).lower().strip(' .:"\'')
                ph = re.sub(r'^(to|a|an|the)\s+', '', ph)
                if not ph or len(ph) > 40 or ph == 'see': continue
                words = re.findall(r"[a-z][a-z'-]+", ph)
                if not words: continue
                common = -min(FREQ[e['w']], 999) / 100   # up to ~10 points for very common words
                if len(words) <= 3: add(' '.join(words), (sid, i), (0 if len(words) == 1 else 2) + min(k, 3) * 0.5 + common)
                for wd in words:
                    if wd not in STOP and len(wd) > 2: add(wd, (sid, i), 20 + k + len(words) + common)
by_letter = collections.defaultdict(dict)
for term, refs in eng.items():
    best = sorted(refs.items(), key=lambda kv: (kv[1], len(files[kv[0][0]][kv[0][1]]['w'])))[:30]
    by_letter[term[0]][term] = [[a, b] for (a, b), _ in best]
for letter, m in by_letter.items():
    json.dump(m, open(os.path.join(OUT, f'e-{letter}.json'), 'w'), ensure_ascii=False, separators=(',', ':'))

json.dump({'source': 'Purnachandra Ordia Bhashakosha (1931–1940), digitised by Digital Dictionaries of South Asia, University of Chicago; structured by OdiaNLP (MIT)',
           'entries': len(entries), 'english_terms': len(eng), 'shards': shards}, open(os.path.join(OUT, 'index.json'), 'w'), ensure_ascii=False, separators=(',', ':'))
print('entries', len(entries), 'shards', len(files), 'english terms', len(eng))
