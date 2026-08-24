import re
text = open('index.html', 'r', encoding='utf-8').read()

replacements = {
    'ðŸ“… Date': 'Date',
    'ðŸ“† Day': 'Day',
    'ðŸ‘¤ Student': 'Student',
    'Ã°Å¸—˜Â¨â‚¬Â Ã°Å¸Â Â« Mentor': 'Mentor',
    'ðŸ’¾ Save All Weeks': 'Save All Weeks',
    '📊 Project Report': 'Project Report',
    '📑 Presentation (PPT)': 'Presentation (PPT)',
    '📄 Research Papers': 'Research Papers',
    '📝 Weekly Diary': 'Weekly Diary',
    '✍️ Team Contributions': 'Team Contributions',
    '👥 Team': 'Team',
    '——â‚¬——â‚¬ TAB: WEEKLY DIARY ——â‚¬——â‚¬': '<!-- TAB: WEEKLY DIARY -->',
    '——â‚¬——â‚¬ TAB: TEAM ——â‚¬——â‚¬': '<!-- TAB: TEAM -->',
    '——â‚¬——â‚¬ LIVE CLOCK (IST) ——â‚¬——â‚¬': '// LIVE CLOCK (IST)'
}

for old, new in replacements.items():
    text = text.replace(old, new)

# Let's also do a regex pass for anything that looks like mojibake before Date/Day/Student/Mentor
text = re.sub(r'[^\x00-\x7F]+ Date', 'Date', text)
text = re.sub(r'[^\x00-\x7F]+ Day', 'Day', text)
text = re.sub(r'[^\x00-\x7F]+ Student', 'Student', text)
text = re.sub(r'[^\x00-\x7F]+ Mentor', 'Mentor', text)
text = re.sub(r'[^\x00-\x7F]+ Save All Weeks', 'Save All Weeks', text)

open('index.html', 'w', encoding='utf-8').write(text)
print('Cleaned up mojibake and emojis!')
