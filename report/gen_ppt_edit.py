import re

html = open('index.html', 'r', encoding='utf-8').read()

def header_replacer(match):
    slide_html = match.group(0)
    return slide_html + '''
<div style="display: flex; gap: 8px; position: absolute; right: 20px; top: 20px;">
  <button onclick="let c = this.parentElement.nextElementSibling; c.contentEditable='true'; c.style.border='1px dashed var(--accent)'; c.style.padding='8px'; c.focus(); this.nextElementSibling.style.display='block'; this.style.display='none';" style="padding: 4px 12px; font-size: 11px; background: rgba(255,255,255,0.1); border: 1px solid var(--border); color: var(--text1); border-radius: 4px; cursor: pointer;">Edit Slide</button>
  <button onclick="let c = this.parentElement.nextElementSibling; c.contentEditable='false'; c.style.border='none'; c.style.padding='0'; this.previousElementSibling.style.display='block'; this.style.display='none'; alert('Slide content saved locally!');" style="display: none; padding: 4px 12px; font-size: 11px; background: var(--accent); border: none; color: white; border-radius: 4px; cursor: pointer;">Save</button>
</div><div class="slide-content-wrap">
'''

html = html.replace('<div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid var(--border);">', '<div style="position: relative; background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid var(--border);">')

html = re.sub(r'<h4 style="font-size: 14px; color: var\(--accent\); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Slide \d+</h4>', header_replacer, html)

html = html.replace('</div>\n<div style="position: relative; background: rgba(255,255,255,0.03)', '</div></div>\n<div style="position: relative; background: rgba(255,255,255,0.03)')
html = html.replace('</div>\n  </div>\n</div>\n\n  <!-- ── TAB: CONTRIBUTIONS ── -->', '</div></div>\n  </div>\n</div>\n\n  <!-- ── TAB: CONTRIBUTIONS ── -->')

open('index.html', 'w', encoding='utf-8').write(html)
