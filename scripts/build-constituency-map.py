# Maps gram panchayats and towns to assembly constituencies by reading each constituency's extent
# (Delimitation Order 2008, as written in src/data/elections.json) against the LGD blocks and GPs in src/data/admin.
# Output: src/data/constituency-map.json  {district: {"gp": {"blockCode:gpCode": acNo}, "ulb": {ulbCode: acNo}}}
# Usage: python3 scripts/build-constituency-map.py
import difflib, json, os, re
ROOT = os.path.join(os.path.dirname(__file__), '..')
E_ = json.load(open(os.path.join(ROOT, 'src', 'data', 'elections.json')))
DIST = {'angul': 'angul', 'anugul': 'angul', 'balangir': 'balangir', 'bolangir': 'balangir', 'balasore': 'balasore', 'baleswar': 'balasore', 'baleshwar': 'balasore',
        'bargarh': 'bargarh', 'baragada': 'bargarh', 'bhadrak': 'bhadrak', 'boudh': 'boudh', 'baudh': 'boudh', 'cuttack': 'cuttack', 'deogarh': 'deogarh', 'debagarh': 'deogarh', 'dhenkanal': 'dhenkanal',
        'gajapati': 'gajapati', 'ganjam': 'ganjam', 'jagatsinghpur': 'jagatsinghpur', 'jagatsinghapur': 'jagatsinghpur', 'jajpur': 'jajpur', 'jharsuguda': 'jharsuguda',
        'kalahandi': 'kalahandi', 'kandhamal': 'kandhamal', 'kendrapara': 'kendrapara', 'keonjhar': 'kendujhar', 'kendujhar': 'kendujhar', 'khordha': 'khordha', 'khurda': 'khordha',
        'koraput': 'koraput', 'malkangiri': 'malkangiri', 'mayurbhanj': 'mayurbhanj', 'nabarangpur': 'nabarangpur', 'nabarangapur': 'nabarangpur', 'nayagarh': 'nayagarh',
        'nuapada': 'nuapada', 'puri': 'puri', 'rayagada': 'rayagada', 'sambalpur': 'sambalpur', 'subarnapur': 'subarnapur', 'sonepur': 'subarnapur', 'sundargarh': 'sundargarh'}

def norm(s):
    s = s.lower()
    s = re.sub(r'\b(sadar|block|gp|gps|nac|municipality|m\.?)\b', '', s)
    s = re.sub(r'[^a-z]', '', s)
    for a, b in (('aa', 'a'), ('ee', 'i'), ('oo', 'u'), ('w', 'b'), ('v', 'b'), ('th', 't'), ('dh', 'd'), ('bh', 'b'), ('kh', 'k'), ('gh', 'g'), ('ph', 'p'), ('jh', 'j'), ('chh', 'ch'), ('sh', 's'), ('y', 'j'), ('z', 'j')):
        s = s.replace(a, b)
    return re.sub(r'(.)\1+', r'\1', s)

def best(name, options, cutoff=0.8):
    n = norm(name)
    if not n:
        return None
    exact = [o for o in options if norm(o[0]) == n]
    if exact:
        return exact[0]
    scored = sorted(((difflib.SequenceMatcher(None, n, norm(o[0])).ratio(), o) for o in options), key=lambda x: -x[0])
    return scored[0][1] if scored and scored[0][0] >= cutoff else None

admin = {}
for f in os.listdir(os.path.join(ROOT, 'src', 'data', 'admin')):
    if not f.startswith('_'):
        admin[f[:-5]] = json.load(open(os.path.join(ROOT, 'src', 'data', 'admin', f)))

