
// SCRIPT 0

// SCRIPT 1

  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc, onSnapshot, addDoc, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

  const firebaseConfig = {
    apiKey:            "AIzaSyARQOk-L_G0hxtuwddfcnpoxbPTnRMtUno",
    authDomain:        "capstone-batch-220.firebaseapp.com",
    projectId:         "capstone-batch-220",
    storageBucket:     "capstone-batch-220.firebasestorage.app",
    messagingSenderId: "6386291212",
    appId:             "1:6386291212:web:8acc51863603a9a3d81429",
    measurementId:     "G-XV9HTK9TMM"
  };

  const app  = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db   = getFirestore(app);

  // Expose Firestore helpers to global scope so non-module scripts can use them
  window._db           = db;
  window._doc          = doc;
  window._setDoc       = setDoc;
  window._getDoc       = getDoc;
  window._onSnapshot   = onSnapshot;
  window._addDoc       = addDoc;
  window._collection   = collection;
  window._query        = query;
  window._orderBy      = orderBy;

  const ALLOWED_EMAILS = new Set([
    "2300032267@kluniversity.in","2300033278@kluniversity.in",
    "2300030988@kluniversity.in","2300033848@kluniversity.in",
    "2300032512@kluniversity.in","msubbarao@kluniversity.in"
  ]);

  onAuthStateChanged(auth, (user) => {
    // DEV BYPASS LOGIC
    if (!user && sessionStorage.getItem("dev_bypass") === "true") {
      console.warn("DEV BYPASS ACTIVE: Simulating logged-in user.");
      window._currentUserEmail = "dev@kluniversity.in";
      window._currentUserName  = "Local Developer";
      document.getElementById("user-name").textContent = window._currentUserName;
      document.getElementById("user-initials").textContent = "D";
      document.getElementById("user-initials").style.display = "flex";
      document.getElementById("user-avatar").style.display = "none";
      loadAllDiariesFromFirestore();
      if (window.initContributions) window.initContributions();
      return;
    }

    if (user) {
      const email = (user.email || user.providerData?.[0]?.email || "").toLowerCase().trim();
      if (!ALLOWED_EMAILS.has(email)) {
        signOut(auth).then(() => { window.location.href = "login.html"; });
        return;
      }
      // Populate user profile in header
      const name  = user.displayName || sessionStorage.getItem("capstone_user") || email.split("@")[0];
      const photo = user.photoURL;
      document.getElementById("user-name").textContent = name;
      
      // Store user info globally for diary tracking
      window._currentUserEmail = user.email || user.providerData?.[0]?.email || email;
      window._currentUserName  = name;

      if (photo) {
        document.getElementById("user-avatar").src = photo;
        document.getElementById("user-avatar").style.display = "block";
        document.getElementById("user-initials").style.display = "none";
      } else {
        document.getElementById("user-initials").textContent = name.charAt(0).toUpperCase();
        document.getElementById("user-initials").style.display = "flex";
        document.getElementById("user-avatar").style.display = "none";
      }

      // Load Firestore diaries once logged in
      loadAllDiariesFromFirestore();
      if (window.initContributions) window.initContributions();
    } else {
      window.location.href = "login.html";
    }
  });

  window.handleSignOut = function() {
    signOut(auth).then(() => { window.location.href = "login.html"; });
  };

