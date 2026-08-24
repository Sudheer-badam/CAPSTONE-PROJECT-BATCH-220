import re
text = open('index.html', 'r', encoding='utf-8').read()
panels = re.findall(r'<div id="tab-[^"]*" class="tab-panel.*?">', text)
for panel in panels:
    print('Found:', panel)
