import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'ecommerce.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Promisified DB query helpers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const getOne = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Table Setup and Initial Seeding
export const initDb = async () => {
  // 1. Users Table
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Products Table
  await run(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      rating REAL DEFAULT 0,
      reviews_count INTEGER DEFAULT 0,
      image TEXT NOT NULL,
      gallery TEXT,
      in_stock BOOLEAN DEFAULT 1,
      stock_count INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT 0,
      is_trending BOOLEAN DEFAULT 0,
      badge TEXT,
      description TEXT,
      colors TEXT,
      sizes TEXT,
      specifications TEXT,
      reviews TEXT
    )
  `);

  // 3. Orders Table
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      user_name TEXT NOT NULL,
      user_email TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      items TEXT NOT NULL,
      subtotal REAL NOT NULL,
      discount REAL DEFAULT 0,
      shipping_fee REAL DEFAULT 0,
      tax REAL DEFAULT 0,
      total REAL NOT NULL,
      status TEXT DEFAULT 'Processing',
      step INTEGER DEFAULT 2,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      estimated_delivery TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Seed Products if table is empty
  const countRow = await getOne('SELECT COUNT(*) as count FROM products');
  if (countRow.count === 0) {
    console.log('Seeding initial products into database...');
    const seedProducts = [
      {
        id: "prod-1",
        name: "Aura Pro Wireless Noise-Canceling Headphones",
        category: "Electronics",
        price: 249.99,
        original_price: 299.99,
        rating: 4.8,
        reviews_count: 142,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 18,
        is_featured: 1,
        is_trending: 1,
        badge: "Bestseller",
        description: "Immerse yourself in pure studio-quality sound with active noise cancellation, custom 40mm beryllium drivers, and up to 40 hours of continuous battery life.",
        colors: JSON.stringify(["Space Black", "Silver Frost", "Midnight Blue"]),
        sizes: JSON.stringify([]),
        specifications: JSON.stringify({
          "Driver Size": "40mm Beryllium",
          "Battery Life": "Up to 40 Hours",
          "Bluetooth": "v5.3 Low Latency",
          "Active Noise Control": "Hybrid ANC (4 Mics)",
          "Weight": "250 grams"
        }),
        reviews: JSON.stringify([
          { id: "r1", user: "Alex Mercer", rating: 5, date: "2026-06-15", comment: "The soundstage is unreal. Battery lasts for days!" },
          { id: "r2", user: "Sophia Lin", rating: 4, date: "2026-07-02", comment: "Very comfortable ANC for long flights." }
        ])
      },
      {
        id: "prod-2",
        name: "Minimalist Solar-Powered Smartwatch v2",
        category: "Electronics",
        price: 189.00,
        original_price: 220.00,
        rating: 4.6,
        reviews_count: 98,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 25,
        is_featured: 1,
        is_trending: 0,
        badge: "Eco Pick",
        description: "A sleek OLED touchscreen watch with infinite solar charging under natural light, SpO2 sensor, heart rate monitor, and 50m water resistance.",
        colors: JSON.stringify(["Matte Black", "Rose Gold", "Titanium Gray"]),
        sizes: JSON.stringify(["38mm", "42mm"]),
        specifications: JSON.stringify({
          "Display": "1.4” AMOLED Touch",
          "Water Resistance": "5 ATM (50m)",
          "Battery": "Infinite Solar / 14-Day Standby",
          "Sensors": "Heart Rate, SpO2, GPS, Sleep Tracker"
        }),
        reviews: JSON.stringify([
          { id: "r3", user: "David K.", rating: 5, date: "2026-05-20", comment: "Haven't charged it once since getting it!" }
        ])
      },
      {
        id: "prod-3",
        name: "Ergonomic Artisan Mechanical Keyboard",
        category: "Electronics",
        price: 135.50,
        original_price: 160.00,
        rating: 4.9,
        reviews_count: 215,
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 12,
        is_featured: 0,
        is_trending: 1,
        badge: "Hot",
        description: "Hot-swappable mechanical keyboard with custom lubricated linear switches, RGB backlighting, gasket mount structure, and PBT double-shot keycaps.",
        colors: JSON.stringify(["Cyber White", "Retro Slate"]),
        sizes: JSON.stringify([]),
        specifications: JSON.stringify({
          "Switch Type": "Gateron Oil King Linear",
          "Layout": "75% Compact",
          "Connectivity": "Tri-Mode (2.4G, BT5.0, Type-C)",
          "Keycaps": "Double-shot PBT"
        }),
        reviews: JSON.stringify([
          { id: "r4", user: "Marcus V.", rating: 5, date: "2026-06-28", comment: "Sounds like rain on a tin roof. Satisfying typing!" }
        ])
      },
      {
        id: "prod-4",
        name: "Luxury Italian Leather Everyday Tote",
        category: "Fashion",
        price: 175.00,
        original_price: 210.00,
        rating: 4.7,
        reviews_count: 76,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 9,
        is_featured: 1,
        is_trending: 0,
        badge: "Handcrafted",
        description: "Crafted from full-grain Tuscan leather with gold-tone hardware, laptop compartment fits up to 15-inch devices, water-resistant interior lining.",
        colors: JSON.stringify(["Cognac Brown", "Midnight Black", "Olive Green"]),
        sizes: JSON.stringify([]),
        specifications: JSON.stringify({
          "Material": "Full-Grain Italian Leather",
          "Capacity": "18 Liters",
          "Dimensions": "40cm x 30cm x 15cm",
          "Weight": "850g"
        }),
        reviews: JSON.stringify([
          { id: "r5", user: "Emma Watson", rating: 5, date: "2026-04-12", comment: "Smells incredible, leather ages beautifully." }
        ])
      },
      {
        id: "prod-5",
        name: "Organic Bamboo Linen Duvet & Sheet Set",
        category: "Home & Living",
        price: 119.99,
        original_price: 149.99,
        rating: 4.8,
        reviews_count: 160,
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 30,
        is_featured: 0,
        is_trending: 1,
        badge: "Organic",
        description: "100% Organic Viscose from Bamboo. Hypoallergenic, temperature-regulating silky soft weave for deep, refreshing sleep.",
        colors: JSON.stringify(["Sage Green", "Crisp White", "Sand Ochre"]),
        sizes: JSON.stringify(["Queen", "King", "California King"]),
        specifications: JSON.stringify({
          "Thread Count": "400 Thread Count Bamboo",
          "Certifications": "OEKO-TEX Standard 100",
          "Includes": "1 Duvet Cover, 1 Fitted Sheet, 2 Pillowcases"
        }),
        reviews: JSON.stringify([
          { id: "r6", user: "Chloe M.", rating: 5, date: "2026-06-01", comment: "So cool to the touch! Slept like a baby." }
        ])
      },
      {
        id: "prod-6",
        name: "Aroma Ceramic Ultrasonic Essential Oil Diffuser",
        category: "Home & Living",
        price: 49.99,
        original_price: 65.00,
        rating: 4.5,
        reviews_count: 89,
        image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 45,
        is_featured: 0,
        is_trending: 0,
        badge: "Sale",
        description: "Handcrafted ceramic housing diffuser with 7 ambient LED light modes, Whisper-Quiet ultrasonic misting, auto shut-off feature.",
        colors: JSON.stringify(["Terracotta", "Terracotta White", "Slate Grey"]),
        sizes: JSON.stringify([]),
        specifications: JSON.stringify({
          "Capacity": "250ml Water Tank",
          "Coverage": "300 sq. ft.",
          "Timer Modes": "1h, 3h, 6h, Continuous"
        }),
        reviews: JSON.stringify([])
      },
      {
        id: "prod-7",
        name: "Ultra-Lightweight Carbon Trail Running Shoes",
        category: "Fashion",
        price: 159.95,
        original_price: 185.00,
        rating: 4.7,
        reviews_count: 112,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 14,
        is_featured: 1,
        is_trending: 1,
        badge: "New Release",
        description: "Full-length carbon fiber propulsion plate encased in high-rebound supercritical foam. Maximum traction for rugged mountain trails.",
        colors: JSON.stringify(["Neon Crimson", "Volt Yellow", "Obsidian Black"]),
        sizes: JSON.stringify(["US 8", "US 9", "US 10", "US 11", "US 12"]),
        specifications: JSON.stringify({
          "Drop": "6mm",
          "Weight": "210g",
          "Plate": "Full Carbon Fiber Plate"
        }),
        reviews: JSON.stringify([
          { id: "r7", user: "Jason B.", rating: 5, date: "2026-07-10", comment: "Broke my 10k PR on the very first run!" }
        ])
      },
      {
        id: "prod-8",
        name: "HydraGlow Vitamin C & Peptide Facial Serum",
        category: "Beauty",
        price: 38.00,
        original_price: 48.00,
        rating: 4.9,
        reviews_count: 230,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        gallery: JSON.stringify([
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
        ]),
        in_stock: 1,
        stock_count: 50,
        is_featured: 0,
        is_trending: 1,
        badge: "Top Rated",
        description: "Potent 15% L-Ascorbic Acid infused with Hyaluronic Acid and copper tripeptides to brighten complexion and boost collagen synthesis.",
        colors: JSON.stringify([]),
        sizes: JSON.stringify([]),
        specifications: JSON.stringify({
          "Volume": "30ml / 1 fl. oz.",
          "Skin Type": "All Skin Types",
          "Cruelty-Free": "Yes, Vegan Certified"
        }),
        reviews: JSON.stringify([
          { id: "r8", user: "Sarah T.", rating: 5, date: "2026-06-18", comment: "My skin glows like never before. 10/10." }
        ])
      }
    ];

    for (const p of seedProducts) {
      await run(
        `INSERT INTO products 
        (id, name, category, price, original_price, rating, reviews_count, image, gallery, in_stock, stock_count, is_featured, is_trending, badge, description, colors, sizes, specifications, reviews)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.id, p.name, p.category, p.price, p.original_price, p.rating, p.reviews_count, p.image, p.gallery, p.in_stock, p.stock_count, p.is_featured, p.is_trending, p.badge, p.description, p.colors, p.sizes, p.specifications, p.reviews]
      );
    }
    console.log('Seeded 8 initial products into database successfully.');
  }
};

export default db;
