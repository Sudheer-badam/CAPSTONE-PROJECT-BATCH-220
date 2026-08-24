import re
text = open('index.html', 'r', encoding='utf-8').read()
if '<script src="contrib_logic.js"></script>' not in text:
    new_text = text.replace('</body>', '  <script src="contrib_logic.js"></script>\n</body>')
    open('index.html', 'w', encoding='utf-8').write(new_text)
    print('Added contrib_logic.js script tag to index.html!')
else:
    print('Already present')
