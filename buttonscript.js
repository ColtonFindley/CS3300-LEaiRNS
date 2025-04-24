
function createSideButton() {
// this script just creates the button element on the page that toggles the side panel.

  
  const sideButton = document.createElement('div');
  sideButton.id = 'side-button';
  // Style the button: adjust size, position, and appearance as needed
  Object.assign(sideButton.style, {
    position: 'fixed',
    right: 'calc(100% - 100vw)',
    top: '50%',
    transform: 'translateY(-50%) rotate(270deg)',
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    zIndex: 10000
  });
  sideButton.textContent = 'Toggle Panel';

  // Set up the click event to send a message to the background script
  sideButton.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: "openSidePanel", msg: "grrrr" });
    //the content of this message sent my this event is entirely unneccesary.
    //this is an archiac implementation based on an older design of our product.
  });

  // Add the button to the page
  document.body.appendChild(sideButton);
}

// Run the function once the DOM is ready
createSideButton();
