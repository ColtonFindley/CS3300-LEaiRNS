// Close sidebar when button is clicked
document.getElementById("closeBtn").addEventListener("click", () => {
    document.getElementById("sidebar").style.display = "none";
});

document.getElementById("timestampBtn").addEventListener("click", async () => {
    // Find the active tab in the current window
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //console.log("Sending tab", tab.id, tab.url)

    if (!tab) return;

    // Send the message directly to the content script in that tab
    chrome.tabs.sendMessage(tab.id, { command: "getCurrentTime" });
});
