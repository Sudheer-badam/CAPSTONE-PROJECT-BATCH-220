import re

filename = 'index.html'
with open(filename, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Set Monaco default readOnly to true
content = content.replace(
    "scrollBeyondLastLine: false",
    "scrollBeyondLastLine: false,\n          readOnly: true"
)

# 2. Update editContrib
edit_replacement = """window.editContrib = function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.style.pointerEvents = 'auto';
  contentDiv.style.opacity = '1';
  
  document.getElementById(`code-${id}`).disabled = false;
  document.getElementById(`theory-${id}`).disabled = false;
  document.getElementById(`file-${id}`).disabled = false;
  if(document.getElementById(`caption-${id}`)) document.getElementById(`caption-${id}`).disabled = false;
  
  if (window.editors && window.editors[id]) {
      window.editors[id].updateOptions({ readOnly: false });
  }
  
  document.getElementById('btn-edit-' + id).style.display = 'none';
  document.getElementById('btn-save-' + id).style.display = 'inline-block';
};"""

content = re.sub(
    r'window\.editContrib = function\(id\) \{.*?\};',
    edit_replacement,
    content,
    flags=re.DOTALL
)

# 3. Update saveContrib
# Find the end of saveContrib where btn-save and btn-edit are toggled back
# Or simply find: "contentDiv.style.pointerEvents = 'none';" and insert the updateOptions there.
# Let's insert it right after `contentDiv.style.pointerEvents = 'none';`
content = content.replace(
    "contentDiv.style.pointerEvents = 'none';",
    "contentDiv.style.pointerEvents = 'none';\n  if (window.editors && window.editors[id]) { window.editors[id].updateOptions({ readOnly: true }); }"
)

# 4. Sync Monaco in initContributions when fetching from DB
# Look for: if (codeBox && codeBox.disabled) codeBox.value = studentData.code_work || "";
sync_replacement = """if (codeBox && codeBox.disabled) {
              codeBox.value = studentData.code_work || "";
              if (window.editors && window.editors[student.id]) {
                  window.editors[student.id].setValue(studentData.code_work || "");
              }
            }"""

content = content.replace(
    'if (codeBox && codeBox.disabled) codeBox.value = studentData.code_work || "";',
    sync_replacement
)

with open(filename, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html")
