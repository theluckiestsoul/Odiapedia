"""
Builds src/data/odisha-map.json — simplified SVG paths for Odisha's 30 districts.

Source: DataMeet "Districts of India" (Census 2011 boundaries), https://github.com/datameet/maps
License: Creative Commons Attribution 2.5 India — attribution is shown on the map page.
Usage: python3 scripts/build-map-paths.py /path/to/datameet/maps/Districts/Census_2011/2011_Dist
"""
import sys, json, math, os, struct

def read_dbf(path):
    f = open(path, 'rb'); hdr = f.read(32)
    n = struct.unpack('<I', hdr[4:8])[0]; hl = struct.unpack('<H', hdr[8:10])[0]; rl = struct.unpack('<H', hdr[10:12])[0]
    fields = []
    while True:
        d = f.read(32)
        if d[0] == 0x0D: break
        fields.append((d[:11].split(b'\0')[0].decode(), d[16]))
    f.seek(hl); recs = []
    for _ in range(n):
        r = f.read(rl); pos = 1; rec = {}
        for name, l in fields:
            rec[name] = r[pos:pos + l].decode('latin1').strip(); pos += l
        recs.append(rec)
    return recs

def read_shp(path):
    f = open(path, 'rb'); f.seek(100); shapes = []
    while True:
        h = f.read(8)
        if len(h) < 8: break
        _, clen = struct.unpack('>2i', h); c = f.read(clen * 2)
        if struct.unpack('<i', c[:4])[0] == 0: shapes.append([]); continue
        np_, npt = struct.unpack('<2i', c[36:44])
        parts = list(struct.unpack('<%di' % np_, c[44:44 + 4 * np_]))
        flat = struct.unpack('<%dd' % (2 * npt), c[44 + 4 * np_:44 + 4 * np_ + 16 * npt])
        pts = [(flat[2 * i], flat[2 * i + 1]) for i in range(npt)]
        parts.append(npt)
        shapes.append([pts[parts[i]:parts[i + 1]] for i in range(np_)])
    return shapes

def dp(pts, tol):
    if len(pts) < 4: return pts
    a, b = pts[0], pts[-1]; dmax = 0; idx = 0
    for i in range(1, len(pts) - 1):
        p = pts[i]
        if a == b: d = math.hypot(p[0] - a[0], p[1] - a[1])
        else: d = abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / math.hypot(b[0] - a[0], b[1] - a[1])
        if d > dmax: dmax, idx = d, i
    if dmax > tol: return dp(pts[:idx + 1], tol)[:-1] + dp(pts[idx:], tol)
    return [a, b]

def area_centroid(ring):
    A = cx = cy = 0
    for i in range(len(ring) - 1):
        x0, y0 = ring[i]; x1, y1 = ring[i + 1]; c = x0 * y1 - x1 * y0
        A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    A /= 2
    return (abs(A), (cx / (6 * A), cy / (6 * A)) if A else ring[0])

NAME = {'Anugul': 'angul', 'Baleshwar': 'balasore', 'Bauda': 'boudh', 'Debagarh': 'deogarh', 'Jagatsinghapur': 'jagatsinghpur',
        'Jajapur': 'jajpur', 'Nabarangapur': 'nabarangpur', 'Subarnapur': 'subarnapur'}

base = sys.argv[1] if len(sys.argv) > 1 else '/home/claude/ext/datameet/Districts/Census_2011/2011_Dist'
recs = read_dbf(base + '.dbf'); shapes = read_shp(base + '.shp')
ods = [(r, s) for r, s in zip(recs, shapes) if r['ST_NM'].upper() in ('ODISHA', 'ORISSA')]
allpts = [p for _, s in ods for ring in s for p in ring]
minx = min(p[0] for p in allpts); maxx = max(p[0] for p in allpts); miny = min(p[1] for p in allpts); maxy = max(p[1] for p in allpts)
lat0 = (miny + maxy) / 2; kx = math.cos(math.radians(lat0))
W = 1000; scale = W / ((maxx - minx) * kx); H = (maxy - miny) * scale
pad = 10
proj = lambda p: (round((p[0] - minx) * kx * scale + pad, 1), round((maxy - p[1]) * scale + pad, 1))
out = {'source': 'DataMeet, Districts of India (Census 2011 boundaries), CC BY 2.5 India — github.com/datameet/maps',
       'width': W + 2 * pad, 'height': round(H + 2 * pad, 1), 'bounds': [minx, miny, maxx, maxy], 'lat0': lat0, 'scale': scale, 'pad': pad, 'districts': []}
for r, s in ods:
    slug = NAME.get(r['DISTRICT'], r['DISTRICT'].lower())
    d = []; best = (0, None)
    for ring in s:
        simp = dp(ring, 0.006)
        if len(simp) < 4: continue
        a, c = area_centroid(ring)
        if a > best[0]: best = (a, c)
        pts = [proj(p) for p in simp]
        d.append('M' + 'L'.join(f'{x:g} {y:g}' for x, y in pts) + 'Z')
    cx, cy = proj(best[1])
    out['districts'].append({'id': slug, 'census': r['DISTRICT'], 'path': ''.join(d), 'cx': cx, 'cy': cy})
dst = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'odisha-map.json')
json.dump(out, open(dst, 'w'), separators=(',', ':'))
print(len(out['districts']), 'districts', os.path.getsize(dst), 'bytes', out['width'], out['height'])
