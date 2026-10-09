# Builds src/data/literary-awards.json: Odia winners of the Jnanpith Award, Saraswati Samman, Sahitya Akademi Award
# and the Odisha Sahitya Akademi Award, from the corresponding English Wikipedia lists (CC BY-SA 4.0), which cite
# the awarding bodies. Input: /home/claude/ext/new/odiapedia-wiki-lists.json
import json, os, re
W = json.load(open('/home/claude/ext/new/odiapedia-wiki-lists.json'))
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'literary-awards.json')

def plain(s):
    s = re.sub(r'<ref[^>/]*/>|<ref[^>]*>.*?</ref>|<!--.*?-->', '', s or '', flags=re.S)
    s = re.sub(r'\{\{(?:dagger|efn|small)[^{}]*\}\}', '', s, flags=re.I)
    s = re.sub(r'\{\{sortname\|([^|}]+)\|([^|}]+)[^}]*\}\}', r'\1 \2', s)
    s = re.sub(r'\[\[(?:File|Image):[^\]]*\]\]', '', s)
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    s = re.sub(r"'''?|<[^>]+>", ' ', s)
    return re.sub(r'\s+', ' ', s).strip(' "')

def link(s):
    m = re.search(r'\[\[([^\]|]+)', s or '')
    return m.group(1) if m else ''

def rows(table):
    out = []
    for r in re.split(r'\n\|-[^\n]*', table):
        cells = []
        for line in r.split('\n'):
            line = line.strip()
            if not line or line[0] not in '|!' or line.startswith('{|') or line.startswith('|}') or line.startswith('|+'):
                continue
            for c in re.split(r'\|\||!!', line[1:]):
                c = re.sub(r'^\s*(?:scope|style|rowspan|colspan|align)[^|\[]*\|', '', c)
                cells.append(c.strip())
        if cells:
            out.append(cells)
    return out

res = {}
# Sahitya Akademi Award (Odia)
t = W['List_of_Sahitya_Akademi_Award_winners_for_Odia']
sa = []
for tbl in re.findall(r'\{\|[^\n]*wikitable[^\n]*\n.*?\n\|\}', t, flags=re.S):
    for c in rows(tbl):
        if len(c) >= 3 and re.fullmatch(r'\d{4}', plain(c[0])):
            sa.append({'year': int(plain(c[0])), 'author': plain(c[1]), 'wiki': link(c[1]), 'work': plain(c[2]), 'category': plain(c[3]) if len(c) > 3 else '',
                       'posthumous': 'dagger' in c[1]})
res['sahityaAkademi'] = sa
# Jnanpith (Odia)
t = W['Jnanpith_Award']; jn = []
for x in re.finditer(r'\{\{sort\|Odia', t):
    seg = t[:x.start()]
    year = None
    for r in reversed(seg.split('\n|-')[-3:]):
        y = re.search(r'\|\s*(\d{4})\s*<br', r)
        if y:
            year = int(y.group(1)); break
    name = re.findall(r'\{\{sortname\|([^|}]+)\|([^|}]+)', seg)[-1]
    after = t[x.end():].split('\n')
    work = plain(after[1].lstrip('|')) if len(after) > 1 else ''
    jn.append({'year': year, 'author': f'{name[0]} {name[1]}', 'wiki': f'{name[0]} {name[1]}', 'work': work})
res['jnanpith'] = jn
# Saraswati Samman (Odia)
ss = []
for line in W['Saraswati_Samman'].split('|-'):
    if 'Odia' in line:
        c = [x.strip() for x in line.strip().lstrip('|').split('||')]
        if len(c) >= 4 and re.search(r'\d{4}', c[0]):
            work = plain(c[3]); m = re.match(r'(.*?)\s*\((.*)\)$', work)
            ss.append({'year': int(re.search(r'\d{4}', c[0]).group(0)), 'author': plain(c[2]), 'wiki': link(c[2]), 'work': (m.group(1) if m else work).strip(' "'), 'category': m.group(2) if m else ''})
res['saraswati'] = ss
# Odisha Sahitya Akademi Award (books, grouped by the period headings)
t = W['Odisha_Sahitya_Akademi_Award']; osa = []
for m in re.finditer(r'\{\|[^\n]*wikitable[^\n]*\n(.*?)\n\|\}', t, flags=re.S):
    cap = re.search(r'^\|\+\s*(.+)$', m.group(1), flags=re.M)
    period = plain(cap.group(1)) if cap else ''
    for c in rows(m.group(0)):
        if len(c) >= 4 and re.fullmatch(r'\d+', plain(c[0])):
            osa.append({'no': int(plain(c[0])), 'period': period, 'work': plain(c[1]), 'author': plain(c[2]), 'wiki': link(c[2]), 'category': plain(c[3])})
res['odishaSahityaAkademi'] = osa
res['source'] = 'Wikipedia lists of Jnanpith Award, Saraswati Samman, Sahitya Akademi Award (Odia) and Odisha Sahitya Akademi Award winners (CC BY-SA 4.0), which cite the awarding bodies'
json.dump(res, open(OUT, 'w'), ensure_ascii=False, indent=0)
print({k: len(v) for k, v in res.items() if isinstance(v, list)})
print(jn, ss[:2], sa[-3:], osa[:2], osa[-2:])
