import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, 'src', 'data', 'products.json');

const categorizeProduct = (name) => {
  const n = name.toUpperCase();
  if (n.includes('DRILL') || n.includes('T/S')) return 'Drills';
  if (n.includes('ENDMILL') || n.includes('MILLING') || n.includes('CUTTER')) return 'Milling Tools';
  if (n.includes('INSERT') || n.includes('THREADING')) return 'Inserts';
  if (n.includes('TAP') || n.includes('DIE')) return 'Taps & Dies';
  if (n.includes('BORING') || n.includes('BAR')) return 'Boring Tools';
  if (n.includes('TOOL') || n.includes('HOLDER')) return 'Tool Holders';
  if (n.includes('CONNECTOR') || n.includes('FITTING') || n.includes('HOSE') || n.includes('TUBE')) return 'Pneumatics';
  if (n.includes('BEARING') || n.includes('SKF') || n.includes('NSK')) return 'Bearings';
  if (n.includes('GAUGE') || n.includes('SCALE') || n.includes('CALIPER')) return 'Measuring';
  if (n.includes('WHEEL') || n.includes('DISC') || n.includes('GRINDING')) return 'Grinding & Cutting';
  if (n.includes('FIXTURE') || n.includes('PALLET') || n.includes('CHUCK') || n.includes('JAWS')) return 'Fixtures';
  if (n.includes('SCREW') || n.includes('NUT') || n.includes('BOLT') || n.includes('KEY')) return 'Fasteners';
  if (n.includes('ROPE') || n.includes('CABLE') || n.includes('PIPE')) return 'Cables & Ropes';
  return 'Others';
};

const imageMap = {
    'Drills': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    'Milling Tools': 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    'Inserts': 'https://images.unsplash.com/photo-1611078833918-2c262a04870d?auto=format&fit=crop&q=80&w=400',
    'Taps & Dies': 'https://images.unsplash.com/photo-1631541909061-71e34a625e19?auto=format&fit=crop&q=80&w=400',
    'Boring Tools': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=400',
    'Tool Holders': 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=400',
    'Pneumatics': 'https://images.unsplash.com/photo-1584483861546-568ebba49a88?auto=format&fit=crop&q=80&w=400',
    'Bearings': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400',
    'Measuring': 'https://images.unsplash.com/photo-1601000845348-18eebda9e869?auto=format&fit=crop&q=80&w=400',
    'Grinding & Cutting': 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&q=80&w=400',
    'Fixtures': 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=400',
    'Fasteners': 'https://images.unsplash.com/photo-1530982011887-3cc11cc85693?auto=format&fit=crop&q=80&w=400',
    'Cables & Ropes': 'https://images.unsplash.com/photo-1518080735706-53805eb11075?auto=format&fit=crop&q=80&w=400'
};

async function processProducts() {
  const productsData = fs.readFileSync(productsPath, 'utf8');
  const allProducts = JSON.parse(productsData);

  const categories = [
    'Drills', 'Milling Tools', 'Inserts', 'Taps & Dies', 'Boring Tools',
    'Tool Holders', 'Pneumatics', 'Bearings', 'Measuring', 'Grinding & Cutting',
    'Fixtures', 'Fasteners', 'Cables & Ropes'
  ]; // Exactly 13 categories

  const selectedProducts = [];
  const categoryCounts = {};
  
  categories.forEach(c => categoryCounts[c] = 0);

  // First pass: Try to find existing products
  for (const product of allProducts) {
    const cat = categorizeProduct(product.name);
    if (categories.includes(cat) && categoryCounts[cat] < 2) {
      // Improve image logic to definitely be exactly mapped per category for best visual
      product.image = imageMap[cat];
      selectedProducts.push(product);
      categoryCounts[cat]++;
    }
  }

  // Second pass: If any category doesn't have 2 products, create mock ones
  for (const cat of categories) {
    while (categoryCounts[cat] < 2) {
      const mockId = Math.floor(Math.random() * 10000) + 1000;
      selectedProducts.push({
        id: mockId,
        name: `Premium ${cat.slice(0, -1)} Product ${categoryCounts[cat] + 1}`,
        price: Math.floor(Math.random() * 5000) + 500,
        image: imageMap[cat]
      });
      categoryCounts[cat]++;
    }
  }

  // Re-assign IDs to be sequential for cleanliness
  selectedProducts.forEach((p, idx) => p.id = idx + 1);

  fs.writeFileSync(productsPath, JSON.stringify(selectedProducts, null, 2));
  console.log(`Successfully reduced catalog to ${selectedProducts.length} products across 13 categories (2 per category).`);
}

processProducts();
