import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-papers".*?>', text)
if match:
    print(match.group(0))
