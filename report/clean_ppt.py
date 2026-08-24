text = open('index.html', 'r', encoding='utf-8').read()

replacements = {
    'Womenâ€™s': "Women's",
    'womenâ€™s': "women's",
    'Womens': "Women's",
    'womens': "women's",
    'Womens': "Women's",
    'womens': "women's",
    '202627': '2026–27',
    '202627': '2026–27',
    ' ': '• ',
    ' ': '• ',
    '': '•',
    'projects': "project's",
    'Projects': "Project's",
    'projectâ€™s': "project's",
    'Projectâ€™s': "Project's",
    'projects': "project's",
    'Projects': "Project's",
    '': '•'
}

for k, v in replacements.items():
    text = text.replace(k, v)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
