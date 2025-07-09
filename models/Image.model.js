import mongoose from 'mongoose';

/**
 * Image Schema
 * @typedef {Object} Image
 * @property {String} url - Image URL
 * @property {String} publicId - Cloudinary public ID
 * @property {mongoose.Types.ObjectId} uploadedBy - Reference to User
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model('Image', ImageSchema);

export default Image;
