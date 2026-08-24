import re
text = open('login.html', 'r', encoding='utf-8').read()
match = re.search(r'window\.location\.href\s*=\s*["\'](.*?)["\']', text)
if match:
    print('Login redirects to:', match.group(1))
else:
    print('No redirect found!')
