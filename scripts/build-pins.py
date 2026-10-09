# Builds src/data/pins.json: PIN code → villages, from the PIN codes recorded for each village in the
# Census 2011 Village Directory (src/data/amenities/<district>.json, built by scripts/build-amenities.py).
import collections, glob, json, os, re
ROOT = os.path.join(os.path.dirname(__file__), '..')
pins = collections.defaultdict(list)
for p in sorted(glob.glob(os.path.join(ROOT, 'src', 'data', 'amenities', '*.json'))):
    d = json.load(open(p)); i = d['fields'].index('pin'); dist = os.path.basename(p)[:-5]
    for code, row in d['villages'].items():
        v = str(row[i]).strip()
        if re.fullmatch(r'7[5-7]\d{4}', v):
            pins[v].append([dist, code])
json.dump(dict(sorted(pins.items())), open(os.path.join(ROOT, 'src', 'data', 'pins.json'), 'w'), separators=(',', ':'))
print(len(pins), 'PIN codes')
