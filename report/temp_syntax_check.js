// Script block 1

  // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
  // import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
  // import { getFirestore, doc, setDoc, getDoc, onSnapshot, addDoc, collection, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
  // import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
  const storage = getStorage(app);
  window._storage = storage;
  window._ref = ref;
  window._uploadBytes = uploadBytes;
  window._uploadBytesResumable = uploadBytesResumable;
  window._getDownloadURL = getDownloadURL;

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
      window.applyAuthorization();
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

// Script block 3

      window.setServerStatus = function(stateIndex) {
        const states = ['status-best', 'status-mod', 'status-low'];
        const texts = ['SERVER BEST', 'SAVING...', 'ERROR!'];
        const colors = ['#10B981', '#FDE047', '#EF4444'];
        
        const btn = document.getElementById('server-status-btn');
        const txt = document.getElementById('server-status-text');
        if(btn && txt) {
            btn.className = states[stateIndex];
            txt.textContent = texts[stateIndex];
            txt.style.color = colors[stateIndex];
        }
      };
    
// Script block 4

  // --- TAB SWITCHER ---
  function showTab(id, btn) {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  
  // --- WEEKLY DIARY LOGIC ---
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
  const metaFields = ['date', 'mentor', 'student', 'marks-2300033848', 'marks-2300032512', 'marks-2300032267', 'marks-2300033278', 'marks-2300030988'];

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
              <span id="status-week${i}" style="font-size: 12px; color: var(--green); opacity: 0; transition: 0.3s;">[Saved] Saved</span>
              <button id="btn-save-${i}" onclick="saveWeek(${i})" style="padding: 6px 14px; background: var(--accent); color: #fff; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;">Save</button>
              <button onclick="downloadPdf(${i})" style="padding: 6px 14px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer;"> Export PDF</button>
            </div>
          </div>

          <div id="pdf-content-${i}">
            <!-- Meta Row: Date, Day, Mentor, Student -->
            <div style="display:flex; gap:16px; flex-wrap:wrap; margin-bottom:16px; padding:14px; background:var(--surface); border-radius:10px; border:1px solid var(--border);">
              <div style="flex:1; min-width:140px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">Date Week Start Date</label>
                <input type="date" id="w${i}-date"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;"
                  oninput="updateDay(${i})" />
              </div>
              <div style="flex:0 0 120px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">Day</label>
                <div id="w${i}-day-display" style="padding:8px 10px; background:var(--card); color:var(--accent2); border:1px solid var(--border); border-radius:8px; font-size:13px; font-weight:600; min-height:36px;"></div>
              </div>
              <div style="flex:1; min-width:160px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">Mentor Name</label>
                <input type="text" id="w${i}-mentor" value="Mr. M. Subba Rao"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;" />
              </div>
              <div style="flex:1; min-width:160px;">
                <label style="display:block; font-size:12px; font-weight:600; color:var(--text2); margin-bottom:4px;">Student Name</label>
                <input type="text" id="w${i}-student" placeholder="Your name"
                  style="width:100%; padding:8px 10px; background:var(--card); color:var(--text1); border:1px solid var(--border); border-radius:8px; font-family:'Inter',sans-serif; font-size:13px; outline:none;" />
              </div>
            </div>

            <!-- Main Diary Fields -->
            ${fieldsHtml}
            
            <!-- Student Marks -->
            <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border);">
              <h4 style="font-size: 14px; font-weight: 700; color: var(--text1); margin-bottom: 12px; display: flex; align-items: center; gap: 6px;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Weekly Mentor Marks</h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px;">
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px;">Mitta Kavya Nayana</label>
                  <input type="number" min="0" max="10" oninput="if(this.value>10) this.value=10; if(this.value<0) this.value=0;" id="w${i}-marks-2300033848" placeholder="/ 10" style="width:100%; padding:6px 10px; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:6px; outline:none;" />
                </div>
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px;">Inti Hanitha Sai Gayathri</label>
                  <input type="number" min="0" max="10" oninput="if(this.value>10) this.value=10; if(this.value<0) this.value=0;" id="w${i}-marks-2300032512" placeholder="/ 10" style="width:100%; padding:6px 10px; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:6px; outline:none;" />
                </div>
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px;">Kokkiligadda T.V. Durga Rao</label>
                  <input type="number" min="0" max="10" oninput="if(this.value>10) this.value=10; if(this.value<0) this.value=0;" id="w${i}-marks-2300032267" placeholder="/ 10" style="width:100%; padding:6px 10px; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:6px; outline:none;" />
                </div>
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px;">Badam Sudheer Reddy</label>
                  <input type="number" min="0" max="10" oninput="if(this.value>10) this.value=10; if(this.value<0) this.value=0;" id="w${i}-marks-2300033278" placeholder="/ 10" style="width:100%; padding:6px 10px; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:6px; outline:none;" />
                </div>
                <div>
                  <label style="display:block; font-size:11px; font-weight:600; color:var(--text2); margin-bottom:4px;">Garikapati Satya Karthika</label>
                  <input type="number" min="0" max="10" oninput="if(this.value>10) this.value=10; if(this.value<0) this.value=0;" id="w${i}-marks-2300030988" placeholder="/ 10" style="width:100%; padding:6px 10px; background:var(--surface); color:var(--text1); border:1px solid var(--border); border-radius:6px; outline:none;" />
                </div>
              </div>
            </div>
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

  // Real-time listeners -- live updates when any team member saves
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
    if(window.setServerStatus) window.setServerStatus(1);
    const btn = document.getElementById(`btn-save-${week}`);
    const originalText = btn.innerHTML;
    btn.innerHTML = "3 Saving...";
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
      if(window.setServerStatus) window.setServerStatus(0);
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
    deviceInfo = `${deviceInfo} - ${browser}`;

    // Fetch IP + geolocation address (stored in Firebase only)
    let userIp = "Unavailable", userAddress = "Unavailable";
    try {
      const geoRes  = await fetch("https://ipapi.co/json/");
      const geoData = await geoRes.json();
      userIp      = geoData.ip || "Unavailable";
      userAddress = [geoData.city, geoData.region, geoData.postal, geoData.country_name].filter(Boolean).join(', ');
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

      if(window.setServerStatus) window.setServerStatus(0);
      // Update local cache
      window.cloudDataStore[week] = newData;

      const status = document.getElementById(`status-week${week}`);
      status.style.opacity = '1';
      setTimeout(() => { status.style.opacity = '0'; }, 2000);
    } catch (err) {
      if(window.setServerStatus) window.setServerStatus(2);
      alert("Failed to save. See console for details.");
      console.error(err);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
  };


  window.saveAllDiaries = async function() {
    const btn = document.querySelector("button[onclick='saveAllDiaries()']");
    const originalText = btn.innerHTML;
    btn.innerHTML = "3 Saving All...";
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
    const origText = btn ? btn.innerHTML : " Export PDF";
    if (btn) { btn.innerHTML = "3 Generating..."; btn.disabled = true; }

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
              WEEKLY DIARY REPORT -- WEEK ${week}
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
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Date</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dateVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #48bb78;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Day</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dayVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #ed8936;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Student</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${studentVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #9f7aea;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Mentor</div>
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

  // 
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


  // LIVE CLOCK (IST)
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

// Script block 5


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
      document.getElementById(`preview-container-${id}`).style.display = 'block';
      const img = document.getElementById(`preview-${id}`);
      if (img.src && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src); // Free memory from previous preview
      }
      img.src = URL.createObjectURL(input.files[0]);
      document.getElementById(`url-${id}`).value = ''; // Clear old URL so we know it's a new file
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


  window.compressToBase64 = function(file, maxWidth = 800, quality = 0.6) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
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
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
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
    
    
    for (let student of STUDENTS) {
      const codeBox = document.getElementById(`code-${student.id}`);
      const theoryBox = document.getElementById(`theory-${student.id}`);
      
      if (!codeBox) continue;
      
      payload[student.id] = {
        code_work: codeBox.value,
        theory_work: theoryBox.value
      };
    }
    
    // ONE SINGLE SAVE TO FIRESTORE
    try {
      const globalBtn = document.getElementById("btn-save-contrib");
      if (globalBtn) globalBtn.innerHTML = `⏳ Saving to Database...`;
      
      await window._setDoc(window._doc(window._db, "team_progress", selectedDate), payload, { merge: true });
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
    }

    if(window.setServerStatus) window.setServerStatus(0);
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
    deviceInfo = `${deviceInfo} - ${browser}`;

    // Fetch IP + geolocation address (stored in Firebase only)
    let userIp = "Unavailable", userAddress = "Unavailable";
    try {
      const geoRes  = await fetch("https://ipapi.co/json/");
      const geoData = await geoRes.json();
      userIp      = geoData.ip || "Unavailable";
      userAddress = [geoData.city, geoData.region, geoData.postal, geoData.country_name].filter(Boolean).join(', ');
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

      if(window.setServerStatus) window.setServerStatus(0);
      // Update local cache
      window.cloudDataStore[week] = newData;

      const status = document.getElementById(`status-week${week}`);
      status.style.opacity = '1';
      setTimeout(() => { status.style.opacity = '0'; }, 2000);
    } catch (err) {
      if(window.setServerStatus) window.setServerStatus(2);
      alert("Failed to save. See console for details.");
      console.error(err);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
  };


  window.saveAllDiaries = async function() {
    const btn = document.querySelector("button[onclick='saveAllDiaries()']");
    const originalText = btn.innerHTML;
    btn.innerHTML = "3 Saving All...";
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
    const origText = btn ? btn.innerHTML : " Export PDF";
    if (btn) { btn.innerHTML = "3 Generating..."; btn.disabled = true; }

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
              WEEKLY DIARY REPORT -- WEEK ${week}
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
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Date</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dateVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #48bb78;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Day</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${dayVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #ed8936;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Student</div>
            <div style="font-size:12px; color:#1a202c; font-weight:800;">${studentVal}</div>
          </div>
          <div style="flex: 1; min-width: 100px; background: #fff; padding: 6px 10px; border-radius: 6px; border-left: 3px solid #9f7aea;">
            <div style="font-size:9px; color:#718096; font-weight:bold; text-transform:uppercase; margin-bottom:2px;">Mentor</div>
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

  // 
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


  // LIVE CLOCK (IST)
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

// Script block 6


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
      document.getElementById(`preview-container-${id}`).style.display = 'block';
      const img = document.getElementById(`preview-${id}`);
      if (img.src && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src); // Free memory from previous preview
      }
      img.src = URL.createObjectURL(input.files[0]);
      document.getElementById(`url-${id}`).value = ''; // Clear old URL so we know it's a new file
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


  window.compressToBase64 = function(file, maxWidth = 800, quality = 0.6) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
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
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
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
        const file = fileInput.files[0];
        const p = (async () => {
            try {
                const globalBtn = document.getElementById("btn-save-contrib");
                
                const storageRef = window._ref(window._storage, `team_diagrams/${selectedDate}/${student.id}_${file.name}`);
                
                if (globalBtn) globalBtn.innerHTML = `⏳ 1/3: Starting Upload...`;
                const uploadTask = window._uploadBytesResumable(storageRef, file);
                
                const btnSave = document.getElementById('btn-save-' + student.id);
                
                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                            if (btnSave) btnSave.innerHTML = `⏳ ${progress}%`;
                            if (globalBtn) globalBtn.innerHTML = `⏳ 2/3: Uploading ${progress}%`;
                        }, 
                        (error) => {
                            console.error("Firebase Storage Error:", error);
                            if (btnSave) btnSave.innerHTML = `❌ Storage Error!`;
                            if (globalBtn) globalBtn.innerHTML = `❌ Storage Error! Check Console.`;
                            alert("FIREBASE STORAGE ERROR: " + error.message);
                            resolve(); 
                        }, 
                        () => {
                            resolve();
                        }
                    );
                });
                
                if (globalBtn) globalBtn.innerHTML = `⏳ 3/3: Getting Image URL...`;
                diagramUrl = await window._getDownloadURL(storageRef);
                urlBox.value = diagramUrl;
                payload[student.id].diagram_url = diagramUrl;
            } catch (e) {
                console.error("Upload failed for " + student.name, e);
                const globalBtn = document.getElementById("btn-save-contrib");
                if (globalBtn) globalBtn.innerHTML = `❌ Error: ` + e.message;
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

window.saveContrib = async function(id) {
  const contentDiv = document.getElementById('content-' + id);
  if (!contentDiv) return;
  contentDiv.style.pointerEvents = 'none';
  contentDiv.style.opacity = '0.6';
  
  document.getElementById(`code-${id}`).disabled = true;
  document.getElementById(`theory-${id}`).disabled = true;
  document.getElementById(`file-${id}`).disabled = true;
  
  const saveBtn = document.getElementById('btn-save-' + id);
  const editBtn = document.getElementById('btn-edit-' + id);
  
  const originalSaveText = saveBtn.innerHTML;
  saveBtn.innerHTML = '⏳ Uploading...';
  
  if (window.saveContributions) {
    await window.saveContributions();
  }
  
  saveBtn.innerHTML = '✅ Saved!';
  setTimeout(() => {
      saveBtn.style.display = 'none';
      editBtn.style.display = 'inline-block';
      saveBtn.innerHTML = originalSaveText;
  }, 1500);
};


// Script block 7

  window.editors = {};
  
  // Initialize Monaco
  require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
  require(['vs/editor/editor.main'], function() {
    const students = ["2300033848", "2300032512", "2300032267", "2300033278", "2300030988"];
    
    students.forEach(sid => {
      const container = document.getElementById('editor-container-' + sid);
      const hiddenTextArea = document.getElementById('code-' + sid);
      
      if (container && hiddenTextArea) {
        const editor = monaco.editor.create(container, {
          value: hiddenTextArea.value || "# Write your code here...",
          language: 'python',
          theme: 'vs-dark',
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 13,
          scrollBeyondLastLine: false
        });
        
        window.editors[sid] = editor;
        
        // Sync Monaco editor content to hidden textarea so Firebase saves it normally
        editor.onDidChangeModelContent(() => {
          hiddenTextArea.value = editor.getValue();
        });
      }
    });
  });

  window.changeLanguage = function(sid) {
    const langSelect = document.getElementById('lang-' + sid);
    const editor = window.editors[sid];
    if (editor && langSelect) {
      monaco.editor.setModelLanguage(editor.getModel(), langSelect.value);
    }
  };

  
  // Judge0 Language IDs
  const judge0LanguageMap = {
    'python': 71,      // Python 3.8.1
    'javascript': 63,  // Node.js 12.14.0
    'java': 62,        // Java 13.0.1
    'cpp': 54,         // C++ (GCC 9.2.0)
    'c': 50          // C (GCC 9.2.0)
  };

  window.runCode = async function(sid) {
    const editor = window.editors[sid];
    const langSelect = document.getElementById('lang-' + sid);
    const outputWrapper = document.getElementById('output-wrapper-' + sid);
    const outputBox = document.getElementById('output-' + sid);
    const runBtn = document.getElementById('btn-run-' + sid);
    
    if (!editor || !langSelect || !outputBox) return;
    
    let rapidApiKey = localStorage.getItem('RAPIDAPI_KEY');
    if (!rapidApiKey) {
        rapidApiKey = prompt("Because public execution servers were abused, you now need a free API key to compile code!

1. Go to: https://rapidapi.com/judge0-official/api/judge0-ce
2. Create a free account & subscribe to the Basic Free Tier
3. Copy your 'X-RapidAPI-Key' and paste it below:

(This will be saved securely in your browser)");
        if (!rapidApiKey) return;
        localStorage.setItem('RAPIDAPI_KEY', rapidApiKey);
    }
    
    const code = editor.getValue();
    const langId = judge0LanguageMap[langSelect.value];
    
    outputWrapper.style.display = 'block';
    outputBox.style.color = '#fff';
    outputBox.innerText = 'Compiling and executing on Judge0...';
    runBtn.disabled = true;
    runBtn.innerHTML = '⏳ Running';
    
    try {
      const response = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': rapidApiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        body: JSON.stringify({
          source_code: code,
          language_id: langId,
          stdin: ""
        })
      });
      
      if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('RAPIDAPI_KEY');
          throw new Error("Invalid API Key! I have removed it. Please click Run again to enter a valid RapidAPI Key.");
      }
      if (response.status === 429) {
          throw new Error("You have exceeded your free daily limit on RapidAPI (50 requests/day).");
      }
      
      const result = await response.json();
      
      if (result.stdout !== null && result.stdout !== undefined) {
        outputBox.innerText = result.stdout || "Program exited successfully with no output.";
        outputBox.style.color = '#4ade80';
      } else if (result.stderr) {
        outputBox.innerText = result.stderr;
        outputBox.style.color = '#ff6b6b';
      } else if (result.compile_output) {
        outputBox.innerText = "COMPILER ERROR:
" + result.compile_output;
        outputBox.style.color = '#ff6b6b';
      } else {
        outputBox.innerText = result.message || result.error || "Unknown execution error.";
        outputBox.style.color = '#ff6b6b';
      }
    } catch (err) {
      outputBox.innerText = "Error: " + err.message;
      outputBox.style.color = '#ff6b6b';
    }
    
    runBtn.disabled = false;
    runBtn.innerHTML = '▶ Run';
  };

