# Builds src/data/elections.json: Odisha assembly (147) and Lok Sabha (21) constituencies — district, reservation,
# extent (Delimitation Order 2008), members elected since 1951 and candidate-wise results of recent elections.
# Source: Election Commission of India results and the Delimitation Order 2008, as compiled in the English Wikipedia
# articles for each constituency (CC BY-SA 4.0), fetched with the MediaWiki API → /home/claude/ext/new/odiapedia-wiki-lists.json
# Usage: python3 scripts/build-elections.py
import json, os, re

SRC = '/home/claude/ext/new/odiapedia-wiki-lists.json'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'elections.json')
W = json.load(open(SRC))
ARTICLES = W['__constituencies']

def strip_refs(s):
    s = re.sub(r'<ref[^>/]*/>', '', s)
    s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    return s

def plain(s):
    s = strip_refs(s or '')
    s = re.sub(r'\{\{(?:efn|cn|citation needed|sfn|refn)[^{}]*\}\}', '', s, flags=re.I)
    s = re.sub(r'\{\{(?:party name with color|full party name with color|party color cell)\|(?:[^|{}]*=[^|{}]*\|)*([^|{}]*)\}\}', r'\1', s, flags=re.I)
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s)
    s = re.sub(r'\{\{[^{}]*\}\}', '', s)
    s = re.sub(r"'''?|<[^>]+>", '', s)
    return re.sub(r'\s+', ' ', s).strip()

def num(s):
    s = re.sub(r'[^\d.]', '', plain(s))
    try:
        return float(s) if '.' in s else int(s)
    except ValueError:
        return None

def templates(text, name_re):
    """Yield (name, body) for top-level-ish templates whose name matches, handling nesting."""
    out = []
    for m in re.finditer(r'\{\{\s*(' + name_re + r')\s*\|', text, flags=re.I):
        i, depth = m.start(), 0
        j = i
        while j < len(text):
            if text.startswith('{{', j):
                depth += 1; j += 2; continue
            if text.startswith('}}', j):
                depth -= 1; j += 2
                if depth == 0:
                    break
                continue
            j += 1
        out.append((m.group(1), text[m.end():j - 2], m.start()))
    return out

def params(body):
    # split on top-level pipes
    parts, depth, cur = [], 0, ''
    k = 0
    while k < len(body):
        if body.startswith('{{', k) or body.startswith('[[', k):
            depth += 1; cur += body[k:k + 2]; k += 2; continue
        if body.startswith('}}', k) or body.startswith(']]', k):
            depth -= 1; cur += body[k:k + 2]; k += 2; continue
        if body[k] == '|' and depth == 0:
            parts.append(cur); cur = ''; k += 1; continue
        cur += body[k]; k += 1
    parts.append(cur)
    d = {}
    for p in parts:
        if '=' in p:
            a, b = p.split('=', 1)
            d[a.strip().lower()] = b.strip()
    return d

def infobox(t):
    tb = templates(t, r'Infobox Indian constituency|Infobox constituency')
    return params(tb[0][1]) if tb else {}

def extent_text(t):
    body = strip_refs(t)
    m = re.search(r"(?:This constituency includes|Area of this constituency includes|This constituency consists of|It (?:includes|comprises|consists of)|The constituency (?:includes|comprises|consists of)|Extent of [^:\n]*:?)\s*(.+?)(?:\n\n|\n==)", body, flags=re.S | re.I)
    return plain(m.group(1)) if m else ''

def extent(t):
    m = re.search(r'==\s*(?:Extent[^=]*|Area[^=]*|Assembly segments|Assembly Segments|Vidhan Sabha segments[^=]*|Segments[^=]*)\s*==(.*?)(?=\n==[^=])', t, flags=re.S | re.I)
    if not m:
        return []
    body = strip_refs(m.group(1))
    return [plain(x) for x in re.findall(r'^\*+\s*(.+)$', body, flags=re.M) if plain(x)]

