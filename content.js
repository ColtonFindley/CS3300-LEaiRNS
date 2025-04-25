/*
* Copyright (c) 2025 Colton Findley, Daniel Hettich, Devon White
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/

//This content script pulls the timestamp from the video element of the page and saves it
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getCurrentTime") {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const timestamp = Math.floor(videoElement.currentTime);  // Get the current timestamp
      sendResponse({ timestamp: timestamp });  // Send the timestamp back
    }
  }
});

function sendTimestampUpdate() {
    const player = document.querySelector('.html5-video-player');   //gets the video element
    const isAd = player && (
        player.classList.contains('ad-showing') ||      // checks if the video content currently showing is an ad
        player.classList.contains('ad-interrupting')    
    );
    if (isAd) {
      return; //do not save the current timestamp if it is an ad
    }
 
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const tmsp = Math.floor(videoElement.currentTime);
      chrome.storage.session.set({ lastTimestamp: tmsp }); 
      //use chrome.storage.session instead of .local and things saved with .session are cleared between uses while .local is not
      //This can cause an error due to saving something when there is no guarantee that the extension still exists
      //This error does not impact functionality. It might need to be fixed if you plan to modify this code and actually upload it to the chrome web store
    }
};

// Continuously check for updates every half second
setInterval(sendTimestampUpdate, 500);
