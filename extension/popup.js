
document.addEventListener('DOMContentLoaded', () => {
  const profileUrlsTextarea = document.getElementById('profileUrls');
  const startButton = document.getElementById('startButton');
  const resetButton = document.getElementById('resetButton');
  const statusDiv = document.getElementById('status');

  // Load saved URLs and scraping status
  chrome.storage.local.get(['profileUrls', 'isScraping', 'scrapingStatus'], (result) => {
    if (result.profileUrls) {
      profileUrlsTextarea.value = result.profileUrls;
    }
    if (result.isScraping) {
      showScrapingStatus(result.scrapingStatus);
    }
  });

  // Save URLs on input
  profileUrlsTextarea.addEventListener('input', () => {
    chrome.storage.local.set({ profileUrls: profileUrlsTextarea.value });
  });

  // Start scraping on button click
  startButton.addEventListener('click', () => {
    const profileUrls = profileUrlsTextarea.value.split('\n').filter(url => url.trim() !== '');
    if (profileUrls.length > 0) {
      chrome.runtime.sendMessage({ action: 'startScraping', urls: profileUrls });
      chrome.storage.local.set({ isScraping: true, profileUrls: profileUrlsTextarea.value });
      showScrapingStatus(`Scraping ${profileUrls.length} profiles...`);
    }
  });

  // Reset button click
  resetButton.addEventListener('click', () => {
    chrome.storage.local.set({ isScraping: false, profileUrls: '', scrapingStatus: '' });
    showIdleStatus();
  });

  function showScrapingStatus(message) {
    profileUrlsTextarea.disabled = true;
    startButton.disabled = true;
    statusDiv.textContent = message;
  }

  function showIdleStatus() {
    profileUrlsTextarea.disabled = false;
    startButton.disabled = false;
    statusDiv.textContent = '';
    profileUrlsTextarea.value = '';
    chrome.storage.local.set({ isScraping: false, profileUrls: '', scrapingStatus: '' });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateStatus') {
      showScrapingStatus(request.message);
    } else if (request.action === 'scrapingDone') {
      showIdleStatus();
    }
  });
});
