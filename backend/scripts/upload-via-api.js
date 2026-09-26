require('dotenv').config();
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

const API_URL = 'http://localhost:5000/api/uploads';
const AUTH_URL = 'http://localhost:5000/api/auth/login';

// Test credentials (create user if doesn't exist)
const TEST_EMAIL = 'admin@opslogistics.local';
const TEST_PASSWORD = 'TestAdmin123!';

let authToken = null;

async function getAuthToken() {
  try {
    const response = await axios.post(AUTH_URL, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    return response.data.token;
  } catch (err) {
    console.error('❌ Auth failed:', err.response?.data?.error || err.message);
    return null;
  }
}

const imageFolders = [
  'logo',
  'home',
  'automotive',
  'case studies',
  'cold chain',
  'contract logistics',
  'cotsumer service',
  'customs',
  'ecommerce',
  'energy',
  'healthcare',
  'lastmile',
  'logistics',
  'retail',
  'technology',
  'white papers'
];

const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
const baseProjectPath = path.join(__dirname, '../../');

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadImagesToCloudinary() {
  console.log('🚀 Starting image upload via backend API...\n');

  // Get authentication token
  console.log('🔐 Authenticating...');
  authToken = await getAuthToken();

  if (!authToken) {
    console.error('❌ Failed to authenticate. Using unauthenticated upload...');
  } else {
    console.log('✅ Authenticated successfully\n');
  }

  const uploadedImages = {};

  for (const folder of imageFolders) {
    const folderPath = path.join(baseProjectPath, folder);

    if (!fs.existsSync(folderPath)) {
      console.log(`⚠️  Skipping ${folder} - folder not found`);
      continue;
    }

    uploadedImages[folder] = [];

    try {
      const files = fs.readdirSync(folderPath).filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      });

      if (files.length === 0) {
        console.log(`ℹ️  ${folder} - no images found`);
        continue;
      }

      console.log(`📁 ${folder} (${files.length} images)`);

      for (const file of files) {
        const filePath = path.join(folderPath, file);

        try {
          const formData = new FormData();
          formData.append('file', fs.createReadStream(filePath));
          formData.append('document_type', folder);

          const headers = formData.getHeaders();
          if (authToken) {
            headers['Authorization'] = `Bearer ${authToken}`;
          }

          const response = await axios.post(`${API_URL}/document`, formData, {
            headers,
            timeout: 30000
          });

          uploadedImages[folder].push({
            originalName: file,
            cloudinaryUrl: response.data.file_url,
            cloudinaryId: response.data.cloudinary_id,
            documentType: folder
          });

          console.log(`  ✅ ${file}`);
          await sleep(500);
        } catch (err) {
          console.log(`  ❌ ${file} - ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`❌ Error reading ${folder}: ${err.message}`);
    }

    console.log('');
  }

  // Save mapping to JSON file
  const mappingPath = path.join(baseProjectPath, 'backend', 'config', 'cloudinary-images-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(uploadedImages, null, 2));

  console.log(`\n✨ Upload complete!`);
  console.log(`📊 Mapping saved to: backend/config/cloudinary-images-mapping.json`);

  let totalImages = 0;
  for (const [folder, images] of Object.entries(uploadedImages)) {
    if (images.length > 0) {
      console.log(`  ${folder}: ${images.length} images`);
      totalImages += images.length;
    }
  }

  console.log(`\n🎉 Total images uploaded: ${totalImages}`);
  process.exit(0);
}

// Wait for backend to be ready
setTimeout(() => {
  uploadImagesToCloudinary().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}, 3000);
