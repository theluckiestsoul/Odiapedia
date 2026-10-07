# Builds src/data/census/<district>.json: Census 2011 Primary Census Abstract (PCA) figures per village,
# keyed by the Local Government Directory (LGD) village code the site uses.
#
# Inputs:
#   - PCA "town, village and ward level" workbooks for the 30 Odisha districts (PC11_PCA-TV-2101 … 2130),
#     Census of India, https://censusindia.gov.in/nada/index.php/catalog/6561 … 6590 → /home/claude/ext/pca/<id>.xlsx
#   - LGD village list (4-village.csv) for the Census 2011 code of each LGD village → /tmp/claude-0/lgd/4-village.csv
# Usage: python3 scripts/build-census.py
import csv, json, os, glob, collections
import openpyxl

PCA = '/home/claude/ext/pca'
LGD_VILLAGES = '/tmp/claude-0/lgd/4-village.csv'
ADMIN = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'admin')
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'census')

# Field order of each village row in the output (keep in sync with src/lib/census.ts)
FIELDS = ['No_HH', 'TOT_P', 'TOT_M', 'TOT_F', 'P_06', 'P_SC', 'P_ST', 'P_LIT', 'M_LIT', 'F_LIT',
          'TOT_WORK_P', 'MAINWORK_P', 'MAIN_CL_P', 'MAIN_AL_P', 'MAIN_HH_P', 'MAIN_OT_P', 'MARGWORK_P', 'NON_WORK_P']

census2lgd = {}
for r in csv.DictReader(open(LGD_VILLAGES, encoding='utf-8', errors='replace')):
    if r['State Code'] == '21' and r['Census 2011 Code'].strip().strip('0'):
        census2lgd[r['Census 2011 Code'].strip().zfill(6)] = r['Village Code'].strip()

villages = {}            # census code -> row
district_rural = {}      # census district code -> rural totals row
for f in sorted(glob.glob(f'{PCA}/*.xlsx')):
    ws = openpyxl.load_workbook(f, read_only=True).worksheets[0]
    rows = ws.iter_rows(values_only=True)
    head = next(rows)
    ix = [head.index(k) for k in FIELDS]
    for r in rows:
        if r[6] == 'VILLAGE':
            villages[str(r[3]).zfill(6)] = [int(r[i] or 0) for i in ix]
        elif r[6] == 'DISTRICT' and r[8] == 'Rural':
            district_rural[str(r[1])] = [int(r[i] or 0) for i in ix]

os.makedirs(OUT, exist_ok=True)
matched = total = 0
for path in sorted(glob.glob(f'{ADMIN}/*.json')):
    name = os.path.basename(path)[:-5]
    if name.startswith('_'):
        continue
    admin = json.load(open(path))
    lgd2census = {}
    for c, l in census2lgd.items():
        lgd2census.setdefault(l, c)
    out = {}
    for v in admin['villages']:
        if not v['c']:
            continue
        total += 1
        cc = lgd2census.get(v['c'])
        if cc and cc in villages:
            out[v['c']] = villages[cc]
            matched += 1
    rural = district_rural.get(admin.get('census2011', ''))
    json.dump({'fields': FIELDS, 'districtRural': rural, 'villages': out}, open(f'{OUT}/{name}.json', 'w'), separators=(',', ':'))
print(f'villages with census figures: {matched} of {total} ({matched / total:.1%})')
