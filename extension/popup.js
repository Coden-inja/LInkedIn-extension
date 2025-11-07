
document.getElementById('startButton').addEventListener('click', () => {
  const profileUrls = document.getElementById('profileUrls').value.split('\n').filter(url => url.trim() !== '');
  if (profileUrls.length > 0) {
    chrome.runtime.sendMessage({ action: 'startScraping', urls: profileUrls });
    window.close();
  }
});
