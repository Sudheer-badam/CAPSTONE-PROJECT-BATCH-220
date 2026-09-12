import os
import glob
import json
import uuid

papers = []
pdf_files = glob.glob('*.pdf')

for pdf in pdf_files:
    if "Capstone" in pdf or "capstone" in pdf or "reasearch" in pdf or "FINAL" in pdf:
        size = os.path.getsize(pdf)
        size_mb = size / (1024 * 1024)
        papers.append({
            "id": str(uuid.uuid4()),
            "filename": pdf,
            "display_name": pdf.replace('.pdf', ''),
            "size_str": f"{size_mb:.1f} MB",
            "uploader_name": "System Admin",
            "uploader_email": "admin@kluniversity.in"
        })

# Sort by name
papers.sort(key=lambda x: x['display_name'])

with open('papers_state.json', 'w') as f:
    json.dump(papers, f, indent=2)

print(f"Migrated {len(papers)} papers.")
