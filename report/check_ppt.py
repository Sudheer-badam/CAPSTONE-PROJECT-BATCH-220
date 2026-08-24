import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

slides = re.findall(r'<div class="slide-content-wrap">(.*?)</div></div>', text, re.DOTALL)
for i, slide in enumerate(slides):
    print(f'--- SLIDE {i+1} ---')
    print(slide[:500])
