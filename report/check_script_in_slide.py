import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="slide-content-wrap">.*?<script', text, re.DOTALL)
if match:
    print('Found script inside slide-content-wrap!')
else:
    print('No script inside slide-content-wrap')
