import re

for filename in ['index.html', 'login.html']:
    text = open(filename, 'r', encoding='utf-8').read()
    if 'SERVER IS WORKING' not in text:
        banner = '<div style="background: red; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; z-index: 9999; position: relative;">SERVER IS WORKING - YOU ARE LOOKING AT THE RIGHT FILE</div>'
        text = text.replace('<body>', '<body>\n' + banner)
        open(filename, 'w', encoding='utf-8').write(text)
