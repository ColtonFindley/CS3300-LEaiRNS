document.getElementById("sendMessageBtn").addEventListener("click", async () => {
    const message = document.getElementById("messageInput").value;
    
    // Find the active tab in the current window to get the current time
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    // Send the message and the timestamp to the background script
    chrome.tabs.sendMessage(tab.id, { command: "getCurrentTime" }, (response) => {
        // Once the timestamp is retrieved, send the custom message to background.js
        const timestamp = response.timestamp;  // The timestamp returned from content.js
        chrome.runtime.sendMessage({
            type: "CUSTOM_MESSAGE",
            payload: message,
            timestamp: timestamp
        });

        // Display the sent message in the chatbox without showing the timestamp
        appendMessage('You', message);

        // Log the timestamp to the background console as well
        console.log(`Timestamp sent: ${timestamp}`);

        // Clear the text box after sending the message
        document.getElementById("messageInput").value = '';
    });
});

// Listen for a response from background.js and display it
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "CUSTOM_RESPONSE") {
        appendMessage('Bot', message.payload);
    }
});

// Function to append messages to the chat area
function appendMessage(sender, text) {
    const chatArea = document.getElementById("chatArea");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add('message');
    messageDiv.textContent = `${sender}: ${text}`;
    chatArea.appendChild(messageDiv);

    // Scroll to the bottom of the chat area
    chatArea.scrollTop = chatArea.scrollHeight;
}
