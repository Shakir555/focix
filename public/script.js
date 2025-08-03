function showTab(tabId)
{
  document.querySelectorAll('.tab-content').forEach(div => {
    div.style.display = 'none';
  });
  document.getElementsById(tabId).style.display = 'block';
}
