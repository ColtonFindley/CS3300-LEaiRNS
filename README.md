# LEaiRNS 

LEaiRNS is an open-source chrome extension that will prompt the Gemini API for questions while watching YouTube videos. When the user navigates to a YouTube.com/watch page, a button will appear halfway on the far left of the screen. Once that button is clicked, a side panel will open, displaying the chat box. Once a message is typed and sent, Gemini will be sent the YouTube video for analysis. Gemini’s response to the question will then be displayed in the chat box. 

## Table of contents 

- Features 
- Installation 
- Known Bugs/Flaws 
- Future Development 
- User Manual 
- License 
- Contact 
- Additional Information 

## Features 

- Gemini API 
- Chrome Extension API 
- Live YouTube URL awareness 
- Live timestamp tagging 
- AI-powered Q&A with Gemini 
- Side panel toggle button 

## Installation 

Step 1: Download all the required files for the chrome extension – manifest.json, background.js, buttonscript.js, content.js, sidebar.js, sidebar.html, sidebar.css 

Step 2: Store all of these files in a folder. 

Step 3: Navigate to chrome://extensions/ on a Chrome browser. 

Step 4: At the top right, turn on Developer Mode. 

Step 5: Click Load unpacked. 

Step 6: Find and select the extension folder.

## Known Bugs / Flaws 

When the close button found at the top right of the side panel, outside of our implemented UI is clicked, the side panel closes, however the toggle button is not updated to know that the side panel is closed. The user then must press it twice to open the side panel again. 

There is a displayed error in the Chrome extensions page: Uncaught Error: Extension context invalidated. This is a warning and doesn’t impact the functionality of the code. 

When using the free version of the Gemini API, the response times are very inconsistent. 

With our current implementation of the Gemini API, the chatbot cannot remember previous prompts and chat history. Because our code prompts Gemini with the YouTube video on every question, and because the previous question are not remembered, each question consumes a significant number of API tokens.  

## Future Development 

- Improved response speed and higher usage quota with a paid Gemini API key
- Improved response quality with different versions of Gemini
- Update codebase functionality with future Gemini API changes 
- Improved UI for user usability
- Improved structured Gemini response 
- Improved convention of safely storing the Gemini API key 
- More robust error handling for timeouts
- Memory storage of user conversations
- Improve API token usage efficiency
- Meet requirements to upload to Google Chrome Web Store 
- Add forms of monetization to fund paid Gemini API key 

## User Manual 

See the user manual file located on the GitHub page. 

## License 

This code is licensed under the MIT license. See the license file located on the GitHub page.  

## Contact 

- Colton Findley – cfindle2@uccs.edu 
- Daniel Hettich - dhettich@uccs.edu 
- Devon White - dwhite13@uccs.edu 

## Additional Information 

- Programming Languages: JavaScript, CSS, HTML 
- Lines of code: 479 
- Run times: Due to the inconsistency of response times by the Gemini API, and the fact that it will be machine dependent, the average response times range from 5 seconds to 1 minute, and on some occasions it was over. 