def boxes(t):
    res = []
    starts = [(m.start(), m.end()) for m in re.finditer(r'\{\{\s*Election box begin', t, flags=re.I)]
    for s0, _ in starts:
        e = t.find('Election box end', s0)
        if e < 0:
            continue
        chunk = t[s0:e]
        head = templates(chunk, r'Election box begin(?: no change)?')
        title = plain(params(head[0][1]).get('title', '')) if head else ''
        ym = re.search(r'(19|20)\d\d', title)
        if not ym:
            continue
        cands = []
        for name, body, _ in templates(chunk, r'Election box (?:winning )?candidate(?: with party link)?(?: no change)?|Election box candidate for alliance'):
            p = params(body)
            cands.append({'name': plain(p.get('candidate', '')), 'party': plain(p.get('party', '')), 'votes': num(p.get('votes', '')),
                          'pct': num(p.get('percentage', '')), 'won': 'winning' in name.lower()})
        cands = [c for c in cands if c['name']]
        if not cands:
            continue
        rec = {'title': title, 'year': int(ym.group(0)), 'bypoll': bool(re.search(r'by-?\s?(?:election|poll)', title, re.I)), 'candidates': cands}
        for key, nm in (('majority', r'Election box majority'), ('turnout', r'Election box turnout'), ('electors', r'Election box registered electors')):
            tb = templates(chunk, nm)
            if tb:
                p = params(tb[0][1])
                rec[key] = {'votes': num(p.get('votes', '')), 'pct': num(p.get('percentage', ''))}
        if not any(c['won'] for c in cands):
            top = max(cands, key=lambda c: c['votes'] or 0)
            top['won'] = True
        res.append(rec)
    return res

def members(t):
    """Parse the members table (Year | Member | Party) with rowspans."""
    m = re.search(r'\{\|[^\n]*wikitable[^\n]*\n(?:(?!\|\}).)*?!\s*(?:Year|Election)(?:(?!\|\}).)*?\|\}', t, flags=re.S)
    if not m:
        return []
    tbl = strip_refs(m.group(0))
    tbl = re.sub(r'\{\{\s*(?:full party name with color|party name with color|party color cell)\s*\|((?:[^{}]|\{\{[^{}]*\}\})*)\}\}',
                 lambda mm: ('rowspan=' + re.search(r'rowspan\s*=\s*"?(\d+)', mm.group(1)).group(1) + '|' if re.search(r'rowspan\s*=\s*"?(\d+)', mm.group(1)) else '') + next((x for x in re.sub(r'(?:rowspan|colspan)\s*=\s*"?\d+"?\|?', '', mm.group(1)).split('|') if x.strip() and '=' not in x), ''),
                 tbl, flags=re.I)
    rows = re.split(r'\n\|-[^\n]*', tbl)
    header = None
    grid, pending = [], {}
    for r in rows:
        lines = [l for l in r.strip().split('\n') if l.strip() and not l.startswith('{|') and not l.startswith('|}')]
        if not lines:
            continue
        if all(l.startswith('!') for l in lines):
            hdr = []
            for l in lines:
                hdr += [plain(re.sub(r'^[^|]*=[^|]*\|', '', h)) for h in l.lstrip('!').split('!!')]
            header = [h.lower() for h in hdr]
            continue
        cells = []
        for l in lines:
            if l.startswith('!') or l.startswith('|'):
                for c in re.split(r'\|\|', l[1:]):
                    cells.append(c)
            elif cells:
                cells[-1] += ' ' + l
        row, col = [], 0
        cells = list(cells)
        out = []
        ci = 0
        while ci < len(cells) or col in pending:
            if col in pending:
                val, left = pending[col]
                out.append(val)
                if left > 1:
                    pending[col] = (val, left - 1)
                else:
                    del pending[col]
                col += 1
                continue
            c = cells[ci]; ci += 1
            rs = re.match(r'\s*((?:\w+\s*=\s*"?[^|"]*"?\s*)+)\|(.*)$', c, flags=re.S)
            span = 1
            if rs and not rs.group(1).strip().startswith('[['):
                sm = re.search(r'rowspan\s*=\s*"?(\d+)', rs.group(1))
                span = int(sm.group(1)) if sm else 1
                c = rs.group(2)
            val = plain(c)
            out.append(val)
            if span > 1:
                pending[col] = (val, span - 1)
            col += 1
        grid.append(out)
    res = []
    for g in grid:
        if not g:
            continue
        ym = re.search(r'((?:19|20)\d\d)', g[0])
        if not ym:
            continue
        member = g[1] if len(g) > 1 else ''
        party = g[-1] if len(g) > 2 else ''
        if party in ('', member):
            party = g[2] if len(g) > 2 else ''
        party = re.sub(r'^\w+=\w+$', '', party)
        res.append({'year': re.sub(r'^[|\s]+', '', g[0]), 'member': member, 'party': party})
    return res

def slugify(s):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))

lst = W['List_of_constituencies_of_the_Odisha_Legislative_Assembly']
order = []
for m in re.finditer(r'\n\|\s*(\d+)\s*\n\|\s*\[\[([^\]|]+Assembly constituency)', lst):
    order.append((int(m.group(1)), m.group(2)))
