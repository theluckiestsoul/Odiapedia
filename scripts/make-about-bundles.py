"""Prepares source notes (Wikipedia text) for writing the cinema descriptions. Output is not shipped."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from wikitext_plain import article

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, 'src', 'data', 'cinema')
films = json.load(open(os.path.join(D, 'films.json')))
people = json.load(open(os.path.join(D, 'people.json')))
en = json.load(open(sys.argv[1]))
wd = json.load(open(sys.argv[2]))
outdir = sys.argv[3]; per = int(sys.argv[4]) if len(sys.argv) > 4 else 30
os.makedirs(outdir, exist_ok=True)
en_by = {}
for t, rec in en.items():
    en_by[t.lower()] = rec['text']; en_by[rec['from'].lower()] = rec['text']
orw = wd['orwiki']
or_by = {}
for t, rec in orw.items():
    or_by[t] = rec['text']; or_by[rec['from']] = rec['text']

def body_len(txt):
    return len(re.sub(r'\[infobox\].*?\n\n', '', txt, flags=re.S))

entries = []
pname = lambda q: people[q]['name'] if q in people else None
for f in films:
    e_txt = en_by.get((f.get('wp') or '').replace('_', ' ').lower())
    o_txt = or_by.get(f.get('orwiki') or '')
    e = article(e_txt, 9000) if e_txt else ''
    o = article(o_txt, 6000) if o_txt else ''
    if not e and not o: continue
    write = body_len(e) + body_len(o) * 0.6 >= 450
    entries.append({'key': f.get('q') or f['id'], 'kind': 'film', 'write_about': write, 'title': f['title'], 'year': f.get('year'),
                    'credits': {r: [pname(q) for q in f.get(r, []) if pname(q)] + f.get(r + 'Text', []) for r in ('director', 'cast', 'music', 'producer') if f.get(r) or f.get(r + 'Text')},
                    'films_on_site': None, 'en_wikipedia': e, 'or_wikipedia': o,
                    'src_urls': ([f"https://en.wikipedia.org/wiki/{f['wp']}"] if e else []) + ([f"https://or.wikipedia.org/wiki/{f['orwiki'].replace(' ', '_')}"] if o else [])})
fl = {}
for f in films:
    for r in ('director', 'cast', 'music', 'producer'):
        for q in f.get(r, []): fl.setdefault(q, []).append(f"{f['title']} ({f.get('year') or '?'})")
for q, p in people.items():
    e_txt = en_by.get((p.get('wp') or '').replace('_', ' ').lower())
    o_txt = or_by.get(p.get('orwiki') or '')
    e = article(e_txt, 9000) if e_txt else ''
    o = article(o_txt, 6000) if o_txt else ''
    if body_len(e) + body_len(o) * 0.6 < 350: continue
    entries.append({'key': q, 'kind': 'person', 'write_about': True, 'name': p['name'], 'gender': p.get('g'), 'born': p.get('birth'), 'died': p.get('death'),
                    'films_on_site': sorted(set(fl.get(q, [])))[:80], 'en_wikipedia': e, 'or_wikipedia': o,
                    'src_urls': ([f"https://en.wikipedia.org/wiki/{p['wp']}"] if e else []) + ([f"https://or.wikipedia.org/wiki/{p['orwiki'].replace(' ', '_')}"] if o else [])})
# batches by size (characters of source text), people and films mixed
budget = per * 1000
batches, cur, size = [], [], 0
for e in sorted(entries, key=lambda e: (e['kind'], -(len(e['en_wikipedia']) + len(e['or_wikipedia'])))):
    n = len(e['en_wikipedia']) + len(e['or_wikipedia']) + 400
    if cur and (size + n > budget or len(cur) >= 45): batches.append(cur); cur, size = [], 0
    cur.append(e); size += n
if cur: batches.append(cur)
for f in os.listdir(outdir):
    if f.startswith('batch_'): os.remove(os.path.join(outdir, f))
for i, b in enumerate(batches):
    json.dump(b, open(os.path.join(outdir, f'batch_{i:02d}.json'), 'w'), ensure_ascii=False, indent=1)
print('entries', len(entries), 'films', sum(1 for e in entries if e['kind'] == 'film'), 'write', sum(1 for e in entries if e['write_about']),
      'people', sum(1 for e in entries if e['kind'] == 'person'), 'batches', len(batches))
