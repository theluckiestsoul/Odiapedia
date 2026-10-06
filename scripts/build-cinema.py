"""
Builds the Odia cinema database used by /cinema from a Wikidata export.

Input: JSON produced from query.wikidata.org (films whose original language is Odia, Q33810), with
       {films: {Qid: {...}}, entities: {Qid: {...}}, images: {file: {...}}} — see the /cinema "About the data" note.
       Wikidata is CC0; person photos come from Wikimedia Commons with their own licences (kept per image).
Output: src/data/cinema/films.json, src/data/cinema/people.json
Usage:  python3 scripts/build-cinema.py /path/to/odia-films-wikidata-full.json
"""
import sys, os, json, re, unicodedata, collections

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data', 'cinema')
os.makedirs(OUT, exist_ok=True)
d = json.load(open(SRC, encoding='utf-8'))
F, E, IMG = d['films'], d['entities'], d.get('images', {})

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower())) or 'untitled'

ROLE_KEYS = ['director', 'cast', 'music', 'producer', 'writer', 'cinematographer', 'editor']
TAG_KEYS = ['genre', 'basedOn', 'awards', 'language', 'studio', 'location']
HUMAN = 'Q5'

def label(q):
    return (E.get(q) or {}).get('en') or q

films = []
used = set()
for q, f in F.items():
    title = f.get('en') or f.get('or')
    if not title or re.fullmatch(r'Q\d+', title): continue
    date = f.get('date') or ''
    year = int(date[:4]) if date[:4].isdigit() else None
    if year and (year < 1930 or year > 2030): year = None
    base = slug(title) + (f'-{year}' if year else '')
    s = base; n = 2
    while s in used: s = f'{base}-{n}'; n += 1
    used.add(s)
    rec = {'id': s, 'q': q, 'title': title}
    if f.get('or') and f.get('or') != title: rec['odia'] = f['or']
    if year: rec['year'] = year
    if date and year and not date.endswith('-01-01'): rec['date'] = date
    if f.get('dur'): rec['min'] = int(round(f['dur']))
    if f.get('wp'): rec['wp'] = f['wp']
    for k in ROLE_KEYS:
        v = [x for x in f.get(k, []) if re.fullmatch(r'Q\d+', x)]
        if v: rec[k] = v
    for k in TAG_KEYS:
        v = [label(x) for x in f.get(k, []) if re.fullmatch(r'Q\d+', x)]
        v = [x for x in v if not re.fullmatch(r'Q\d+', x)]
        if k == 'language': v = [x for x in v if x != 'Odia']
        if v: rec[k] = v
    films.append(rec)

# Wikidata sometimes holds two items for one film (same title, same exact release date): merge them.
merged = {}
for r in films:
    k = (r['title'].lower(), r.get('date'))
    if r.get('date') and k in merged:
        a = merged[k]
        for f2, v in r.items():
            if f2 in ('id', 'q'): continue
            if f2 not in a: a[f2] = v
            elif isinstance(v, list): a[f2] = a[f2] + [x for x in v if x not in a[f2]]
    else:
        merged[k] = r
films = list(merged.values())
films.sort(key=lambda r: (r.get('year') or 9999, r.get('date') or '', r['title']))

# People: humans credited in at least one role
credits = collections.defaultdict(lambda: collections.Counter())
for r in films:
    for k in ROLE_KEYS:
        for p in r.get(k, []): credits[p][k] += 1
people = {}
pused = set()
for p, c in credits.items():
    e = E.get(p) or {}
    if e.get('inst') and e['inst'] != HUMAN: continue
    name = e.get('en')
    if not name or re.fullmatch(r'Q\d+', name): continue
    s = slug(name); b = s; n = 2
    while s in pused: s = f'{b}-{n}'; n += 1
    pused.add(s)
    rec = {'id': s, 'q': p, 'name': name, 'roles': dict(c)}
    for k in ('or', 'desc', 'birth', 'death', 'wp'):
        if e.get(k): rec['odia' if k == 'or' else k] = e[k]
    if e.get('sex') in ('Q6581072', 'Q1052281'): rec['g'] = 'f'
    elif e.get('sex') in ('Q6581097', 'Q2449503'): rec['g'] = 'm'
    img = IMG.get(e.get('img') or '')
    if img and img.get('thumb'):
        rec['img'] = {'src': img['thumb'].split('?')[0], 'w': img.get('w'), 'h': img.get('h'), 'page': img.get('page'), 'licence': img.get('lic'), 'credit': img.get('by') or 'Wikimedia Commons'}
    people[p] = rec

# drop non-human credits from films; keep only people we have
for r in films:
    for k in ROLE_KEYS:
        if k in r:
            r[k] = [p for p in r[k] if p in people]
            if not r[k]: del r[k]

json.dump(films, open(os.path.join(OUT, 'films.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(people, open(os.path.join(OUT, 'people.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
yrs = collections.Counter(r.get('year') for r in films)
print('films', len(films), 'with year', sum(1 for r in films if r.get('year')), 'people', len(people),
      'years', min(y for y in yrs if y), '-', max(y for y in yrs if y))

# Compact index for the client-side browser on /cinema
PUB = os.path.join(ROOT, 'public', 'data', 'cinema'); os.makedirs(PUB, exist_ok=True)
name = lambda p: people[p]['name']
index = [[r['id'], r['title'], r.get('year') or 0, [name(p) for p in r.get('director', [])], [name(p) for p in r.get('cast', [])[:4]], [name(p) for p in r.get('music', [])], r.get('genre', [])[:2], 1 if r.get('awards') else 0] for r in films]
json.dump({'fields': ['id', 'title', 'year', 'directors', 'cast', 'music', 'genre', 'awarded'], 'films': index}, open(os.path.join(PUB, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
