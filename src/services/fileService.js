/**
 * File Service
 * Handles file operations for importing and exporting data with error handling
 */
import { AppError, ERROR_CODES, tryCatchAsync } from '../utils/errorHandling';

/**
 * FileService class provides methods for file operations
 */
export class FileService {
    /**
     * Export data to a JSON file
     * @param {Object} data - Data to export
     * @param {string} filename - Name of the file (without extension)
     * @returns {Promise<boolean>} Success status
     * @throws {AppError} If export fails
     */
    async exportToJson(data, filename) {
        return tryCatchAsync(
            async () => {
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

                return true;
            },
            ERROR_CODES.FILE_WRITE_ERROR,
            'Error exporting data to JSON file'
        );
    }

    /**
     * Import data from a JSON file
     * @param {File} file - File object from file input
     * @returns {Promise<Object>} Parsed data from the file
     * @throws {AppError} If import fails
     */
    async importFromJson(file) {
        if (!file) {
            throw new AppError('No file provided', ERROR_CODES.FILE_READ_ERROR);
        }

        return tryCatchAsync(
            async () => {
                return new Promise((resolve, reject) => {
                    // Create a FileReader instance
                    const reader = new FileReader();

                    // Set up the onload event handler
                    reader.onload = (event) => {
                        try {
                            // Parse the JSON data
                            const data = JSON.parse(event.target.result);
                            resolve(data);
                        } catch (error) {
                            reject(new AppError(
                                'Invalid JSON file format',
                                ERROR_CODES.FILE_INVALID_FORMAT,
                                error
                            ));
                        }
                    };

                    // Set up the onerror event handler
                    reader.onerror = () => {
                        reject(new AppError(
                            'Error reading file',
                            ERROR_CODES.FILE_READ_ERROR
                        ));
                    };

                    // Read the file as text
                    reader.readAsText(file);
                });
            },
            ERROR_CODES.FILE_READ_ERROR,
            'Error importing JSON file'
        );
    }

    /**
     * Process an image file and compress it
     * @param {File} file - Image file
     * @param {Object} options - Processing options
     * @param {number} options.maxWidth - Maximum width of the processed image
     * @param {number} options.maxHeight - Maximum height of the processed image
     * @param {number} options.quality - JPEG quality (0-1)
     * @returns {Promise<string>} Data URL of the processed image
     * @throws {AppError} If processing fails
     */
    async processImage(file, options = {}) {
        if (!file || !file.type.match('image.*')) {
            throw new AppError('Invalid image file', ERROR_CODES.FILE_INVALID_FORMAT);
        }

        const { maxWidth = 300, maxHeight = 300, quality = 0.7 } = options;

        return tryCatchAsync(
            async () => {
                return new Promise((resolve, reject) => {
                    // Check file size before processing
                    if (file.size > 10 * 1024 * 1024) { // 10MB limit
                        reject(new AppError(
                            'Image file is too large (max 10MB)',
                            ERROR_CODES.FILE_TOO_LARGE
                        ));
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

                            // Check the size of the compressed image
                            const base64 = dataUrl.split(',')[1];
                            const binarySize = window.atob(base64).length;

                            if (binarySize > 2 * 1024 * 1024) { // 2MB limit for localStorage
                                // Try with lower quality if too large
                                if (quality > 0.3) {
                                    const lowerQuality = Math.max(0.3, quality - 0.2);
                                    const lowerQualityUrl = canvas.toDataURL('image/jpeg', lowerQuality);
                                    resolve(lowerQualityUrl);
                                } else {
                                    reject(new AppError(
                                        'Compressed image is still too large for storage',
                                        ERROR_CODES.FILE_TOO_LARGE
                                    ));
                                }
                            } else {
                                // Resolve with the data URL
                                resolve(dataUrl);
                            }
                        };

                        // Set up the onerror event handler for the image
                        img.onerror = () => {
                            reject(new AppError(
                                'Error loading image',
                                ERROR_CODES.FILE_READ_ERROR
                            ));
                        };

                        // Set the source of the image
                        img.src = e.target.result;
                    };

                    // Set up the onerror event handler for the file reader
                    reader.onerror = () => {
                        reject(new AppError(
                            'Error reading image file',
                            ERROR_CODES.FILE_READ_ERROR
                        ));
                    };

                    // Read the file as a data URL
                    reader.readAsDataURL(file);
                });
            },
            ERROR_CODES.FILE_READ_ERROR,
            'Error processing image file'
        );
    }
}

// Export a singleton instance
export const fileService = new FileService();