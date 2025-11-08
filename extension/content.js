
async function scrapeProfile() {
  console.log('Scraping profile...');
  try {
    const profileData = {
      name: '',
      url: window.location.href,
      about: '',
      bio: '',
      location: '',
      follower_count: '',
      connection_count: ''
    };

    const nameElement = document.querySelector('h1');
    if (nameElement) {
      profileData.name = nameElement.innerText;
      console.log('Name found:', profileData.name);
    } else {
      console.log('Name element not found.');
    }

    const bioElement = document.querySelector('.text-body-medium.break-words');
    if (bioElement) {
      profileData.bio = bioElement.innerText;
      console.log('Bio found:', profileData.bio);
    } else {
      console.log('Bio element not found.');
    }

    const locationElement = document.querySelector('.text-body-small.inline');
    if (locationElement) {
      profileData.location = locationElement.innerText;
      console.log('Location found:', profileData.location);
    } else {
      console.log('Location element not found.');
    }

    const aboutElement = document.querySelector('.inline-show-more-text p');
    if (aboutElement) {
      profileData.about = aboutElement.innerText;
      console.log('About found:', profileData.about);
    } else {
      console.log('About element not found.');
    }

    const extraInfoElements = document.querySelectorAll('span.t-bold');
    extraInfoElements.forEach(element => {
      const text = element.innerText.toLowerCase();
      if (text.includes('follower')) {
        profileData.follower_count = text;
        console.log('Follower count found:', profileData.follower_count);
      }
      if (text.includes('connection')) {
        profileData.connection_count = text;
        console.log('Connection count found:', profileData.connection_count);
      }
    });

    console.log('Scraped data:', profileData);
    return profileData;
  } catch (error) {
    console.error('Error scraping profile:', error);
    return null;
  }
}

console.log('Content script injected.');

setTimeout(() => {
  scrapeProfile().then(scrapedData => {
    if (scrapedData) {
      console.log('Sending scraped data to background script:', scrapedData);
      chrome.runtime.sendMessage({ action: 'scrapedData', data: scrapedData });
    }
  });
}, 5000);
