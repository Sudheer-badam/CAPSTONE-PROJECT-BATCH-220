import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-ppt" class="tab-panel">(.*?)<div id="tab-papers" class="tab-panel">', text, re.DOTALL)
if match:
    print('Length of PPT tab:', len(match.group(1)))
    print(repr(match.group(1)[-200:]))
else:
    print('PPT Tab NOT properly closed before Research Papers Tab!')
