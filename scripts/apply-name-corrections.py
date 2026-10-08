# Applies src/data/name-corrections.json to the village data files (by LGD village code):
#   src/data/admin/<district>.json and public/data/admin/<district>.json → villages[].n (official name kept in "on")
#   public/data/map/<district>-villages.json → village label (index 1)
# Safe to re-run after rebuilding the data. Usage: python3 scripts/apply-name-corrections.py
import json, os

ROOT = os.path.join(os.path.dirname(__file__), '..')
fixes = json.load(open(os.path.join(ROOT, 'src', 'data', 'name-corrections.json')))['villages']

by_district = {}
for code, f in fixes.items():
    by_district.setdefault(f['district'], {})[code] = f

for d, fs in by_district.items():
    for p in (f'src/data/admin/{d}.json', f'public/data/admin/{d}.json'):
        path = os.path.join(ROOT, p)
        a = json.load(open(path))
        n = 0
        for v in a['villages']:
            f = fs.get(v['c'])
            if f:
                v['on'] = f['official']
                v['n'] = f['name']
                n += 1
        json.dump(a, open(path, 'w'), separators=(',', ':'), ensure_ascii=False)
        print(p, n)
    path = os.path.join(ROOT, f'public/data/map/{d}-villages.json')
    m = json.load(open(path))
    n = 0
    for r in m['villages']:
        if r[0] in fs:
            r[1] = fs[r[0]]['name']
            n += 1
    json.dump(m, open(path, 'w'), separators=(',', ':'), ensure_ascii=False)
    print(path, n)
