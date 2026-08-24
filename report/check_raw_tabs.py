import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="tabs">.*?</div>', text, re.DOTALL)
if match:
    print(repr(match.group(0)))
