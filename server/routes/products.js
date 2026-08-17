import express from 'express';
import { query, getOne } from '../db.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, sort, inStockOnly } = req.query;

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Search filter
    if (search) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(category) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    // Category filter
    if (category && category !== 'all') {
      sql += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    // Price filters
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(Number(maxPrice));
    }

    // Rating filter
    if (minRating) {
      sql += ' AND rating >= ?';
      params.push(Number(minRating));
    }

    // In Stock filter
    if (inStockOnly === 'true' || inStockOnly === true) {
      sql += ' AND in_stock = 1';
    }

    // Sorting
    if (sort === 'price-low') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price-high') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else {
      sql += ' ORDER BY id DESC';
    }

    const rows = await query(sql, params);

    // Format fields (parse JSON strings back into objects/arrays)
    const products = rows.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.original_price,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      image: p.image,
      gallery: p.gallery ? JSON.parse(p.gallery) : [],
      inStock: Boolean(p.in_stock),
      stockCount: p.stock_count,
      isFeatured: Boolean(p.is_featured),
      isTrending: Boolean(p.is_trending),
      badge: p.badge,
      description: p.description,
      colors: p.colors ? JSON.parse(p.colors) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      specifications: p.specifications ? JSON.parse(p.specifications) : {},
      reviews: p.reviews ? JSON.parse(p.reviews) : []
    }));

    return res.json({ products, total: products.length });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error fetching products' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const p = await getOne('SELECT * FROM products WHERE id = ?', [id]);

    if (!p) {
      return res.status(404).json({ message: `Product with ID ${id} not found.` });
    }

    const product = {
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      originalPrice: p.original_price,
      rating: p.rating,
      reviewsCount: p.reviews_count,
      image: p.image,
      gallery: p.gallery ? JSON.parse(p.gallery) : [],
      inStock: Boolean(p.in_stock),
      stockCount: p.stock_count,
      isFeatured: Boolean(p.is_featured),
      isTrending: Boolean(p.is_trending),
      badge: p.badge,
      description: p.description,
      colors: p.colors ? JSON.parse(p.colors) : [],
      sizes: p.sizes ? JSON.parse(p.sizes) : [],
      specifications: p.specifications ? JSON.parse(p.specifications) : {},
      reviews: p.reviews ? JSON.parse(p.reviews) : []
    };

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return res.status(500).json({ message: 'Server error fetching product' });
  }
});

export default router;
