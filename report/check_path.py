import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<main>.*?(<div id="tab-papers")', text, re.DOTALL)
if match:
    print('Path from <main> to tab-papers:', match.group(0)[:500] + '\n...\n' + match.group(0)[-500:])
