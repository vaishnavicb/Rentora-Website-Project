# ⚡ Quick Start Guide

## 🎯 Get Bandhu Running in 5 Minutes

### Prerequisites
- Node.js 16+
- MongoDB (local or cloud)

---

## 🚀 Step 1: Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd Backend

# Install dependencies
npm install

# Create .env file
echo PORT=5000 > .env
echo MONGODB_URI=mongodb://localhost:27017/bandhu >> .env
echo JWT_SECRET=your_secret_key >> .env

# Start server
npm start

# Expected: "Server running on port 5000"
```

---

## 🎨 Step 2: Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Expected: "Local: http://localhost:5173/"
```

---

## ✅ Step 3: Access the App

Open browser and go to: **http://localhost:5173**

---

## 🧪 Step 4: Test the App

### Option A: Quick Test
1. Click "Register"
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: 123456
   - Role: Customer
3. Submit
4. Auto-login (redirects to home)
5. Browse products on home page ✅

### Option B: Test as Vendor
1. Register again with:
   - Name: Vendor Name
   - Email: vendor@example.com
   - Role: Vendor
2. Click "My Products" (navbar)
3. Add a product ✅
4. View in "Orders" tab

### Option C: Test as Admin
1. Manually create admin in MongoDB:
```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10/...", // bcrypt hash
  role: "admin",
  walletBalance: 0,
  createdAt: new Date()
})
```
2. Login with admin email/password
3. Click "Dashboard" (navbar)
4. View analytics ✅

---

## 📡 API Endpoints

```
Base URL: http://localhost:5000/api

Auth:
POST /auth/register     - Create account
POST /auth/login        - Login

Products:
GET  /products          - List products
POST /products          - Create (vendor)
GET  /products/my-products  - My products
DELETE /products/:id    - Delete

Orders:
POST   /orders                 - Create order
GET    /orders/my-orders       - My orders
GET    /orders/vendor-orders   - Vendor orders
PUT    /orders/update-status   - Update status
PUT    /orders/return          - Return product
PUT    /orders/cancel/:id      - Cancel order

Admin:
GET /admin/dashboard    - Stats
```

---

## 📁 Key Files Modified

### Backend
- ✅ `server.js` - Express app
- ✅ `config/db.js` - MongoDB connection
- ✅ `controllers/*` - Business logic
- ✅ `models/*` - Schemas
- ✅ `routes/*` - Endpoints
- ✅ `middleware/*` - Auth/roles

### Frontend
- ✅ `src/App.jsx` - Routes
- ✅ `src/pages/*` - 8 pages
- ✅ `src/components/*` - Navbar, ProductCard, ProtectedRoute
- ✅ `src/services/index.js` - API calls
- ✅ `src/context/AuthContext.jsx` - Auth state
- ✅ `src/hooks/useAuth.js` - Custom hook

---

## 🎨 UI Pages

| Path | Name | Protected | Role |
|------|------|-----------|------|
| `/` | Home | ❌ | Public |
| `/login` | Login | ❌ | Public |
| `/register` | Register | ❌ | Public |
| `/wishlist` | Wishlist | ❌ | Public |
| `/my-orders` | My Orders | ✅ | Customer |
| `/my-products` | My Products | ✅ | Vendor |
| `/vendor-orders` | Vendor Orders | ✅ | Vendor |
| `/admin` | Admin Dashboard | ✅ | Admin |

---

## 🧠 How It Works

### Authentication Flow
```
User → Register/Login → Backend validates → JWT token → localStorage
Every request → Attach token → Backend verifies → Allow/Deny
```

### Order Flow
```
Customer: Browse → Add to cart → Create order → Debit wallet
Vendor: View orders → Approve → Mark in-use → Complete
Refund: Order completed → Refund deposit (minus late fee) → Credit wallet
```

### Wallet System
```
Create Order: wallet = wallet - (rental + deposit)
Return late: lateFee = days_late * 200
Complete:    refund = deposit - lateFee
            wallet = wallet + refund
```

---

## 🔧 Troubleshooting

### Backend won't start
```
Check:
1. MongoDB running? (mongod command)
2. Port 5000 available? (Change in .env)
3. Node modules installed? (npm install)
4. .env file created? (Check PORT, MONGODB_URI, JWT_SECRET)
```

### Frontend won't load
```
Check:
1. Backend running on port 5000?
2. API_BASE_URL correct in src/services/api.js?
3. Node modules installed? (npm install)
4. Port 5173 available? (Should auto-pick another)
```

### API calls failing
```
Check:
1. Token in localStorage? (DevTools → Application)
2. Authorization header sent? (Network tab)
3. CORS enabled in backend? (Check server.js)
4. API endpoint correct? (Check services/index.js)
```

---

## 🎯 What's Included

✅ **Backend**
- Node.js + Express + MongoDB
- JWT authentication
- Role-based access control
- Product management
- Order lifecycle
- Wallet system
- Late fee calculation
- Admin dashboard

✅ **Frontend**
- React 19 + Vite
- Beautiful UI with Tailwind CSS
- Smooth animations (Framer Motion)
- 8 functional pages
- Protected routes
- Form handling
- API integration
- Mobile responsive

---

## 📊 Database

### Collections Created
- `users` - Users with roles
- `products` - Rental items
- `orders` - Rental orders
- `reviews` - Product reviews
- `wishlists` - Saved items
- `transactions` - Wallet ledger

### Initial Data
Create test data:
```javascript
// In MongoDB
db.users.insertOne({
  name: "Test",
  email: "test@test.com",
  password: "$2a$10/...", // bcrypt(123456)
  role: "customer",
  walletBalance: 5000,
  createdAt: new Date()
})
```

---

## 🎓 Learning Path

1. **Day 1**: Register, Login, Browse products
2. **Day 2**: Create order as customer, manage orders as vendor
3. **Day 3**: Create products as vendor, approve orders
4. **Day 4**: Return products, see late fees, refunds
5. **Day 5**: Admin dashboard, view analytics

---

## 💡 Pro Tips

1. **Use DevTools**: Check network tab for API calls
2. **Check Console**: Look for error messages
3. **Test APIs**: Use Postman before frontend
4. **Read Code**: Components are well-commented
5. **Start Simple**: Test 1 feature at a time

---

## 📞 Need Help?

1. Check the SETUP.md for detailed setup
2. Check the FRONTEND_GUIDE.md for UI details
3. Check the Backend code comments
4. Look at error messages in console/terminal

---

## 🚀 You're All Set!

Your Bandhu platform is ready to use. 

**Happy renting! 🎉**

---

Next Steps:
- [ ] Create test accounts
- [ ] Add test products
- [ ] Test order creation
- [ ] Test vendor dashboard
- [ ] Check admin analytics
