// src/services/storage.service.js
const supabase = require('../config/supabase');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

/**
 * Upload a file to Supabase Storage
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name
 * @param {string} bucket - The bucket name
 * @param {string} folderPath - The folder path in the bucket
 * @returns {Promise<string>} - The file URL
 */
const uploadFile = async (fileBuffer, fileName, bucket, folderPath = '') => {
  try {
    const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;
    
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      logger.error(`Error uploading file: ${error.message}`);
      throw new AppError(`Error uploading file: ${error.message}`, 400);
    }
    
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a file from Supabase Storage
 * @param {string} filePath - The file path
 * @param {string} bucket - The bucket name
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath, bucket) => {
  try {
    const { error } = await supabase
      .storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      logger.error(`Error deleting file: ${error.message}`);
      throw new AppError(`Error deleting file: ${error.message}`, 400);
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  uploadFile,
  deleteFile
};