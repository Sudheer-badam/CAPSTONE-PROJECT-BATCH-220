import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<script type="module">(.*?)</script>', text, re.DOTALL)
if match:
    print(match.group(1)[:1500])
