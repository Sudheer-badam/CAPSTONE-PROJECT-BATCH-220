import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-papers".*?<div id="tab-diary"', text, re.DOTALL)
if match:
    print(match.group(0))
else:
    print("Not found")
