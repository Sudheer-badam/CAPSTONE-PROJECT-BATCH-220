import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="pdf-grid" id="(.*?)">', text)
if match:
    print('HTML ID for pdf grid is:', match.group(1))
