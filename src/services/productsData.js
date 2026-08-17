export const PRODUCTS = [
  {
    id: "prod-1",
    name: "Aura Pro Wireless Noise-Canceling Headphones",
    category: "Electronics",
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.9,
    reviewsCount: 184,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    isTrending: true,
    badge: "Bestseller",
    description: "Immerse yourself in pure studio-quality sound with active noise cancellation, custom 40mm beryllium drivers, spatial audio tracking, and up to 40 hours of continuous battery life.",
    colors: ["Space Black", "Silver Frost", "Midnight Blue"],
    specifications: {
      "Driver Size": "40mm Beryllium Custom",
      "Battery Life": "Up to 40 Hours (ANC On)",
      "Bluetooth": "v5.3 Low Latency Audio",
      "Active Noise Control": "Hybrid ANC (4 Mics)",
      "Weight": "250 grams"
    },
    reviews: [
      { id: "r1", user: "Alex Mercer", rating: 5, date: "2026-06-15", comment: "The soundstage is unreal! Deep bass without muddying the mids. Battery lasts for days." },
      { id: "r2", user: "Sophia Lin", rating: 5, date: "2026-07-02", comment: "Very comfortable ANC for long transpacific flights. Feels like sitting in a quiet room." },
      { id: "r3", user: "Daniel K.", rating: 4, date: "2026-07-28", comment: "Build quality is top notch. Premium aluminum touches feel great." }
    ]
  },
  {
    id: "prod-2",
    name: "Minimalist Solar Smartwatch Series X",
    category: "Electronics",
    price: 189.00,
    originalPrice: 220.00,
    rating: 4.7,
    reviewsCount: 112,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 25,
    isFeatured: true,
    isTrending: false,
    badge: "Eco Pick",
    description: "A sleek AMOLED touchscreen watch with infinite solar charging under natural light, SpO2 sensor, heart rate monitoring, continuous ECG, and 50m water resistance.",
    colors: ["Matte Black", "Rose Gold", "Titanium Gray"],
    sizes: ["38mm", "42mm"],
    specifications: {
      "Display": "1.4” Ultra AMOLED Touch (1000 nits)",
      "Water Resistance": "5 ATM (50 meters)",
      "Battery": "Infinite Solar / 14-Day Standby",
      "Sensors": "Heart Rate, SpO2, GPS, Sleep Tracker"
    },
    reviews: [
      { id: "r4", user: "David K.", rating: 5, date: "2026-05-20", comment: "Haven't charged it once since getting it! Solar feature actually works standard outdoors." }
    ]
  },
  {
    id: "prod-3",
    name: "Ergonomic Artisan Mechanical Keyboard",
    category: "Electronics",
    price: 135.50,
    originalPrice: 160.00,
    rating: 4.9,
    reviewsCount: 215,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 12,
    isFeatured: true,
    isTrending: true,
    badge: "Hot Deal",
    description: "Hot-swappable mechanical keyboard with custom lubricated linear switches, per-key RGB backlighting, gasket mount structure, and PBT double-shot keycaps.",
    colors: ["Cyber White", "Retro Slate"],
    specifications: {
      "Switch Type": "Gateron Oil King Linear",
      "Layout": "75% Compact Layout",
      "Connectivity": "Tri-Mode (2.4G Wireless, BT5.0, Type-C)",
      "Keycaps": "Double-shot PBT Profile"
    },
    reviews: [
      { id: "r5", user: "Marcus V.", rating: 5, date: "2026-06-28", comment: "Sounds like rain on a tin roof! Extremely satisfying thocky typing sound." }
    ]
  },
  {
    id: "prod-4",
    name: "Luxury Italian Leather Everyday Tote",
    category: "Fashion",
    price: 175.00,
    originalPrice: 210.00,
    rating: 4.8,
    reviewsCount: 96,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 9,
    isFeatured: true,
    isTrending: false,
    badge: "Handcrafted",
    description: "Crafted from full-grain Tuscan leather with gold-tone hardware, padded laptop compartment fitting up to 15-inch devices, and water-resistant interior lining.",
    colors: ["Cognac Brown", "Midnight Black", "Olive Green"],
    specifications: {
      "Material": "Full-Grain Italian Tuscan Leather",
      "Capacity": "18 Liters",
      "Dimensions": "40cm x 30cm x 15cm",
      "Weight": "850g"
    },
    reviews: [
      { id: "r6", user: "Emma Watson", rating: 5, date: "2026-04-12", comment: "Smells incredible! The full-grain leather ages with a gorgeous patina." }
    ]
  },
  {
    id: "prod-5",
    name: "Organic Bamboo Linen Duvet & Sheet Set",
    category: "Home & Living",
    price: 119.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviewsCount: 160,
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 30,
    isFeatured: false,
    isTrending: true,
    badge: "Organic",
    description: "100% Organic Viscose from Bamboo. Hypoallergenic, thermal-regulating silky soft weave engineered for deep, luxurious sleep year-round.",
    colors: ["Sage Green", "Crisp White", "Sand Ochre"],
    sizes: ["Queen", "King", "California King"],
    specifications: {
      "Thread Count": "400 Thread Count Organic Bamboo",
      "Certifications": "OEKO-TEX Standard 100 Certified",
      "Includes": "1 Duvet Cover, 1 Fitted Sheet, 2 Pillowcases"
    },
    reviews: [
      { id: "r7", user: "Chloe M.", rating: 5, date: "2026-06-01", comment: "So cool to the touch! Perfect for warm summer nights." }
    ]
  },
  {
    id: "prod-6",
    name: "Aroma Ceramic Ultrasonic Essential Oil Diffuser",
    category: "Home & Living",
    price: 49.99,
    originalPrice: 65.00,
    rating: 4.6,
    reviewsCount: 89,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 45,
    isFeatured: false,
    isTrending: false,
    badge: "Sale",
    description: "Handcrafted ceramic housing diffuser with 7 ambient LED light modes, Whisper-Quiet ultrasonic misting, ambient night light, and safety auto shut-off.",
    colors: ["Terracotta", "Pure White", "Slate Grey"],
    specifications: {
      "Capacity": "250ml Water Tank",
      "Coverage": "300 sq. ft.",
      "Timer Modes": "1h, 3h, 6h, Continuous"
    },
    reviews: [
      { id: "r8", user: "Liam P.", rating: 5, date: "2026-05-14", comment: "Looks like a piece of high-end pottery on my nightstand." }
    ]
  },
  {
    id: "prod-7",
    name: "Ultra-Lightweight Carbon Trail Running Shoes",
    category: "Fashion",
    price: 159.95,
    originalPrice: 185.00,
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 14,
    isFeatured: true,
    isTrending: true,
    badge: "New Release",
    description: "Full-length carbon fiber propulsion plate encased in high-rebound supercritical foam. Maximum energy return and traction for rugged mountain trails.",
    colors: ["Neon Crimson", "Volt Yellow", "Obsidian Black"],
    sizes: ["US 8", "US 9", "US 10", "US 11", "US 12"],
    specifications: {
      "Drop": "6mm Heel-to-Toe",
      "Weight": "210g Superlight",
      "Plate": "Full Carbon Fiber Plate"
    },
    reviews: [
      { id: "r9", user: "Jason B.", rating: 5, date: "2026-07-10", comment: "Broke my 10k PR on the very first run! Explosive energy return." }
    ]
  },
  {
    id: "prod-8",
    name: "HydraGlow Vitamin C & Peptide Serum",
    category: "Beauty",
    price: 38.00,
    originalPrice: 48.00,
    rating: 4.9,
    reviewsCount: 230,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 50,
    isFeatured: false,
    isTrending: true,
    badge: "Top Rated",
    description: "Potent 15% L-Ascorbic Acid infused with Hyaluronic Acid and copper tripeptides to brighten skin tone, fade hyperpigmentation, and boost collagen.",
    colors: [],
    specifications: {
      "Volume": "30ml / 1 fl. oz.",
      "Skin Type": "All Skin Types & Sensitive",
      "Certifications": "Cruelty-Free, 100% Vegan"
    },
    reviews: [
      { id: "r10", user: "Sarah T.", rating: 5, date: "2026-06-18", comment: "My skin glows like never before. Faded dark spots in 2 weeks!" }
    ]
  },
  {
    id: "prod-9",
    name: "Precision Aluminum Studio Desk Lamp",
    category: "Home & Living",
    price: 79.00,
    originalPrice: 99.00,
    rating: 4.7,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 22,
    isFeatured: false,
    isTrending: false,
    badge: "Design Award",
    description: "Architectural LED desk light with touch-dimmable color temperatures (2700K - 6500K), built-in 15W Qi Wireless Fast Charger base, and USB-C port.",
    colors: ["Space Gray", "Silver Anodized"],
    specifications: {
      "Brightness": "1000 Lumens Peak",
      "Wireless Charge": "15W Qi Fast Charging Base",
      "CRI Rating": ">95 True Color Render"
    },
    reviews: [
      { id: "r11", user: "Nathan R.", rating: 5, date: "2026-07-01", comment: "Love charging my phone right on the lamp base while reading." }
    ]
  },
  {
    id: "prod-10",
    name: "Minimalist Polarized Sunglasses",
    category: "Fashion",
    price: 89.00,
    originalPrice: 110.00,
    rating: 4.8,
    reviewsCount: 77,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
    ],
    inStock: true,
    stockCount: 16,
    isFeatured: false,
    isTrending: true,
    badge: "Trending",
    description: "Lightweight titanium frame polarized sunglasses with UV400 anti-glare scratch resistant Japanese TAC lenses.",
    colors: ["Gold / Green Lens", "Matte Black / Smoke"],
    specifications: {
      "Lens Material": "TAC Polarized UV400",
      "Frame": "Hypoallergenic Titanium",
      "Weight": "19 grams"
    },
    reviews: [
      { id: "r12", user: "Clara S.", rating: 5, date: "2026-06-11", comment: "Featherlight! Forget I even have them on." }
    ]
  }
];

export const CATEGORIES = [
  { id: "all", name: "All Products", count: 10 },
  { id: "Electronics", name: "Electronics", count: 3 },
  { id: "Fashion", name: "Fashion & Apparel", count: 3 },
  { id: "Home & Living", name: "Home & Living", count: 3 },
  { id: "Beauty", name: "Beauty & Wellness", count: 1 }
];

export const PROMO_CODES = {
  "SAVE20": { discountPercent: 20, description: "20% Off Your Entire Order" },
  "AURA10": { discountPercent: 10, description: "10% Welcome Discount" },
  "FREESHIP": { discountPercent: 0, freeShipping: true, description: "Free Express Shipping" }
};
