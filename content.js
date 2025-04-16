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
    const player = document.querySelector('.html5-video-player');   // main wrapper
    const isAd = player && (
        player.classList.contains('ad-showing') ||      // pre‑/mid‑roll
        player.classList.contains('ad-interrupting')    // some older skins
    );
    if (isAd) {
      return; // <-- no further messages
    }
 
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const tmsp = Math.floor(videoElement.currentTime);
      chrome.storage.session.set({ lastTimestamp: tmsp });
    }
};

// Continuously check for updates every half second
setInterval(sendTimestampUpdate, 500);
