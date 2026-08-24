import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
text = open('index.html', 'r', encoding='utf-8').read()
start = text.find('deviceInfo =')
if start != -1:
    print(text[start:start+1000])
