chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getCurrentTime") {
    chrome.storage.local.get({ lastTimestamp: 0 }, ({ lastTimestamp }) => {
      chrome.runtime.sendMessage({ type: "UPDATE_TIMESTAMP", timestamp: lastTimestamp });
    });
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
      chrome.storage.local.set({ lastTimestamp: tmsp });
    }
};

// Continuously check for updates every half second
setInterval(sendTimestampUpdate, 500);
