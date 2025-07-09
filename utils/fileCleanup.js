import fs from 'fs';

/**
 * Safely delete a file if it exists
 * @param {string} filePath - Path to the file to delete
 */
export const safeDeleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Temporary file deleted: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error deleting temporary file ${filePath}:`, error);
  }
};

/**
 * Cleanup file after async operation with error handling
 * @param {string} filePath - Path to the file to delete
 * @param {Function} operation - Async operation to perform
 * @returns {Promise} - Result of the operation
 */
export const withFileCleanup = async (filePath, operation) => {
  try {
    const result = await operation();
    return result;
  } finally {
    safeDeleteFile(filePath);
  }
}; 