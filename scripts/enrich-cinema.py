"""
Enriches the Odia cinema database built by build-cinema.py.

1. Fills missing cast / director / music / producer from English Wikipedia's "List of Odia films of YEAR"
   pages (parsed by parse_film_lists.py) and adds films that those lists have but Wikidata does not.
   Names that match a known person are linked; other names become lightweight person records so their
   filmographies can still be listed.
2. Adds extra facts from Wikidata (birthplace, awards, Odia Wikipedia article, Commons category).
3. Adds free-licence photos from Wikimedia Commons (licence + author kept per image).
4. Adds the written descriptions in src/data/cinema/about/*.json (original prose written from cited sources).
5. Writes a short, factual data-derived summary for everyone else.

Usage: python3 scripts/enrich-cinema.py --lists /tmp/cine/lists.json [--wd wd-orwiki.json]
"""
import argparse, collections, glob, json, os, re, unicodedata

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'src', 'data', 'cinema')
ROLE_KEYS = ['director', 'cast', 'music', 'producer', 'writer', 'cinematographer', 'editor']

ap = argparse.ArgumentParser()
ap.add_argument('--lists'); ap.add_argument('--wd'); ap.add_argument('--about')
args = ap.parse_args()

films = json.load(open(os.path.join(OUT, 'films.json'), encoding='utf-8'))
people = json.load(open(os.path.join(OUT, 'people.json'), encoding='utf-8'))

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower())) or 'untitled'

def key(s):
    """Loose phonetic key for Odia names/titles spelled in Latin script in different ways."""
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'[^a-z]', '', s)
    for a, b in [('sh', 's'), ('th', 't'), ('dh', 'd'), ('kh', 'k'), ('bh', 'b'), ('ph', 'p'), ('gh', 'g'), ('ch', 'c'), ('jh', 'j'),
                 ('aa', 'a'), ('ee', 'i'), ('oo', 'u'), ('ow', 'o'), ('w', 'v'), ('y', 'i'), ('z', 'j'), ('ou', 'o'), ('au', 'o')]:
        s = s.replace(a, b)
    s = re.sub(r'(.)\1+', r'\1', s)
    return s

def loose(s):
    """Per-word key that ignores a final -a and e/i spelling ('Ratha'~'Rath', 'Pankaja'~'Pankaj')."""
    out = []
    for t in re.sub(r'\(.*?\)', '', s).split():
        k = key(t).replace('e', 'i')
        if len(k) > 3 and k.endswith('a'): k = k[:-1]
        if k: out.append(k)
    return ' '.join(out)

def skel(s):
    """Consonant skeleton: 'Mahasweta Roy' ~ 'Mahasweta Ray', 'Mohanty' ~ 'Mahanty'."""
    k = key(s)
    return (k[:1] + re.sub(r'[aeiou]', '', k[1:])) if k else ''

def fl(s):
    t = s.split()
    return (skel(t[0]), skel(t[-1])) if len(t) >= 2 else None

def first(s):
    return key(s.split()[0]) if s.split() else ''

# ---------- people index ----------
by_loose = collections.defaultdict(list)
by_wp, by_key, by_skel, by_first, by_fl = {}, collections.defaultdict(list), collections.defaultdict(list), collections.defaultdict(list), collections.defaultdict(list)
for q, p in people.items():
    if p.get('wp'): by_wp[p['wp'].replace('_', ' ').lower()] = q
    by_key[key(p['name'])].append(q)
    by_skel[skel(p['name'])].append(q)
    by_loose[loose(p['name'])].append(q)
    by_first[first(p['name'])].append(q)
    if fl(p['name']): by_fl[fl(p['name'])].append(q)
# years each known person was active (from the Wikidata credits), for matching one-word credits like "Aparajita"
active = collections.defaultdict(lambda: collections.defaultdict(list))
for f in films:
    for role in ROLE_KEYS:
        for q in f.get(role, []):
            if f.get('year'): active[q][role].append(f['year'])
used_slugs = {p['id'] for p in people.values()}

def alive(q, year):
    """Could this person have worked on a film released in `year`?"""
    if not year: return True
    p = people[q]
    b, d = (p.get('birth') or '')[:4], (p.get('death') or '')[:4]
    if d.isdigit() and int(d) < year - 1: return False
    if b.isdigit() and int(b) > year - 8: return False
    return True

