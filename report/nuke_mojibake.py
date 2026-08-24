import re
text = open('index.html', 'r', encoding='utf-8').read()

replacements = {
    '——â‚¬——â‚¬': '---',
    'â†’': '->',
    'â¬‡': '[Download]',
    'ðŸ’¾': '[Save]',
    'ðŸ“…': 'Date:',
    'ðŸ“†': 'Day:',
    'ðŸ‘¤': 'Student:',
    'Ã°Å¸—˜Â¨â‚¬Â Ã°Å¸Â Â«': 'Mentor:',
    'âœ…': '[Saved]',
    'ðŸ“': '',
    'ðŸ’': '',
    'Â': '',
    'â': '',
    '€': '',
    'œ': '',
    '¬': '',
    '¾': '',
    'ð': '',
    'Ÿ': '',
    '˜': '',
    '¨': '',
    '«': '',
    'Ã': '',
    '°': '',
    'Å': '',
    '¸': '',
    '—': '-',
    '·': '-',
    '³': '3'
}

for old, new in replacements.items():
    text = text.replace(old, new)

# And any remaining random characters that typically appear in mojibake
text = re.sub(r'[^\x00-\x7F]', '', text)

open('index.html', 'w', encoding='utf-8').write(text)
print('Nuked all non-ascii characters!')
