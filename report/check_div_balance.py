import re

text = open('index.html', 'r', encoding='utf-8').read()

# Find the start and end of each tab
tabs = ['tab-report', 'tab-ppt', 'tab-papers', 'tab-diary', 'tab-contributions', 'tab-team']
for i in range(len(tabs)):
    start_tag = f'<div id="{tabs[i]}"'
    start_idx = text.find(start_tag)
    
    if i < len(tabs) - 1:
        end_idx = text.find(f'<div id="{tabs[i+1]}"')
    else:
        end_idx = text.find('<script>')
    
    chunk = text[start_idx:end_idx]
    div_opens = len(re.findall(r'<div\b[^>]*>', chunk))
    div_closes = len(re.findall(r'</div>', chunk))
    print(f"{tabs[i]}: opens={div_opens}, closes={div_closes}, net={div_opens - div_closes}")
