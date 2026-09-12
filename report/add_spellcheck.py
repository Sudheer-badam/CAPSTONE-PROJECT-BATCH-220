import os
import re

def add_spellcheck(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Add spellcheck="true" to all textareas if not already present
    # Using regex to find <textarea ... > and insert spellcheck="true"
    def replace_textarea(match):
        tag = match.group(0)
        if 'spellcheck=' not in tag:
            # insert right after <textarea
            return tag.replace('<textarea', '<textarea spellcheck="true"')
        return tag
    
    new_content = re.sub(r'<textarea[^>]*>', replace_textarea, content)
    
    # Also apply to input type="text" just in case they have text inputs
    def replace_input(match):
        tag = match.group(0)
        if 'type="text"' in tag and 'spellcheck=' not in tag:
            return tag.replace('<input', '<input spellcheck="true"')
        return tag
        
    new_content = re.sub(r'<input[^>]*>', replace_input, new_content)
    
    if new_content != content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filename}")

files_to_update = [
    'index.html',
    'contributions_tab.html',
    'gen_contrib_html.py',
    'login.html'
]

for f in files_to_update:
    add_spellcheck(f)
