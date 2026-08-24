import re

text = open('index.html', 'r', encoding='utf-8').read()

tabs = ['tab-report', 'tab-ppt', 'tab-papers', 'tab-diary', 'tab-contributions', 'tab-team']

# We have to process from the last tab to the first tab, 
# so that modifying the text doesn't mess up the indices for subsequent tabs.
# Actually, wait, it's safer to just split the string, process each chunk, and re-join!

chunks = []
start_idx = 0
for i in range(len(tabs)):
    tab_start = text.find(f'<div id="{tabs[i]}"')
    if tab_start == -1:
        print(f"ERROR: {tabs[i]} not found!")
        continue
    
    # Everything before this tab is added to chunks
    if i == 0:
        chunks.append(text[:tab_start])
    else:
        # We need to extract the chunk for the PREVIOUS tab
        prev_tab_start = text.find(f'<div id="{tabs[i-1]}"')
        chunk = text[prev_tab_start:tab_start]
        
        opens = len(re.findall(r'<div\b[^>]*>', chunk))
        closes = len(re.findall(r'</div>', chunk))
        diff = opens - closes
        print(f"{tabs[i-1]}: opens={opens}, closes={closes}, diff={diff}")
        
        if diff > 0:
            chunk = chunk.rstrip() + '\n' + ('</div>\n' * diff)
        elif diff < 0:
            for _ in range(-diff):
                last_div_idx = chunk.rfind('</div>')
                if last_div_idx != -1:
                    chunk = chunk[:last_div_idx] + chunk[last_div_idx+6:]
        chunks.append(chunk)

# Now handle the last tab (tab-team)
last_tab_start = text.find(f'<div id="{tabs[-1]}"')
end_idx = text.find('<script>')
chunk = text[last_tab_start:end_idx]

opens = len(re.findall(r'<div\b[^>]*>', chunk))
closes = len(re.findall(r'</div>', chunk))
diff = opens - closes
print(f"{tabs[-1]}: opens={opens}, closes={closes}, diff={diff}")

if diff > 0:
    chunk = chunk.rstrip() + '\n' + ('</div>\n' * diff)
elif diff < 0:
    for _ in range(-diff):
        last_div_idx = chunk.rfind('</div>')
        if last_div_idx != -1:
            chunk = chunk[:last_div_idx] + chunk[last_div_idx+6:]
chunks.append(chunk)

# Add the rest of the file
chunks.append(text[end_idx:])

final_text = ''.join(chunks)

# Let's verify the balance
print("Verification:")
for i in range(len(tabs)):
    start_idx = final_text.find(f'<div id="{tabs[i]}"')
    if i < len(tabs) - 1:
        end_idx = final_text.find(f'<div id="{tabs[i+1]}"')
    else:
        end_idx = final_text.find('<script>')
    chunk = final_text[start_idx:end_idx]
    opens = len(re.findall(r'<div\b[^>]*>', chunk))
    closes = len(re.findall(r'</div>', chunk))
    print(f"{tabs[i]}: diff = {opens - closes}")

open('index.html', 'w', encoding='utf-8').write(final_text)
print('DOM balanced!')
