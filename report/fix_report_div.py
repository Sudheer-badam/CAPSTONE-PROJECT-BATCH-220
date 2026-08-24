import re
text = open('index.html', 'r', encoding='utf-8').read()

# Make sure we don't double inject
match = re.search(r'<div id="tab-report".*?(<div id="tab-ppt")', text, re.DOTALL)
if match:
    report = match.group(0)
    opens = len(re.findall(r'<div\b', report))
    closes = len(re.findall(r'</div\b', report))
    if opens > closes:
        new_text = text.replace('<div id="tab-ppt"', '</div>\n\n  <div id="tab-ppt"')
        open('index.html', 'w', encoding='utf-8').write(new_text)
        print('Fixed missing closing div on tab-report!')
    else:
        print('Already fixed!')
else:
    print('tab-report or tab-ppt not found')
