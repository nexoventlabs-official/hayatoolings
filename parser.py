import json
import re

with open('../pdf_text.txt', 'r', encoding='utf-8') as f:
    lines = [line.strip() for line in f.readlines()]

products = []

current_name = []
current_numbers = []

for line in lines[11:]: # Skip header
    if not line: continue
    
    # Check if line is a number (integer or float)
    is_num = False
    try:
        float(line)
        is_num = True
    except ValueError:
        is_num = False
        
    if is_num:
        current_numbers.append(float(line))
        # If we have collected at least 2 numbers (MRP and Price) and the last one is a price,
        # wait, let's just check if we have 2 or 3 numbers.
        # Actually, sometimes we see Code (long int), MRP (0.0), Price (float).
        # Let's say if we see a number after a name, we start collecting numbers.
        pass
    else:
        # It's a string.
        # If we already have numbers, then this string means a NEW product has started.
        if current_numbers:
            if current_name:
                name = " ".join(current_name).strip()
                price = current_numbers[-1]
                if price > 0: # Only add if price > 0
                    products.append({
                        "id": len(products) + 1,
                        "name": name,
                        "price": price,
                        "image": ""
                    })
            current_name = []
            current_numbers = []
            
        current_name.append(line)

# Add the last one
if current_name and current_numbers:
    name = " ".join(current_name).strip()
    price = current_numbers[-1]
    if price > 0:
        products.append({
            "id": len(products) + 1,
            "name": name,
            "price": price,
            "image": ""
        })

# Write to src/data/products.json
import os
os.makedirs('src/data', exist_ok=True)
with open('src/data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f"Extracted {len(products)} products with valid prices.")
