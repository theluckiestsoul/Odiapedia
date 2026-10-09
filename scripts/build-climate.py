# Builds src/data/climate.json: monthly climate averages (1995-2024) near each district headquarters from the
# Open-Meteo Historical Weather API (ERA5 reanalysis, ECMWF/Copernicus; CC BY 4.0), fetched in the browser:
#   /v1/archive?latitude=..&longitude=..&start_date=1995-01-01&end_date=2024-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum
# averaged by calendar month (rain = mean monthly total; rainy day = 2.5 mm or more).
# Inputs: /home/claude/ext/new/odiapedia-climate.json (+ odiapedia-climate-rest.json for districts that hit the rate limit)
import json, os
ROOT = os.path.join(os.path.dirname(__file__), '..')
base = json.load(open('/home/claude/ext/new/odiapedia-climate.json'))
rest = '/home/claude/ext/new/odiapedia-climate-rest.json'
if os.path.exists(rest):
    base['districts'].update(json.load(open(rest))['districts'])
base['districts'] = {k: v for k, v in base['districts'].items() if isinstance(v, dict)}
base['years'] = [1995, 2024]
json.dump(base, open(os.path.join(ROOT, 'src', 'data', 'climate.json'), 'w'), separators=(',', ':'))
print(len(base['districts']), 'districts')
