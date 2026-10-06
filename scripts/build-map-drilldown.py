"""
Builds the drill-down map data used by /map (district -> block / sub-district -> village).

Inputs
  * DataMeet "Indian Village Boundaries" for Odisha (Census 2011 villages), ODbL 1.0
    https://github.com/datameet/indian_village_boundaries  (or/or1.geojson, or/or2.geojson, or/or.csv.csv)
  * DataMeet "Districts of India" (Census 2011), CC BY 2.5 India — the district outline each district is clipped to
  * src/data/admin/*.json — Local Government Directory (Dec 2022): village -> block, gram panchayat, sub-district

Method
  Village polygons are joined to LGD through their Census 2011 village code. Block and sub-district shapes are built
  by rasterising the villages (~50 m cells), filling towns / forest / unmatched gaps with the nearest labelled cell
  inside the district outline, and tracing the cell edges back into simplified polygons. Village polygons are
  simplified and written as SVG paths.

Outputs (coordinates are the /map SVG space x100, i.e. the units of src/data/odisha-map.json multiplied by 100)
  public/data/map/<district>.json          blocks + sub-districts
  public/data/map/<district>-villages.json village polygons

Usage: python3 scripts/build-map-drilldown.py /path/to/indian_village_boundaries/or /path/to/datameet/maps/Districts/Census_2011/2011_Dist
"""
import sys, os, json, csv, math, re, collections, difflib
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

sys.setrecursionlimit(10000)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
VDIR = sys.argv[1] if len(sys.argv) > 1 else '/tmp/ivb/or'
DDIR = sys.argv[2] if len(sys.argv) > 2 else '/home/claude/ext/datameet/Districts/Census_2011/2011_Dist'
OUT = os.path.join(ROOT, 'public', 'data', 'map')
os.makedirs(OUT, exist_ok=True)

# ---------- shapefile helpers (same as build-map-paths.py) ----------
import struct
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

# ---------- projection shared with odisha-map.json ----------
G = json.load(open(os.path.join(ROOT, 'src', 'data', 'odisha-map.json')))
MINX, MINY, MAXX, MAXY = G['bounds']; KX = math.cos(math.radians(G['lat0'])); SC = G['scale']; PAD = G['pad']
def proj(lon, lat):
    return (((lon - MINX) * KX * SC + PAD) * 100, ((MAXY - lat) * SC + PAD) * 100)

# ---------- geometry helpers ----------
def dp(pts, tol):
    """Iterative Douglas-Peucker on a list of (x, y)."""
    n = len(pts)
    if n < 4: return pts
    keep = [False] * n; keep[0] = keep[-1] = True
    stack = [(0, n - 1)]
    while stack:
        i0, i1 = stack.pop()
        ax, ay = pts[i0]; bx, by = pts[i1]; dx, dy = bx - ax, by - ay; L = math.hypot(dx, dy)
        dmax = -1; idx = -1
        for i in range(i0 + 1, i1):
            px, py = pts[i]
            d = math.hypot(px - ax, py - ay) if L == 0 else abs(dx * (ay - py) - (ax - px) * dy) / L
            if d > dmax: dmax, idx = d, i
        if dmax > tol:
            keep[idx] = True; stack.append((i0, idx)); stack.append((idx, i1))
    return [p for p, k in zip(pts, keep) if k]

def simplify_ring(ring, tol):
    """Closed ring (first == last). Split at the farthest point so DP keeps the shape."""
    if ring[0] != ring[-1]: ring = ring + [ring[0]]
    if len(ring) < 5: return ring
    a = ring[0]; far = max(range(len(ring)), key=lambda i: (ring[i][0] - a[0]) ** 2 + (ring[i][1] - a[1]) ** 2)
    out = dp(ring[:far + 1], tol)[:-1] + dp(ring[far:], tol)
    return out

def ring_area(r):
    s = 0
    for i in range(len(r) - 1): s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]
    return s / 2

def area_centroid(r):
    A = cx = cy = 0
    for i in range(len(r) - 1):
        x0, y0 = r[i]; x1, y1 = r[i + 1]; c = x0 * y1 - x1 * y0
        A += c; cx += (x0 + x1) * c; cy += (y0 + y1) * c
    if A == 0: return r[0]
    return (cx / (3 * A), cy / (3 * A))

