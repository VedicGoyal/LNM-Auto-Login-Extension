/*
Cross-browser extension: "LNM Auto Login"
Auto-fills MIS, Moodle, and Network login forms; provides quick-launch toolbar.
*/

// === content.js ===
(function() {
  const MIS_URL     = "https://erp.lnmiit.ac.in/mis";
  const MOODLE_URL  = "https://moodle.lnmiit.ac.in/moodle/login/index.php";
  const NETWORK_URL = "https://172.22.2.6/connect/PortalMain";

  function dispatch(el) {
    el.focus();
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function fillMIS(creds) {
    const userType      = document.querySelector("select[name='ddlUserType']");
    const usernameField = document.querySelector("input[name='txt_username']");
    const passwordField = document.querySelector("input[name='txt_password']");

    if (!userType) return;

    // Handle user type selection only once
    if (!sessionStorage.getItem('misStudentSelected')) {
      userType.value = '2';
      dispatch(userType);
      sessionStorage.setItem('misStudentSelected', 'true');
      return; // wait for the postback to happen
    }

    // If the fields are present, fill them
    if (usernameField && passwordField && creds.misUsername && creds.misPassword) {
      if (usernameField.value !== creds.misUsername) {
        usernameField.value = creds.misUsername;
        dispatch(usernameField);
      }
      if (passwordField.value !== creds.misPassword) {
        passwordField.value = creds.misPassword;
        dispatch(passwordField);
      }
    }
  }

  function tryFill() {
    chrome.storage.sync.get([
      'misUsername', 'misPassword',
      'moodleUsername', 'moodlePassword',
      'networkUsername','networkPassword'
    ], creds => {
      const url = window.location.href;

      if (url.startsWith(MIS_URL)) {
        fillMIS(creds);
        return;
      }

      // —— Moodle login ——
      if (url.startsWith(MOODLE_URL)) {
        const u = document.querySelector("input[name='username']");
        const p = document.querySelector("input[name='password']");
        if (u && p) {
          u.value = creds.moodleUsername || '';
          dispatch(u);
          p.value = creds.moodlePassword || '';
          dispatch(p);
        }
        return;
      }

      // —— Network login ——
      if (url.startsWith(NETWORK_URL)) {
        const u = document.querySelector("input[name='username']");
        const p = document.querySelector("input[name='password']");
        if (u && p) {
          u.value = creds.networkUsername || '';
          dispatch(u);
          p.value = creds.networkPassword || '';
          dispatch(p);
        }
      }
    });
  }

  // Retry every 500ms up to 15s
  const intervalID = setInterval(tryFill, 500);
  setTimeout(() => clearInterval(intervalID), 15000);
})();
