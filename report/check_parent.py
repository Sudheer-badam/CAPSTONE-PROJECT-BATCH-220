import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<main>.*?(<div id="tab-report")', text, re.DOTALL)
if match:
    print(match.group(0))
