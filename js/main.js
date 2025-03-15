/**
 * Main application initialization script
 * Handles setting up the application when the page loads
 */

// Global application state
const app = {
    characterData: null,
    config: {
        defaultCharacterPath: './data/characters/default-character.json',
        defaultPortraitPath: './images/default-character.png'
    }
};

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
    console.log('Initializing D&D Character Sheet App');

    // Generate the skills list
    generateSkillsList();

    // Set up event listeners
    setupEventListeners();

    // Load initial character data
    loadInitialCharacter();
});

// Set up application-wide event listeners
function setupEventListeners() {
    // Set up the event for importing JSON
    const importJsonInput = document.getElementById("import-json");
    if (importJsonInput) {
        importJsonInput.addEventListener("change", importCharacterFromJson);
    }

    // Add listener for saving character
    const saveButton = document.querySelector('button[onclick="exportCharacterToJson()"]');
    if (saveButton) {
        saveButton.addEventListener('click', function (e) {
            e.preventDefault();
            exportCharacterToJson();
        });
    }

    // Add global keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Ctrl+S to save character
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            exportCharacterToJson();
        }
    });
}

// Load the initial character data
async function loadInitialCharacter() {
    try {
        // Try to load from localStorage first
        const savedCharacter = localStorage.getItem('lastCharacter');

        if (savedCharacter) {
            app.characterData = JSON.parse(savedCharacter);
            applyCharacterData(app.characterData);
            console.log('Character loaded from localStorage');
            return;
        }

        // Otherwise try to fetch the default character
        const response = await fetch(app.config.defaultCharacterPath);

        // If fetch was successful, load the character
        if (response.ok) {
            const characterData = await response.json();
            app.characterData = characterData;
            applyCharacterData(characterData);
            console.log('Default character loaded');
        } else {
            // If no default character found, create an empty one
            console.log('No default character found, starting with blank sheet');
            // No need to do anything as the sheet is already blank
        }
    } catch (error) {
        console.error('Error loading initial character:', error);
        // Display a user-friendly error message
        showNotification('Could not load character data. Starting with a blank sheet.', 'error');
    }
}

// Show a notification to the user
function showNotification(message, type = 'info') {
    // Check if the notification container exists, if not create it
    let notificationContainer = document.getElementById('notification-container');

    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.top = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '1000';
        document.body.appendChild(notificationContainer);
    }

    // Create the notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.backgroundColor = type === 'error' ? '#f8d7da' : '#d4edda';
    notification.style.color = type === 'error' ? '#721c24' : '#155724';
    notification.style.padding = '10px 15px';
    notification.style.marginBottom = '10px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.justifyContent = 'space-between';
    notification.style.alignItems = 'center';

    // Add the message and close button
    notification.innerHTML = `
      <span>${message}</span>
      <button style="background: none; border: none; cursor: pointer; font-weight: bold; margin-left: 15px;">&times;</button>
    `;

    // Add the notification to the container
    notificationContainer.appendChild(notification);

    // Set up the close button
    const closeButton = notification.querySelector('button');
    closeButton.addEventListener('click', function () {
        notification.remove();
    });

    // Automatically remove the notification after a delay
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}