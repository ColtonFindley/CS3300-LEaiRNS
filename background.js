chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    chrome.sidePanel.open({ tabId: tab.id });
  } else {
    console.log("This sidebar only works on YouTube video pages.");
  }
});