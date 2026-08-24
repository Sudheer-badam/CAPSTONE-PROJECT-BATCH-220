import re

html = open('index.html', 'r', encoding='utf-8').read()

def replacer(match):
    id = match.group(1)
    return f'''<div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 8px;">
        <button onclick="editContrib('{id}')" id="btn-edit-{id}" style="padding: 4px 8px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid var(--border); color: var(--text1); border-radius: 4px; cursor: pointer;">Edit</button>
        <button onclick="saveContrib('{id}')" id="btn-save-{id}" style="display: none; padding: 4px 8px; font-size: 11px; background: var(--accent); border: none; color: white; border-radius: 4px; cursor: pointer;">Save</button>
      </div>'''

# Replace locks
html = re.sub(r'<div id="lock-(\d+)"[^>]*>.*?</div>', replacer, html)

open('index.html', 'w', encoding='utf-8').write(html)
