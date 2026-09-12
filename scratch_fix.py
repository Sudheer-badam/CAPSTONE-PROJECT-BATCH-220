import re

file_path = 'report/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix user-name error
content = content.replace('document.getElementById("user-name").textContent', 'document.getElementById("user-name")?.textContent')

# 2. Remove 'Code Work' sections
pattern = r'<div style=\"display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;\">\s*<label style=\"font-size: 12px; font-weight: 600; color: var\(--text2\);\">Code Work:</label>.*?<div id=\"output-wrapper-\d+\" style=\"display:none; margin-bottom: 12px;\">\s*<div style=\"font-size: 11px; color: var\(--text2\); margin-bottom: 4px; font-weight: bold;\">Execution Output:</div>\s*<pre id=\"output-\d+\"[^>]*></pre>\s*</div>'

new_content = re.sub(pattern, '', content, flags=re.DOTALL)

if len(new_content) == len(content):
    print("WARNING: No code work sections removed in index.html. Pattern might be wrong.")
else:
    print("Removed code work sections in index.html")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

# Fix in contrib_logic.js as well
contrib_path = 'report/contrib_logic.js'
with open(contrib_path, 'r', encoding='utf-8') as f:
    contrib_content = f.read()

# Remove code work parsing in contrib_logic.js
contrib_pattern = r'if \(code\) compiledText \+= `\[Code Work\]: \$\{code\}\\n`;\s*'
new_contrib_content = re.sub(contrib_pattern, '', contrib_content)

with open(contrib_path, 'w', encoding='utf-8') as f:
    f.write(new_contrib_content)
print("Updated contrib_logic.js")
