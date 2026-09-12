import re

filename = 'index.html'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Add 'disabled' to <textarea id="code-*">
content = re.sub(r'(<textarea[^>]*id="code-\d+"[^>]*style="display:none;")>', r'\1 disabled>', content)

# Add 'disabled' to <input id="file-*"> if they exist
content = re.sub(r'(<input[^>]*id="file-\d+"[^>]*type="file")', r'\1 disabled', content)

# Add 'disabled' to <input id="caption-*"> if they exist
content = re.sub(r'(<input[^>]*id="caption-\d+"[^>]*type="text")', r'\1 disabled', content)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added disabled attributes to HTML")