def enc(rings):
    """Integer SVG path with relative line commands."""
    out = []
    for r in rings:
        pts = [(int(round(x)), int(round(y))) for x, y in r]
        ded = [pts[0]]
        for p in pts[1:]:
            if p != ded[-1]: ded.append(p)
        if ded[-1] == ded[0]: ded.pop()
        if len(ded) < 3: continue
        s = 'M%d %d' % ded[0]; parts = []
        for i in range(1, len(ded)):
            parts.append('%d %d' % (ded[i][0] - ded[i - 1][0], ded[i][1] - ded[i - 1][1]))
        out.append(s + 'l' + ' '.join(parts) + 'z')
    return ''.join(out).replace(' -', '-')

def trace(mask):
    """Trace cell-edge boundaries of a boolean mask. Returns rings in cell coordinates (x=col, y=row)."""
    m = np.pad(mask, 1).astype(np.int8)
    edges = {}
    def add(a, b): edges.setdefault(a, []).append(b)
    dv = m[1:, :] - m[:-1, :]   # vertical transitions between row r-1 and r (padded coords)
    for r, c in zip(*np.nonzero(dv == 1)):   # inside below, outside above: top edge, go east
        add((c, r + 1), (c + 1, r + 1))
    for r, c in zip(*np.nonzero(dv == -1)):  # inside above, outside below: bottom edge, go west
        add((c + 1, r + 1), (c, r + 1))
    dh = m[:, 1:] - m[:, :-1]
    for r, c in zip(*np.nonzero(dh == 1)):   # inside right of the edge at x=c+1: left edge, go north
        add((c + 1, r + 1), (c + 1, r))
    for r, c in zip(*np.nonzero(dh == -1)):  # inside left: right edge, go south
        add((c + 1, r), (c + 1, r + 1))
    rings = []
    while edges:
        start = next(iter(edges)); ring = [start]; cur = start
        while True:
            nxt = edges[cur].pop()
            if not edges[cur]: del edges[cur]
            ring.append(nxt); cur = nxt
            if cur == start: break
            if cur not in edges: break
        # drop collinear points
        pts = [ring[0]]
        for i in range(1, len(ring) - 1):
            a, b, c2 = pts[-1], ring[i], ring[i + 1]
            if (b[0] - a[0]) * (c2[1] - b[1]) - (b[1] - a[1]) * (c2[0] - b[0]) != 0: pts.append(b)
        pts.append(ring[-1])
        rings.append([(int(x) - 1, int(y) - 1) for x, y in pts])  # undo padding
    return rings

def greedy_colours(labels, adj, k=6):
    col = {}
    for l in sorted(labels, key=lambda l: -len(adj.get(l, ()))):
        used = {col[n] for n in adj.get(l, ()) if n in col}
        col[l] = next((i for i in range(k) if i not in used), 0)
    return col

def adjacency(grid):
    adj = collections.defaultdict(set)
    for a, b in ((grid[:, 1:], grid[:, :-1]), (grid[1:, :], grid[:-1, :])):
        sel = (a != b) & (a > 0) & (b > 0)
        for x, y in set(zip(a[sel].tolist(), b[sel].tolist())):
            adj[x].add(y); adj[y].add(x)
    return adj

slug = lambda s: re.sub(r'(^-|-$)', '', re.sub(r'[^a-z0-9]+', '-', s.lower()))

# ---------- load inputs ----------
DM_NAME = {'Anugul': 'angul', 'Baleshwar': 'balasore', 'Bauda': 'boudh', 'Debagarh': 'deogarh', 'Jagatsinghapur': 'jagatsinghpur',
           'Jajapur': 'jajpur', 'Nabarangapur': 'nabarangpur', 'Subarnapur': 'subarnapur'}
V_NAME = dict(DM_NAME, Baudh='boudh', Khorda='khordha', Sonapur='subarnapur')
dslug = lambda name, table: table.get(name, name.lower())

recs = read_dbf(DDIR + '.dbf'); shapes = read_shp(DDIR + '.shp')
DISTRICT_POLY = {}
for r, s in zip(recs, shapes):
    if r['ST_NM'].upper() in ('ODISHA', 'ORISSA'):
        DISTRICT_POLY[dslug(r['DISTRICT'], DM_NAME)] = [[proj(x, y) for x, y in ring] for ring in s]

