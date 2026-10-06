# Builds src/data/admin/*.json from a Local Government Directory (LGD) dump.
# Usage: clone https://github.com/planemad/india-local-government-directory, unzip village-directory.csv and
# administrative/4-village.csv into /tmp/claude-0/lgd (or edit the paths below), then run: python3 scripts/build-admin-data.py
# Afterwards copy src/data/admin/*.json (except _summary.json) to public/data/admin/.
import csv, json, re, collections, os
LGD='/home/claude/ext/india-local-government-directory'
OUT=os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'admin')
DMAP={'ANUGUL':'angul','BALANGIR':'balangir','BALESHWAR':'balasore','BARGARH':'bargarh','BHADRAK':'bhadrak','BOUDH':'boudh','CUTTACK':'cuttack','DEOGARH':'deogarh','DHENKANAL':'dhenkanal','GAJAPATI':'gajapati','GANJAM':'ganjam','JAGATSINGHAPUR':'jagatsinghpur','JAJAPUR':'jajpur','JHARSUGUDA':'jharsuguda','KALAHANDI':'kalahandi','KANDHAMAL':'kandhamal','KENDRAPARA':'kendrapara','KENDUJHAR':'kendujhar','KHORDHA':'khordha','KORAPUT':'koraput','MALKANGIRI':'malkangiri','MAYURBHANJ':'mayurbhanj','NABARANGPUR':'nabarangpur','NAYAGARH':'nayagarh','NUAPADA':'nuapada','PURI':'puri','RAYAGADA':'rayagada','SAMBALPUR':'sambalpur','SONEPUR':'subarnapur','SUNDARGARH':'sundargarh'}
def title(s):
    s=s.strip()
    if s.isupper() or s.islower():
        s=' '.join(w.capitalize() if not re.fullmatch(r'[IVX]+',w) else w for w in s.lower().split(' '))
        s=re.sub(r'\(([a-z])',lambda m:'('+m.group(1).upper(),s)
        s=re.sub(r'\b(M\.corp\.|N\.a\.c\.|P\.s)\b',lambda m:m.group(0).upper(),s)
    return re.sub(r'\s+',' ',s)
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
local={}
for r in csv.DictReader(open('/tmp/claude-0/lgd/4-village.csv',encoding='utf-8',errors='replace')):
    if r['State Code']=='21':
        local[r['Village Code']]=(r['Village Name (In Local)'].strip(), r['Village Status'], r['Census 2011 Code'])
gpl={}
for r in csv.DictReader(open(f'{LGD}/municipal/rural-local-body.csv',encoding='utf-8',errors='replace')):
    if r['State Code'].strip('"')=='21':
        n=r['Local Body Name (In Local)'].strip()
        gpl[r['Local Body Code'].strip('"')]=n if n and n!=r['Local Body Name (IN English)'] and re.search('[଀-୿]',n) else ''
TYPES={'4':'Municipal Corporation','5':'Municipality','6':'Notified Area Council'}
ulbt={r['Local Body Code']:r for r in csv.DictReader(open(f'{LGD}/municipal/urban-local-body.csv',encoding='utf-8',errors='replace')) if r['State Code']=='21'}
ulbs=collections.defaultdict(dict)
for r in csv.DictReader(open(f'{LGD}/municipal-directory.csv',encoding='utf-8',errors='replace')):
    if r['State Name'].strip()=='ODISHA':
        d=DMAP.get(r['District Name'].strip())
        if not d: continue
        u=ulbs[d].setdefault(r['Localbody Code'],{'code':r['Localbody Code'],'name':title(r['Localbody Name']),'census2011':r['Census 2011 Code'],'type':''})
        t=ulbt.get(r['Localbody Code'])
        if t: u['type']=TYPES.get(t['Localbody Type Code'],'')
rows=[r for r in csv.DictReader(open('/tmp/claude-0/lgd/village-directory.csv',encoding='utf-8',errors='replace')) if r['State code']=='21']
by=collections.defaultdict(list)
for r in rows: by[DMAP[r['District Name(In English)']]].append(r)
summary={}
for d,rs in by.items():
    sub={}; blocks={}; villages=[]
    bslugs={}
    for r in rs:
        sc=r['Subdistrict code']; sub.setdefault(sc,{'code':sc,'name':title(r['Subdistrict Name(In English)']),'villages':0})['villages']+=1
        bc=r['Block code'] or '0'
        if bc not in blocks:
            bn=title(r['Block Name(In English)']) if r['Block code'] else 'Not mapped to a block'
            s=slug(bn) if r['Block code'] else 'unmapped'
            while s in bslugs.values(): s+='-'+bc
            bslugs[bc]=s
            blocks[bc]={'code':bc,'name':bn,'slug':s,'gps':{},'villages':0,'subdistricts':set()}
        b=blocks[bc]; b['villages']+=1; b['subdistricts'].add(sc)
        gc=r['Localbody Code'] or '0'
        g=b['gps'].setdefault(gc,{'code':gc,'name':title(r['Localbody Name(In English)']) if r['Localbody Code'] else 'Not mapped to a gram panchayat','odia':gpl.get(gc,''),'villages':0})
        g['villages']+=1
        lo=local.get(r['Village code'],('', 'Inhabitant', r['VillageCunsecCode']))
        v={'c':r['Village code'],'n':title(r['Village Name(In English)']),'s':sc,'b':bc,'g':gc}
        if lo[0] and re.search('[଀-୿]',lo[0]): v['o']=lo[0]
        if lo[1]=='Un-Inhabitant': v['u']=1
        villages.append(v)
    villages.sort(key=lambda v:v['n'])
    out={'district':d,'lgdName':title(rs[0]['District Name(In English)']),'lgdCode':rs[0]['District code'],'census2011':rs[0]['District census code'],
         'subdistricts':sorted(sub.values(),key=lambda x:x['name']),
         'blocks':sorted([{**b,'gps':sorted(b['gps'].values(),key=lambda g:(g['code']=='0',g['name'])),'subdistricts':sorted(b['subdistricts'])} for b in blocks.values()],key=lambda b:(b['code']=='0',b['name'])),
         'ulbs':sorted(ulbs.get(d,{}).values(),key=lambda u:u['name']),
         'villages':villages}
    json.dump(out,open(f'{OUT}/{d}.json','w'),ensure_ascii=False,separators=(',',':'))
    summary[d]={'villages':len(villages),'blocks':len([b for b in blocks if b!='0']),'gps':sum(len([g for g in b['gps'] if g!='0']) for b in blocks.values()),'subdistricts':len(sub),'ulbs':len(ulbs.get(d,{}))}
json.dump({'source':'Local Government Directory (lgdirectory.gov.in), Government of India — data dump of December 2022 via github.com/planemad/india-local-government-directory','summary':summary},open(f'{OUT}/_summary.json','w'),indent=1)
print(sum(s['villages'] for s in summary.values()), sum(s['blocks'] for s in summary.values()), sum(s['gps'] for s in summary.values()), sum(s['ulbs'] for s in summary.values()))
print(summary['khordha'], summary['puri'])
