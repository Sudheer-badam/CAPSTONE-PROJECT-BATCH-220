import re
text = open('index.html', 'r', encoding='utf-8').read()

tabs = '''  <div class="tabs">
    <button class="tab-btn active" onclick="showTab('tab-report', this)">📊 Project Report</button>
    <button class="tab-btn" onclick="showTab('tab-ppt', this)">📑 Presentation (PPT)</button>
    <button class="tab-btn" onclick="showTab('tab-papers', this)">📄 Research Papers</button>
    <button class="tab-btn" onclick="showTab('tab-diary', this)">📝 Weekly Diary</button>
    <button class="tab-btn" onclick="showTab('tab-contributions', this)">✍️ Team Contributions</button>
    <button class="tab-btn" onclick="showTab('tab-team', this)">👥 Team</button>
  </div>'''

text = re.sub(r'<div class="tabs">.*?</div>', tabs, text, flags=re.DOTALL)
open('index.html', 'w', encoding='utf-8').write(text)
