import re
text = open('index.html', 'r', encoding='utf-8').read()
match = re.search(r'(<div id="tab-team".*?</main>)', text, re.DOTALL)
if match:
    print(match.group(1)[-500:])
else:
    print("NO MAIN ENDING FOUND AFTER TAB-TEAM")
