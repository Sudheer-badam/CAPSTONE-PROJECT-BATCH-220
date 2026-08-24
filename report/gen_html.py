with open('extracted_ppt_text.md', 'r', encoding='utf-8') as f:
    text = f.read()

html = '''
<div style="margin-top: 32px; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px; text-align: left;">
  <div style="font-size: 18px; font-weight: 700; color: var(--text1); margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
    Extracted Presentation Content
  </div>
  <div style="display: flex; flex-direction: column; gap: 24px;">
'''

for part in text.split('## Slide '):
    if not part.strip(): continue
    lines = part.strip().split('\n')
    slide_num = lines[0].strip()
    content = lines[1:]

    html += f'<div style="background: rgba(255,255,255,0.03); border-radius: 12px; padding: 20px; border: 1px solid var(--border);">'
    html += f'<h4 style="font-size: 14px; color: var(--accent); margin-bottom: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Slide {slide_num}</h4>'
    
    if slide_num == '7':
        html += '<div style="background: rgba(74, 222, 128, 0.1); border-left: 4px solid #4ade80; padding: 16px; border-radius: 8px; margin-bottom: 16px;">'
        html += '<h5 style="color: #4ade80; font-size: 14px; font-weight: 700; margin-bottom: 8px;">🛠️ Hardware / Software Requirements & Cost</h5>'
        for line in content:
            if line.strip():
                html += f'<div style="font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 4px;">• {line}</div>'
        html += '</div>'
    else:
        for line in content:
            if line.strip():
                html += f'<div style="font-size: 14px; color: var(--text2); line-height: 1.6; margin-bottom: 8px;">{line}</div>'
    
    html += '</div>\n'

html += '''
  </div>
</div>
'''

with open('ppt_tab_injection.html', 'w', encoding='utf-8') as f:
    f.write(html)