// SCRIPT 2

  // ——â‚¬——â‚¬ TAB SWITCHER ——â‚¬——â‚¬
  function showTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  // ——â‚¬——â‚¬ BUILD PDF GRID ——â‚¬——â‚¬
  const papers = [
    { name: "Capstone Project Research Paper-1",  file: "Capstone Project Reasearch Paper-1.pdf",   size: "2.5 MB" },
    { name: "Capstone Project Research Paper-2",  file: "Capstone project Reasearch Paper-2.pdf",   size: "4.0 MB" },
    { name: "Capstone Project Research Paper-3",  file: "Capstone project Reasearch paper-3.pdf",   size: "3.5 MB" },
    { name: "Capstone Project Research Paper-4",  file: "Capstone Project reasearch paper-4.pdf",   size: "3.4 MB" },
    { name: "Capstone Project Research Paper-5",  file: "Capstone Project Reasearch Paper-5.pdf",   size: "6.4 MB" },
    { name: "Capstone Project Research Paper-6",  file: "Capstone Project Reasearch Paper-6.pdf",   size: "2.5 MB" },
    { name: "Capstone Project Research Paper-7",  file: "Capstone Project Reasearch Paper-7.pdf",   size: "4.2 MB" },
    { name: "Capstone Project Research Paper-8",  file: "Capstone Project Reasearch Paper-8.pdf",   size: "3.9 MB" },
    { name: "Capstone Project Research Paper-9",  file: "Capstone Project Reasearch Paper-9.pdf",   size: "5.8 MB" },
    { name: "Capstone Project Research Paper-10", file: "Capstone Project Reasearch Paper-10.pdf",  size: "1.9 MB" },
    { name: "Capstone Project Research Paper-11", file: "Capstone Project Reasearch Paper-11.pdf",  size: "2.1 MB" },
    { name: "Capstone Project Research Paper-12", file: "Capstone Project Reasearch Paper-12.pdf",  size: "1.5 MB" },
    { name: "Capstone Project Research Paper-13", file: "Capstone Project Reasearch Paper-13.pdf",  size: "3.9 MB" },
    { name: "Capstone Project Research Paper-14", file: "Capstone Project Reasearch Paper-14.pdf",  size: "7.4 MB" },
    { name: "Capstone Project Research Paper-15", file: "Capstone project Reasearch paper-15.pdf",  size: "2.7 MB" },
    { name: "Capstone Project Research Paper-16", file: "Capstone project Reasearch paper-16.pdf",  size: "1.6 MB" },
    { name: "Capstone Project Research Paper-17", file: "Capstone project Reasearch paper-17.pdf",  size: "1.1 MB" },
  ];

  const grid = document.getElementById('pdf-grid');
  papers.forEach(p => {
    const a = document.createElement('a');
    a.className = 'pdf-card';
    a.href = p.file;
    a.target = '_blank';
    a.innerHTML = `
      <div class="pdf-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      </div>
      <div>
        <div class="pdf-name">${p.name}</div>
        <div class="pdf-size">${p.size} · Click to open</div>
      </div>`;
    grid.appendChild(a);
  });
  // ——â‚¬——â‚¬ WEEKLY DIARY LOGIC ——â‚¬——â‚¬
  const diaryContainer = document.getElementById('diary-container');

  const fields = [
    { id: 'obj',          label: 'Weekly Objectives:' },
    { id: 'work',         label: 'Work Completed:' },
    { id: 'hw',           label: 'Hardware Progress:',               half: true },
    { id: 'sw',           label: 'Software Progress:',               half: true },
    { id: 'code_impl',    label: 'Code Implementation Details:' },
    { id: 'project_proc', label: 'Process of Project:' },
    { id: 'doc_edited',   label: 'Documents Edited:' },
    { id: 'results',      label: 'Experimental Results / Problems Faced:' },
    { id: 'guide',        label: 'Guide Suggestions:' },
    { id: 'plan',         label: 'Action Plan for Next Week:' }
  ];
  // Extra meta fields stored but rendered separately
  const metaFields = ['date', 'mentor', 'student'];

  function buildDiaryUI() {
    let html = '';
    for (let i = 1; i <= 13; i++) { // The PDF has 13 weeks
      let fieldsHtml = '';
      let flexRow = '';

      fields.forEach(f => {
        const tpl = `
          <div style="${f.half ? 'flex:1;' : 'margin-bottom: 12px;'}">
            <label style="display:block; font-size:13px; font-weight:600; color:var(--text2); margin-bottom:6px;">${f.label}</label>
            <textarea id="w${i}-${f.id}" style="width:100%; height:${f.half ? '80px' : '60px'}; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:8px; padding:10px; font-family:'Inter', sans-serif; font-size:13px; resize:vertical; outline:none;" oninput="this.style.borderColor='var(--accent2)'"></textarea>
          </div>
        `;
        if (f.half) {
          flexRow += tpl;
          if (f.id === 'sw') {
            fieldsHtml += `<div style="display:flex; gap:16px; margin-bottom:12px;">${flexRow}</div>`;
            flexRow = '';
          }
        } else {
          fieldsHtml += tpl;
        }
      });

      html += `
        <div id="diary-card-${i}" style="background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 24px; position:relative;">
          <!-- Card Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 800; color: var(--text1); margin: 0;">Capstone Project Diary &mdash; Week ${i}</h3>
            <div style="display: flex; gap: 10px; align-items: center;" class="no-print">
              <span id="status-week${i}" style="font-size: 12px; color: var(--green); opacity: 0; transition: 0.3s;">âœ… Saved</span>
              <button id="btn-save-${i}" onclick="saveWeek(${i})" style="padding: 6px 14px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">ðŸ’¾ Save</button>
              <button onclick="downloadPdf(${i})" style="padding: 6px 14px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">📄 Export PDF</button>
            </div>
          </div>

          <div id="pdf-content-${i}">
            <!-- Meta Row: Date, Day, Mentor, Student -->
            <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px; padding:14px; background:var(--surface); border-radius:10px; border:1px solid var(--border);">
              <div style="flex:1; min-width:140px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">ðŸ“… Week Start Date</label>
                <input type="date" id="w${i}-date"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;"
                  oninput="updateDay(${i})" />
              </div>
              <div style="flex:0 0 120px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">ðŸ“† Day</label>
                <div id="w${i}-day-display" style="padding:8px 10px; background:var(--card); color:var(--accent2); border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:600; min-height:36px;"></div>
              </div>
              <div style="flex:1; min-width:160px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">Ã°Å¸—˜Â¨â‚¬ÂÃ°Å¸ÂÂ« Mentor Name</label>
                <input type="text" id="w${i}-mentor" value="Mr. M. Subba Rao"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;" />
              </div>
              <div style="flex:1; min-width:160px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">ðŸ‘¤ Student Name</label>
                <input type="text" id="w${i}-student" placeholder="Your name"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;" />
              </div>
            </div>

            <!-- Main Diary Fields -->
            ${fieldsHtml}
          </div>

          <!-- Edit History Log -->
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border); font-size: 12px; color: var(--text2);" class="no-print">
            <strong>Edit History:</strong>
            <ul id="history-week${i}" style="list-style-type: none; margin-top: 8px; padding: 0; max-height: 80px; overflow-y: auto;">
              <li>Loading...</li>
            </ul>
          </div>
        </div>
      `;
    }
    diaryContainer.innerHTML = html;
  }

  // Auto-show day name when date is picked
  window.updateDay = function(week) {
    const dateVal = document.getElementById(`w${week}-date`).value;
    const display = document.getElementById(`w${week}-day-display`);
    if (dateVal) {
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const d = new Date(dateVal + 'T00:00:00'); // avoid timezone offset issues
      display.textContent = days[d.getDay()];
    } else {
      display.textContent = '';
    }
  };

  // Global store to cache cloud data for change comparison
  window.cloudDataStore = {};

  // Real-time listeners —— live updates when any team member saves
  window.loadAllDiariesFromFirestore = function() {
    for (let i = 1; i <= 13; i++) {
      const weekNum = i;
      try {
        // 1. Listen to the week document (flat diary fields)
        const weekDocRef = window._doc(window._db, "diaries", `week_${weekNum}`);
        window._onSnapshot(weekDocRef, (docSnap) => {
          if (!docSnap.exists()) { window.cloudDataStore[weekNum] = {}; return; }
          const data = docSnap.data();
          window.cloudDataStore[weekNum] = data;

          const activeEl = document.activeElement;
          const isEditing = activeEl && activeEl.id && activeEl.id.startsWith(`w${weekNum}-`);
          if (!isEditing) {
            // Load diary fields
            fields.forEach(f => {
              const el = document.getElementById(`w${weekNum}-${f.id}`);
              if (el && data[f.id] !== undefined) el.value = data[f.id];
            });
            // Load meta fields
            metaFields.forEach(mf => {
              const el = document.getElementById(`w${weekNum}-${mf}`);
              if (el && data[mf] !== undefined) {
                el.value = data[mf];
                if (mf === 'date') updateDay(weekNum);
              }
            });
          }
        });

        // 2. Listen to history subcollection (each edit is its own document)
        const historyRef = window._query(
          window._collection(window._db, "diaries", `week_${weekNum}`, "history"),
          window._orderBy("savedAt", "desc")
        );
        window._onSnapshot(historyRef, (snapshot) => {
          const historyDocs = snapshot.docs.map(d => d.data());
          renderHistoryUI(weekNum, historyDocs);
        });

      } catch(err) {
        console.error("Error setting up listener week", weekNum, err);
        const ul = document.getElementById(`history-week${weekNum}`);
        if (ul) ul.innerHTML = `<li style="color:red;">Error: ${err.message}</li>`;
      }
    }
  };

  function renderHistoryUI(week, historyArray) {
    const ul = document.getElementById(`history-week${week}`);
    ul.innerHTML = '';
    if (historyArray && historyArray.length > 0) {
      historyArray.forEach((entry) => {
        const li = document.createElement('li');
        li.style.cssText = 'margin-bottom:8px; padding:7px 10px; background:var(--surface); border-radius:8px; border-left:3px solid var(--accent);';
        
        const userName    = entry.name || entry.user || "Unknown";
        const savedAt     = entry.saved_at || entry.date || "";
        const changedHtml = (entry.changed_fields || (entry.changes?.join(', ')))
          ? `<div style="margin-top:3px;font-size:11px;color:var(--accent2);">Updated: ${entry.changed_fields || entry.changes?.join(', ')}</div>` : '';

        li.innerHTML = `
          <span style="color:var(--accent2);font-size:12px;">${savedAt}</span>
          &mdash; <strong>${userName}</strong>
          ${changedHtml}
        `;
        ul.appendChild(li);
      });
    } else {
      ul.innerHTML = '<li style="color:var(--text2);">No edits yet.</li>';
    }
  }

  window.saveWeek = async function(week) {
    const btn = document.getElementById(`btn-save-${week}`);
    const originalText = btn.innerHTML;
    btn.innerHTML = "ÂÂ³ Saving...";
    btn.disabled = true;

    // Collect data
    const newData = {};
    const changedLabels = [];
    const oldCloudData = window.cloudDataStore[week] || {};

    fields.forEach(f => {
      const el = document.getElementById(`w${week}-${f.id}`);
      newData[f.id] = el.value;
      if (newData[f.id] !== (oldCloudData[f.id] || "")) {
        changedLabels.push(f.label.replace(':', ''));
      }
      el.style.borderColor = 'var(--border)';
    });

    metaFields.forEach(mf => {
      const el = document.getElementById(`w${week}-${mf}`);
      if (el) {
        newData[mf] = el.value;
        if (newData[mf] !== (oldCloudData[mf] || "") && mf === 'date') {
          changedLabels.push('Week Date');
        }
      }
    });

    if (changedLabels.length === 0) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      const status = document.getElementById(`status-week${week}`);
      status.style.opacity = '1';
      setTimeout(() => { status.style.opacity = '0'; }, 2000);
      return;
    }

    const userName  = window._currentUserName  || document.getElementById("user-name").textContent || "Anonymous";
    const userEmail = window._currentUserEmail || "";

    // Detect device / browser
    const ua = navigator.userAgent;
    let deviceInfo = /Android/.test(ua) ? "Android Mobile"
                   : /iPhone|iPad/.test(ua) ? "iOS Device"
                   : /Windows/.test(ua) ? "Windows PC"
                   : /Mac/.test(ua) ? "Mac"
                   : /Linux/.test(ua) ? "Linux" : "Unknown Device";
    const browser  = /Edg\//.test(ua) ? "Edge" : /Chrome/.test(ua) ? "Chrome" : /Firefox/.test(ua) ? "Firefox" : /Safari/.test(ua) ? "Safari" : "Browser";
    deviceInfo = `${deviceInfo} · ${browser}`;

    // Fetch IP + geolocation address (stored in Firebase only)
    let userIp = "Unavailable", userAddress = "Unavailable";
    try {
      const geoRes  = await fetch("http://ip-api.com/json/?fields=query,city,regionName,country,zip");
      const geoData = await geoRes.json();
      userIp      = geoData.query || "Unavailable";
      userAddress = [geoData.city, geoData.regionName, geoData.zip, geoData.country].filter(Boolean).join(', ');
    } catch(e) {}

    // Edit count for this user on this week
    const prevHistory = window.cloudDataStore[week]?._historyCount || {};
    const userEditCount = (prevHistory[userEmail] || 0) + 1;

    try {
      // 1. Save flat diary fields to the week document
      const weekDocRef = window._doc(window._db, "diaries", `week_${week}`);
      await window._setDoc(weekDocRef, newData, { merge: true });

      // 2. Add a clean history entry as its own document in the subcollection
      const historyColRef = window._collection(window._db, "diaries", `week_${week}`, "history");
      await window._addDoc(historyColRef, {
        name:          userName,
        email:         userEmail,
        device:        deviceInfo,
        ip_address:    userIp,
        address:       userAddress,
        edit_number:   userEditCount,
        saved_at:      new Date().toLocaleString(),
        savedAt:       Date.now(),    // numeric for ordering
        changed_fields: changedLabels.join(', ')
      });

      // Update local cache
      window.cloudDataStore[week] = newData;

      const status = document.getElementById(`status-week${week}`);
      status.style.opacity = '1';
      setTimeout(() => { status.style.opacity = '0'; }, 2000);
    } catch (err) {
      alert("Failed to save. See console for details.");
      console.error(err);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
  };


  window.saveAllDiaries = async function() {
    const btn = document.querySelector("button[onclick='saveAllDiaries()']");
    const originalText = btn.innerHTML;
    btn.innerHTML = "ÂÂ³ Saving All...";
    btn.disabled = true;
    
    for (let i = 1; i <= 13; i++) {
      await saveWeek(i);
    }
    
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert("All weeks have been safely saved to the cloud database!");
  };

  window.downloadPdf = function(week) {
    const btn = document.querySelector(`#diary-card-${week} button[onclick="downloadPdf(${week})"]`);
    const origText = btn ? btn.innerHTML : "📄 Export PDF";
    if (btn) { btn.innerHTML = "ÂÂ³ Generating..."; btn.disabled = true; }

    const dateVal = document.getElementById(`w${week}-date`)?.value || 'N/A';
    const dayVal = document.getElementById(`w${week}-day-display`)?.textContent || 'N/A';
    const mentorVal = document.getElementById(`w${week}-mentor`)?.value || 'N/A';
    const studentVal = document.getElementById(`w${week}-student`)?.value || 'N/A';

    let fieldsHtml = '';
    let flexRow = '';

    fields.forEach(f => {
      const el = document.getElementById(`w${week}-${f.id}`);
      const val = el ? el.value : '';
      const cleanVal = val ? val.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>") : '<span style="color:#a0aec0;font-style:italic;">No entry</span>';
      
      const tpl = `
        <div style="${f.half ? 'flex:1;' : 'margin-bottom: 8px;'}">
          <div style="font-size:11px; font-weight:bold; color:#2b6cb0; margin-bottom:3px; display:flex; align-items:center;">
             <span style="display:inline-block; width:5px; height:11px; background:linear-gradient(135deg, #4299e1, #2b6cb0); margin-right:6px; border-radius:1px;"></span>
             ${f.label}
          </div>
          <div style="font-size:11px; line-height:1.4; color:#1a202c; padding:6px 10px; border-left:3px solid #63b3ed; border-radius:0 6px 6px 0; background:linear-gradient(to right, #ebf8ff, #ffffff); box-shadow: 0 1px 2px rgba(0,0,0,0.05); min-height:auto;">${cleanVal}</div>
        </div>
      `;
      
      if (f.half) {
        flexRow += tpl;
        if (f.id === 'sw') {
          fieldsHtml += `<div style="display:flex; gap:12px; margin-bottom:8px;">${flexRow}</div>`;
          flexRow = '';
        }
      } else {
        fieldsHtml += tpl;
      }
    });

    const pdfHtml = `
      <div style="padding: 20px; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #ffffff;">
        
        <!-- HEADER WITH LOGOS -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #2b6cb0; padding-bottom: 10px;">
          <!-- KL University Logo -->
          <div style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">
            <img src="kl_logo.png" alt="KL Logo" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.style.display='none';"/>
          </div>
          
          <div style="text-align: center; flex: 1; padding: 0 10px;">
            <h1 style="color: #1a365d; font-size: 20px; font-weight: 800; margin: 0 0 3px 0; text-transform: uppercase; letter-spacing: 1px;">KL UNIVERSITY</h1>
            <h2 style="color: #3182ce; font-size: 13px; font-weight: 600; margin: 0 0 6px 0;">AI-Based Social Media Sentiment & Trend Analysis Platform</h2>
            <div style="display: inline-block; background: linear-gradient(135deg, #3182ce, #2b6cb0); color: #ffffff; padding: 3px 12px; border-radius: 12px; font-weight: bold; font-size: 11px;">
              WEEKLY DIARY REPORT —— WEEK ${week}
            </div>
          </div>

          <!-- Capstone Logo -->
          <div style="width: 70px; height: 70px; display: flex; align-items: center; justify-content: center;">
            <img src="capstone_logo.jpeg" alt="Capstone Logo" style="max-width:100%; max-height:100%; object-fit:contain;" onerror="this.style.display='none';"/>
          </div>
        </div>
        
        <!-- META INFO -->
        <div style="display: flex; flex-wrap: wrap; gap: 10px; background: linear-gradient(135deg, #f7fafc, #edf2f7); padding: 10px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #e2e8f0;">
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #4299e1;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">ðŸ“… Date</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dateVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #48bb78;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">ðŸ“† Day</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dayVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #ed8936;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">ðŸ‘¤ Student</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${studentVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #9f7aea;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Ã°Å¸—˜Â¨â‚¬ÂÃ°Å¸ÂÂ« Mentor</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${mentorVal}</div>
          </div>
        </div>

        <!-- DIARY CONTENT -->
        ${fieldsHtml}
        
        <!-- SIGNATURES -->
        <div style="margin-top: 15px; display: flex; justify-content: space-between; padding: 0 40px;">
          <div style="text-align: center; width: 160px;">
            <div style="height: 40px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #cbd5e0; font-family: cursive; font-size: 14px; opacity: 0.5;">Sign Here</span>
            </div>
            <div style="border-top: 1.5px solid #2d3748; padding-top: 4px;">
               <div style="font-weight: 800; font-size: 12px; color: #1a202c;">${studentVal !== 'N/A' ? studentVal : 'Student'}</div>
               <div style="font-size: 9px; color: #718096; text-transform: uppercase; margin-top:2px;">Student Signature</div>
            </div>
          </div>
          
          <div style="text-align: center; width: 160px;">
            <div style="height: 40px; margin-bottom: 5px; display: flex; align-items: center; justify-content: center;">
              <span style="color: #cbd5e0; font-family: cursive; font-size: 14px; opacity: 0.5;">Sign Here</span>
            </div>
            <div style="border-top: 1.5px solid #2d3748; padding-top: 4px;">
               <div style="font-weight: 800; font-size: 12px; color: #1a202c;">${mentorVal !== 'N/A' ? mentorVal : 'Mentor'}</div>
               <div style="font-size: 9px; color: #718096; text-transform: uppercase; margin-top:2px;">Mentor Signature</div>
            </div>
          </div>
        </div>
        
        <!-- FOOTER -->
        <div style="margin-top: 15px; text-align: center; font-size: 9px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 8px;">
           Generated from the Capstone AI Platform on ${new Date().toLocaleDateString()}
        </div>

      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = pdfHtml;

    const opt = {
      margin:       0,
      filename:     `Capstone_Diary_Week_${week}_${studentVal.replace(/[^a-zA-Z0-9]/g, '')}.pdf`,
      image:        { type: 'jpeg', quality: 1.0 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container).save().then(() => {
       if (btn) { btn.innerHTML = origText; btn.disabled = false; }
    }).catch(err => {
       console.error("PDF Error:", err);
       alert("Error generating PDF");
       if (btn) { btn.innerHTML = origText; btn.disabled = false; }
    });
  };

  // Build the UI on load
  buildDiaryUI();

  // ——â‚¬——â‚¬ LIVE CLOCK (IST) ——â‚¬——â‚¬
  setInterval(() => {
    const timeEl = document.getElementById('time-text');
    if (timeEl) {
      const d = new Date();
      const options = { 
        timeZone: "Asia/Kolkata", 
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true 
      };
      const formatter = new Intl.DateTimeFormat('en-IN', options);
      timeEl.innerText = formatter.format(d) + " IST";
    }
  }, 1000);
