"""Parse English Wikipedia 'List of Odia films of YEAR' wikitables into rows.

Usage: python3 scripts/parse_film_lists.py enwiki.json out.json
Each row: {year, title, title_link, director:[...], cast:[...], music:[...], genre, studio, release, page}
Names keep their wiki-link target where present so they can be matched to people.
"""
import json, re, sys

def strip_refs(s):
    s = re.sub(r'<ref[^>/]*/>', '', s)
    s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    return s

def drop_templates(s):
    # remove {{...}} (nested) except keep content of a few
    out, depth, i = [], 0, 0
    while i < len(s):
        if s.startswith('{{', i): depth += 1; i += 2; continue
        if s.startswith('}}', i) and depth: depth -= 1; i += 2; continue
        if depth == 0: out.append(s[i])
        i += 1
    return ''.join(out)

LINK = re.compile(r'\[\[([^\]|]+)(?:\|([^\]]+))?\]\]')

def names(cell):
    """Split a cast/crew cell into [(display, link_target or None)]."""
    cell = strip_refs(cell)
    cell = drop_templates(cell)
    cell = re.sub(r'<br\s*/?>', ',', cell, flags=re.I)
    cell = re.sub(r"'''?", '', cell)
    # protect links
    links = []
    def keep(m):
        links.append((m.group(2) or m.group(1)).strip()); tgt = m.group(1).strip()
        links[-1] = (links[-1], tgt); return f'\x00{len(links)-1}\x00'
    cell = LINK.sub(keep, cell)
    parts = re.split(r',|;|\band\b|&|\n|\*', cell)
    res = []
    for p in parts:
        p = p.strip(' .:-–()')
        if not p: continue
        m = re.fullmatch(r'\x00(\d+)\x00', p)
        if m:
            d, t = links[int(m.group(1))]; res.append((d, t)); continue
        # text with embedded links: take each link separately + rest
        for lm in re.finditer(r'\x00(\d+)\x00', p):
            d, t = links[int(lm.group(1))]; res.append((d, t))
        rest = re.sub(r'\x00\d+\x00', ' ', p).strip(' .:-–()')
        rest = re.sub(r'<[^>]+>', '', rest).strip()
        if rest and not re.search(r'\x00', rest) and len(rest) < 60 and not re.fullmatch(r'[\d\s]+', rest):
            res.append((re.sub(r'\s+', ' ', rest), None))
    return [r for r in res if r[0] and not r[0].lower().startswith(('file:', 'category:'))]

def plain(cell):
    cell = strip_refs(cell); cell = drop_templates(cell)
    cell = LINK.sub(lambda m: (m.group(2) or m.group(1)), cell)
    cell = re.sub(r"'''?", '', cell); cell = re.sub(r'<br\s*/?>', ' ', cell, flags=re.I)
    cell = re.sub(r'<[^>]+>', '', cell)
    return re.sub(r'\s+', ' ', cell).strip()

def split_attrs(c):
    # "attr=... | content" -> (attrs, content); careful with [[a|b]]
    depth = 0
    for i, ch in enumerate(c):
        if c.startswith('[[', i) or c.startswith('{{', i): depth += 1
        elif c.startswith(']]', i) or c.startswith('}}', i): depth -= 1
        elif ch == '|' and depth == 0 and not c.startswith('||', i):
            a = c[:i]
            if re.search(r'(rowspan|colspan|style|class|align|width|bgcolor)\s*=', a): return a, c[i+1:]
            return '', c
    return '', c

def split_cells(line, sep):
    # split on sep ('||' or '!!') outside links/templates
    out, depth, cur, i = [], 0, '', 0
    while i < len(line):
        if line.startswith('[[', i) or line.startswith('{{', i): depth += 1; cur += line[i:i+2]; i += 2; continue
        if (line.startswith(']]', i) or line.startswith('}}', i)) and depth: depth -= 1; cur += line[i:i+2]; i += 2; continue
        if depth == 0 and line.startswith(sep, i): out.append(cur); cur = ''; i += 2; continue
        cur += line[i]; i += 1
    out.append(cur); return out

