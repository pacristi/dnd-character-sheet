/**
 * File Service
 * Handles file operations for importing and exporting data
 */

/**
 * FileService class provides methods for file operations
 */
class FileService {
    /**
     * Export data to a JSON file
     * @param {Object} data - Data to export
     * @param {string} filename - Name of the file (without extension)
     * @returns {Promise<boolean>} Success status
     */
    exportToJson(data, filename) {
        return new Promise((resolve) => {
            try {
                // Convert data to JSON string
                const jsonString = JSON.stringify(data, null, 2);

                // Create a blob with the JSON data
                const blob = new Blob([jsonString], { type: 'application/json' });

                // Create a download URL
                const url = URL.createObjectURL(blob);

                // Create a temporary link element to trigger the download
                const link = document.createElement('a');
                link.href = url;
                link.download = `${filename}.json`;

                // Append the link to the document and click it
                document.body.appendChild(link);
                link.click();

                // Clean up
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                resolve(true);
            } catch (error) {
                console.error('Error exporting data to JSON:', error);
                resolve(false);
            }
        });
    }

    /**
     * Import data from a JSON file
     * @param {File} file - File object from file input
     * @returns {Promise<Object>} Parsed data from the file
     */
    importFromJson(file) {
        return new Promise((resolve, reject) => {
            if (!file) {
                reject(new Error('No file provided'));
                return;
            }

            // Create a FileReader instance
            const reader = new FileReader();

            // Set up the onload event handler
            reader.onload = (event) => {
                try {
                    // Parse the JSON data
                    const data = JSON.parse(event.target.result);
                    resolve(data);
                } catch (error) {
                    console.error('Error parsing JSON file:', error);
                    reject(new Error('Invalid JSON file'));
                }
            };

            // Set up the onerror event handler
            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };

            // Read the file as text
            reader.readAsText(file);
        });
    }

    /**
     * Process an image file and compress it
     * @param {File} file - Image file
     * @param {Object} options - Processing options
     * @param {number} options.maxWidth - Maximum width of the processed image
     * @param {number} options.maxHeight - Maximum height of the processed image
     * @param {number} options.quality - JPEG quality (0-1)
     * @returns {Promise<string>} Data URL of the processed image
     */
    processImage(file, options = {}) {
        const { maxWidth = 300, maxHeight = 300, quality = 0.7 } = options;

        return new Promise((resolve, reject) => {
            if (!file || !file.type.match('image.*')) {
                reject(new Error('Invalid image file'));
                return;
            }

            // Create a FileReader instance
            const reader = new FileReader();

            // Set up the onload event handler
            reader.onload = (e) => {
                // Create an image element
                const img = new Image();

                // Set up the onload event handler for the image
                img.onload = () => {
                    // Calculate dimensions while maintaining aspect ratio
                    let width = img.width;
                    let height = img.height;

                    if (width > height && width > maxWidth) {
                        height = Math.round(height * (maxWidth / width));
                        width = maxWidth;
                    } else if (height > maxHeight) {
                        width = Math.round(width * (maxHeight / height));
                        height = maxHeight;
                    }

                    // Create a canvas element
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;

                    // Draw the image to the canvas
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert the canvas to a data URL
                    const dataUrl = canvas.toDataURL('image/jpeg', quality);

                    // Resolve with the data URL
                    resolve(dataUrl);
                };

                // Set up the onerror event handler for the image
                img.onerror = () => {
                    reject(new Error('Error loading image'));
                };

                // Set the source of the image
                img.src = e.target.result;
            };

            // Set up the onerror event handler for the file reader
            reader.onerror = () => {
                reject(new Error('Error reading image file'));
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        });
    }
}

// Export a singleton instance
export const fileService = new FileService();