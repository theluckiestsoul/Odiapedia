# Builds amenity data from the Census 2011 District Census Handbook (DCHB) releases for Odisha:
#   - src/data/amenities/<district>.json: Village Directory (schools, health, water, roads, power, banks, land use …)
#     per village, keyed by Local Government Directory (LGD) village code
#   - src/data/census/_towns.json: Town Directory (area, population since 1901, civic amenities) per census town code
#
# Inputs (Census of India, https://censusindia.gov.in/nada/index.php/catalog/920 → "Odisha - Village Amenities"
# and "Odisha - Town Amenities"):
#   /home/claude/ext/vd/DH_2011_DCHB_Village_Release_2100.xlsx
#   /home/claude/ext/vd/DH_2011_DCHB_Town_Release_2100.xlsx
#   LGD village list (Census 2011 code of each LGD village) → /tmp/claude-0/lgd/4-village.csv
# Usage: python3 scripts/build-amenities.py
import csv, glob, json, os
import openpyxl

VD = '/home/claude/ext/vd'
LGD_VILLAGES = '/tmp/claude-0/lgd/4-village.csv'
ROOT = os.path.join(os.path.dirname(__file__), '..')
ADMIN = os.path.join(ROOT, 'src', 'data', 'admin')
OUT = os.path.join(ROOT, 'src', 'data', 'amenities')

census2lgd = {}
for r in csv.DictReader(open(LGD_VILLAGES, encoding='utf-8', errors='replace')):
    if r['State Code'] == '21' and r['Census 2011 Code'].strip().strip('0'):
        census2lgd.setdefault(r['Census 2011 Code'].strip().zfill(6), r['Village Code'].strip())
census2slug = {}
for p in glob.glob(f'{ADMIN}/*.json'):
    if not os.path.basename(p).startswith('_'):
        census2slug[json.load(open(p))['census2011']] = os.path.basename(p)[:-5]


def num(x):
    if x in (None, '', 'None', 'N.A.', 'NA'):
        return 0
    try:
        f = float(str(x).strip())
        return int(f) if f == int(f) else round(f, 2)
    except ValueError:
        return 0


def txt(x):
    s = '' if x is None else str(x).strip()
    return '' if s.upper() in ('NONE', 'N.A.', 'NA', '-', '0') else s.title()


