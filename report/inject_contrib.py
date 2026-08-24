import re
text = open('index.html', 'r', encoding='utf-8').read()

if 'id="tab-contributions"' not in text:
    contrib_html = open('contributions_tab.html', 'r', encoding='utf-8').read()
    text = re.sub(r'(<div id="tab-team" class="tab-panel">)', contrib_html + r'\n\n\1', text)
    open('index.html', 'w', encoding='utf-8').write(text)
    print('Injected!')
else:
    print('Already exists!')
