"""Small wikitext → plain text converter used to prepare source notes (not shipped to the site)."""
import re

def _templates(s):
    """Yield (start, end) of top-level {{...}} templates."""
    depth, start = 0, None
    i = 0
    while i < len(s) - 1:
        if s.startswith('{{', i):
            if depth == 0: start = i
            depth += 1; i += 2; continue
        if s.startswith('}}', i) and depth:
            depth -= 1; i += 2
            if depth == 0: yield start, i
            continue
        i += 1

def _split_params(body):
    parts, depth, cur, i = [], 0, '', 0
    while i < len(body):
        if body.startswith('{{', i) or body.startswith('[[', i): depth += 1; cur += body[i:i+2]; i += 2; continue
        if (body.startswith('}}', i) or body.startswith(']]', i)) and depth: depth -= 1; cur += body[i:i+2]; i += 2; continue
        if body[i] == '|' and depth == 0: parts.append(cur); cur = ''; i += 1; continue
        cur += body[i]; i += 1
    parts.append(cur)
    return parts

def infobox(text):
    """Return (name, {param: plain value}) for the first template with >= 4 named params."""
    for a, b in _templates(text):
        body = text[a+2:b-2]
        parts = _split_params(body)
        named = {}
        for p in parts[1:]:
            if '=' in p:
                k, v = p.split('=', 1)
                v = plain(v, keep_lists=True)
                if v: named[k.strip()] = v
        if len(named) >= 4:
            return parts[0].strip(), named
    return None, {}

def plain(s, keep_lists=False):
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = re.sub(r'<ref[^>/]*/>', '', s)
    s = re.sub(r'<ref[^>]*>.*?</ref>', '', s, flags=re.S)
    # plainlist / ubl / hlist templates: keep items
    def tmpl(m):
        inner = m.group(1)
        name = inner.split('|', 1)[0].strip().lower()
        if name in ('ubl', 'unbulleted list', 'plainlist', 'flatlist', 'hlist', 'plain list', 'flat list'):
            return ', '.join(x.strip() for x in _split_params(inner)[1:] if x.strip() and '=' not in x[:12])
        if name in ('lang', 'transl', 'nowrap', 'small'):
            ps = _split_params(inner); return ps[-1]
        if name.startswith(('birth date', 'death date', 'film date', 'start date', 'birth date and age', 'death date and age')):
            nums = [x.strip() for x in _split_params(inner)[1:] if x.strip().isdigit()]
            return '-'.join(nums[:3])
        if name in ('convert',):
            ps = _split_params(inner); return ' '.join(ps[1:3])
        if name in ('inr', '₹'): return '₹'
        if name in ('crore', 'lakh'): return name
        return ''
    for _ in range(4):
        s2 = re.sub(r'\{\{((?:[^{}]|\{[^{]|\}[^}])*)\}\}', tmpl, s)
        if s2 == s: break
        s = s2
    s = re.sub(r'\{\|.*?\|\}', '', s, flags=re.S)  # tables
    s = re.sub(r'\[\[(?:File|Image|ଚିତ୍ର|ଫାଇଲ|Category|ଶ୍ରେଣୀ):[^\[\]]*(?:\[\[[^\]]*\]\][^\[\]]*)*\]\]', '', s, flags=re.I)
    s = re.sub(r'\[\[([^\]|]+)\|([^\]]+)\]\]', r'\2', s)
    s = re.sub(r'\[\[([^\]]+)\]\]', r'\1', s)
    s = re.sub(r'\[https?://\S+\s([^\]]+)\]', r'\1', s)
    s = re.sub(r'\[https?://\S+\]', '', s)
    s = re.sub(r"'''?", '', s)
    s = re.sub(r'<br\s*/?>', ', ' if keep_lists else '\n', s, flags=re.I)
    s = re.sub(r'<[^>]+>', '', s)
    s = re.sub(r'__[A-Z]+__', '', s)
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip(' ,\n')

SKIP_SECTIONS = re.compile(r'^(references|external links|see also|notes|further reading|bibliography|sources|ଆଧାର|ଆଧାର ଗ୍ରନ୍ଥ|ବାହାର ଲିଙ୍କ|ଅଧିକ ପଢ଼ନ୍ତୁ|ଟୀକା|ଆହୁରି ଦେଖନ୍ତୁ|ବାହ୍ୟ ଲିଙ୍କ|ବାହାର ଲିଂକ)', re.I)

def article(text, max_chars=9000):
    """Infobox + body as plain text, dropping reference/external-link sections and tables."""
    name, ib = infobox(text)
    # strip all top-level templates from body
    out, last = [], 0
    for a, b in _templates(text):
        out.append(text[last:a]); last = b
    out.append(text[last:])
    body = ''.join(out)
    sections = re.split(r'\n(={2,4})\s*(.*?)\s*\1\s*\n', '\n' + body)
    keep = [plain(sections[0])]
    for i in range(1, len(sections) - 2, 3):
        title, content = sections[i + 1], sections[i + 2]
        if SKIP_SECTIONS.match(title.strip()): continue
        c = plain(content)
        if c: keep.append(f'## {title}\n{c}')
    txt = '\n\n'.join(k for k in keep if k)
    ibt = '\n'.join(f'{k}: {v}' for k, v in ib.items() if len(v) < 400)
    res = (f'[infobox]\n{ibt}\n\n' if ibt else '') + txt
    return res[:max_chars]
