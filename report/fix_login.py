import re

text = open('login.html', 'r', encoding='utf-8').read()

# 1. Remove the red banner
banner = '<div style="background: red; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; z-index: 9999; position: relative;">SERVER IS WORKING - YOU ARE LOOKING AT THE RIGHT FILE</div>\n'
text = text.replace(banner, '')
# Also handle case without trailing newline
banner_no_nl = '<div style="background: red; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; z-index: 9999; position: relative;">SERVER IS WORKING - YOU ARE LOOKING AT THE RIGHT FILE</div>'
text = text.replace(banner_no_nl, '')

# 2. Change align-items: flex-start to center
text = text.replace('align-items: flex-start;', 'align-items: center;')

open('login.html', 'w', encoding='utf-8').write(text)
print('Successfully removed banner and centered login page!')
