text = open('index.html', 'r', encoding='utf-8').read()
script = '''
  window.saveAllDiaries = async function() {
    const btn = document.querySelector('button[onclick="saveAllDiaries()"]');
    if (btn) { btn.innerHTML = 'Saving...'; btn.disabled = true; }
    for (let i = 1; i <= 13; i++) {
      try {
        await window.saveWeek(i);
      } catch (e) {
        console.error('Error saving week ' + i, e);
      }
    }
    if (btn) { btn.innerHTML = 'Save All Weeks'; btn.disabled = false; }
    alert('All weeks saved to Firebase!');
  };
'''
new_text = text.replace('// LIVE CLOCK (IST)', script + '\n\n  // LIVE CLOCK (IST)')
open('index.html', 'w', encoding='utf-8').write(new_text)
print('Added saveAllDiaries!')
