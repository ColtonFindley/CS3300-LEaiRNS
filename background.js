chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.url.includes('youtube.com/watch')) {
    console.log('This sidebar only works on YouTube video pages.');
    return;
  }
 
  // User‑gesture‑safe: open the side‑panel immediately
  chrome.sidePanel.open({ tabId: tab.id });
 
  // Inject content.js *afterwards* (no await → still allowed)
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  }).catch(err => console.error(err));
});

// Listen for timestamp updates from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_TIMESTAMP") {
    console.log(`Updated timestamp received: ${message.timestamp}`);
  }
});
