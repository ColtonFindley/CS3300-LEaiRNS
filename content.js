function sendTimestampUpdate() {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const timestamp = Math.floor(videoElement.currentTime);
      chrome.runtime.sendMessage({ type: "UPDATE_TIMESTAMP", timestamp });
    }
  }
  
// Continuously check for updates every second
setInterval(sendTimestampUpdate, 1000);  