acs, pcs = [], []
for no, title in order:
    t = ARTICLES.get(title, '')
    ib = infobox(t)
    name = plain(ib.get('name', '')) or title.replace(' Assembly constituency', '')
    acs.append({'no': no, 'name': name, 'slug': slugify(name), 'wiki': title, 'district': plain(ib.get('district', '')),
                'pc': plain(ib.get('loksabha_cons', '')).replace(' (Lok Sabha constituency)', ''), 'reservation': plain(ib.get('reservation', '')) or 'None',
                'electors': num(ib.get('electors', '')), 'established': plain(ib.get('established', '')),
                'extent': extent(t), 'extentText': extent_text(t), 'members': members(t), 'results': boxes(t)})
for title, t in ARTICLES.items():
    if not title.endswith('Lok Sabha constituency'):
        continue
    ib = infobox(t)
    name = title.replace(' Lok Sabha constituency', '')
    pcs.append({'no': num(ib.get('constituency_no', '')), 'name': name, 'slug': slugify(name), 'wiki': title, 'reservation': plain(ib.get('reservation', '')) or 'None',
                'electors': num(ib.get('electors', '')), 'established': plain(ib.get('established', '')),
                'segments': extent(t), 'members': members(t), 'results': boxes(t)})
pcs.sort(key=lambda p: p['no'] or 99)

# --- Cross-check against the statewide results tables, which are more carefully maintained -----------------
import sys
sys.path.insert(0, os.path.dirname(__file__))
from election_summary import summary
def key(n):
    return re.sub(r'[^a-z]', '', n.lower())
def reconcile(seats, year, table, by):
    fixed = 0
    for seat in seats:
        row = table.get(by(seat))
        if not row:
            continue
        r = next((x for x in seat['results'] if x['year'] == year and not x['bypoll']), None)
        w = row['winner']
        ok = False
        if r:
            win = next((c for c in r['candidates'] if c['won']), None)
            ok = bool(win) and (key(win['name'])[:6] == key(w[0])[:6] or win['votes'] == w[2]) and win['party'].split(' (')[0] == w[1].split(' (')[0]
        if not ok:
            fixed += 1
            new = {'title': f'{year}', 'year': year, 'bypoll': False, 'partial': True,
                   'candidates': [{'name': w[0], 'party': w[1], 'votes': w[2], 'pct': w[3], 'won': True},
                                  {'name': row['runner'][0], 'party': row['runner'][1], 'votes': row['runner'][2], 'pct': row['runner'][3], 'won': False}],
                   'majority': {'votes': row['margin'], 'pct': None}}
            seat['results'] = [x for x in seat['results'] if not (x['year'] == year and not x['bypoll'])] + [new]
            for m in seat['members']:
                if m['year'].strip() == str(year):
                    m['member'], m['party'] = w[0], w[1]
    return fixed
ac_no = lambda a: a['no']
print('fixed AC 2024:', reconcile(acs, 2024, summary(W['2024_Odisha_Legislative_Assembly_election'], plain, num), ac_no))
pc_rank = {p['name']: i for i, p in enumerate(sorted(pcs, key=lambda p: min([a['no'] for a in acs if key(a['pc']) == key(p['name'])] or [999])), 1)}
for y in (2024, 2019):
    print(f'fixed PC {y}:', reconcile(pcs, y, summary(W[f'{y}_Indian_general_election_in_Odisha'], plain, num), lambda p: pc_rank[p['name']]))
# vote shares recomputed from votes where the total is known
for seat in acs + pcs:
    for r in seat['results']:
        tot = (r.get('turnout') or {}).get('votes')
        s_ = sum(c['votes'] or 0 for c in r['candidates'])
        if tot and s_ and s_ <= tot * 1.001 and all(c['votes'] for c in r['candidates']):
            for c in r['candidates']:
                c['pct'] = round(c['votes'] / tot * 100, 2)
        elif not r.get('partial'):
            pcts = [c['pct'] or 0 for c in r['candidates']]
            if sum(pcts) > 101.5:
                r['pctUnreliable'] = True
json.dump({'source': 'Election Commission of India results and the Delimitation of Parliamentary and Assembly Constituencies Order, 2008, as compiled in Wikipedia (CC BY-SA 4.0)',
           'assembly': acs, 'loksabha': pcs}, open(OUT, 'w'), separators=(',', ':'), ensure_ascii=False)
print(len(acs), 'assembly;', len(pcs), 'lok sabha')
print('AC with results', sum(1 for a in acs if a['results']), 'with members', sum(1 for a in acs if a['members']), 'with extent', sum(1 for a in acs if a['extent']))
print('PC with results', sum(1 for a in pcs if a['results']), 'with members', sum(1 for a in pcs if a['members']), 'with segments', sum(1 for a in pcs if a['segments']))
