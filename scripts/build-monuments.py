# Builds src/data/monuments.json: Monuments of National Importance in Odisha (Archaeological Survey of India list,
# as transcribed with coordinates in Wikipedia's "List of Monuments of National Importance in Odisha", CC BY-SA 4.0)
# Input: wikitext of that page → /home/claude/ext/new/odiapedia-asi-monuments-odisha.wikitext.txt
# Each monument is matched to the Census village whose boundary centre is nearest (public/data/map/<district>-villages.json).
# Usage: python3 scripts/build-monuments.py
import json, math, os, re

ROOT = os.path.join(os.path.dirname(__file__), '..')
SRC = '/home/claude/ext/new/odiapedia-asi-monuments-odisha.wikitext.txt'
OUT = os.path.join(ROOT, 'src', 'data', 'monuments.json')
DIST = {'angul': 'angul', 'anugul': 'angul', 'balangir': 'balangir', 'bolangir': 'balangir', 'balasore': 'balasore', 'baleshwar': 'balasore',
        'bargarh': 'bargarh', 'bhadrak': 'bhadrak', 'boudh': 'boudh', 'baudh': 'boudh', 'cuttack': 'cuttack', 'deogarh': 'deogarh', 'dhenkanal': 'dhenkanal',
        'gajapati': 'gajapati', 'ganjam': 'ganjam', 'jagatsinghpur': 'jagatsinghpur', 'jajpur': 'jajpur', 'jharsuguda': 'jharsuguda', 'kalahandi': 'kalahandi',
        'kandhamal': 'kandhamal', 'kendrapara': 'kendrapara', 'keonjhar': 'kendujhar', 'kendujhar': 'kendujhar', 'khordha': 'khordha', 'khurda': 'khordha',
        'koraput': 'koraput', 'malkangiri': 'malkangiri', 'mayurbhanj': 'mayurbhanj', 'nabarangpur': 'nabarangpur', 'nayagarh': 'nayagarh', 'nuapada': 'nuapada',
        'puri': 'puri', 'rayagada': 'rayagada', 'sambalpur': 'sambalpur', 'subarnapur': 'subarnapur', 'sonepur': 'subarnapur', 'sundargarh': 'sundargarh',
        'bhubaneswar': 'khordha'}

G = json.load(open(os.path.join(ROOT, 'src', 'data', 'odisha-map.json')))
MINX, MINY, MAXX, MAXY = G['bounds']; KX = math.cos(math.radians(G['lat0'])); SC = G['scale']; PAD = G['pad']
def unproj(x, y):
    return MAXY - (y / 100 - PAD) / SC, (x / 100 - PAD) / (KX * SC) + MINX

def clean(s):
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s or '')
    s = re.sub(r"'''?", '', s)
    s = re.sub(r'<ref[^>]*>.*?</ref>|<ref[^>]*/>|<[^>]+>', '', s, flags=re.S)
    s = re.sub(r'\{\{[^}]*\}\}', '', s)
    return re.sub(r'\s+', ' ', s).strip(' ,')

def slugify(s):
    return re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))

w = open(SRC).read()
rows = []
villages_cache = {}
for block in re.findall(r'\{\{ASI Monument row(.*?)\n\}\}', w, flags=re.S):
    f = {}
    for m in re.finditer(r'^\|\s*(\w+)\s*=(.*?)(?=^\||\Z)', block, flags=re.S | re.M):
        f[m.group(1)] = m.group(2).strip()
    num = clean(f.get('number', ''))
    if not num:
        continue
    dname = clean(f.get('district', '')).lower().replace(' district', '').strip()
    slug = DIST.get(dname, '')
    try:
        lat, lon = float(f.get('lat') or 'x'), float(f.get('lon') or 'x')
    except ValueError:
        lat = lon = None
    rec = {'id': num.lower(), 'number': num, 'description': clean(f.get('description')), 'location': clean(f.get('location')),
           'address': clean(f.get('address')), 'district': slug, 'districtName': clean(f.get('district')),
           'lat': lat, 'lon': lon, 'commons': clean(f.get('commonscat', ''))}
    if lat and slug:
        if slug not in villages_cache:
            villages_cache[slug] = json.load(open(os.path.join(ROOT, 'public', 'data', 'map', f'{slug}-villages.json')))['villages']
        best = named = None
        locs = {re.sub(r'[^a-z]', '', x.lower()) for x in re.split(r'[,()]', rec['location'] + ',' + rec['address']) if x.strip()}
        for r in villages_cache[slug]:
            if not r[0]:
                continue
            la, lo = unproj(r[8], r[9])
            d = math.hypot((la - lat) * 111.3, (lo - lon) * 111.3 * math.cos(math.radians(lat)))
            if best is None or d < best[0]:
                best = (d, r[0], r[1])
            if re.sub(r'[^a-z]', '', r[1].lower()) in locs and d < 8 and (named is None or d < named[0]):
                named = (d, r[0], r[1])
        if named:
            rec['village'] = {'code': named[1], 'name': named[2], 'km': round(named[0], 1), 'match': 'name'}

    rows.append(rec)
rows.sort(key=lambda r: int(re.sub(r'\D', '', r['number']) or 0))
json.dump({'source': 'Archaeological Survey of India list of Monuments of National Importance (Odisha), as transcribed with coordinates on Wikipedia (CC BY-SA 4.0)',
           'sourceUrl': 'https://en.wikipedia.org/wiki/List_of_Monuments_of_National_Importance_in_Odisha', 'monuments': rows},
          open(OUT, 'w'), indent=0, ensure_ascii=False)
print(len(rows), 'monuments;', sum(1 for r in rows if r['lat']), 'with coordinates;', sum(1 for r in rows if not r['district']), 'without district', [r['districtName'] for r in rows if not r['district']])
