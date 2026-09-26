require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
};

if (!config.cloud_name || !config.api_key || !config.api_secret) {
  console.error('❌ Missing Cloudinary credentials!');
  console.error('Cloud Name:', config.cloud_name ? '✓' : '✗');
  console.error('API Key:', config.api_key ? '✓' : '✗');
  console.error('API Secret:', config.api_secret ? '✓' : '✗');
  process.exit(1);
}

cloudinary.config(config);

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
const uploadedImages = {};
const baseProjectPath = path.join(__dirname, '../../');

async function uploadImagesToCloudinary() {
  console.log('🚀 Starting image upload to Cloudinary...\n');

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
          const result = await cloudinary.uploader.upload(filePath, {
            folder: `opslogistics/${folder}`,
            public_id: path.parse(file).name,
            overwrite: false,
            resource_type: 'auto'
          });

          uploadedImages[folder].push({
            originalName: file,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            cloudinaryFolder: `opslogistics/${folder}`
          });

          console.log(`  ✅ ${file}`);
        } catch (err) {
          console.log(`  ❌ ${file} - ${err.message || JSON.stringify(err)}`);
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
  console.log(`\n📈 Summary:`);

  let totalImages = 0;
  for (const [folder, images] of Object.entries(uploadedImages)) {
    if (images.length > 0) {
      console.log(`  ${folder}: ${images.length} images`);
      totalImages += images.length;
    }
  }

  console.log(`\n🎉 Total images uploaded: ${totalImages}`);
}

uploadImagesToCloudinary().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
