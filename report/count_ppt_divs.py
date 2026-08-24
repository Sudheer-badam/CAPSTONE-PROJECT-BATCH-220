import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-ppt" class="tab-panel">(.*?)<div id="tab-papers" class="tab-panel">', text, re.DOTALL)
if match:
    ppt_content = match.group(1)
    opens = len(re.findall(r'<div\b', ppt_content))
    closes = len(re.findall(r'</div\b', ppt_content))
    print('PPT div opens:', opens)
    print('PPT div closes:', closes)
