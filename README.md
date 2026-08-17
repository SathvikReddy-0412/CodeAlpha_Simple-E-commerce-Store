# 🛍️ CodeAlpha Simple E-Commerce Store (AURA Commerce)

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build%20Tool-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

A full-stack, feature-packed e-commerce web application built for **CodeAlpha Task 1 Internship Project**. **AURA Commerce** features a modern frontend built with React & Vite and a RESTful backend API built with Express and SQLite.

---

## ✨ Features

### 🛒 Customer Experience
- **Interactive Home Page**: Featured hero banner, promotional offer cards, trending collection showcases, value proposition badges, and customer testimonials.
- **Product Catalog & Shop**: Filter products by category, price range, search keywords, and sort by price or rating.
- **Detailed Product Views**: Interactive image gallery viewer, color & size selectors, stock status indicator, product specifications table, and user reviews.
- **Shopping Cart**: Real-time quantity adjustments, item removal, dynamic price calculations (subtotal, taxes, shipping, coupon discounts).
- **Wishlist**: Save favorite items with one click and move them to cart anytime.
- **Multi-Step Checkout**: Comprehensive checkout flow with address form, shipping options, payment method selection, and order review.
- **Order Management & History**: View past orders, status indicators (Processing, Shipped, Delivered), item details, and breakdown.

### 🔐 Backend & Database
- **Authentication**: JWT-based authentication for user registration and login.
- **RESTful API**: Endpoints for products, user auth, cart management, and order history.
- **Auto Database Initialization**: SQLite database auto-configures tables (`users`, `products`, `orders`) and seeds rich initial product catalog data on launch.
- **API Dashboard**: Express backend provides a custom HTML dashboard at `http://localhost:5000/api` for easy route inspection and status checks.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite) |
| **Routing** | React Router DOM v6 |
| **Icons & UI Utilities** | Lucide React Icons |
| **Styling** | Custom Vanilla CSS (Design Tokens, Responsive Grid & Flexbox, Glassmorphism, Micro-interactions) |
| **Backend Framework** | Node.js & Express.js |
| **Database** | SQLite3 (Promisified Queries) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` |
| **HTTP Client** | Axios |

---

## 📁 Project Structure

```
CodeAlpha_T1_EcommerceStore/
├── public/                 # Static assets
├── server/                 # Express backend server
│   ├── routes/             # API routes (auth, products, orders)
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── products.js
│   ├── db.js               # SQLite connection & seed initialization
│   ├── ecommerce.db        # SQLite database file (generated at runtime)
│   └── index.js            # Express server entry point & API dashboard
├── src/                    # React frontend source code
│   ├── components/         # Reusable UI components (Navbar, Footer, ProductCard, etc.)
│   ├── context/            # Global context (AuthContext, CartContext, WishlistContext)
│   ├── pages/              # Page components (Home, Shop, ProductDetail, Cart, Checkout, Orders, Wishlist)
│   ├── services/           # Axios API services
│   ├── utils/              # Helper functions & formatting utilities
│   ├── App.jsx             # Main application layout & route setup
│   ├── index.css           # Global design system & component styles
│   └── main.jsx            # React root entry point
├── .gitignore              # Git ignore rules
├── index.html              # HTML shell
├── package.json            # Dependencies & scripts
└── vite.config.js          # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v16+ recommended) installed on your system.
- Node.js: `node -v`
- npm: `npm -v`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SathvikReddy-0412/CodeAlpha_Simple-E-commerce-Store.git
   cd CodeAlpha_Simple-E-commerce-Store
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

### Running the Application

You can run the frontend development server and backend API server simultaneously or separately.

#### Option 1: Running Backend Server
```bash
npm run server
```
- Express backend will start at: `http://localhost:5000`
- API Dashboard & Health check available at: `http://localhost:5000/api`

#### Option 2: Running Frontend App
In a new terminal window:
```bash
npm run dev
```
- React application will start at: `http://localhost:3000` (or `http://localhost:5173`)

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | API Health Check |
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/products` | Fetch all products (supports category & search query) |
| `GET` | `/api/products/:id` | Fetch product details by ID |
| `GET` | `/api/orders` | Fetch user order history |
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/:id` | Fetch order details by ID |

---

## 👤 Author

**Sathvik Reddy Surasani**
- GitHub: [@SathvikReddy-0412](https://github.com/SathvikReddy-0412)
- Internship: CodeAlpha Full Stack Web Development Internship

---

## 📜 License

This project is licensed under the MIT License - feel free to use it for learning and portfolio purposes.
