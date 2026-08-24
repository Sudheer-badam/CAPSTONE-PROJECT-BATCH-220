import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-report".*?(<div id="tab-ppt")', text, re.DOTALL)
if match:
    report = match.group(0)
    opens = len(re.findall(r'<div\b', report))
    closes = len(re.findall(r'</div\b', report))
    print('Report opens:', opens, 'closes:', closes)
