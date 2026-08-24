import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="pdf-grid" id="pdf-grid">.*?</div>', text, re.DOTALL)
if match:
    print('pdf-grid HTML:', match.group(0)[:500] + ' ...')
