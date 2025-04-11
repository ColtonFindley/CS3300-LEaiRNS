/*chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.url.includes('youtube.com/watch')) {
    console.log('This sidebar only works on YouTube video pages.');
    return;
  }

  // Makes button
  chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      files: ['content.js']
    }).catch(err => console.error(err));
  
});*/

var btn = false
var panelOpened = false
var active = false

// Listen for timestamp updates from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "UPDATE_TIMESTAMP") {
    console.log(`Updated timestamp received: ${message.timestamp}`);
  }
  else if (message.type === "openSidePanel") {
    if (panelOpened) {
      chrome.sidePanel.setOptions({ enabled: false })
      panelOpened = false
    } else {
      chrome.sidePanel.setOptions({ enabled: true })
      panelOpened = true
      chrome.sidePanel.open({ tabId: sender.tab.id });
      
      if (!active){
        active = true
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ['content.js']
        }).catch(err => console.error(err));

      } 
    }
  }
});

function fuckyoutube(details){
  if (btn) {
    btn = false

    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      func: () => {
        const button = document.getElementById('side-button');
        if (button) {
          button.remove();
        }
      }
    });

    chrome.sidePanel.setOptions({ enabled: false })
    panelOpened = false

  }
  if (details.url.includes("youtube.com/watch")) {
    btn = true
    chrome.scripting.executeScript({
      target: { tabId: details.tabId },
      files: ['buttonscript.js']
    }).catch(err => console.error(err));
  }
};

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    console.log("onHistory")
    fuckyoutube(details)  
  }
});
 
 
chrome.webNavigation.onCommitted.addListener((details) => {
  
  if (details.frameId === 0) {
    console.log("onCommitted")
    active = false
    fuckyoutube(details)
  }
});