def find_person(name, link, role=None, year=None):
    if link:
        q = by_wp.get(link.replace('_', ' ').lower())
        if q and alive(q, year): return q
    for cand in (name, re.sub(r'\s*\(.*?\)', '', link or '')):
        if not cand: continue
        for idx, fn in ((by_key, key), (by_loose, loose), (by_skel, skel), (by_fl, fl)):
            allq = [q for q in idx.get(fn(cand), []) if (not q.startswith('W:') or idx in (by_key, by_loose))]
            qs = [q for q in allq if alive(q, year)]
            if allq and not qs and idx in (by_key, by_loose): return 'AMBIG'  # same name, but dates don't fit: show as text
            if len(qs) == 1: return qs[0]
            if len(qs) > 1:
                # one far better-known namesake (e.g. a star with 190 films vs a duplicate record with 6)
                n = sorted(((sum(people[q]['roles'].values()), q) for q in qs), reverse=True)
                if n[0][0] >= 5 * sum(x for x, _ in n[1:]) and idx is not by_fl: return n[0][1]
                return 'AMBIG'
    if len(name.split()) == 1 and role and year:
        qs = [q for q in by_first.get(first(name), []) if not q.startswith('W:')
              and any(abs(y - year) <= 6 for y in active[q].get(role, []))]
        if len(qs) == 1: return qs[0]
    return None

def new_person(name, link):
    k = key(name)
    for q in by_key.get(k, []) + by_loose.get(loose(name), []):
        if q.startswith('W:'): return q
    s = slug(name); b = s; n = 2
    while s in used_slugs: s = f'{b}-{n}'; n += 1
    used_slugs.add(s)
    q = 'W:' + s
    rec = {'id': s, 'q': q, 'name': name, 'roles': {}, 'src': 'wl'}
    if link: rec['wpLink'] = link
    people[q] = rec
    by_key[k].append(q); by_skel[skel(name)].append(q); by_loose[loose(name)].append(q)
    return q

ORG = re.compile(r'\b(productions?|films?|pictures?|entertainments?|movies|creations?|studios?|zee|sarthak|tarang|banner|cine|arts|media|pvt|ltd|music|enterprises?|combines?|international|tele)\b', re.I)

BAD = re.compile(r'^(n/?a|tba|tbd|unknown|various|others?|etc|new faces?|newcomers?|and others|more|music|cast|director|-+|\?)$', re.I)

def clean_name(n):
    n = re.sub(r'\s+', ' ', n).strip(' .,:;-–"\'')
    n = re.sub(r'^(dr|mr|mrs|ms|shri|sri|smt)\.?\s+', lambda m: m.group(0), n, flags=re.I)
    return n

