import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="tabs">(.*?)</div>', text, re.DOTALL)
if match:
    print(match.group(1))
