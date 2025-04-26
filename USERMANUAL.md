# LEaiRNS

Welcome to **LEaiRNS** – the Lecture Enhancement Assistant for Inquiry, Review, ‘N’ Studying. This manual will guide you through using this product. 

## Product Operation Requirements:  
- Windows OS 
- A Google Chrome Web Browser 
- An internet connection 
- Access to YouTube videos
  - Note that videos must be less than an hour in length 

## Installation 

Step 1: Download all the required files for the chrome extension from the GitHub – manifest.json, background.js, buttonscript.js, content.js, sidebar.js, sidebar.html, sidebar.css 

Step 2: Obtain your own Google Gemini API key. (Obtain Gemini API Keys)  

  Note: The tier selected for your API key (paid or free) will impact how much you can use this product. Lower tiers sometimes respond slower, have less API tokens, and have smaller use quotas. 

Step 3: In sidebar.js, on line 10, replace “API_KEY” with your own API key (surrounded by double quotes).   

Step 4: Store all these files in a new folder. 

Step 5: Navigate to chrome://extensions/ on a Chrome browser. 

Step 6: In the top right of the screen, enable “Developer mode”. 

Step 7: In the top left of the screen, click “Load unpacked”. 

Step 8: Select the folder you created containing the files for the extension. 

## How To Use 

Step 1: Navigate to the desired YouTube video page. 

Step 2: Once the YouTube video page has loaded, a blue button will appear on the right side of the page with the text “Toggle Panel”. Click this button to open the side panel. Please note that this extension is only active on YouTube Videos. It does not work for YouTube Shorts or videos playing in miniplayer mode. 

Step 3: As you watch your video, you can enter questions about the content of the video into the textbox displayed in the panel. Clicking the “Send Message” button will send your question to the Gemini AI model along with the context of the video and your current timestamp in the video. Your question will be displayed in the chat box and marked as being sent by you. 

Step 4: Afterwards, the Gemini AI model will respond to your question. Please note that the Gemini AI model can take time to respond. Until a response is received, the ability to send messages is disabled. Gemini’s response will be displayed in the chat box and marked as sent by Gemini. 

Step 5: Changing tabs, clicking the toggle panel button while the panel is open, changing to a different video, and navigating to a different webpage all will reset the side panel and clear the chat box message logs. Once logs are cleared, there are no retrieval methods. 

## Troubleshooting 

If you are not getting any response, the Gemini API could be down or slow.  

If the blue “Toggle Panel” button is not appearing when you think it should, check your website URL: LEaiRNS only functions on YouTube videos of the form “youtube.com/watch” 

If you receive the following response from Gemini: “Gemini error, HTTP code:XXX” this means there was an error sending a message to the Gemini API. Further detail about the error can be found at: https://ai.google.dev/gemini-api/docs/troubleshooting If this is not sufficient, contact user support. 

If you receive the following response form Gemini: “Unexpected response structure from Gemini API”, contact user support. 

## Contact 
For further questions or for user support, contact any one of us 
- Colton Findley – cfindle2@uccs.edu 
- Daniel Hettich - dhettich@uccs.edu 
- Devon White - dwhite13@uccs.edu 
