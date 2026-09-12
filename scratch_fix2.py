import re
file_path = 'report/index.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Hide edit buttons by default
content = re.sub(r'id="btn-edit-(\d+)" style="padding:', r'id="btn-edit-\1" style="display: none; padding:', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated index.html to hide edit buttons by default')
