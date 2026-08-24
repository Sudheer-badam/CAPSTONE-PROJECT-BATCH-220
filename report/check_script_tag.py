import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<script.*?>\s*// .*?TAB SWITCHER', text, re.DOTALL)
if match:
    print('Script tag is:', match.group(0).split('//')[0])
