import re
text = open('index.html', 'r', encoding='utf-8').read()
print(len(re.findall(r'id="pdf-grid"', text)))
