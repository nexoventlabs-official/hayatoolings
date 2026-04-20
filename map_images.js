import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, 'src', 'assets', 'products');
const destDir = path.join(__dirname, 'public', 'products');
const productsPath = path.join(__dirname, 'src', 'data', 'products.json');

function main() {
    // 1. Create public/products if not exists
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    // 2. Read images from source
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

    // 3. Copy to destination
    for (const file of imageFiles) {
        fs.copyFileSync(path.join(sourceDir, file), path.join(destDir, file));
    }

    console.log(`Copied ${imageFiles.length} images to public/products`);

    // 4. Update products.json
    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);

    for (let i = 0; i < products.length; i++) {
        // Map images to products. Wrap around if more products than images.
        const imageFile = imageFiles[i % imageFiles.length];
        products[i].image = `/products/${imageFile}`;
    }

    fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
    console.log(`Updated ${products.length} products with local images.`);
}

main();
