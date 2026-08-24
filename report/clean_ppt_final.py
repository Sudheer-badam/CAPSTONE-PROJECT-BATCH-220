import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

def clean_slide(match):
    slide_html = match.group(1)
    
    # Let's map some common smart quotes to ascii
    slide_html = slide_html.replace(chr(8217), "'")
    slide_html = slide_html.replace(chr(8216), "'")
    slide_html = slide_html.replace(chr(8220), '"')
    slide_html = slide_html.replace(chr(8221), '"')
    slide_html = slide_html.replace(chr(8211), '-')
    slide_html = slide_html.replace(chr(8212), '-')
    slide_html = slide_html.replace(chr(160), ' ') # nbsp
    
    # Now remove all non-ascii characters EXCEPT the bullet point (8226) and the specific characters allowed
    allowed = set([8226]) # bullet point
    
    cleaned = ''
    for char in slide_html:
        if ord(char) <= 127 or ord(char) in allowed:
            cleaned += char
            
    # Also clean up any weird spaces left behind
    cleaned = re.sub(r' +', ' ', cleaned)
    
    return f'<div class="slide-content-wrap">{cleaned}</div>'

# We apply this ONLY to the slide content wrappers so we don't accidentally break HTML outside
new_text = re.sub(r'<div class="slide-content-wrap">(.*?)</div>(?=</div>)', clean_slide, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_text)
