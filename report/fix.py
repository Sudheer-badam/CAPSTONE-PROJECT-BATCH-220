import os
import re

for f in ['index.html', 'contrib_logic.js', 'temp_check.js', 'temp_syntax_check.js']:
    if not os.path.exists(f): continue
    try:
        content = open(f, encoding='utf-8').read()
        
        # 1. Revert global save button hiding
        content = content.replace(
'''      const globalBtn = document.getElementById("btn-save-all-diaries");
      if (globalBtn) globalBtn.style.display = isMentor ? 'inline-block' : 'none';
      for (let i = 1; i <= 13; i++) {
        const saveBtn = document.getElementById(`btn-save-${i}`);
        if (saveBtn) saveBtn.style.display = isMentor ? 'inline-block' : 'none';''',
'''      for (let i = 1; i <= 13; i++) {'''
        )
        
        # 2. Fix the edit button logic in initContributions
        old_code = "      document.getElementById(`btn-edit-${student.id}`).style.display = 'inline-block';"
        
        new_code = '''      const uName = (window._currentUserName || "").toLowerCase().trim();
      const sName = student.name.toLowerCase().trim();
      const isNameMatch = uName && (sName.includes(uName.split(' ')[0]) || uName.includes(sName.split(' ')[0]));
      
      if (userEmail === student.email || userEmail.includes(student.id) || isNameMatch || window._currentUserEmail === "msubbarao@kluniversity.in") {
        document.getElementById(`btn-edit-${student.id}`).style.display = 'inline-block';
      } else {
        document.getElementById(`btn-edit-${student.id}`).style.display = 'none';
      }'''
          
        content = content.replace(old_code, new_code)
        
        open(f, 'w', encoding='utf-8').write(content)
        print('Fixed', f)
    except Exception as e:
        print('Error in', f, e)
