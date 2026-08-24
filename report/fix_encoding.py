import re

text = open('index.html', 'r', encoding='utf-8').read()

replacements = {
    'NLP Â· BERT Â· VADER': 'NLP · BERT · VADER',
    '2026â€“27': '2026–27',
    'ðŸ“Š': '📊',
    'ðŸ“‘': '📑',
    'ðŸ“„': '📄',
    'ðŸ“ ': '📝',
    'Ã¢Å“Â Ã¯Â¸ ': '✍️',
    'âœ ï¸ ': '✍️',
    'ðŸ‘¥': '👥',
    'Ã¢â€ â‚¬Ã¢â€ â‚¬': '──',
    'Ã¢â‚¬â€ ': '—',
    'Ã°Å¸â€˜Â¨Ã¢â‚¬Â Ã°Å¸Â Â«': '👨‍🏫',
    'Â·': '·',
    'â€“': '–',
    'â€”': '—',
    'Ã¢â€ â‚¬': '─',
    'â€': '—' # Some hyphens got converted to this
}

for k, v in replacements.items():
    text = text.replace(k, v)

# Let's fix the tab buttons entirely to be safe
tabs = '''  <div class="tabs">
    <button class="tab-btn active" onclick="showTab('tab-report', this)">📊 Project Report</button>
    <button class="tab-btn" onclick="showTab('tab-ppt', this)">📑 Presentation (PPT)</button>
    <button class="tab-btn" onclick="showTab('tab-papers', this)">📄 Research Papers</button>
    <button class="tab-btn" onclick="showTab('tab-diary', this)">📝 Weekly Diary</button>
    <button class="tab-btn" onclick="showTab('tab-contributions', this)">✍️ Team Contributions</button>
    <button class="tab-btn" onclick="showTab('tab-team', this)">👥 Team</button>
  </div>'''

text = re.sub(r'<div class="tabs">.*?</div>', tabs, text, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
