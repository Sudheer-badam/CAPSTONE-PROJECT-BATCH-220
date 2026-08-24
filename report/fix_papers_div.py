import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-papers".*?(<div id="tab-diary")', text, re.DOTALL)
if match:
    papers = match.group(0)
    opens = len(re.findall(r'<div\b', papers))
    closes = len(re.findall(r'</div\b', papers))
    print('Papers opens:', opens, 'closes:', closes)
    if opens > closes:
        new_text = text.replace('<div id="tab-diary"', '</div>\n\n  <div id="tab-diary"')
        open('index.html', 'w', encoding='utf-8').write(new_text)
        print('Fixed tab-papers missing closing div!')
