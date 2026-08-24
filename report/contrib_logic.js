
  // ── TEAM CONTRIBUTIONS LOGIC ──
  const STUDENTS = [
    { id: "2300033848", name: "Mitta Kavya Nayana", email: "2300033848@kluniversity.in" },
    { id: "2300032512", name: "Inti Hanitha Sai Gayathri", email: "2300032512@kluniversity.in" },
    { id: "2300032267", name: "Kokkiligadda T.V. Durga Rao", email: "2300032267@kluniversity.in" },
    { id: "2300033278", name: "Badam Sudheer Reddy", email: "2300033278@kluniversity.in" },
    { id: "2300030988", name: "Garikapati Satya Karthika", email: "2300030988@kluniversity.in" }
  ];

  document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('contrib-date-picker');
    if (datePicker && !datePicker.value) {
      datePicker.value = new Date().toISOString().split('T')[0]; // Set today
    }
  });

  window.previewImage = function(id, input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.getElementById(`preview-container-${id}`).style.display = 'block';
        document.getElementById(`preview-${id}`).src = e.target.result;
        document.getElementById(`url-${id}`).value = ''; // Clear old URL so we know it's a new file
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  let unsubscribeContributions = null;

  window.initContributions = function() {
    let userEmail = window._currentUserEmail;
    if (userEmail === "dev@kluniversity.in") userEmail = "2300033278@kluniversity.in";
    
    const datePicker = document.getElementById('contrib-date-picker');
    const selectedDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];

    STUDENTS.forEach(student => {
      const contentDiv = document.getElementById(`content-${student.id}`);
      if (!contentDiv) return;

      if (userEmail === student.email || userEmail === "msubbarao@kluniversity.in") {
        document.getElementById(`btn-edit-${student.id}`).style.display = 'inline-block';
      } else {
        document.getElementById(`btn-edit-${student.id}`).style.display = 'none';
      }
      
      // Reset fields before loading new date
      document.getElementById(`code-${student.id}`).value = '';
      document.getElementById(`theory-${student.id}`).value = '';
      document.getElementById(`file-${student.id}`).value = '';
      if(document.getElementById(`caption-${student.id}`)) document.getElementById(`caption-${student.id}`).value = '';
      document.getElementById(`preview-${student.id}`).src = '';
      document.getElementById(`url-${student.id}`).value = '';
      document.getElementById(`preview-container-${student.id}`).style.display = 'none';
    });

    if (unsubscribeContributions) unsubscribeContributions();

    if (window._db && window._doc && window._onSnapshot) {
      unsubscribeContributions = window._onSnapshot(window._doc(window._db, "team_progress", selectedDate), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          STUDENTS.forEach(student => {
            const codeBox = document.getElementById(`code-${student.id}`);
            const theoryBox = document.getElementById(`theory-${student.id}`);
            const urlBox = document.getElementById(`url-${student.id}`);
            const previewCont = document.getElementById(`preview-container-${student.id}`);
            const previewImg = document.getElementById(`preview-${student.id}`);
            const captionBox = document.getElementById(`caption-${student.id}`);
            
            const studentData = data[student.id] || {};
            
            // Only update if not actively typing (disabled means they aren't editing)
            if (codeBox && codeBox.disabled) codeBox.value = studentData.code_work || "";
            if (theoryBox && theoryBox.disabled) theoryBox.value = studentData.theory_work || "";
            if (captionBox && captionBox.disabled) captionBox.value = studentData.diagram_caption || "";
            if (urlBox && codeBox.disabled) {
                urlBox.value = studentData.diagram_url || "";
                if (studentData.diagram_caption) {
          compiledText += `\n  * Photo Caption: ${studentData.diagram_caption}`;
      }
      if (studentData.diagram_url) {
                    previewImg.src = studentData.diagram_url;
                    previewCont.style.display = 'block';
                } else {
                    previewCont.style.display = 'none';
                }
            }
          });
          updateMasterContribution();
        }
      });
    }
  };

  window.updateMasterContribution = function() {
    const masterBox = document.getElementById("contrib-master");
    if (!masterBox) return;
    const datePicker = document.getElementById('contrib-date-picker');
    const selectedDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];

    let compiledText = `🔥 TEAM CAPSTONE BATCH 220 - DAILY UPDATE (${selectedDate}) 🔥\n`;
    compiledText += "=========================================================\n\n";

    STUDENTS.forEach(student => {
      const code = document.getElementById(`code-${student.id}`)?.value.trim() || "";
      const theory = document.getElementById(`theory-${student.id}`)?.value.trim() || "";
      
      compiledText += `👤 ${student.name} (${student.id}):\n`;
      if (code || theory) {
        if (code) compiledText += `[Code Work]: ${code}\n`;
        if (theory) compiledText += `[Theory Work]: ${theory}\n`;
      } else {
        compiledText += "No updates provided yet.\n";
      }
      compiledText += "\n";
    });

    masterBox.value = compiledText;
  };

  
