# Builds src/data/census/_areas.json: Census 2011 Primary Census Abstract totals for each district
# (total / rural / urban), each sub-district, and each town (statutory towns and census towns),
# with the number of wards per town.
#
# Input: the same PCA "town, village and ward level" workbooks as scripts/build-census.py
#   (Census of India, https://censusindia.gov.in/nada/index.php/catalog/6561 … 6590) → /home/claude/ext/pca/<id>.xlsx
# Usage: python3 scripts/build-census-areas.py
import glob, json, os, re, collections
import openpyxl

PCA = '/home/claude/ext/pca'
ADMIN = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'admin')
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'census', '_areas.json')
FIELDS = ['No_HH', 'TOT_P', 'TOT_M', 'TOT_F', 'P_06', 'P_SC', 'P_ST', 'P_LIT', 'M_LIT', 'F_LIT',
          'TOT_WORK_P', 'MAINWORK_P', 'MAIN_CL_P', 'MAIN_AL_P', 'MAIN_HH_P', 'MAIN_OT_P', 'MARGWORK_P', 'NON_WORK_P',
          'M_06', 'F_06']
TYPES = {'CT': 'Census town', 'NAC': 'Notified Area Council', 'M': 'Municipality', 'M Corp.': 'Municipal Corporation',
         'ITS': 'Industrial township'}

census2slug = {}
for p in glob.glob(f'{ADMIN}/*.json'):
    if os.path.basename(p).startswith('_'):
        continue
    a = json.load(open(p))
    census2slug[a['census2011']] = os.path.basename(p)[:-5]

out = {}
for f in sorted(glob.glob(f'{PCA}/*.xlsx')):
    ws = openpyxl.load_workbook(f, read_only=True).worksheets[0]
    rows = ws.iter_rows(values_only=True)
    head = next(rows)
    ix = [head.index(k) for k in FIELDS]
    wards = collections.Counter()
    for r in rows:
        slug = census2slug.get(str(r[1]))
        if not slug:
            continue
        d = out.setdefault(slug, {'fields': FIELDS, 'district': {}, 'subdistricts': {}, 'towns': []})
        vals = [int(r[i] or 0) for i in ix]
        level, name, tru = r[6], str(r[7]).strip(), r[8]
        if level == 'DISTRICT':
            d['district'][tru.lower()] = vals
        elif level == 'SUB-DISTRICT':
            sd = d['subdistricts'].setdefault(str(int(r[2])), {'name': name})
            sd[tru.lower()] = vals
        elif level == 'TOWN':
            m = re.match(r'^(.*?)\s*\(([^)]*)\)\s*$', name)
            base, kind = (m.group(1).strip(), m.group(2).strip()) if m else (name, '')
            og = '+ OG' in kind
            kind = kind.replace('+ OG', '').strip()
            d['towns'].append({'code': str(r[3]), 'name': base, 'kind': TYPES.get(kind, kind), 'og': og,
                               'sd': str(int(r[2])), 'v': vals})
        elif level == 'WARD':
            wards[str(r[3])] += 1
    for d in out.values():
        merged = {}
        for t in d['towns']:
            m = merged.get(t['code'])
            if not m:
                merged[t['code']] = t
            elif t['og']:            # "Town (M + OG)": town plus its outgrowths
                m['vOg'] = t['v']
            else:                    # the town alone
                t['vOg'] = m['v']
                merged[t['code']] = t
        for t in merged.values():
            t.pop('og', None)
            if t['kind'] != 'Census town' and wards.get(t['code'], 0) > 1:
                t['wards'] = wards[t['code']]
        d['towns'] = sorted(merged.values(), key=lambda t: -t['v'][1])

json.dump(out, open(OUT, 'w'), separators=(',', ':'))
print(len(out), 'districts;', sum(len(d['towns']) for d in out.values()), 'towns;',
      sum(len(d['subdistricts']) for d in out.values()), 'sub-districts')
