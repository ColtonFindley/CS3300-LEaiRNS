chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    console.log("Opening the sidebar...");
    chrome.sidePanel.open({ tabId: tab.id });
  } else {
    console.log("This sidebar only works on YouTube video pages.");
  }
});

// Listen for timestamp updates from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_TIMESTAMP") {
    console.log(`Updated timestamp received: ${message.timestamp}`);
    
    // Store the latest timestamp in Chrome's storage
    chrome.storage.local.set({ lastTimestamp: message.timestamp });
  }
});
