import re
text = open('index.html', 'r', encoding='utf-8').read()
slides = re.findall(r'<div class="slide-content-wrap">(.*?)</div></div>', text, re.DOTALL)
print('Last slide length:', len(slides[-1]))
print('Last slide ends with:', repr(slides[-1][-500:]))
