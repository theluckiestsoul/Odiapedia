# Helper for build-elections.py: winner and runner-up of each seat from the statewide results tables in
# "2024 Odisha Legislative Assembly election" and "<year> Indian general election in Odisha" (Wikipedia, citing ECI).
import re

def _cells(row):
    out = []
    for line in row.split('\n'):
        line = line.strip()
        if not line or line.startswith('|-') or line.startswith('{|') or line.startswith('|}'):
            continue
        if line[0] in '|!':
            for c in re.split(r'\|\||!!', line[1:]):
                c = re.sub(r'^\s*(?:scope|style|rowspan|colspan|bgcolor|align|data-sort-value)[^|]*\|', '', c)
                out.append(c.strip())
    return out

def summary(text, plain, num):
    """Return {constituencyNo: {'winner':(name,party,votes,pct), 'runner':(...), 'margin':votes}} for rows that look like results."""
    res = {}
    for row in re.split(r'\n\|-[^\n]*', text):
        c = _cells(row)
        # find "No | [[... constituency|Name]] | ..." rows
        for i in range(len(c) - 1):
            if re.fullmatch(r'\d{1,3}', plain(c[i])) and 'constituency' in c[i + 1]:
                no = int(plain(c[i])); rest = c[i + 2:]
                # drop a poll % cell
                if rest and re.fullmatch(r'[\d.]+%?', plain(rest[0]) or 'x'):
                    rest = rest[1:]
                people = []
                k = 0
                while k < len(rest) and len(people) < 2:
                    name = plain(rest[k])
                    party = ''
                    j = k + 1
                    while j < len(rest) and ('party' in rest[j].lower() and 'color' in rest[j].lower() or re.fullmatch(r'[A-Z()\-]{2,10}', plain(rest[j]) or '')):
                        pm = re.search(r'party (?:name with color|color cell)\s*\|\s*([^}|]+)', rest[j], re.I)
                        if pm and not party:
                            party = pm.group(1).strip()
                        j += 1
                    if not party:
                        break
                    votes = num(rest[j]) if j < len(rest) else None
                    pct = num(rest[j + 1]) if j + 1 < len(rest) else None
                    if not isinstance(votes, (int, float)) or votes < 100:
                        break
                    people.append((name, party, int(votes), pct))
                    k = j + 2
                if len(people) == 2:
                    margin = num(rest[k]) if k < len(rest) else None
                    res[no] = {'winner': people[0], 'runner': people[1], 'margin': margin}
                break
    return res
