import re
text = open('index.html', 'r', encoding='utf-8').read()
slides = re.findall(r'<div class="slide-content-wrap">(.*?)</div></div>', text, re.DOTALL)
print('Number of slides:', len(slides))
if len(slides) > 0:
    print('First slide length:', len(slides[0]))
    print(repr(slides[0][:200]))
