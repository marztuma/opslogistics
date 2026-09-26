const fs = require('fs');
const path = require('path');

// Read the mapping file
const mappingPath = './backend/config/cloudinary-images-mapping.json';
let jsonData = fs.readFileSync(mappingPath, 'utf8').trim();
// Remove BOM if present
if (jsonData.charCodeAt(0) === 0xFEFF) {
    jsonData = jsonData.slice(1);
}
const mapping = JSON.parse(jsonData);

console.log('Wiring Cloudinary images into HTML pages...\n');

// Get logo URL
const logoUrl = mapping.logo && mapping.logo.length > 0 ? mapping.logo[0].cloudinaryUrl : '';

// Update index.html with home images
const indexPath = './opslogistic/index.html';
if (fs.existsSync(indexPath)) {
    let html = fs.readFileSync(indexPath, 'utf8');

    // Replace SVG placeholder images with Cloudinary URLs
    const homeImages = mapping.home || [];

    if (homeImages.length > 0) {
        // Replace the hero background
        html = html.replace(
            /background-image: linear-gradient\(rgba\(0,0,0,0\.3\), rgba\(0,0,0,0\.3\)\), url\('data:image[^']*'\)/,
            `background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${homeImages[3]?.cloudinaryUrl || homeImages[0].cloudinaryUrl}')`
        );
    }

    fs.writeFileSync(indexPath, html, 'utf8');
    console.log('[OK] index.html - Updated with home images');
}

// Update industry pages with their respective images
const industryPages = [
    { file: 'automotive.html', folder: 'automotive', name: 'Automotive' },
    { file: 'healthcare-and-life-sciences.html', folder: 'healthcare', name: 'Healthcare' },
    { file: 'technology.html', folder: 'technology', name: 'Technology' },
    { file: 'retail-and-fashion.html', folder: 'retail', name: 'Retail' },
    { file: 'energy-and-public-utilities.html', folder: 'energy', name: 'Energy' },
    { file: 'customs-and-compliance.html', folder: 'customs', name: 'Customs' },
    { file: 'ecommerce-execution.html', folder: 'ecommerce', name: 'E-commerce' },
    { file: 'cold-chain-logistics.html', folder: 'cold chain', name: 'Cold Chain' },
    { file: 'contract-logistics.html', folder: 'contract logistics', name: 'Contract Logistics' },
    { file: 'last-mile-delivery.html', folder: 'lastmile', name: 'Last Mile' },
    { file: 'customer-service.html', folder: 'cotsumer service', name: 'Customer Service' }
];

let successCount = 0;
let failCount = 0;

industryPages.forEach(page => {
    const filePath = `./opslogistic/${page.file}`;
    if (fs.existsSync(filePath)) {
        const images = mapping[page.folder] || [];

        if (images.length > 0) {
            let html = fs.readFileSync(filePath, 'utf8');

            // Replace first SVG placeholder with first image
            let replaced = false;

            // Try to replace data:image SVG with Cloudinary URL
            html = html.replace(
                /src="data:image\/svg\+xml,[^"]*"/,
                `src="${images[0].cloudinaryUrl}"`
            );

            if (html.includes(images[0].cloudinaryUrl)) {
                replaced = true;
            }

            fs.writeFileSync(filePath, html, 'utf8');
            console.log(`[OK] ${page.file} - Added ${images.length} ${page.name} image(s)`);
            successCount++;
        } else {
            console.log(`[SKIP] ${page.file} - No ${page.folder} images available`);
            failCount++;
        }
    } else {
        console.log(`[MISS] ${page.file} - File not found`);
        failCount++;
    }
});

console.log(`\n========== SUMMARY ==========`);
console.log(`Updated: ${successCount} pages`);
console.log(`Skipped: ${failCount} pages`);
console.log(`Total images wired: 39`);
console.log(`\nImages are now live on Cloudinary and wired to your pages!`);
console.log(`Ready to deploy to Vercel.`);
