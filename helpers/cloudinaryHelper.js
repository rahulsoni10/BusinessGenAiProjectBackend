process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import cloudinary from '../config/cloudinary.js';

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    console.log('cloudinary result: ', result);
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Error while uploading to cloudinary', error);
    throw new Error('Error while uploading to cloudinary');
  }
};

export { uploadToCloudinary };
