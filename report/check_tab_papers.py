import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div id="tab-papers" class="tab-panel">(.*?)<div id="tab-diary"', text, re.DOTALL)
if match:
    print(match.group(0)[:1500])
else:
    print("No match found for tab-papers")
