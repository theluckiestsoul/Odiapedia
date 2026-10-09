# Builds src/data/stations.json: railway stations and halts in and around Odisha from OpenStreetMap
# (© OpenStreetMap contributors, ODbL 1.0), fetched with the Overpass API:
#   node["railway"~"^(station|halt)$"](17.6,81.2,22.8,87.7)  → /home/claude/ext/new/odiapedia-osm-stations.json
# Usage: python3 scripts/build-stations.py
import json, os
SRC = '/home/claude/ext/new/odiapedia-osm-stations.json'
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'stations.json')
import math, re
G = json.load(open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'odisha-map.json')))
MINX, MINY, MAXX, MAXY = G['bounds']; KX = math.cos(math.radians(G['lat0'])); SC = G['scale']; PAD = G['pad']
def proj(lon, lat):
    return ((lon - MINX) * KX * SC + PAD, (MAXY - lat) * SC + PAD)
POLYS = []
for d in G['districts']:
    for part in d['path'].split('M')[1:]:
        pts = [tuple(map(float, p.split())) for p in re.sub(r'[Zz]', '', part).split('L') if p.strip()]
        POLYS.append((d['id'], pts))
def district_of(lat, lon):
    x, y = proj(lon, lat)
    for did, pts in POLYS:
        inside = False
        for i in range(len(pts)):
            (x1, y1), (x2, y2) = pts[i], pts[i - 1]
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                inside = not inside
        if inside:
            return did
    return ''
rows = []
for e in json.load(open(SRC))['elements']:
    t = e.get('tags', {})
    name = t.get('name:en') or t.get('name')
    if not name or t.get('railway') not in ('station', 'halt'):
        continue
    if t.get('usage') == 'industrial' or t.get('railway:traffic_mode') == 'freight':
        continue
    rows.append([name.strip(), t.get('ref', '').strip(), round(e['lat'], 5), round(e['lon'], 5), 1 if t['railway'] == 'halt' else 0, t.get('name:or', '').strip(), district_of(e['lat'], e['lon'])])
rows.sort()
json.dump({'source': 'OpenStreetMap contributors (ODbL 1.0), railway stations and halts', 'fields': ['name', 'code', 'lat', 'lon', 'halt', 'odia', 'district'], 'stations': rows},
          open(OUT, 'w'), separators=(',', ':'), ensure_ascii=False)
print(len(rows), 'stations;', sum(1 for r in rows if r[6]), 'inside Odisha')
