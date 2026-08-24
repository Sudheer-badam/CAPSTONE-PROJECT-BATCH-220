import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-contributions" class="tab-panel">(.*?)<div id="tab-team" class="tab-panel">', text, re.DOTALL)
if match:
    print('Length of Team Contributions tab:', len(match.group(1)))
else:
    print('Tab Contributions NOT FOUND before tab-team!')
