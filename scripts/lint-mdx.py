import re,glob,yaml,sys
bad=0
for f in sorted(glob.glob('content/**/*.mdx',recursive=True)):
    s=open(f).read()
    m=re.match(r'^---\n(.*?)\n---\n',s,re.S)
    if not m: print('NOFM',f); bad+=1; continue
    try:
        d=yaml.safe_load(m.group(1))
        assert isinstance(d,dict)
        for k in ('sources','facts','faq'):
            if k in d and not isinstance(d[k],list): print('BADTYPE',f,k); bad+=1
        for src in d.get('sources') or []:
            if not (isinstance(src,dict) and src.get('url','').startswith('http') and src.get('title')): print('BADSRC',f,src); bad+=1
        for fa in d.get('facts') or []:
            if not (isinstance(fa,dict) and 'label' in fa and 'value' in fa): print('BADFACT',f,fa); bad+=1
            elif not isinstance(fa['value'],(str,int,float)): print('FACTVAL',f,fa); bad+=1
        for q in d.get('faq') or []:
            if not (isinstance(q,dict) and q.get('q') and q.get('a')): print('BADFAQ',f,q); bad+=1
    except Exception as e: print('YAML',f,e); bad+=1
    body=s[m.end():]
    injsx=False; incode=False
    for i,line in enumerate(body.split('\n')):
        if line.strip().startswith('```'): incode=not incode; continue
        if incode: continue
        if re.match(r'\s*<(LanguageSelector|Countdown)\b',line): injsx=True
        if injsx:
            if line.strip().endswith('/>') or line.strip()=='/>' : injsx=False
            continue
        l=re.sub(r'`[^`]*`','',line)
        l=re.sub(r'^\s*(>\s*)+','',l)
        if '<!--' in l: print('COMMENT',f,i,line[:80]); bad+=1
        for ch in '{}<':
            if ch in l: print('CHAR',repr(ch),f,i,line[:100]); bad+=1; break
        else:
            if '>' in l: print('GT',f,i,line[:100]); bad+=1
print('problems',bad)
