import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-diary" class="tab-panel">(.*?)</div>\s*<div id="tab-contributions"', text, re.DOTALL)
if match:
    print(match.group(1)[:1000])
else:
    print('Tab diary not found')
