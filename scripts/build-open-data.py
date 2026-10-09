# Builds the downloadable open datasets in public/data/open/ (listed on /data) from Odiapedia's data files.
import csv, glob, json, os, re
ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'public', 'data', 'open')
os.makedirs(OUT, exist_ok=True)
D = lambda *p: os.path.join(ROOT, 'src', 'data', *p)

def w(name, header, rows):
    with open(os.path.join(OUT, name), 'w', newline='', encoding='utf-8') as f:
        c = csv.writer(f); c.writerow(header); c.writerows(rows)
    return len(rows)

counts = {}
# villages
vrows = []
for p in sorted(glob.glob(D('admin', '*.json'))):
    d = os.path.basename(p)[:-5]
    if d.startswith('_'):
        continue
    a = json.load(open(p))
    cen = json.load(open(D('census', f'{d}.json')))
    am_p = D('amenities', f'{d}.json')
    am = json.load(open(am_p)) if os.path.exists(am_p) else {'fields': [], 'villages': {}}
    fi = {k: i for i, k in enumerate(am['fields'])}
    blocks = {b['code']: b for b in a['blocks']}
    sds = {s['code']: s['name'] for s in a['subdistricts']}
    for v in a['villages']:
        if not v['c']:
            continue
        b = blocks.get(v['b']); g = next((x for x in (b['gps'] if b else []) if x['code'] == v['g']), None)
        r = cen['villages'].get(v['c']); m = am['villages'].get(v['c'])
        lit = ''
        if r and r[1] - r[4] > 0:
            lit = round(r[7] / (r[1] - r[4]) * 100, 2)
        vrows.append([v['c'], v['n'], v.get('o', ''), d, sds.get(v['s'], ''), b['name'] if b and b['code'] != '0' else '', g['name'] if g and g['code'] != '0' else '',
                      1 if v.get('u') else 0, *(r[i] if r else '' for i in (0, 1, 2, 3, 4, 5, 6)), lit,
                      (m[fi['pin']] if m else ''), (m[fi['area']] if m else '')])
counts['villages.csv'] = w('villages.csv', ['lgd_code', 'name', 'name_odia', 'district', 'subdistrict', 'block', 'gram_panchayat', 'uninhabited',
                                             'households_2011', 'population_2011', 'males_2011', 'females_2011', 'children_0_6_2011', 'sc_2011', 'st_2011', 'literacy_rate_2011', 'pin_code_2009', 'area_hectares'], vrows)
# towns
areas = json.load(open(D('census', '_areas.json'))); towns = json.load(open(D('census', '_towns.json')))
trows = []
for d, x in areas.items():
    for t in x['towns']:
        v = t['v']; td = towns.get(t['code'], {})
        trows.append([t['code'], t['name'], t['kind'], d, t.get('wards', ''), v[0], v[1], v[2], v[3], round(v[7] / (v[1] - v[4]) * 100, 2) if v[1] - v[4] > 0 else '', v[5], v[6], td.get('area', ''), td.get('class', '')])
counts['towns.csv'] = w('towns.csv', ['census_2011_code', 'name', 'type', 'district', 'wards', 'households', 'population', 'males', 'females', 'literacy_rate', 'sc', 'st', 'area_km2', 'class'], trows)
# districts
drows = []
for d, x in sorted(areas.items()):
    t, r, u = x['district'].get('total'), x['district'].get('rural'), x['district'].get('urban')
    if t:
        drows.append([d, t[0], t[1], t[2], t[3], r[1] if r else '', u[1] if u else '', round(t[7] / (t[1] - t[4]) * 100, 2), t[5], t[6], len(x['towns'])])
counts['districts.csv'] = w('districts.csv', ['district', 'households', 'population', 'males', 'females', 'rural_population', 'urban_population', 'literacy_rate', 'sc', 'st', 'towns'], drows)
# elections
E_ = json.load(open(D('elections.json'))); arows = []
for a in E_['assembly']:
    r = sorted([x for x in a['results'] if not x['bypoll']], key=lambda x: -x['year'])
    w_ = next((c for c in r[0]['candidates'] if c['won']), None) if r else None
    arows.append([a['no'], a['name'], a['district'], a['pc'], a['reservation'], a['electors'] or '', r[0]['year'] if r else '', w_['name'] if w_ else '', w_['party'] if w_ else '', w_['votes'] if w_ else ''])
counts['assembly-constituencies.csv'] = w('assembly-constituencies.csv', ['no', 'name', 'district', 'lok_sabha', 'reservation', 'electors', 'latest_election', 'winner', 'party', 'votes'], arows)
# monuments
M = json.load(open(D('monuments.json')))['monuments']
counts['monuments.csv'] = w('monuments.csv', ['asi_number', 'description', 'location', 'address', 'district', 'lat', 'lon'], [[m['number'], m['description'], m['location'], m['address'], m['district'], m['lat'] or '', m['lon'] or ''] for m in M])
# stations
S = json.load(open(D('stations.json')))['stations']
counts['railway-stations.csv'] = w('railway-stations.csv', ['name', 'code', 'lat', 'lon', 'halt', 'name_odia', 'district'], S)
# PIN
P = json.load(open(D('pins.json')))
counts['pin-codes.csv'] = w('pin-codes.csv', ['pin_code', 'district', 'lgd_village_code'], [[p, d, c] for p, rows in P.items() for d, c in rows])
# climate
C = json.load(open(D('climate.json')))['districts']
counts['climate.csv'] = w('climate.csv', ['district', 'lat', 'lon', 'month', 'avg_high_c', 'avg_low_c', 'rain_mm', 'rainy_days'], [[d, c['lat'], c['lon'], i + 1, m['tmax'], m['tmin'], m['rain'], m['rainyDays']] for d, c in C.items() for i, m in enumerate(c['months'])])
sizes = {k: os.path.getsize(os.path.join(OUT, k)) for k in counts}
json.dump({'files': {k: {'rows': counts[k], 'bytes': sizes[k]} for k in counts}}, open(D('open-data.json'), 'w'), indent=1)
print(counts, sum(sizes.values()) / 1e6, 'MB')
