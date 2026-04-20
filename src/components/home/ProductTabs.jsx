import React from 'react';
import { Link } from 'react-router-dom';
import { Drill, Wrench, CircleDot, Scissors, Settings, Hammer, Ruler, CircuitBoard, Cog, Shield } from 'lucide-react';
import catBottom from '../../assets/cat-1-bottom.png';

import productsData from '../../data/products.json';

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
  if (n.includes('FIXTURE') || n.includes('PALLET') || n.includes('CHUCK')) return 'Fixtures';
  if (n.includes('SCREW') || n.includes('NUT') || n.includes('BOLT') || n.includes('KEY')) return 'Fasteners';
  if (n.includes('ROPE') || n.includes('CABLE') || n.includes('PIPE')) return 'Cables & Ropes';
  return 'Others';
};

const categories = [
  { name: 'Cutting Tools', icon: Scissors, count: 45 },
  { name: 'Drills', icon: Drill, count: 38 },
  { name: 'Measuring', icon: Ruler, count: 24 },
  { name: 'Hand Tools', icon: Hammer, count: 52 },
  { name: 'Inserts', icon: CircleDot, count: 30 },
  { name: 'Boring Tools', icon: Settings, count: 18 },
  { name: 'Bearings', icon: Cog, count: 22 },
  { name: 'Fasteners', icon: Wrench, count: 35 },
  { name: 'Pneumatics', icon: CircuitBoard, count: 16 },
  { name: 'Grinding', icon: Shield, count: 20 },
];

const ProductTabs = () => {
  const doubled = [...categories, ...categories];

  return (
    <section className="dt-sc-section-wrapper home-product-tab">
      <div className="category-scroll-header">
        <h2>Browse <span className="text-accent">Categories</span></h2>
      </div>
      <div className="category-scroll-wrapper">
        <div className="category-scroll-track">
          {doubled.map((cat, idx) => {
            const CatIcon = cat.icon;
            // Get actual count from productsData instead of dummy data
            const count = productsData.filter(p => categorizeProduct(p.name) === cat.name).length;
            
            // Only show categories that have products
            if (count === 0) return null;

            return (
              <Link to="/products" key={idx} className="category-scroll-card">
                <div className="category-card-arch">
                  <div className="category-card-icon">
                    <CatIcon size={36} />
                  </div>
                  <div className="category-card-info">
                    <span className="category-card-name">{cat.name}</span>
                    <span className="category-card-count">{count} Items</span>
                  </div>
                  <img src={catBottom} alt="" className="category-card-bottom" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductTabs;
