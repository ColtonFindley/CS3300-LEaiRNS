/*
* Copyright (c) 2025 Colton Findley, Daniel Hettich, Devon White
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/


chrome.storage.session.setAccessLevel({ accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS" });
//this is requried so that we can use chrome.storage.session in content scripts. 


let btn = false //bool flag to keep track of if the button is on the screen or not
let panelOpened = false //bool flag to keep track of if the panel is on the screen or not
let active = false //bool flag to keep track of if the content scropt that keeps track of the timestamp is running on the current tab or not
//these flags are all neccessary because youtube can change its url (from home page to shorts to videos), without reloading/unloading the actual page
//meaning the content script doesn't always get unloaded when the user changes from one video to another

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
      
      if (!active){ //if the content script is currently not running, run it
        active = true
        chrome.scripting.executeScript({
          target: { tabId: sender.tab.id },
          files: ['content.js']
        }).catch(err => console.error(err));

      } 
    }

    
  } else if (message.type == "CUSTOM_MESSAGE") {
    const response = message.payload;
  //Receives a message with the current timestamp, youtube url, and user message and sends it to the code running in sidebar.js
  //The current implementation is ineffecient (does not actually impact runtime) and archiac due to the original structures of how our program functioned in a previous version. 
  //currently this receives a message from sidebar.js containing this information and sends it back to sidebar.js
  //future modification of this code should probably change this
    chrome.runtime.sendMessage({ 
      type: "CUSTOM_RESPONSE", 
      payload: response,
      timestamp: message.timestamp,
      youtube: message.youtube
    });
      
  }
});

function toggle(details){
  //this function toggles if the side panel and the button are visible or not based on their current stat.
  //without this, changing the url of the web page you are currently on to another page would keep the side panel and button there
  if (btn) {
    btn = false

    if (details.url.includes("youtube.com/watch")) {
      chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: () => {
          const button = document.getElementById('side-button');
          if (button) {
            button.remove();
          }
        }
      }).catch(err => console.error("Failed to remove button", details.url, err));
    }

    chrome.sidePanel.setOptions({ enabled: false })
    panelOpened = false

  }
  if (details.url.includes("youtube.com/watch")) {
    btn = true
    chrome.scripting.executeScript({ //this is the script that creates the button
      target: { tabId: details.tabId },
      files: ['buttonscript.js']
    }).catch(err => console.error("Failed to execute buttonscript", details.tab.url, err));
  }
};

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  //this triggers when the user performs some navigation that results in the page being reloaded/loaded.
  //ie reload page or going from a non-youtube webpage to a youtube web page 
  if (details.frameId === 0) {
    toggle(details)  
  }
});
 
chrome.webNavigation.onCommitted.addListener((details) => {
  //this triggers when the user performs some navigation that takes the user to a different page, but the website is not loaded/unloaded/reloaded
  //ie going from the youtube homepage to a video or going from one video to another
  if (details.frameId === 0) {
    active = false
    toggle(details)
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  // If the user changes the current active tab to another tab, disable the side panel.
  // this is required due to how the chrome.side panel api works
  chrome.sidePanel.setOptions({ enabled: false })
  panelOpened = false

});
