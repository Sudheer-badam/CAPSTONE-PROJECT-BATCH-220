import re
text = open('index.html', 'r', encoding='utf-8').read()
matches = re.findall(r'id=\"history-week\$\{i\}\"', text)
print('Count:', len(matches))
