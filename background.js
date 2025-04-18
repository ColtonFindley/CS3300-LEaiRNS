chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });

// All of these could be var instead of let
let btn = false
let panelOpened = false
let active = false

// Listen for timestamp updates from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // If the recieved message is to open the sidepanel
  if (message.type === "openSidePanel") {
    // If the panel is already opened (message is to close the side panel)
    if (panelOpened) {
      chrome.sidePanel.setOptions({ enabled: false })
      panelOpened = false
    // If the side panel is not already opened
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
    // If the recieved message is related to the chatbox send message
  } else if (message.type == "CUSTOM_MESSAGE") {
    const response = `You said: "${message.payload}"`; // You can customize the response as needed
    console.log(`Updated timestamp received: ${message.timestamp}`);
    chrome.runtime.sendMessage({ type: "CUSTOM_RESPONSE", payload: response });  
  }
});

function toggle(details){
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
    toggle(details)  
  }
});
 
chrome.webNavigation.onCommitted.addListener((details) => {
  
  if (details.frameId === 0) {
    console.log("onCommitted")
    active = false
    toggle(details)
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // Disable/hide the side panel when a new tab is activated.
  chrome.sidePanel.setOptions({ enabled: false })
  panelOpened = false

});