// Script block 8

  window.applyAuthorization = function() {
    const userEmail = window._currentUserEmail;
    if (!userEmail) return;
    
    // Ignore logic for Developer Bypass
    if (userEmail === "dev@kluniversity.in") return;

    const isMentor = userEmail === "msubbarao@kluniversity.in";
    const currentUserId = userEmail.split('@')[0];
    
    const students = ["2300033848", "2300032512", "2300032267", "2300033278", "2300030988"];
    
    students.forEach(sid => {
      // 1. Lock Mentor Marks input if not mentor
      const marksInput = document.getElementById(`marks-${sid}`);
      if (marksInput) {
          marksInput.disabled = !isMentor;
          if (!isMentor) marksInput.style.opacity = "0.7";
      }

      // 2. Lock Code / Theory if not mentor AND not the specific student
      const isThisStudent = (currentUserId === sid);
      const canEdit = isMentor || isThisStudent;
      
      const theoryBox = document.getElementById(`theory-${sid}`);
      const langSelect = document.getElementById(`lang-${sid}`);
      const runBtn = document.getElementById(`btn-run-${sid}`);
      const saveBtn = document.getElementById(`btn-save-${sid}`);
      
      if (theoryBox) {
          theoryBox.disabled = !canEdit;
          if (!canEdit) theoryBox.style.opacity = "0.7";
      }
      if (langSelect) langSelect.disabled = !canEdit;
      if (runBtn) runBtn.disabled = !canEdit;
      if (saveBtn) saveBtn.disabled = !canEdit;
      
      // Lock Monaco Editor
      const editor = window.editors ? window.editors[sid] : null;
      if (editor) {
          editor.updateOptions({ readOnly: !canEdit });
      }
    });
    
    // Hide Global Save button if they are not the mentor and not a recognized student
    const globalSave = document.getElementById("btn-save-contrib");
    if (globalSave && !isMentor && !students.includes(currentUserId)) {
        globalSave.style.display = "none";
    }
  };

