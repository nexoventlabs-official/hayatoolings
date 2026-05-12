const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'data', 'products.json');
let productsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const itemName = '1/2" Bore Threading Tool';
const hit = productsData.find((p) => (p.bundleItems && p.bundleItems[0] === itemName) || p.name === itemName);
console.log('Hit for', itemName, ':', hit ? hit.name : 'Not Found', 'Image:', hit ? hit.image : 'N/A');

const allMatches = productsData.filter((p) => (p.bundleItems && p.bundleItems[0] === itemName) || p.name === itemName);
console.log('All matches length:', allMatches.length);
if (allMatches.length > 0) {
    allMatches.forEach(m => console.log('ID:', m.id, 'Image:', m.image, 'BundleItems[0]:', m.bundleItems[0]));
}
