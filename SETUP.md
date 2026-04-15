# 🚀 Bandhu - Complete Setup Guide

## Project Overview

**Bandhu** is a full-stack rental marketplace platform with:
- 🔐 Secure authentication
- 📦 Product rental management
- 💰 Wallet-based payment system
- 📊 Admin analytics
- 🎨 Beautiful UI with animations

---

## 🗂️ Project Structure

```
BanduProject/
├── Backend/                 # Node.js + Express + MongoDB API
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Auth & role middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   ├── package.json        # Dependencies
│   └── .env                # Environment variables
│
└── frontend/               # React + Vite + Tailwind CSS
    ├── src/
    │   ├── pages/         # Route pages
    │   ├── components/    # Reusable components
    │   ├── services/      # API client
    │   ├── context/       # State management
    │   ├── hooks/         # Custom hooks
    │   ├── App.jsx        # Main component
    │   └── index.css      # Global styles
    ├── package.json       # Dependencies
    ├── vite.config.js     # Vite config
    ├── tailwind.config.js # Tailwind config
    └── postcss.config.js  # PostCSS config
```

---

## 📋 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or cloud - MongoDB Atlas)
- Git

### 1️⃣ Backend Setup

#### Step 1.1: Navigate to Backend
```bash
cd Backend
```

#### Step 1.2: Install Dependencies
```bash
npm install
```

#### Step 1.3: Create `.env` File
Create a `.env` file in the Backend folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bandhu
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

**For MongoDB Cloud (Atlas):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bandhu
```

#### Step 1.4: Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on port 5000
```

---

### 2️⃣ Frontend Setup

#### Step 2.1: Navigate to Frontend
```bash
cd frontend
```

#### Step 2.2: Install Dependencies
```bash
npm install
```

#### Step 2.3: Configure API URL
In `src/services/api.js`, ensure the base URL matches your backend:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### Step 2.4: Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v7.3.1  ready in 745 ms

  ➜  Local:   http://localhost:5173/
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/register` | name, email, password, role | {message} |
| POST | `/auth/login` | email, password | {token, user} |

### Products
| Method | Endpoint | Role | Response |
|--------|----------|------|----------|
| GET | `/products` | Public | {page, totalPages, products} |
| POST | `/products` | Vendor | {product} |
| GET | `/products/my-products` | Vendor | [products] |
| DELETE | `/products/:id` | Vendor | {message} |

### Orders
| Method | Endpoint | Body | Role |
|--------|----------|------|------|
| POST | `/orders` | productId, startDate, endDate | Customer |
| GET | `/orders/my-orders` | - | Customer |
| GET | `/orders/vendor-orders` | - | Vendor |
| PUT | `/orders/update-status` | orderId, status | Vendor |
| PUT | `/orders/return` | orderId, returnDate | Customer |
| PUT | `/orders/cancel/:id` | - | Customer |

### Admin
| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/admin/dashboard` | Admin |

---

## 🔐 User Roles & Permissions

### Customer
- Browse products
- Create rentals
- Track orders
- Return items
- Write reviews
- Manage wishlist

### Vendor
- Create products
- Manage inventory
- View customer orders
- Update order status
- Track earnings

### Admin
- View platform analytics
- Monitor users
- Track revenue
- System statistics

---

## 💾 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "customer" | "vendor" | "admin",
  walletBalance: Number,
  createdAt: Date
}
```

### Product Model
```javascript
{
  vendor: ObjectId (User),
  title: String,
  category: String,
  description: String,
  rentalPricePerDay: Number,
  depositAmount: Number,
  availableQuantity: Number,
  isAvailable: Boolean,
  isDeleted: Boolean,
  averageRating: Number,
  numReviews: Number,
  createdAt: Date
}
```

### Order Model
```javascript
{
  customer: ObjectId (User),
  vendor: ObjectId (User),
  product: ObjectId (Product),
  startDate: Date,
  endDate: Date,
  totalDays: Number,
  rentalAmount: Number,
  depositAmount: Number,
  lateFee: Number,
  status: "pending" | "approved" | "in-use" | "returned" | "completed" | "cancelled",
  isDeleted: Boolean,
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  user: ObjectId (User),
  amount: Number,
  type: "credit" | "debit",
  description: String,
  createdAt: Date
}
```

---

## 🎯 Key Features Explained

### 1. Wallet System
- **Payment**: Rent price + Deposit is deducted from wallet upfront
- **Refund**: Deposit refunded when order completes (minus late fee)
- **Transaction Log**: Every wallet change is logged

### 2. Late Fee Calculation
- Formula: `lateDays × ₹200 per day`
- Calculated: When customer returns item after end date
- Deducted: From deposit refund

### 3. Order Lifecycle
```
pending → approved → in-use → returned → completed
                                  ↓
                              (lateFee applied)
                                  ↓
                         (deposit refunded)
```

### 4. Soft Delete
- Products marked `isDeleted: true` instead of removal
- Maintains referential integrity
- Allows data recovery

---

## 🧪 Testing the App

### Test User Accounts

#### Customer Account
```
Email: customer@test.com
Password: 123456
Role: customer
```

#### Vendor Account
```
Email: vendor@test.com
Password: 123456
Role: vendor
```

#### Admin Account
```
Email: admin@test.com
Password: 123456
Role: admin
```

### Test Flow
1. **Register** as customer, vendor, or admin
2. **Login** with credentials
3. **Browse products** (home page)
4. **Create order** as customer
5. **Manage orders** as vendor
6. **View dashboard** as admin

---

## 🛠️ Development Tips

### Hot Reload
- Frontend automatically reloads on file changes
- Backend requires manual restart (or use `nodemon`)

### API Debugging
- Check network tab in browser DevTools
- Verify token in localStorage
- Use Postman for API testing

### Common Issues

**CORS Error?**
- Ensure backend CORS is enabled
- Check API URL in frontend config

**Token Expires?**
- JWT expires after 7 days
- User is redirected to login
- Token auto-refreshes on login

**Database Connection?**
- Verify MongoDB is running
- Check MongoDB URI in .env
- Test connection with MongoDB Compass

---

## 📦 Build & Deploy

### Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

### Production Checklist
- [ ] Set `NODE_ENV=production` in backend
- [ ] Update API URLs for production servers
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set secure JWT_SECRET
- [ ] Database backups enabled
- [ ] Error logging configured

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com)
- [React Docs](https://react.dev)
- [Mongoose Docs](https://mongoosejs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 Support & Contribution

For issues, create a GitHub issue or contact the team.

---

**Happy Coding! 🎉**

Built with ❤️ for Bandhu Rental Marketplace