// Helper to compress images before upload
window.compressImage = function(file, maxWidth = 1024, quality = 0.7) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(file); // Don't compress non-images
      return;
    }
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => {
          if (!blob) { resolve(file); return; }
          // Create a new File object from the blob
          const newFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(newFile);
        }, 'image/jpeg', quality);
      };
      img.onerror = reject;
  });
};

window.saveContributions = async function() {

    if(window.setServerStatus) window.setServerStatus(1);
    const btn = document.getElementById("btn-save-contrib");
    if (!window._db || !window._setDoc || !window._doc) {
       alert("Database not ready yet.");
       if(window.setServerStatus) window.setServerStatus(0);
       return;
    }
    
    const datePicker = document.getElementById('contrib-date-picker');
    const selectedDate = datePicker ? datePicker.value : new Date().toISOString().split('T')[0];

    const payload = {};
    const masterBox = document.getElementById("contrib-master");
    if (masterBox) payload.master_summary = masterBox.value;

    btn.innerHTML = `⏳ Saving...`;
    
    const uploadPromises = [];
    
    for (let student of STUDENTS) {
      const codeBox = document.getElementById(`code-${student.id}`);
      const theoryBox = document.getElementById(`theory-${student.id}`);
      const fileInput = document.getElementById(`file-${student.id}`);
      const urlBox = document.getElementById(`url-${student.id}`);
      const captionBox = document.getElementById(`caption-${student.id}`);
      
      if (!codeBox) continue;
      
      let diagramUrl = urlBox.value;
      let captionText = captionBox ? captionBox.value : "";
      
      payload[student.id] = {
        code_work: codeBox.value,
        theory_work: theoryBox.value,
        diagram_url: diagramUrl,
        diagram_caption: captionText
      };
      
      if (fileInput.files && fileInput.files[0] && window._storage) {
        let file = fileInput.files[0];
        const p = (async () => {
            try {
                file = await window.compressImage(file, 400, 0.4);
                const storageRef = window._ref(window._storage, `team_diagrams/${selectedDate}/${student.id}_${file.name}`);
                await window._uploadBytes(storageRef, file);
                diagramUrl = await window._getDownloadURL(storageRef);
                urlBox.value = diagramUrl;
                payload[student.id].diagram_url = diagramUrl;
            } catch (e) {
                console.error("Upload failed for " + student.name, e);
            }
        })();
        uploadPromises.push(p);
      }
    }
    
    // OPTIMISTIC SAVE: Immediately save the text fields so the UI feels instant
    try {
      await window._setDoc(window._doc(window._db, "team_progress", selectedDate), payload, { merge: true });
    } catch (err) {
      console.error(err);
    }

    if (uploadPromises.length > 0) {
        btn.innerHTML = `✅ Saved Text! Uploading Photos...`;
        await Promise.all(uploadPromises);
        
        // After photos upload, save again to store the new image URLs
        try {
            await window._setDoc(window._doc(window._db, "team_progress", selectedDate), payload, { merge: true });
        } catch (err) {
            console.error(err);
        }
    }

    if(window.setServerStatus) window.setServerStatus(0);
    btn.innerHTML = `✅ Fully Saved!`;
    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg><span>Save to Database</span>`;
    }, 2000);
  };

window.editContrib = function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.style.pointerEvents = 'auto';
  contentDiv.style.opacity = '1';
  
  document.getElementById(`code-${id}`).disabled = false;
  document.getElementById(`theory-${id}`).disabled = false;
  document.getElementById(`file-${id}`).disabled = false;
  if(document.getElementById(`caption-${id}`)) document.getElementById(`caption-${id}`).disabled = false;
  
  document.getElementById('btn-edit-' + id).style.display = 'none';
  document.getElementById('btn-save-' + id).style.display = 'inline-block';
};

window.saveContrib = function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.style.pointerEvents = 'none';
  contentDiv.style.opacity = '0.6';
  
  document.getElementById(`code-${id}`).disabled = true;
  document.getElementById(`theory-${id}`).disabled = true;
  document.getElementById(`file-${id}`).disabled = true;
  
  document.getElementById('btn-edit-' + id).style.display = 'inline-block';
  document.getElementById('btn-save-' + id).style.display = 'none';
  
  // Trigger a global save so it syncs to Firebase automatically
  if (window.saveContributions) {
    window.saveContributions();
  }
};
