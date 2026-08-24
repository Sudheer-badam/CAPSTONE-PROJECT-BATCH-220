import sys, io, re
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
text = open('index.html', 'r', encoding='utf-8').read()

# Extract the papers array from JS
match = re.search(r'const papers = \[\s*(.*?)\s*\];', text, re.DOTALL)
if not match:
    print("Papers array not found")
    sys.exit(1)

papers_js = match.group(1)
# Parse the JS objects
papers = []
for line in papers_js.split('\n'):
    if '{' in line and '}' in line:
        name_match = re.search(r'name:\s*"([^"]+)"', line)
        file_match = re.search(r'file:\s*"([^"]+)"', line)
        size_match = re.search(r'size:\s*"([^"]+)"', line)
        if name_match and file_match and size_match:
            papers.append({
                'name': name_match.group(1),
                'file': file_match.group(1),
                'size': size_match.group(1)
            })

# Generate static HTML
static_html = ''
for p in papers:
    static_html += f'''
      <a class="pdf-card" href="{p['file']}" target="_blank">
        <div class="pdf-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        </div>
        <div>
          <div class="pdf-name">{p['name']}</div>
          <div class="pdf-size">{p['size']} - Click to open</div>
        </div>
      </a>
'''

# Replace the empty grid with the populated grid
new_grid = f'<div class="pdf-grid" id="pdf-grid">\n{static_html}    </div>'
text = re.sub(r'<div class="pdf-grid" id="pdf-grid"></div>', new_grid, text)

# Delete the JS that builds it
js_to_delete = r'// --- BUILD PDF GRID ---.*?grid\.appendChild\(a\);\n  \}\);'
text = re.sub(js_to_delete, '', text, flags=re.DOTALL)

open('index.html', 'w', encoding='utf-8').write(text)
print("Statically injected Research Papers grid!")
