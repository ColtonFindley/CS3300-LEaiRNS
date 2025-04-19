const GEMINI_API_KEY = "API KEY";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY
 
var context = ""

document.getElementById("sendMessageBtn").addEventListener("click", async () => {
    const message = document.getElementById("messageInput").value;
   
    // Find the active tab in the current window to get the current time
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    const url = tab.url
 
    // Send the message and the timestamp to the background script
    chrome.tabs.sendMessage(tab.id, { command: "getCurrentTime" }, (response) => {
        // Once the timestamp is retrieved, send the custom message to background.js
        const timestamp = response.timestamp;  // The timestamp returned from content.js
        chrome.runtime.sendMessage({
            type: "CUSTOM_MESSAGE",
            payload: message,
            timestamp: timestamp,
            youtube: url
        });
 
        // Display the sent message in the chatbox without showing the timestamp
        appendMessage('You', message);
 
        // Clear the text box after sending the message
        document.getElementById("messageInput").value = '';
    });
});
 
// Listen for a response from background.js and display it
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "CUSTOM_RESPONSE") {
       
        const msg = message.payload;
        const tmp = message.timestamp;
        const yt = message.youtube
        

        // !!! ADD RESTRICTION ON USER MESSAGE LENGTH


        fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: msg },
                        {file_data: {file_uri: yt}}
                      ]
                }]
            }),
        })
        .then((response) => {
            return response.json();
        })
        .then((result) => {
            const reply = result.candidates[0].content.parts[0].text;
            appendMessage('Gemini', reply);
        });
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
