document.addEventListener('DOMContentLoaded', () => {
  const fields = ['misUsername','misPassword','moodleUsername','moodlePassword','networkUsername','networkPassword'];
  const urls = {
    openMis:    'https://erp.lnmiit.ac.in/mis',
    openMoodle: 'https://moodle.lnmiit.ac.in/moodle/login/index.php',
    openNetwork:'https://172.22.2.6/connect/PortalMain'
  };

  Object.entries(urls).forEach(([btnId, url]) => {
    document.getElementById(btnId).addEventListener('click', () => {
      chrome.tabs.create({ url });
    });
  });

  chrome.storage.sync.get(fields, data => {
    fields.forEach(f => document.getElementById(f).value = data[f] || '');
  });

  document.getElementById('save').addEventListener('click', () => {
    const obj = {};
    fields.forEach(f => obj[f] = document.getElementById(f).value);
    chrome.storage.sync.set(obj, () => {
      const status = document.getElementById('status');
      status.textContent = 'Credentials saved!';
      setTimeout(() => status.textContent = '', 1500);
    });
  });
});