# ---------------------------------------------------------------- villages
# Each spec: (key, kind, columns). kinds: n = number, t = text, a = availability (1 in the village,
# 'a' <5 km, 'b' 5–10 km, 'c' 10+ km to the nearest, 0 unknown/none), y = yes/no status column,
# s = sum of number columns, c = count with nearest range (count col, range col)
SPEC = [
    ('area', 'n', [23]), ('pin', 't', [260]), ('town', 't', [394]), ('townKm', 'n', [395]),
    ('sdKm', 'n', [14]), ('dhqKm', 'n', [16]),
    ('prePrimaryG', 'n', [35]), ('prePrimaryP', 'n', [37]), ('primaryG', 'n', [42]), ('primaryP', 'n', [44]),
    ('middleG', 'n', [49]), ('middleP', 'n', [51]), ('secondaryG', 'n', [56]), ('secondaryP', 'n', [58]),
    ('seniorG', 'n', [63]), ('seniorP', 'n', [65]), ('college', 's', [70, 72]),
    ('primaryNear', 'r', [47]), ('middleNear', 'r', [54]), ('secondaryNear', 'r', [61]), ('seniorNear', 'r', [68]), ('collegeNear', 'r', [75]),
    ('secondaryAt', 't', [60]), ('seniorAt', 't', [67]), ('collegeAt', 't', [74]),
    ('iti', 's', [105, 107]), ('engineering', 's', [77, 79]), ('medical', 's', [84, 86]), ('polytechnic', 's', [98, 100]), ('management', 's', [91, 93]),
    ('chc', 'n', [132]), ('chcNear', 'r', [137]), ('phc', 'n', [138]), ('phcNear', 'r', [143]), ('subCentre', 'n', [144]), ('subCentreNear', 'r', [149]),
    ('mcw', 'n', [150]), ('hospital', 'n', [162]), ('hospitalNear', 'r', [167]), ('dispensary', 'n', [174]), ('vet', 'n', [180]), ('vetNear', 'r', [185]),
    ('familyWelfare', 'n', [192]), ('medicineShop', 'n', [205]), ('mbbs', 'n', [201]),
    ('tapTreated', 'y', [207]), ('tapUntreated', 'y', [210]), ('coveredWell', 'y', [213]), ('uncoveredWell', 'y', [216]), ('handPump', 'y', [219]),
    ('tubeWell', 'y', [222]), ('spring', 'y', [225]), ('river', 'y', [228]), ('tank', 'y', [231]),
    ('closedDrain', 'y', [237]), ('openDrain', 'y', [238]), ('tsc', 'y', [244]), ('wasteCollection', 'y', [249]),
    ('postOffice', 'a', [252, 253]), ('subPostOffice', 'a', [254, 255]), ('landline', 'a', [261, 262]), ('mobile', 'a', [265, 266]),
    ('internet', 'a', [267, 268]), ('courier', 'a', [269, 270]),
    ('publicBus', 'a', [271, 272]), ('privateBus', 'a', [273, 274]), ('railway', 'a', [275, 276]), ('auto', 'a', [277, 278]), ('taxi', 'a', [279, 280]),
    ('ferry', 'a', [291, 292]), ('nh', 'a', [293, 294]), ('sh', 'a', [295, 296]), ('mdr', 'a', [297, 298]), ('pucca', 'a', [301, 302]), ('allWeather', 'a', [307, 308]),
    ('atm', 'a', [313, 314]), ('bank', 'a', [315, 316]), ('coopBank', 'a', [317, 318]), ('creditSociety', 'a', [319, 320]), ('shg', 'a', [321, 322]),
    ('pds', 'a', [323, 324]), ('mandi', 'a', [325, 326]), ('haat', 'a', [327, 328]),
    ('anganwadi', 'a', [333, 334]), ('asha', 'a', [337, 338]), ('communityCentre', 'a', [339, 340]), ('sportsField', 'a', [341, 342]),
    ('cinema', 'a', [345, 346]), ('library', 'a', [347, 348]), ('readingRoom', 'a', [349, 350]), ('newspaper', 'a', [351, 352]),
    ('pollingStation', 'a', [353, 354]), ('birthRegistration', 'a', [355, 356]),
    ('power', 'y', [357]), ('powerSummer', 'n', [358]), ('powerWinter', 'n', [359]), ('powerAgri', 'y', [360]),
    ('agri', 'l', [369, 372, 375]), ('manufactured', 'l', [370, 373, 376]), ('handicraft', 'l', [371, 374, 377]),
    ('forest', 'n', [378]), ('nonAgri', 'n', [379]), ('barren', 'n', [380]), ('pasture', 'n', [381]), ('treeCrops', 'n', [382]),
    ('culturableWaste', 'n', [383]), ('fallowOther', 'n', [384]), ('fallowCurrent', 'n', [385]), ('netSown', 'n', [386]),
    ('unirrigated', 'n', [387]), ('irrigated', 'n', [388]), ('irrCanal', 'n', [389]), ('irrWell', 'n', [390]), ('irrTank', 'n', [391]), ('irrOther', 's', [392, 393]),
]
EXPECT = {23: 'Geographical Area', 260: 'PIN', 394: 'Nearest Town Name', 42: 'Primary School (Numbers)', 132: 'Community Health Centre (Numbers)',
          219: 'Hand Pump (Status', 252: 'Post Office', 313: 'ATM', 357: 'Power Supply For Domestic', 386: 'Net Area Sown', 369: 'Agricultural Commodities'}

wb = openpyxl.load_workbook(f'{VD}/DH_2011_DCHB_Village_Release_2100.xlsx', read_only=True)
rows = wb.worksheets[0].iter_rows(values_only=True)
head = next(rows)
for i, s in EXPECT.items():
    assert s.lower() in str(head[i]).lower(), (i, head[i])


def rng(x):
    s = '' if x is None else str(x).strip().lower()
    return s if s in ('a', 'b', 'c') else 0


