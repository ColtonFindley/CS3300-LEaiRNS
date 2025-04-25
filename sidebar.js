/*
* Copyright (c) 2025 Colton Findley, Daniel Hettich, Devon White
*
* This software is released under the MIT License.
* https://opensource.org/licenses/MIT
*/



const GEMINI_API_KEY = "API_KEY";
//if you would plan to modify this code and upload it to the chrome webstore, you would need to modify the code to hide the api key better
//due to how chrome extensions work, a user can always inspect the source code of the chrome extension

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
//In future versions, as google comes out with more versions of gemini, it will most likely be good to update/change the model in the url.
 
let buffer = true // Boolean that disables the send message button when set to false
 
document.getElementById("sendMessageBtn").addEventListener("click", async () => {
    //when the send message button is clicked
 
    if (!buffer) return; //if the button is currently disabled, end early.
 
    buffer = false; //disable the button
    const sendButton = document.getElementById("sendMessageBtn"); 
    const messageInput = document.getElementById("messageInput"); 
    sendButton.disabled = true //visually disable the button
    messageInput.disabled = true //disable the text boxt for message input
 
    const message = document.getElementById("messageInput").value;
   
    // Find the active tab in the current window to get the current time
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;
 
    const url = tab.url //this is the url of the current video that is being watched
 
    // Send the message and the timestamp to the background script
    chrome.tabs.sendMessage(tab.id, { command: "getCurrentTime" }, (response) => {
        // Once the timestamp is retrieved, send the custom message to background.js
        // As mentioned in background.js, the method of sending these messages is unneccessary and should be modified
        const timestamp = response.timestamp; 
        chrome.runtime.sendMessage({
            type: "CUSTOM_MESSAGE",
            payload: message,
            timestamp: timestamp,
            youtube: url
        });
 
        // Display the message sent by the user in the chat logs and mark it as sent by the user.
        appendMessage('You', message);
 
        // Clear the text box after sending the message
        document.getElementById("messageInput").value = '';
    });
});
 
// Listen for a response from background.js and display it
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "CUSTOM_RESPONSE") {
       
        const msg = message.payload; //this is the message sent by the user
        const tmp = message.timestamp; //this is the current timestamp in the video. it is formatted in seconds
        const yt = message.youtube; //this is the youtube video url
 
        let tmp1 = Math.floor(tmp / 60).toString().padStart(2, '0');
        let tmp2 = (tmp % 60).toString().padStart(2, '0');
        let timestamp = tmp1 + ":" + tmp2; //this formats the timestamp into MM:SS. The gemini api documentation requests timestamps be formatted like this.


        //importing forigen code libraries (such as the gemini api library) is not allowed in chrome extensions
        //as a work around we used an alternative method to communicate with gemini provided by gemini's documentation pages
        fetch(GEMINI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": GEMINI_API_KEY
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: "Don't mention this in your response: the following message is a question from the user who is currently watching the attached youtube video. They are currently at "
                            + timestamp + " in the video. Here is their message to respond to: " + msg},
                        {file_data: {file_uri: yt}}
                        //this current method for uploading youtube videos to gemini is considered experimental
                        //Google states this feature may become a paid feature only in the future or they might rework how it works.
                    ]
                }]
            }),
        })
        .then(response => { 
            if (!response.ok){
                throw new Error(`Gemini error, HTTP code: ${response.status}`);
                //handles errors returned by gemini 
            }
            return response.json();
        })
        .then((result) => {
            if (!result?.candidates?.[0]?.content?.parts?.[0]?.text) {
                throw new Error("Unexpected response structure from Gemini API");
            }
            const reply = result.candidates[0].content.parts[0].text;
            //pulls gemini's response out of all the data they send back
            appendMessage('Gemini', reply); //puts gemini's response into the chat logs and marks it as being sent by gemini
            
            buffer = true //re-enables the button and other elements
            const sendButton = document.getElementById("sendMessageBtn");
            const messageInput = document.getElementById("messageInput");
            sendButton.disabled = false
            messageInput.disabled = false
        })
        .catch(error => {
            console.error("Fetch error:", error);
            appendMessage('Gemini', `Sorry, there was an error. Error: ${error.message}.`);
            //if there was a gemini specific error it sends the error to the user and gives them the specific error code
            

            buffer = true //re-enables the button and other elements
            const sendButton = document.getElementById("sendMessageBtn");
            const messageInput = document.getElementById("messageInput");
            sendButton.disabled = false
            messageInput.disabled = false

         
        });
     }
});
 
// Function that sends a message to the chat history log on the screen
function appendMessage(sender, text) {
    const chatArea = document.getElementById("chatArea");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.textContent = `${sender}: ${text}`;
    chatArea.appendChild(messageDiv);
 
    // Scroll to the bottom of the chat area
    chatArea.scrollTop = chatArea.scrollHeight;
}
 
// Add disclaimer message when panel loads
window.addEventListener("DOMContentLoaded", () => {
    appendMessage("Disclaimer", "Responses are generated by Google's Gemini AI. There are no guarantees of the validity of the information generated by the AI. Always verify critical information independently." +
        " Validity of the information is also dependent on the content of the YouTube video.");
    appendMessage("Disclaimer", "Input confidential information at your own risk. LEaiRNS does not store any information, however there is no guarantee that Google's Gemini will not store any information.");
});