out = {d: {'gp': {}, 'ulb': {}} for d in admin}
stats = {'acs': 0, 'parsed': 0}
for ac in E_['assembly']:
    stats['acs'] += 1
    d = DIST.get(re.sub(r'[^a-z]', '', ac['district'].lower().replace('district', '')))
    if not d:
        continue
    a = admin[d]
    blocks = [(b['name'], b) for b in a['blocks'] if b['code'] != '0']
    text = ac['extentText'] or ' ; '.join(ac['extent'])
    text = text.replace('Gram panchayats', 'GPs').replace('Gram Panchayats', 'GPs').replace('gram panchayats', 'GPs').replace('Panchayats', 'GPs')
    used = False
    # explicit GP lists: "N GPs (A, B and C) of X block"
    for m in re.finditer(r'(?:\d+\s*)?GPs?\s*\(([^)]*)\)\s*(?:of|in|under)\s+([A-Za-z.\- ]+?)\s+[Bb]lock', text):
        b = best(m.group(2), blocks)
        if not b:
            continue
        gps = [(g['name'], g) for g in b[1]['gps'] if g['code'] != '0']
        for nm in re.split(r',|\band\b', m.group(1)):
            g = best(nm.strip(), gps, 0.78)
            if g:
                out[d]['gp'][b[1]['code'] + ':' + g[1]['code']] = ac['no']; used = True
    # bullet form: "X Block : A, B and C GPs"
    for m in re.finditer(r'([A-Za-z.\- ]+?)\s+[Bb]lock\s*[:\-]\s*([^*;]+?)\s*GPs', text):
        b = best(m.group(1), blocks)
        if not b:
            continue
        gps = [(g['name'], g) for g in b[1]['gps'] if g['code'] != '0']
        for nm in re.split(r',|\band\b', m.group(2)):
            g = best(nm.strip(), gps, 0.78)
            if g:
                out[d]['gp'][b[1]['code'] + ':' + g[1]['code']] = ac['no']; used = True
    rest = re.sub(r'(?:\d+\s*)?GPs?\s*\([^)]*\)\s*(?:of|in|under)\s+[A-Za-z.\- ]+?\s+[Bb]lock', ' ', text)
    rest = re.sub(r'[A-Za-z.\- ]+?\s+[Bb]lock\s*[:\-]\s*[^*;]+?\s*GPs', ' ', rest)
    # whole blocks
    for m in re.finditer(r'(?:all\s+\d+\s+GPs\s+of\s+)?([A-Z][A-Za-z.\-]+(?:\s+[A-Z][A-Za-z.\-]+)?)\s+[Bb]lock', rest):
        b = best(m.group(1), blocks)
        if not b:
            continue
        for g in b[1]['gps']:
            if g['code'] != '0':
                out[d]['gp'].setdefault('block:' + b[1]['code'] + ':' + g['code'], ac['no'])
        used = True
    # towns (statutory ULBs named in the extent)
    ulbs = [(u['name'], u) for u in a['ulbs']]
    for tok in re.split(r',|;|\band\b|\*|\(|\)', rest):
        tok = re.sub(r'\b(NAC|Municipality|Muncipalty|Municipal Corporation|M\.?Corp\.?|town|including.*)$', '', tok.strip(), flags=re.I).strip(' .')
        if not tok or re.search(r'block|ward', tok, re.I) or len(tok) > 30:
            continue
        u = best(tok, ulbs, 0.88)
        if u:
            out[d]['ulb'][u[1]['code']] = ac['no']; used = True
    stats['parsed'] += used
# explicit GP assignments win over whole-block ones
total = mapped = 0
for d, m in out.items():
    final = {}
    for k, v in m['gp'].items():
        if k.startswith('block:'):
            final.setdefault(k[6:], v)
    for k, v in m['gp'].items():
        if not k.startswith('block:'):
            final[k] = v
    m['gp'] = final
    for b in admin[d]['blocks']:
        for g in b['gps']:
            if g['code'] != '0':
                total += 1
                mapped += (b['code'] + ':' + g['code']) in final
json.dump(out, open(os.path.join(ROOT, 'src', 'data', 'constituency-map.json'), 'w'), separators=(',', ':'))
print(stats, f'GPs mapped {mapped}/{total} ({mapped / total:.1%})', 'ULBs mapped', sum(len(m['ulb']) for m in out.values()))
