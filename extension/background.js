
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startScraping') {
    startScraping(request.urls);
  } else if (request.action === 'scrapedData') {
    sendDataToApi(request.data);
  }
});

let currentTabIndex = 0;
let urlsToScrape = [];

function startScraping(urls) {
  urlsToScrape = urls;
  currentTabIndex = 0;
  openNextUrl();
}

function openNextUrl() {
  if (currentTabIndex < urlsToScrape.length) {
    chrome.tabs.create({ url: urlsToScrape[currentTabIndex] }, (tab) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    });
    currentTabIndex++;
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
    openNextUrl();
  })
  .catch(error => {
    console.error('Error sending data to API:', error);
    openNextUrl();
  });
}