def parse_table(tbl):
    rows, cur = [], None
    for raw in tbl.split('\n'):
        line = raw.rstrip()
        if line.startswith('{|'): continue
        if line.startswith('|}'): break
        if line.startswith('|-'):
            cur = []; rows.append(cur); continue
        if cur is None: cur = []; rows.append(cur)
        if line.startswith('!'):
            for c in split_cells(line[1:], '!!'):
                a, v = split_attrs(c); cur.append(('h', a, v))
        elif line.startswith('|+'):
            continue
        elif line.startswith('|'):
            for c in split_cells(line[1:], '||'):
                a, v = split_attrs(c); cur.append(('d', a, v))
        elif cur:
            k, a, v = cur[-1]; cur[-1] = (k, a, v + '\n' + line)
    rows = [r for r in rows if r]
    # header: first row with header cells
    header, body = None, []
    for r in rows:
        if header is None and any(k == 'h' for k, _, _ in r) and sum(k == 'h' for k, _, _ in r) >= 3:
            header = []
            for k, a, v in r:
                span = int((re.search(r'colspan\s*=\s*"?(\d+)', a) or [0, 1])[1])
                header += [plain(v).lower()] * span
        elif header is not None:
            body.append(r)
    if not header: return []
    grid, pending = [], {}
    for r in body:
        cells = [c for c in r if c[0] == 'd']
        if not cells: continue
        row, ci, it = [], 0, iter(cells)
        width = len(header)
        while ci < width:
            if ci in pending and pending[ci][0] > 0:
                row.append(pending[ci][1]); pending[ci] = (pending[ci][0] - 1, pending[ci][1]); ci += 1; continue
            try: k, a, v = next(it)
            except StopIteration: break
            rs = int((re.search(r'rowspan\s*=\s*"?(\d+)', a) or [0, 1])[1])
            cs = int((re.search(r'colspan\s*=\s*"?(\d+)', a) or [0, 1])[1])
            for _ in range(cs):
                row.append(v)
                if rs > 1: pending[ci] = (rs - 1, v)
                ci += 1
        grid.append(row)
    res = []
    for g in grid:
        d = {}
        for h, v in zip(header, g):
            d[h] = d[h] + ' || ' + v if h in d else v
        res.append(d)
    return res

def col(row, *keys):
    for h, v in row.items():
        if any(k in h for k in keys): return v
    return None

def main(src, dst):
    d = json.load(open(src))
    out = []
    for page, rec in d.items():
        m = re.fullmatch(r'List of Odia films of (\d{4})', page)
        if not m: continue
        year = int(m.group(1)); text = rec['text']
        for tm in re.finditer(r'\{\|.*?\n\|\}', text, flags=re.S):
            for row in parse_table(tm.group(0)):
                t = col(row, 'title', 'film', 'name')
                if not t or 'year header' in t.lower(): continue
                tl = None
                lm = LINK.search(strip_refs(t))
                if lm: tl = lm.group(1).strip()
                title = re.sub(r"\s*'+\s*$", '', plain(t)).strip(" '\"")
                # "ଓଡ଼ିଆ<br>[[English]]" -> keep latin part
                if re.search(r'[଀-୿]', title) and re.search(r'[A-Za-z]', title):
                    title = re.sub(r'[଀-୿]+\s*', '', title).strip()
                title = re.sub(r"\s*'+\s*$", '', title).strip(" '\"")
                if not title or len(title) > 80: continue
                r = {'year': year, 'title': title, 'page': page}
                if tl: r['title_link'] = tl
                for key, cols in [('director', ('director',)), ('cast', ('cast', 'starring', 'actor')), ('music', ('music', 'composer')),
                                  ('producer', ('producer',))]:
                    v = col(row, *cols)
                    if v: 
                        n = names(v)
                        if n: r[key] = n
                for key, cols in [('genre', ('genre',)), ('studio', ('studio', 'production', 'banner')), ('release', ('release',)), ('notes', ('note',))]:
                    v = col(row, *cols)
                    if v and plain(v): r[key] = plain(v)
                op = row.get('opening')
                if op and 'release' not in r:
                    parts = [plain(x) for x in op.split(' || ')]
                    parts = [re.sub(r'^(?:[A-Z] )+[A-Z]$', lambda m: m.group(0).replace(' ', ''), x) for x in parts]
                    if len(parts) == 2 and parts[1].isdigit(): r['release'] = f"{parts[1]} {parts[0].title()} {year}"
                out.append(r)
    json.dump(out, open(dst, 'w'), ensure_ascii=False, indent=0)
    print('rows', len(out), 'years', len({r['year'] for r in out}), 'with cast', sum(1 for r in out if r.get('cast')), 'with director', sum(1 for r in out if r.get('director')))

if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
