import json

with open('forms_content.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.read().split('\n')]

forms = {}
current_dept = None
section = None

i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith('--- START:'):
        if 'Audit' in line: current_dept = 'audit'
        elif 'Conformite' in line: current_dept = 'conformite'
        elif 'Credit' in line: current_dept = 'credit'
        elif 'DAF' in line: current_dept = 'daf'
        elif 'Informatique' in line: current_dept = 'informatique'
        elif 'Marketing' in line: current_dept = 'marketing'
        
        forms[current_dept] = {'II': [], 'III': [], 'IX': []}
        section = None

    if not current_dept:
        i += 1
        continue

    if line.startswith('II. RECENSEMENT'): section = 'II'
    elif 'III. QUESTIONS SPÉCIFIQUES' in line: section = 'III'
    elif line.startswith('IV. VERSEMENT'): section = 'IV'
    elif line.startswith('IX. DOCUMENTS À RECUEILLIR'): section = 'IX'
    elif line.startswith('X. SYNTHÈSE'): section = 'X'

    if section == 'II':
        # Detect start of a document row (number alone)
        if line.isdigit() and int(line) < 50:
            if i + 8 < len(lines):
                doc = {
                    'id': int(line),
                    'titre': lines[i+1],
                    'classement': lines[i+2],
                    'dua': lines[i+3],
                    'ref': lines[i+4],
                    'sort': lines[i+5],
                    'support': lines[i+6],
                    'acces': lines[i+7]
                }
                forms[current_dept]['II'].append(doc)
                i += 8
                continue

    elif section == 'III':
        if line.startswith('➤'):
            forms[current_dept]['III'].append(line[1:].strip())

    elif section == 'IX':
        if line.isdigit() and int(line) < 50:
            if i + 2 < len(lines):
                doc = {
                    'id': int(line),
                    'document': lines[i+1]
                }
                forms[current_dept]['IX'].append(doc)
                i += 2
                continue

    i += 1

with open('resources/js/Config/formsData.json', 'w', encoding='utf-8') as f:
    json.dump(forms, f, ensure_ascii=False, indent=2)

print("Extracted to formsData.json")
