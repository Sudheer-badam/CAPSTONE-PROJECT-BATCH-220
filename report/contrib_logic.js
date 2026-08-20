  // ── TEAM CONTRIBUTIONS LOGIC ──
  const STUDENTS = [
    { id: "2300033848", name: "Mitta Kavya Nayana", email: "2300033848@kluniversity.in" },
    { id: "2300032512", name: "Inti Hanitha Sai Gayathri", email: "2300032512@kluniversity.in" },
    { id: "2300032267", name: "Kokkiligadda T.V. Durga Rao", email: "2300032267@kluniversity.in" },
    { id: "2300033278", name: "Badam Sudheer Reddy", email: "2300033278@kluniversity.in" },
    { id: "2300030988", name: "Garikapati Satya Karthika", email: "2300030988@kluniversity.in" }
  ];

  window.initContributions = function() {
    let userEmail = window._currentUserEmail;
    // Map dev email to the user's real email for testing purposes
    if (userEmail === "dev@kluniversity.in") {
       userEmail = "2300033278@kluniversity.in";
    }

    STUDENTS.forEach(student => {
      const box = document.getElementById(`contrib-${student.id}`);
      const lock = document.getElementById(`lock-${student.id}`);
      if (!box) return;

      if (userEmail === student.email || userEmail === "msubbarao@kluniversity.in") {
        // Unlock if it's the student themselves, or the mentor
        box.disabled = false;
        box.placeholder = "Write your weekly contribution here...";
        box.style.background = "var(--card)";
        if (lock) lock.style.display = "none";
      }
    });

    // Real-time listener for contributions
    if (window._db && window._doc && window._onSnapshot) {
      window._onSnapshot(window._doc(window._db, "team_progress", "latest"), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          STUDENTS.forEach(student => {
            const box = document.getElementById(`contrib-${student.id}`);
            // Only update box if user is NOT currently typing in it, or if it's locked
            if (box && box.disabled) {
               box.value = data[student.id] || "";
            } else if (box && !box.disabled && !box.dataset.typing) {
               // Initial load for unlocked box
               box.value = data[student.id] || "";
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

    let compiledText = "🔥 TEAM CAPSTONE BATCH 220 - WEEKLY PROGRESS SUMMARY 🔥\n";
    compiledText += "=========================================================\n\n";

    STUDENTS.forEach(student => {
      const box = document.getElementById(`contrib-${student.id}`);
      const text = box ? box.value.trim() : "";
      
      compiledText += `👤 ${student.name} (${student.id}):\n`;
      compiledText += text ? text : "No updates provided yet.";
      compiledText += "\n\n";
    });

    masterBox.value = compiledText;
  };

  // Track typing to prevent snapshot overwrites
  document.addEventListener('input', (e) => {
    if (e.target.id && e.target.id.startsWith('contrib-')) {
      e.target.dataset.typing = "true";
      setTimeout(() => e.target.dataset.typing = "", 5000); // clear typing state after 5s
    }
  });

  window.saveContributions = async function() {
    const btn = document.getElementById("btn-save-contrib");
    if (!window._db || !window._setDoc || !window._doc) {
       alert("Database not ready yet.");
       return;
    }

    const payload = {};
    STUDENTS.forEach(student => {
      const box = document.getElementById(`contrib-${student.id}`);
      if (box) {
         payload[student.id] = box.value;
      }
    });
    
    const masterBox = document.getElementById("contrib-master");
    if (masterBox) {
       payload.master_summary = masterBox.value;
    }

    try {
      btn.innerHTML = `⏳ Saving...`;
      await window._setDoc(window._doc(window._db, "team_progress", "latest"), payload, { merge: true });
      btn.innerHTML = `✅ Saved!`;
      setTimeout(() => {
        btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg><span>Save to Database</span>`;
      }, 2000);
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save. Check console.");
      btn.innerHTML = `❌ Error`;
    }
  };


window.editContrib = function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.contentEditable = 'true';
  contentDiv.style.border = '1px dashed var(--accent)';
  contentDiv.style.padding = '8px';
  contentDiv.focus();
  document.getElementById('btn-edit-' + id).style.display = 'none';
  document.getElementById('btn-save-' + id).style.display = 'inline-block';
};

window.saveContrib = function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.contentEditable = 'false';
  contentDiv.style.border = 'none';
  contentDiv.style.padding = '0';
  document.getElementById('btn-edit-' + id).style.display = 'inline-block';
  document.getElementById('btn-save-' + id).style.display = 'none';
  // Also trigger a global save so it syncs to Firebase
  if (window.saveContributions) {
    window.saveContributions();
  } else {
    alert('Slide content saved locally!');
  }
};
