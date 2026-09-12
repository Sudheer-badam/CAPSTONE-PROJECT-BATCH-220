import re

filename = 'index.html'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# Add editor.layout() to editContrib
content = content.replace(
    "window.editors[id].updateOptions({ readOnly: false });",
    "window.editors[id].updateOptions({ readOnly: false });\n      setTimeout(() => window.editors[id].layout(), 10);"
)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Added layout call to editContrib")
