import { storage } from './config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Upload multiple images to Firebase Storage
 * @param {File[]} imageFiles - Array of image files to upload
 * @returns {Promise<string[]>} - Array of download URLs
 */
export const uploadImages = async (imageFiles) => {
  try {
    const uploadPromises = imageFiles.map(async (file) => {
      // Create a unique file name
      const fileExtension = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExtension}`;
      
      // Create a reference to the file location
      const storageRef = ref(storage, `items/${fileName}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    });
    
    // Wait for all uploads to complete
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};

/**
 * Delete an image from Firebase Storage by URL
 * @param {string} imageUrl - The URL of the image to delete
 * @returns {Promise<void>}
 */
export const deleteImage = async (imageUrl) => {
  try {
    // Extract the path from the URL
    const urlObj = new URL(imageUrl);
    const path = urlObj.pathname;
    
    // The path includes /o/ followed by the encoded file path
    const encodedPath = path.split('/o/')[1];
    
    // Decode the path
    const decodedPath = decodeURIComponent(encodedPath);
    
    // Create a reference to the file
    const imageRef = ref(storage, decodedPath);
    
    // Delete the file
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