c01to11 = {}
for r in csv.DictReader(open(os.path.join(VDIR, 'or.csv.csv'))):
    c01to11[r['CEN_2001']] = r['village_code_2011']

ADMIN = {}; LGD = {}
for d in DISTRICT_POLY:
    a = json.load(open(os.path.join(ROOT, 'src', 'data', 'admin', d + '.json')))
    ADMIN[d] = a
    for v in a['villages']:
        if v['c']: LGD[v['c']] = (d, v)

features = []
for fn in ('or1.geojson', 'or2.geojson'):
    features += json.load(open(os.path.join(VDIR, fn)))['features']

VILL = collections.defaultdict(list); SEEN = {}
norm = lambda t: re.sub(r'[^a-z]', '', t.lower())
BYNAME = collections.defaultdict(list); SDNAME = {}
LINKED = set(c01to11.values())
for code, (d, v) in LGD.items():
    if code not in LINKED: BYNAME[(d, norm(v['n']))].append(code)
for d, a in ADMIN.items():
    for x in a['subdistricts']: SDNAME[(d, x['code'])] = x['name']
byname = byfuzzy = 0
BYNAME_D = collections.defaultdict(dict)
for (d, nm), cs in BYNAME.items(): BYNAME_D[d][(d, nm)] = cs
matched = 0
for f in features:
    p = f['properties']; g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    rings = [[proj(x, y) for x, y in poly[0]] for poly in polys if poly and len(poly[0]) >= 4]
    if not rings: continue
    code11 = c01to11.get(p.get('CEN_2001') or '')
    hit = LGD.get(code11) if code11 else None
    if not hit:  # fall back to a unique name match inside the same district (and sub-district when needed)
        d0 = dslug(p.get('DISTRICT') or '', V_NAME)
        cands = [c for c in BYNAME.get((d0, norm(p.get('NAME') or '')), []) if c not in SEEN]
        if len(cands) > 1:
            sdn = norm(p.get('SUB_DIST') or '')
            cands = [c for c in cands if norm(SDNAME.get((d0, LGD[c][1]['s']), '')) == sdn]
        if len(cands) == 1: hit = LGD[cands[0]]; byname += 1
        elif not cands:  # close spelling (e.g. Ankabeda / Ankabheda), only when one candidate is clearly best
            nm = norm(p.get('NAME') or '')
            pool = [(difflib.SequenceMatcher(None, nm, k[1]).ratio(), c) for k, cs in BYNAME_D.get(d0, {}).items() for c in cs if c not in SEEN] if nm else []
            pool.sort(reverse=True)
            if pool and pool[0][0] >= 0.86 and (len(pool) == 1 or pool[0][0] - pool[1][0] >= 0.06):
                hit = LGD[pool[0][1]]; byfuzzy += 1
    if hit:
        matched += 1; d, v = hit
        if v['c'] in SEEN:  # several Census polygons for one LGD village: merge them
            SEEN[v['c']]['rings'] += rings; continue
        SEEN[v['c']] = {'rings': rings, 'c': v['c'], 'n': v['n'], 'o': v.get('o', ''), 'b': v['b'], 'g': v['g'], 's': v['s']}
        VILL[d].append(SEEN[v['c']])
    else:
        d = dslug(p.get('DISTRICT') or '', V_NAME)
        if d not in DISTRICT_POLY: continue
        VILL[d].append({'rings': rings, 'c': '', 'n': (p.get('NAME') or '').title(), 'o': '', 'b': '', 'g': '', 's': ''})
print('village features', len(features), 'matched to LGD', matched, 'of which by name', byname, 'by close spelling', byfuzzy)

