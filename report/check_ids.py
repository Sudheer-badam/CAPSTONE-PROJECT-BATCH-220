import re
text = open('index.html', 'r', encoding='utf-8').read()
matches = re.findall(r'id="tab-papers"', text)
print('Number of tab-papers IDs:', len(matches))

matches_grid = re.findall(r'id="pdf-grid"', text)
print('Number of pdf-grid IDs:', len(matches_grid))
