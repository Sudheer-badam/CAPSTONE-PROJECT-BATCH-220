import re
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-diary" class="tab-panel">(.*?)<div id="tab-contributions"', text, re.DOTALL)
if match:
    print(match.group(1)[:1500])
else:
    print('Tab diary not found')