CELL = 8.0  # units per raster cell (~50 m)
MIN_CELLS = 300  # ~0.75 km2
summary = {}
for d in sorted(DISTRICT_POLY):
    if os.environ.get('ONLY') and d != os.environ['ONLY']: continue
    A = ADMIN[d]; vills = VILL[d]
    allx = [x for r in DISTRICT_POLY[d] for x, _ in r]; ally = [y for r in DISTRICT_POLY[d] for _, y in r]
    x0, y0 = min(allx) - 4 * CELL, min(ally) - 4 * CELL
    W = int((max(allx) - x0) / CELL) + 8; H = int((max(ally) - y0) / CELL) + 8
    tocell = lambda r: [((x - x0) / CELL, (y - y0) / CELL) for x, y in r]

    dimg = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(dimg)
    for r in DISTRICT_POLY[d]:
        if len(r) >= 3: dd.polygon(tocell(r), fill=1)
    dmask = np.array(dimg, dtype=bool)

    vimg = Image.new('I', (W, H), 0); vd = ImageDraw.Draw(vimg)
    order = sorted(range(len(vills)), key=lambda i: -max(abs(ring_area(r)) for r in vills[i]['rings']))
    for i in order:
        for r in vills[i]['rings']:
            vd.polygon(tocell(r), fill=i + 1)
    vgrid = np.array(vimg, dtype=np.int32)
    vgrid[~dmask] = 0

    bcodes = sorted({b['code'] for b in A['blocks'] if b['code'] not in ('', '0')})
    scodes = sorted({s['code'] for s in A['subdistricts'] if s['code']})
    bidx = {c: i + 1 for i, c in enumerate(bcodes)}; sidx = {c: i + 1 for i, c in enumerate(scodes)}
    vb = np.zeros(len(vills) + 1, np.int32); vs = np.zeros(len(vills) + 1, np.int32)
    for i, v in enumerate(vills):
        vb[i + 1] = bidx.get(v['b'], 0); vs[i + 1] = sidx.get(v['s'], 0)

    def filled(lut):
        g = lut[vgrid]
        unknown = g == 0
        if unknown.all(): return g
        _, (ri, ci) = ndimage.distance_transform_edt(unknown, return_indices=True)
        g = g[ri, ci]; g[~dmask] = 0
        # Drop specks: components under MIN_CELLS that are not a label's largest piece go to their neighbours.
        drop = np.zeros_like(dmask)
        for li, sl in enumerate(ndimage.find_objects(g), start=1):
            if sl is None: continue
            comp, n = ndimage.label(g[sl] == li)
            if n < 2: continue
            sizes = np.bincount(comp.ravel()); sizes[0] = 0; big = sizes.argmax()
            small = [k for k in range(1, n + 1) if k != big and sizes[k] < MIN_CELLS]
            if small: drop[sl] |= np.isin(comp, small)
        if drop.any():
            g[drop] = 0
            _, (ri, ci) = ndimage.distance_transform_edt(g == 0, return_indices=True)
            g2 = g[ri, ci]; g = np.where(dmask, g2, 0)
        return g

    bgrid = filled(vb); sgrid = filled(vs)
    if False: print("dmask", dmask.sum(), "vgrid>0", (vgrid>0).sum(), "bgrid uniq", np.unique(bgrid)[:20], "vb", np.unique(vb)[:20], W, H)

    # Unmatched villages: take the block / sub-district under most of their cells.
    for i, v in enumerate(vills):
        if v['c']: continue
        cells = vgrid == i + 1
        if cells.any():
            bb = np.bincount(bgrid[cells]); ss = np.bincount(sgrid[cells])
            bb[0] = 0; ss[0] = 0
            v['b'] = bcodes[bb.argmax() - 1] if bb.max() > 0 else ''
            v['s'] = scodes[ss.argmax() - 1] if ss.max() > 0 else ''

    def regions(grid, codes, names):
        adj = adjacency(grid); cols = greedy_colours(range(1, len(codes) + 1), adj)
        out = []
        objs = ndimage.find_objects(grid)
        for li, sl in enumerate(objs, start=1):
            if sl is None: continue
            sub = grid[sl] == li
            rs, cs = sl
            rings = []
            for ring in trace(sub):
                if len(ring) < 4: continue
                simp = simplify_ring([(x, y) for x, y in ring], 0.9)
                if abs(ring_area(simp)) < 2: continue
                rings.append([((x + cs.start) * CELL + x0, (y + rs.start) * CELL + y0) for x, y in simp])
            if not rings: continue
            dist = ndimage.distance_transform_edt(np.pad(sub, 1))[1:-1, 1:-1]
            ly, lx = np.unravel_index(dist.argmax(), dist.shape)
            code = codes[li - 1]
            out.append({'c': code, 'n': names.get(code, code), 'k': cols.get(li, 0), 'p': enc(rings), 'r': int(dist.max() * CELL),
                        'x': int((lx + cs.start + .5) * CELL + x0), 'y': int((ly + rs.start + .5) * CELL + y0)})
        return out

    bname = {b['code']: b['name'] for b in A['blocks']}; sname = {s['code']: s['name'] for s in A['subdistricts']}
    blocks = regions(bgrid, bcodes, bname); sds = regions(sgrid, scodes, sname)
    bslug = {b['code']: b['slug'] for b in A['blocks']}
    for b in blocks: b['s'] = bslug.get(b['c'], slug(b['n']))
    for s in sds: s['s'] = '%s-%s' % (slug(s['n']), s['c'])
    bmeta = {b['code']: b for b in A['blocks']}; smeta = {x['code']: x for x in A['subdistricts']}
    for b in blocks: b['g'] = len(bmeta[b['c']]['gps']) if b['c'] in bmeta else 0; b['v'] = bmeta.get(b['c'], {}).get('villages', 0)
    for x in sds: x['v'] = smeta.get(x['c'], {}).get('villages', 0)

    # GP colouring: adjacency between GPs via village adjacency
    vadj = adjacency(vgrid)
    gp_of = {i + 1: v['g'] for i, v in enumerate(vills)}
    gadj = collections.defaultdict(set)
    for a, ns in vadj.items():
        for b in ns:
            ga, gb = gp_of.get(a), gp_of.get(b)
            if ga and gb and ga != gb: gadj[ga].add(gb)
    gcol = greedy_colours({v['g'] for v in vills if v['g']}, gadj)
    gpname = {g['code']: g['name'] for b in A['blocks'] for g in b['gps']}

    vslices = ndimage.find_objects(vgrid)
    vout = []
    for i, v in enumerate(vills):
        rings = []
        for r in v['rings']:
            s = simplify_ring(r, 3.0)
            if len(s) >= 4 and abs(ring_area(s)) > 4: rings.append(s)
        if not rings: continue
        big = max(rings, key=lambda r: abs(ring_area(r)))
        cx, cy = area_centroid(big); rad = 0
        sl = vslices[i] if i < len(vslices) else None
        if sl is not None:
            sub = vgrid[sl] == i + 1
            dist = ndimage.distance_transform_edt(np.pad(sub, 1))[1:-1, 1:-1]
            ly, lx = np.unravel_index(dist.argmax(), dist.shape)
            cx, cy = (lx + sl[1].start + .5) * CELL + x0, (ly + sl[0].start + .5) * CELL + y0; rad = int(dist.max() * CELL)
        vout.append([v['c'], v['n'], v['o'], v['b'], v['g'], v['s'], gcol.get(v['g'], (hash(v['n']) % 6)), enc(rings), int(cx), int(cy), rad])

    rows = np.nonzero(bgrid.any(axis=1))[0]; colsx = np.nonzero(bgrid.any(axis=0))[0]
    main, n = ndimage.label(bgrid > 0); sizes = np.bincount(main.ravel()); sizes[0] = 0
    keep = np.isin(main, np.nonzero(sizes >= 0.02 * sizes.sum())[0])
    rr = np.nonzero(keep.any(axis=1))[0]; cc = np.nonzero(keep.any(axis=0))[0]
    bbox = [int(cc[0] * CELL + x0), int(rr[0] * CELL + y0), int((cc[-1] + 1) * CELL + x0), int((rr[-1] + 1) * CELL + y0)]
    have = {b['c'] for b in blocks}
    dj = {'district': d, 'bbox': bbox, 'blocks': blocks, 'subdistricts': sds,
          'unmapped': [{'c': b['code'], 'n': b['name'], 's': b['slug']} for b in A['blocks'] if b['code'] not in ('', '0') and b['code'] not in have],
          'gps': gpname}
    json.dump(dj, open(os.path.join(OUT, d + '.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    json.dump({'district': d, 'fields': ['code', 'name', 'odia', 'block', 'gp', 'subdistrict', 'colour', 'path', 'x', 'y', 'r'], 'villages': vout},
              open(os.path.join(OUT, d + '-villages.json'), 'w'), separators=(',', ':'), ensure_ascii=False)
    summary[d] = (len(blocks), len(bcodes), len(sds), len(scodes), len(vout), sum(1 for v in vills if not v['c']))
    print(d, summary[d], os.path.getsize(os.path.join(OUT, d + '.json')), os.path.getsize(os.path.join(OUT, d + '-villages.json')), flush=True)