# ---------- 1. Wikipedia year lists ----------
added_films = filled = 0
if args.lists:
    rows = json.load(open(args.lists, encoding='utf-8'))
    fkey = collections.defaultdict(list)
    fwp = {}
    for f in films:
        fkey[(key(f['title']), f.get('year'))].append(f)
        if skel(f['title']) != key(f['title']): fkey[(skel(f['title']), f.get('year'))].append(f)
        if f.get('wp'): fwp[f['wp'].replace('_', ' ').lower()] = f
    used_ids = {f['id'] for f in films}
    for r in rows:
        f = None
        if r.get('title_link'): f = fwp.get(r['title_link'].replace('_', ' ').lower())
        for dy in (0, -1, 1):  # Wikidata sometimes dates a film a year off from Wikipedia's list
            if f: break
            for kf in (key, skel):
                c = fkey.get((kf(r['title']), r['year'] + dy)) or []
                c = [x for x in c if dy == 0 or not x.get('wl')]
                if len(c) == 1: f = c[0]; break
        if not f:
            base = f"{slug(r['title'])}-{r['year']}"; s = base; n = 2
            while s in used_ids: s = f'{base}-{n}'; n += 1
            used_ids.add(s)
            f = {'id': s, 'title': r['title'], 'year': r['year']}
            films.append(f); fkey[(key(r['title']), r['year'])].append(f); fkey[(skel(r['title']), r['year'])].append(f); added_films += 1
            f['srcList'] = True
        f['wl'] = r['page']
        for role in ('director', 'cast', 'music', 'producer'):
            names = [(clean_name(d), t) for d, t in r.get(role, [])]
            names = [(d, t) for d, t in names if d and not BAD.match(d) and len(d) > 2 and not re.search(r'\d', d)]
            if not names: continue
            have = f.get(role, [])
            have_keys = {key(people[q]['name']) for q in have if q in people}
            for d, t in names:
                if ORG.search(d):
                    if role == 'producer' or role == 'cast':
                        f.setdefault('studio', [])
                        if d not in f['studio']: f['studio'].append(d)
                    continue
                if d.islower(): d = d.title()
                q = find_person(d, t, role, r['year'])
                if q == 'AMBIG' or not q:
                    if q == 'AMBIG' or len(d.split()) == 1:  # a one-word credit we cannot identify: show the name, don't make a page
                        txt = f.setdefault(role + 'Text', [])
                        if d not in txt: txt.append(d); filled += 1
                        f.setdefault('_wlt', {}).setdefault(role, []).append(d)
                        continue
                    q = new_person(d, t)
                if q in have or key(people[q]['name']) in have_keys: continue
                have.append(q); have_keys.add(key(people[q]['name'])); filled += 1
                f.setdefault('_wl', {}).setdefault(role, []).append(q)
            if have: f[role] = have
        if r.get('genre') and not f.get('genre'):
            g = [x.strip().title() for x in re.split(r'[,/&]| and ', r['genre']) if x.strip() and len(x.strip()) < 25]
            if g: f['genre'] = g
        if r.get('studio') and not f.get('studio'):
            f['studio'] = [x.strip() for x in r['studio'].split(',') if x.strip()][:3]
        if r.get('release') and not f.get('date'):
            m = re.match(r'(\d{1,2})\s+([A-Za-z]+)', r['release'])
            months = {m_: i for i, m_ in enumerate(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'], 1)}
            if m and m.group(2)[:3].lower() in months:
                f['date'] = f"{r['year']}-{months[m.group(2)[:3].lower()]:02d}-{int(m.group(1)):02d}"
        if r.get('notes') and len(r['notes']) > 8: f.setdefault('note', r['notes'][:200])

# ---------- 4. Written descriptions + source-checked credits (src/data/cinema/about-src/*.json) ----------
ABOUT = {}
WRONG_ID = {'Q28600218', 'Q21934378', 'Q53567284', 'Q4805773'}  # Wikidata links to a namesake with no film work
TITLE_FIX = {'Q18127183': 'Lekhu Lekhu Lekhideli'}
CR_ROLES = {'director': 'director', 'cast': 'cast', 'music': 'music', 'producer': 'producer', 'story': 'writer', 'screenplay': 'writer',
            'dialogue': 'writer', 'cinematography': 'cinematographer', 'editing': 'editor'}
if args.about:
    src_of = {}
    for b in sorted(glob.glob(os.path.join(args.about, '..', 'bundles', 'batch_*.json'))):
        for e in json.load(open(b, encoding='utf-8')): src_of[e['key']] = e.get('src_urls', [])
    fby = {}
    for f in films: fby[f.get('q') or f['id']] = f
    ncred = 0
    for o in sorted(glob.glob(os.path.join(args.about, 'batch_*.json'))):
        for x in json.load(open(o, encoding='utf-8')):
            k = x['key']
            if k in WRONG_ID: continue
            if x.get('about') and x['about'].get('lead'):
                a = x['about']
                a['src'] = [{'label': 'Wikipedia (English)' if 'en.wikipedia' in u else 'ଓଡ଼ିଆ ଉଇକିପିଡ଼ିଆ (Odia Wikipedia)', 'url': u} for u in src_of.get(k, [])]
                a['sections'] = [sec for sec in a.get('sections', []) if sec.get('p')]
                body = ' '.join([a['lead']] + [t for sec in a['sections'] for t in sec['p']]).lower()
                # a "debut" fact must be backed by the written text itself
                a['facts'] = [fc for fc in a.get('facts', []) if not re.search(r'debut', fc[0], re.I) or re.search(r'debut|first film', body)]
                if not a['facts']: a.pop('facts')
                ABOUT[k] = a
            if k in people:
                if x.get('birthplace') and not people[k].get('birthplace'): people[k]['birthplace'] = x['birthplace']
                continue
            f = fby.get(k)
            if not f: continue
            if k in TITLE_FIX: f['title'] = TITLE_FIX[k]
            if x.get('odia_title') and not f.get('odia'): f['odia'] = x['odia_title']
            rd = x.get('release_date') or ''
            if re.fullmatch(r'\d{4}-\d{2}-\d{2}', rd) and not f.get('date') and (not f.get('year') or int(rd[:4]) == f['year']):
                f['date'] = rd
                if not f.get('year'): f['year'] = int(rd[:4])
            cr = x.get('credits_en') or {}
            grouped = collections.defaultdict(list)
            for ck, role in CR_ROLES.items():
                for n in cr.get(ck, []) or []:
                    n = re.sub(r'\s*\(.*?\)\s*', ' ', n).strip()
                    if n and n not in grouped[role] and not ORG.search(n): grouped[role].append(n)
            for role, names in grouped.items():
                listed = set((f.get('_wl') or {}).get(role, []))
                listed_t = set((f.get('_wlt') or {}).get(role, []))
                keys = {skel(n) for n in names}
                # drop names that came only from the year lists and that the article credits don't confirm
                f[role] = [q for q in f.get(role, []) if q not in listed or skel(people[q]['name']) in keys]
                if f.get(role + 'Text'):
                    f[role + 'Text'] = [t for t in f[role + 'Text'] if t not in listed_t or skel(t) in keys]
                have = {skel(people[q]['name']) for q in f[role] if q in people} | {skel(t) for t in f.get(role + 'Text', [])}
                for n in names:
                    if skel(n) in have: continue
                    q = find_person(n, None, role, f.get('year'))
                    if q == 'AMBIG' or not q:
                        if q == 'AMBIG' or len(n.split()) == 1:
                            f.setdefault(role + 'Text', []).append(n); have.add(skel(n)); continue
                        q = new_person(n, None)
                    if q not in f[role]: f[role].append(q); ncred += 1
                    have.add(skel(n))
                if not f[role]: del f[role]
                if role + 'Text' in f and not f[role + 'Text']: del f[role + 'Text']
            for ck, fld in (('lyrics', 'lyrics'), ('singers', 'singers')):
                v = [n for n in (cr.get(ck) or []) if n]
                if v: f[fld] = v
    for q in WRONG_ID:
        if q in people:
            for fld in ('wp', 'desc', 'birth', 'death', 'img', 'gallery', 'orwiki', 'birthplace', 'awards'): people[q].pop(fld, None)
            people[q]['unverified'] = True
    print(f'about: {len(ABOUT)} descriptions, +{ncred} source-checked credits')
for f in films:
    f.pop('_wl', None); f.pop('_wlt', None)
    if f['title'].startswith('Edit') and len(f['title']) > 5 and f['title'][4].isupper(): f['title'] = f['title'][4:]
    f['title'] = re.sub(r'(?i)filmodia$', '', f['title']).strip()
# films added from the lists that turn out to duplicate an existing film (after title clean-up)
seen, drop = {}, set()
for f in sorted(films, key=lambda f: bool(f.get('srcList'))):
    k = (loose(f['title']), f.get('year'))
    if k in seen and f.get('srcList'):
        a = seen[k]
        for fld, v in f.items():
            if fld in ('id', 'title', 'srcList'): continue
            if fld not in a: a[fld] = v
            elif isinstance(v, list): a[fld] = a[fld] + [x for x in v if x not in a[fld]]
        drop.add(f['id'])
    else:
        seen.setdefault(k, f)
films = [f for f in films if f['id'] not in drop]

# recount roles
for p in people.values(): p['roles'] = {}
for f in films:
    for role in ROLE_KEYS:
        for q in f.get(role, []):
            if q in people: people[q]['roles'][role] = people[q]['roles'].get(role, 0) + 1
people = {q: p for q, p in people.items() if p['roles']}
films.sort(key=lambda r: (r.get('year') or 9999, r.get('date') or '', r['title']))

print(f'lists: +{added_films} films, +{filled} credits; films {len(films)}, people {len(people)} '
      f'(from lists only: {sum(1 for p in people.values() if p["q"].startswith("W:"))}); '
      f'films without cast {sum(1 for f in films if not f.get("cast"))}, without director {sum(1 for f in films if not f.get("director"))}')

# ---------- 2/3. Wikidata extras + Commons photos ----------
FREE = re.compile(r'^(cc|public domain|pd|gfdl|attribution|free art|copyrighted free use|no restrictions|cc0)', re.I)
def clean_html(x):
    x = re.sub(r'<[^>]+>', '', x or ''); x = re.sub(r'\s+', ' ', x).strip()
    return x

if args.wd:
    W = json.load(open(args.wd, encoding='utf-8'))
    items, labels, info, cand = W['items'], W['labels'], W.get('imginfo', {}), W.get('cand', {})
    lab = lambda q: (labels.get(q) or [None])[0]
    def photos_for(q, name_tokens, exclude=()):
        out, seen = [], set(exclude)
        o = items.get(q, {})
        p18 = set(o.get('p18', []))
        catfiles = set(W.get('cats', {}).get(o.get('cat'), []) if o.get('cat') else [])
        for fn in cand.get(q, []):
            ii = info.get(fn)
            if not ii or not ii.get('thumb') or fn in seen: continue
            lic = clean_html(ii.get('lic'))
            if not lic or not FREE.match(lic): continue
            if (ii.get('W') or 0) < 250 or (ii.get('H') or 0) < 250: continue
            low = fn.lower()
            if not (fn in p18 or fn in catfiles or any(t in low for t in name_tokens)): continue
            if re.search(r'logo|poster|signature|autograph|map|flag|icon|stamp', low): continue
            seen.add(fn)
            cap = clean_html(ii.get('desc'))
            if re.search(r'[଀-୿]', cap) and len(cap) > 140: cap = ''
            out.append({'src': ii['thumb'].split('?')[0], 'w': ii.get('w'), 'h': ii.get('h'), 'page': ii.get('page'),
                        'licence': lic, 'credit': (clean_html(ii.get('by')) or 'Wikimedia Commons')[:80], 'caption': cap[:140] or None, '_f': fn})
        out.sort(key=lambda x: (x['_f'] not in p18, x['_f'] not in catfiles))
        for x in out:
            x.pop('_f')
            if not x['caption']: x.pop('caption')
        return out[:9]
    np = 0
    for q, p in people.items():
        o = items.get(q)
        if not o: continue
        if o.get('orwiki'): p['orwiki'] = o['orwiki']
        if o.get('P19') and lab(o['P19'][0]): p['birthplace'] = lab(o['P19'][0])
        aw = [lab(x) for x in o.get('P166', []) if lab(x)]
        if aw: p['awards'] = sorted(set(aw))
        toks = [t.lower() for t in re.split(r'\W+', p['name']) if len(t) >= 4]
        main = p.get('img', {}).get('src')
        ph = [x for x in photos_for(q, toks) if x['src'] != main]
        if ph: p['gallery'] = ph[:8]; np += 1
        if not p.get('img') and ph: p['img'] = p['gallery'].pop(0)
    nf = 0
    for f in films:
        o = items.get(f.get('q') or '')
        if not o: continue
        if o.get('orwiki'): f['orwiki'] = o['orwiki']
        toks = [t.lower() for t in re.split(r'\W+', f['title']) if len(t) >= 5]
        ph = photos_for(f['q'], toks)
        if ph: f['gallery'] = ph[:6]; nf += 1
    print(f'wikidata extras: people with extra photos {np}, films with photos {nf}, '
          f'people with photo {sum(1 for p in people.values() if p.get("img"))}')

# ---------- 5. data-derived summaries ----------
def nm(q): return people[q]['name']
def join(xs):
    xs = list(xs)
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' and ' + xs[-1]
films_of = collections.defaultdict(lambda: collections.defaultdict(list))
for f in films:
    for role in ROLE_KEYS:
        for q in f.get(role, []):
            if q in people: films_of[q][role].append(f)
NOUN = {'director': 'director', 'cast': 'actor', 'music': 'music director', 'producer': 'producer', 'writer': 'writer',
        'cinematographer': 'cinematographer', 'editor': 'film editor'}
for q, p in people.items():
    fo = films_of[q]
    allf = {f['id']: f for r in fo.values() for f in r}
    ys = sorted(f['year'] for f in allf.values() if f.get('year'))
    main = max(fo, key=lambda r: len(fo[r]))
    noun = NOUN[main] if not (main == 'cast' and p.get('g') == 'f') else 'actress'
    n = len(allf)
    pr = 'She' if p.get('g') == 'f' else 'He' if p.get('g') == 'm' else 'They'
    s1 = f"{p['name']} is credited on {n} Odia film{'s' if n != 1 else ''}"
    if ys: s1 += f" released between {ys[0]} and {ys[-1]}" if ys[0] != ys[-1] else f" released in {ys[0]}"
    roles = [f"{len(fo[r])} as {NOUN[r] if not (r == 'cast' and p.get('g') == 'f') else 'actress'}" for r in sorted(fo, key=lambda r: -len(fo[r]))]
    s1 += f" ({join(roles)})." if len(roles) > 1 else f", working as {('an ' if noun[0] in 'aeiou' else 'a ') + noun}."
    out = [s1]
    dated = sorted([f for f in allf.values() if f.get('year')], key=lambda f: (f['year'], f.get('date', '')))
    if len(dated) >= 2:
        out.append(f"The earliest film in our records is {dated[0]['title']} ({dated[0]['year']}) and the most recent is {dated[-1]['title']} ({dated[-1]['year']}).")
    elif len(dated) == 1:
        out.append(f"The film in our records is {dated[0]['title']} ({dated[0]['year']}).")
    # collaborators
    co = collections.Counter(); di = collections.Counter()
    for f in fo.get('cast', []):
        for x in f.get('cast', [])[:4]:
            if x != q and x in people: co[x] += 1
        for x in f.get('director', []):
            if x != q and x in people: di[x] += 1
    for f in fo.get('director', []):
        for x in f.get('cast', [])[:3]:
            if x != q and x in people: co[x] += 1
    bits = []
    top_d = [(x, c) for x, c in di.most_common(2) if c >= 2]
    top_c = [(x, c) for x, c in co.most_common(3) if c >= 2]
    if top_d: bits.append('directors ' + join(f"{nm(x)} ({c} films)" for x, c in top_d) if len(top_d) > 1 else f"director {nm(top_d[0][0])} ({top_d[0][1]} films)")
    if top_c: bits.append(('co-stars ' if fo.get('cast') else 'actors ') + join(f"{nm(x)} ({c} films)" for x, c in top_c))
    if bits: out.append(f"{p['name']} has worked most often with " + ' and with '.join(bits) + '.')
    if len(ys) >= 6:
        dec = collections.Counter(y // 10 * 10 for y in ys)
        busiest = max(dec, key=dec.get)
        out.append(f"The busiest decade was the {busiest}s, with {dec[busiest]} of these films.")
    p['auto'] = out

for f in films:
    def names_of(role):
        return [nm(q) for q in f.get(role, []) if q in people] + f.get(role + 'Text', [])
    d, c, m, pr_ = names_of('director'), names_of('cast'), names_of('music'), names_of('producer')
    out = []
    s1 = f"{f['title']} is {'a ' + str(f['year']) if f.get('year') else 'an'} Odia-language film"
    if d: s1 += f" directed by {join(d)}"
    out.append(s1 + '.')
    if c: out.append(f"The cast includes {', '.join(c[:6]) + ', among others' if len(c) > 6 else join(c)}.")
    if m: out.append(f"Its music was composed by {join(m)}.")
    if pr_: out.append(f"It was produced by {join(pr_)}.")
    if f.get('studio'): out.append(f"Production company: {join(f['studio'])}.")
    # director's nth film
    for q in f.get('director', [])[:1]:
        if q in people and f.get('year'):
            ds = sorted([x for x in films_of[q]['director'] if x.get('year')], key=lambda x: (x['year'], x.get('date', '')))
            if len(ds) >= 2 and f in ds:
                i = ds.index(f) + 1
                out.append(f"It is the {i}{'th' if 10 <= i % 100 <= 20 else {1:'st',2:'nd',3:'rd'}.get(i % 10, 'th')} of {len(ds)} Odia films directed by {nm(q)} in our records.")
    if f.get('awards'): out.append(f"Awards: {join(f['awards'])}.")
    f['auto'] = [' '.join(out[:2])] + ([' '.join(out[2:])] if out[2:] else [])

# ---------- write ----------
for q, p in people.items():
    if p.get('unverified'):
        ABOUT.pop(q, None)
        for fld in ('wp', 'desc', 'birth', 'death', 'img', 'gallery', 'orwiki', 'birthplace', 'awards'): p.pop(fld, None)
json.dump(ABOUT, open(os.path.join(OUT, 'about.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(films, open(os.path.join(OUT, 'films.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
json.dump(people, open(os.path.join(OUT, 'people.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
PUB = os.path.join(ROOT, 'public', 'data', 'cinema'); os.makedirs(PUB, exist_ok=True)
nm = lambda q: people[q]['name']
index = [[r['id'], r['title'], r.get('year') or 0, [nm(p) for p in r.get('director', [])], [nm(p) for p in r.get('cast', [])[:4]],
          [nm(p) for p in r.get('music', [])], r.get('genre', [])[:2], 1 if r.get('awards') else 0] for r in films]
json.dump({'fields': ['id', 'title', 'year', 'directors', 'cast', 'music', 'genre', 'awarded'], 'films': index},
          open(os.path.join(PUB, 'index.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
