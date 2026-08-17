import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Aura Commerce API is active' });
});

// Root & API Welcome Dashboard (HTML)
app.get(['/', '/api'], (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>AURA E-Commerce REST API Dashboard</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; max-width: 800px; margin: 0 auto; }
        .card { background: #1e293b; border-radius: 16px; padding: 2rem; border: 1px solid #334155; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); }
        h1 { color: #818cf8; margin-top: 0; display: flex; align-items: center; gap: 10px; }
        .badge { background: #10b981; color: #022c22; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        ul { list-style: none; padding: 0; margin: 1.5rem 0; }
        li { margin-bottom: 0.75rem; background: #0f172a; padding: 12px 16px; border-radius: 10px; border: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        a { color: #38bdf8; text-decoration: none; font-weight: 600; font-family: monospace; font-size: 1.05rem; }
        a:hover { text-decoration: underline; color: #7dd3fc; }
        .method { background: #6366f1; color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: bold; }
        .btn-ui { display: inline-block; background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 12px 24px; border-radius: 10px; font-weight: bold; margin-top: 1rem; text-decoration: none; }
        .btn-ui:hover { background: #4f46e5; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>✨ AURA Commerce API <span class="badge">ONLINE</span></h1>
        <p>The Express backend server and SQLite database are active and running.</p>
        <p style="color: #94a3b8; font-size: 0.9rem;">Designed & Developed by <strong>Sathvik Reddy Surasani</strong> | CodeAlpha Internship</p>

        <h3>Available API Endpoints:</h3>
        <ul>
          <li>
            <span><span class="method">GET</span> <a href="/api/health" target="_blank">/api/health</a></span>
            <span>API Server Health Status</span>
          </li>
          <li>
            <span><span class="method">GET</span> <a href="/api/products" target="_blank">/api/products</a></span>
            <span>Product Catalog (Filter, Search, Sort)</span>
          </li>
          <li>
            <span><span class="method">GET</span> <a href="/api/products/prod-1" target="_blank">/api/products/prod-1</a></span>
            <span>Single Product Details</span>
          </li>
          <li>
            <span><span class="method">GET</span> <a href="/api/orders" target="_blank">/api/orders</a></span>
            <span>Customer Orders History</span>
          </li>
        </ul>

        <a href="http://localhost:3000" class="btn-ui">🛍️ Open React E-Commerce Store UI (Port 3000) &rarr;</a>
      </div>
    </body>
    </html>
  `);
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Initialize database and start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
  });
