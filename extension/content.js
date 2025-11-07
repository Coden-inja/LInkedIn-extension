
// This script is injected into LinkedIn profile pages to scrape data.
// The selectors used here are placeholders and need to be updated with the correct selectors from a real LinkedIn profile page.

function scrapeProfile() {
  const profileData = {
    name: '',
    url: window.location.href,
    about: '',
    bio: '',
    location: '',
    follower_count: '',
    connection_count: ''
  };

  // --- UPDATE SELECTORS BELOW ---
  // Example: profileData.name = document.querySelector('h1').innerText;

  // Name
  const nameElement = document.querySelector('.text-heading-xlarge');
  if (nameElement) {
    profileData.name = nameElement.innerText;
  }

  // About
  const aboutElement = document.querySelector('.pv-about-section .pv-entity__description');
  if (aboutElement) {
    profileData.about = aboutElement.innerText;
  }

  // Bio
  const bioElement = document.querySelector('.text-body-medium');
  if (bioElement) {
    profileData.bio = bioElement.innerText;
  }

  // Location
  const locationElement = document.querySelector('.text-body-small.inline.t-black--light.break-words');
  if (locationElement) {
    profileData.location = locationElement.innerText;
  }

  // Follower and Connection Count - These are often in the same area, so you might need to adjust selectors
    const followersElement = document.querySelector('.pvs-header__optional-link.pvs-header__optional-link--followers');
  if (followersElement) {
    profileData.follower_count = followersElement.innerText;
  }
  
  const connectionsElement = document.querySelector('.pvs-header__optional-link');
  if (connectionsElement) {
    profileData.connection_count = connectionsElement.innerText;
  }


  // --- END OF SELECTOR UPDATES ---

  return profileData;
}

chrome.runtime.sendMessage({ action: 'scrapedData', data: scrapeProfile() });
