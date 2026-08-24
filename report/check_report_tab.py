import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-report" class="tab-panel active">(.*?)<div id="tab-ppt" class="tab-panel">', text, re.DOTALL)
if match:
    print('Report tab size:', len(match.group(1)))
    print(repr(match.group(1)[:200]))
else:
    print("NO MATCH FOUND")
