import re

text = open('index.html', 'r', encoding='utf-8').read()

pdf_script = """
<script>
  document.addEventListener("DOMContentLoaded", () => {
    const pdfFiles = [
      { title: "Research Paper 1", url: "Capstone Project Reasearch Paper-1.pdf" },
      { title: "Research Paper 2", url: "Capstone project Reasearch Paper-2.pdf" },
      { title: "Research Paper 3", url: "Capstone project Reasearch paper-3.pdf" },
      { title: "Research Paper 4", url: "Capstone Project reasearch paper-4.pdf" },
      { title: "Research Paper 5", url: "Capstone Project Reasearch Paper-5.pdf" },
      { title: "Research Paper 6", url: "Capstone Project Reasearch Paper-6.pdf" },
      { title: "Research Paper 7", url: "Capstone Project Reasearch Paper-7.pdf" },
      { title: "Research Paper 8", url: "Capstone Project Reasearch Paper-8.pdf" },
      { title: "Research Paper 9", url: "Capstone Project Reasearch Paper-9.pdf" },
      { title: "Research Paper 10", url: "Capstone Project Reasearch Paper-10.pdf" },
      { title: "Research Paper 11", url: "Capstone Project Reasearch Paper-11.pdf" },
      { title: "Research Paper 12", url: "Capstone Project Reasearch Paper-12.pdf" },
      { title: "Research Paper 13", url: "Capstone Project Reasearch Paper-13.pdf" },
      { title: "Research Paper 14", url: "Capstone Project Reasearch Paper-14.pdf" },
      { title: "Research Paper 15", url: "Capstone project Reasearch paper-15.pdf" },
      { title: "Research Paper 16", url: "Capstone project Reasearch paper-16.pdf" },
      { title: "Research Paper 17", url: "Capstone project Reasearch paper-17.pdf" }
    ];

    const pdfContainer = document.getElementById('pdf-container');
    if (pdfContainer) {
      pdfFiles.forEach(pdf => {
        const card = document.createElement('div');
        card.className = 'pdf-card';
        card.onclick = () => window.open(pdf.url, '_blank');
        card.innerHTML = `<div class="pdf-icon">📄</div><div class="pdf-title">${pdf.title}</div><div class="pdf-dl">⬇ Download</div>`;
        pdfContainer.appendChild(card);
      });
    }
  });
</script>
"""

# check if it already has it so we dont double inject
if "Capstone Project Reasearch Paper-1.pdf" not in text:
    text = text.replace('</body>', pdf_script + '\n</body>')
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Injected PDF Script!")
else:
    print("Already there!")
