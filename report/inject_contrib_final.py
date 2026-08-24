import re
text = open('index.html', 'r', encoding='utf-8').read()
contrib_html = open('contributions_tab.html', 'r', encoding='utf-8').read()
new_text = re.sub(r'<div id="tab-contributions" class="tab-panel">.*?<!-- .*?TAB: TEAM .*?-->', '<div id="tab-contributions" class="tab-panel">\n' + contrib_html + '\n</div>\n\n  <!-- TAB: TEAM -->', text, flags=re.DOTALL)
open('index.html', 'w', encoding='utf-8').write(new_text)
print('Injected New Team Contributions Tab!')
