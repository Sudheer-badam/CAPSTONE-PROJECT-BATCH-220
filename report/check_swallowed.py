import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<div class="slide-content-wrap">(.*?<script.*?</script>.*?)</div></div>', text, re.DOTALL)
if match:
    print('Found the swallowed script block! Length:', len(match.group(1)))
    print(repr(match.group(1)[:200]))
    print('...')
    print(repr(match.group(1)[-200:]))
else:
    print('No swallowed script found')
