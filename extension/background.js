let state = 'idle'; // 'idle', 'scraping'
let urlsToScrape = [];
let currentUrlIndex = 0;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScraping' && state === 'idle') {
    state = 'scraping';
    urlsToScrape = request.urls;
    currentUrlIndex = 0;
    scrapeNext();
  } else if (request.action === 'scrapedData') {
    sendDataToApi(request.data);
    setTimeout(() => {
      chrome.tabs.remove(sender.tab.id);
      scrapeNext();
    }, 10000); // 10 second delay
  }
});

function scrapeNext() {
  if (currentUrlIndex < urlsToScrape.length) {
    const url = urlsToScrape[currentUrlIndex];
    chrome.runtime.sendMessage({ action: 'updateStatus', message: `Scraping ${currentUrlIndex + 1} of ${urlsToScrape.length}: ${url}` });
    chrome.tabs.create({ url: url }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
    currentUrlIndex++;
  } else {
    state = 'idle';
    chrome.runtime.sendMessage({ action: 'scrapingDone' });
  }
}

function sendDataToApi(data) {
  fetch('http://localhost:3000/api/profiles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log('Data sent to API:', data);
  })
  .catch(error => {
    console.error('Error sending data to API:', error);
  });
}

// on extension install, reset the scraping status
chrome.runtime.onInstalled.addListener(() => {
  state = 'idle';
  chrome.storage.local.set({ isScraping: false, profileUrls: '', scrapingStatus: '' });
});