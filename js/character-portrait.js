/**
 * Character Portrait Module
 * Handles portrait image upload, display, and storage
 */

// Default image and storage settings
const portraitSettings = {
    defaultImage: './images/default-character.png',
    maxStorageSize: 2 * 1024 * 1024, // 2MB limit for localStorage
    compressionQuality: 0.7 // Image quality for compression
};

// Initialize the portrait functionality
document.addEventListener('DOMContentLoaded', function () {
    initializePortraitUpload();
});

/**
 * Sets up the portrait upload functionality
 */
function initializePortraitUpload() {
    const uploadInput = document.getElementById('upload-portrait');
    const portraitImage = document.getElementById('character-image');

    // Set default image if src is missing or invalid
    if (portraitImage && (!portraitImage.src || portraitImage.src === 'undefined')) {
        portraitImage.src = portraitSettings.defaultImage;
    }

    if (uploadInput && portraitImage) {
        // Add change event listener for file upload
        uploadInput.addEventListener('change', function (event) {
            const file = event.target.files[0];

            if (file && file.type.match('image.*')) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    // Compress the image before storing
                    compressImage(e.target.result, function (compressedImage) {
                        // Update the displayed image
                        portraitImage.src = compressedImage;

                        // Save to storage
                        try {
                            savePortraitToStorage(compressedImage);
                        } catch (error) {
                            console.error('Failed to save portrait to storage:', error);
                            showPortraitSaveError();
                        }
                    });
                };

                reader.onerror = function () {
                    console.error('Error reading portrait file');
                    showNotification('Error reading image file. Please try another image.', 'error');
                };

                reader.readAsDataURL(file);
            }
        });

        // Load any saved portrait
        loadPortraitFromStorage();
    }
}

/**
 * Compresses an image to reduce storage size
 * @param {string} imageDataUrl - Data URL of the image
 * @param {function} callback - Callback with compressed image
 */
function compressImage(imageDataUrl, callback) {
    // Create a temporary image
    const img = new Image();

    img.onload = function () {
        // Calculate dimensions (max 300px while maintaining aspect ratio)
        let width = img.width;
        let height = img.height;
        const maxDimension = 300;

        if (width > height && width > maxDimension) {
            height = Math.round(height * (maxDimension / width));
            width = maxDimension;
        } else if (height > maxDimension) {
            width = Math.round(width * (maxDimension / height));
            height = maxDimension;
        }

        // Create canvas and compress
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Draw image to canvas and export as JPEG with compression
        ctx.drawImage(img, 0, 0, width, height);
        const compressedImage = canvas.toDataURL('image/jpeg', portraitSettings.compressionQuality);

        callback(compressedImage);
    };

    img.onerror = function () {
        console.error('Error loading image for compression');
        // Return original if compression fails
        callback(imageDataUrl);
    };

    img.src = imageDataUrl;
}

/**
 * Saves portrait to localStorage
 * @param {string} dataUrl - Image data URL
 */
function savePortraitToStorage(dataUrl) {
    if (!dataUrl) return;

    // Check size
    if (dataUrl.length > portraitSettings.maxStorageSize) {
        throw new Error('Image too large for localStorage');
    }

    const characterName = document.getElementById('character-name')?.value || 'default-character';
    const storageKey = `portrait_${characterName}`;

    try {
        localStorage.setItem(storageKey, dataUrl);
    } catch (e) {
        // If storage fails, try clearing other portraits
        cleanupOldPortraits();
        // Try once more
        localStorage.setItem(storageKey, dataUrl);
    }
}

/**
 * Loads portrait from localStorage
 */
function loadPortraitFromStorage() {
    const characterName = document.getElementById('character-name')?.value || 'default-character';
    const storageKey = `portrait_${characterName}`;
    const savedPortrait = localStorage.getItem(storageKey);
    const portraitImage = document.getElementById('character-image');

    if (savedPortrait && portraitImage) {
        portraitImage.src = savedPortrait;
    }

    // Add event listener to character name to update portrait when name changes
    const nameInput = document.getElementById('character-name');
    if (nameInput) {
        nameInput.addEventListener('change', loadPortraitFromStorage);
    }
}

/**
 * Cleans up old portraits from localStorage to free space
 */
function cleanupOldPortraits() {
    // Find all portrait keys
    const portraitKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('portrait_')) {
            portraitKeys.push(key);
        }
    }

    // If we have more than 5 portraits, remove the oldest ones
    if (portraitKeys.length > 5) {
        // Sort by creation time if available, otherwise just remove random ones
        portraitKeys.slice(0, portraitKeys.length - 5).forEach(key => {
            localStorage.removeItem(key);
        });
    }
}

/**
 * Shows an error notification for portrait save failures
 */
function showPortraitSaveError() {
    if (typeof showNotification === 'function') {
        showNotification('Could not save portrait image. The image may be too large.', 'error');
    } else {
        alert('Could not save portrait image. The image may be too large.');
    }
}

/**
 * Gets portrait data for export
 * @returns {string|null} Portrait data URL or null
 */
function getPortraitData() {
    const img = document.getElementById('character-image');
    return img && img.src.startsWith('data:') ? img.src : null;
}

/**
 * Applies portrait data during import
 * @param {string} portraitData - Portrait data URL
 */
function applyPortraitData(portraitData) {
    if (!portraitData) return;

    const img = document.getElementById('character-image');
    if (img) {
        img.src = portraitData;
    }
}