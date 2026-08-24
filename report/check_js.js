const fs = require('fs');
const vm = require('vm');
const text = fs.readFileSync('index.html', 'utf8');
const matches = text.match(/<script.*?>([\s\S]*?)<\/script>/g);
matches.forEach((s, i) => {
  const code = s.replace(/<script.*?>|<\/script>/g, '');
  try {
    new vm.Script(code);
    console.log(`Script ${i} OK`);
  } catch (e) {
    console.error(`Script ${i} Syntax Error:`, e.message);
  }
});
