import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="pdf-grid" id="pdf-grid">(.*?)</div>', text, re.DOTALL)
if match:
    print('pdf-grid contents:', repr(match.group(1)))