def val(r, kind, cols):
    if kind == 'n':
        return num(r[cols[0]])
    if kind == 't':
        return txt(r[cols[0]])
    if kind == 's':
        return sum(num(r[c]) for c in cols)
    if kind == 'y':
        return 1 if str(r[cols[0]]).strip() == '1' else 0
    if kind == 'r':
        return rng(r[cols[0]])
    if kind == 'a':
        return 1 if str(r[cols[0]]).strip() == '1' else rng(r[cols[1]])
    if kind == 'l':
        return '|'.join(x for x in (txt(r[c]) for c in cols) if x)
    raise ValueError(kind)


out = {}
seen = matched = 0
for r in rows:
    if not r or not r[6]:
        continue
    seen += 1
    slug = census2slug.get(str(r[2]).strip())
    lgd = census2lgd.get(str(r[6]).strip().zfill(6))
    if not slug or not lgd:
        continue
    matched += 1
    out.setdefault(slug, {})[lgd] = [val(r, k, c) for _, k, c in SPEC]

os.makedirs(OUT, exist_ok=True)
fields = [k for k, _, _ in SPEC]
for slug, vs in out.items():
    json.dump({'fields': fields, 'villages': vs}, open(f'{OUT}/{slug}.json', 'w'), separators=(',', ':'), ensure_ascii=False)
print(f'village directory rows {seen}, matched to LGD villages {matched}')

# ---------------------------------------------------------------- towns
wb = openpyxl.load_workbook(f'{VD}/DH_2011_DCHB_Town_Release_2100.xlsx', read_only=True)
rows = wb.worksheets[0].iter_rows(values_only=True)
h = next(rows)
assert 'Area (sq. km.)' in h[23] and 'Census 1901' in h[27] and 'Rainfall' in h[55] and 'Nationalised Bank' in h[424], 'town columns moved'
towns = {}
for r in rows:
    if not r or not r[6]:
        continue
    code = str(r[6]).strip()
    years = list(range(1901, 2012, 10))
    hist = [[y, num(r[27 + 2 * i])] for i, y in enumerate(years) if num(r[27 + 2 * i])]
    gp = lambda g, p: num(r[g]) + num(r[p])
    towns[code] = {
        'area': num(r[23]), 'class': txt(r[19]).upper(), 'block': txt(r[22]), 'ref': num(r[18]),
        'history': hist,
        'rain': num(r[55]), 'tmax': num(r[56]), 'tmin': num(r[57]),
        'stateKm': num(r[59]), 'dhq': txt(r[60]), 'dhqKm': num(r[61]),
        'city1': txt(r[64]), 'city1Km': num(r[65]), 'city5': txt(r[66]), 'city5Km': num(r[67]),
        'rail': txt(r[68]), 'railKm': num(r[69]),
        'roadPucca': num(r[72]), 'roadKutcha': num(r[73]),
        'fire': 1 if str(r[94]).strip() == '1' else 0, 'fireAt': txt(r[95]), 'fireKm': num(r[96]),
        'electricHomes': num(r[97]),
        'hospitals': num(r[102]), 'hospitalBeds': num(r[103]), 'altHospitals': num(r[109]), 'dispensaries': num(r[116]),
        'familyWelfare': num(r[123]), 'mcw': num(r[130]), 'maternity': num(r[137]), 'tb': num(r[144]), 'nursingHomes': num(r[151]),
        'vet': num(r[158]), 'medicineShops': num(r[182]),
        'primary': [num(r[184]), num(r[186])], 'middle': [num(r[191]), num(r[193])], 'secondary': [num(r[198]), num(r[200])],
        'senior': [num(r[205]), num(r[207])],
        'colleges': sum(gp(212 + 7 * i, 214 + 7 * i) for i in range(9)),
        'medical': gp(275, 277), 'engineering': gp(282, 284), 'management': gp(289, 291), 'polytechnic': gp(296, 298),
        'stadium': gp(387, 389), 'cinema': gp(394, 396), 'auditorium': gp(401, 403), 'library': gp(408, 410), 'readingRoom': gp(415, 417),
        'banks': [num(r[424]), num(r[425]), num(r[426])],
        'products': [x for x in (txt(r[c]) for c in (421, 422, 423)) if x],
    }
json.dump(towns, open(os.path.join(ROOT, 'src', 'data', 'census', '_towns.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
print('towns', len(towns))
