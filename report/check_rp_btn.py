import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'<button class="tab-btn".*?Research Papers.*?</button>', text, re.IGNORECASE)
if match:
    print(match.group(0))
