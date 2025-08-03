function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(div => {
    div.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';
}
