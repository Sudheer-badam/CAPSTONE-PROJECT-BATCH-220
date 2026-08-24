import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-contributions".*?>', text)
if match:
    print('Found it:', match.group(0))
else:
    print('NOT FOUND!')
