import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

slides = re.findall(r'<div class="slide-content-wrap">(.*?)</div></div>', text, re.DOTALL)
seen = set()
for slide in slides:
    for char in slide:
        if ord(char) > 127 and char not in seen:
            print(f'Special char found: {repr(char)} (ord {ord(char)})')
            seen.add(char)
