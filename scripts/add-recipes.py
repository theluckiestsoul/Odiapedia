"""Injects structured `recipe:` blocks (scripts/recipes_data.py) into the front matter of content/food/*.mdx."""
import os, re, sys, yaml
sys.path.insert(0, os.path.dirname(__file__))
from recipes_data import RECIPES

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
for slug, r in RECIPES.items():
    p = os.path.join(ROOT, 'content', 'food', slug + '.mdx')
    s = open(p, encoding='utf-8').read()
    assert s.startswith('---\n'), p
    end = s.index('\n---', 4)
    fm, body = s[4:end], s[end:]
    fm = re.sub(r'\nrecipe:\n(?:[ \-].*\n?)*', '\n', fm + '\n').rstrip('\n')
    block = {k.rstrip('_'): v for k, v in r.items()}
    dumped = yaml.safe_dump({'recipe': block}, allow_unicode=True, sort_keys=False, width=1000)
    s = '---\n' + fm + '\n' + dumped.rstrip('\n') + body
    open(p, 'w', encoding='utf-8').write(s)
    print('ok', slug)
