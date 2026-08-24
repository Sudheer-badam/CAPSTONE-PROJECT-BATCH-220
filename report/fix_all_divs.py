import re
text = open('index.html', 'r', encoding='utf-8').read()

def fix_tab(tab_id, next_tab_id):
    global text
    match = re.search(f'<div id="{tab_id}".*?(<div id="{next_tab_id}")', text, re.DOTALL)
    if match:
        panel = match.group(0)
        opens = len(re.findall(r'<div\b', panel))
        closes = len(re.findall(r'</div\b', panel))
        print(f'{tab_id} opens:', opens, 'closes:', closes)
        if opens > closes:
            new_text = text.replace(f'<div id="{next_tab_id}"', '</div>\n\n  <div id="' + next_tab_id + '"')
            text = new_text
            print(f'Fixed {tab_id} missing closing div!')

fix_tab('tab-diary', 'tab-contributions')
fix_tab('tab-contributions', 'tab-team')

# For the last tab (tab-team), we check up to </main>
match = re.search(r'<div id="tab-team".*?(</main>)', text, re.DOTALL)
if match:
    panel = match.group(0)
    opens = len(re.findall(r'<div\b', panel))
    closes = len(re.findall(r'</div\b', panel))
    print('tab-team opens:', opens, 'closes:', closes)
    if opens > closes:
        new_text = text.replace('</main>', '</div>\n</main>')
        text = new_text
        print('Fixed tab-team missing closing div!')

open('index.html', 'w', encoding='utf-8').write(text)
print('All tabs checked!')
