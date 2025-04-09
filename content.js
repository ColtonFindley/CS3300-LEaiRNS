chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === "getCurrentTime") {
    const videoElement = document.querySelector("video");
    if (videoElement) {
      const tmsp = Math.floor(videoElement.currentTime);
      chrome.runtime.sendMessage({ type: "UPDATE_TIMESTAMP", timestamp: tmsp });
    }else{
      chrome.runtime.sendMessage({ type: "UPDATE_TIMESTAMP", timestamp: "none" });
    }
  }
});
