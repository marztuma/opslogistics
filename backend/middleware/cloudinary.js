const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'opslogistics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'zip'],
    resource_type: 'auto',
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Upload single file
const uploadSingle = upload.single('file');

// Upload multiple files
const uploadMultiple = upload.array('files', 10);

// Helper function to delete Cloudinary resource
const deleteCloudinaryFile = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting Cloudinary file:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to generate signed upload URL (for frontend direct uploads)
const getUploadSignature = () => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );
  return {
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
};

module.exports = {
  cloudinary,
  uploadSingle,
  uploadMultiple,
  deleteCloudinaryFile,
  getUploadSignature,
};
