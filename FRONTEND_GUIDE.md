# 🎯 Bandhu Frontend - Complete Documentation

## 📱 Live Pages & Features

### 1. **Login Page** (`/login`)
**Purpose**: User authentication

**Features**:
- Email & password input
- Loading state
- Error message display
- Link to register
- Beautiful gradient background
- Smooth animations
- Auto-login redirect to home

**API Call**: `POST /api/auth/login`

```
Flow: Enter credentials → Validate → Get JWT token → Store in localStorage → Redirect to home
```

---

### 2. **Register Page** (`/register`)
**Purpose**: New user account creation

**Features**:
- Name, email, password inputs
- Role selection (Customer/Vendor)
- Input validation
- Error handling
- Link to login
- Auto-login after registration
- Role-based icon

**API Call**: `POST /api/auth/register`

```
Flow: Fill form → Validate → Create user → Auto-login → Redirect to home
```

---

### 3. **Home Page** (`/`)
**Purpose**: Browse and search rental products

**Features**:
- ✨ Hero banner
- 🔍 Search by keyword
- 🏷️ Filter by category
- 📄 Pagination (5 items per page)
- 💳 Current page info
- 📦 Product cards with:
  - Product image/icon
  - Title & description
  - Rental price/day
  - Deposit amount
  - Available quantity
  - Average rating
  - Rent & Wishlist buttons
  - View details link
- 🔄 Loading spinner
- Responsive grid (1, 2, or 3 columns)

**API Call**: `GET /api/products?page=1&keyword=&category=`

**Product Card Features**:
- Hover animations
- Star rating display
- Color-coded pricing
- Quick action buttons
- Mobile responsive

---

### 4. **My Orders Page** (`/my-orders`)
**Protected**: ✅ Requires login

**Purpose**: Track rental orders and manage returns

**Features**:
- 📊 Status tabs (All, Pending, Approved, In-Use, Returned, Completed, Cancelled)
- 📦 Order cards showing:
  - Product name & category
  - Status badge (color-coded)
  - Rental amount
  - Deposit amount
  - Duration (days)
  - Late fee (if any)
  - Start & end dates
  - Vendor info
- 🔄 Return product button (only for in-use orders)
- ❌ Cancel order button (only for pending orders)
- 📋 Filter by status
- 🔄 Loading state
- Empty state message

**API Calls**:
- `GET /api/orders/my-orders` - Fetch all orders
- `PUT /api/orders/return` - Return product
- `PUT /api/orders/cancel/:id` - Cancel order

---

### 5. **Vendor Products Page** (`/my-products`)
**Protected**: ✅ Vendor only

**Purpose**: Manage rental inventory

**Features**:
- ➕ Add Product button (toggle form)
- 📝 Create Product Form:
  - Title, category, description
  - Rental price/day
  - Deposit amount
  - Available quantity
  - Form validation
  - Submit button
- 📦 Product grid showing:
  - Product name & description
  - Pricing (rental & deposit)
  - Stock quantity
  - Edit button
  - Delete button (with confirmation)
- 🔄 Auto-refresh after create/delete
- Loading state
- Empty state with prompt

**API Calls**:
- `POST /api/products` - Create product
- `GET /api/products/my-products` - Fetch vendor products
- `DELETE /api/products/:id` - Delete product

**Form Validation**:
- Required fields check
- Number validation
- Auto-refresh list

---

### 6. **Vendor Orders Page** (`/vendor-orders`)
**Protected**: ✅ Vendor only

**Purpose**: Manage customer rental requests

**Features**:
- 📊 Status tabs (Pending, Approved, In-Use, Returned, Completed)
- Each tab shows order count
- 💳 Order cards displaying:
  - Customer name & email
  - Product name
  - Rental dates
  - Rental amount
  - Deposit amount
  - Total days
  - Status badge
- 🔘 Status transition buttons:
  - Pending → Approve Order
  - Approved → Mark as In-Use
  - In-Use → Complete Order
- 🔄 Auto-refresh after status update
- Responsive grid layout

**API Calls**:
- `GET /api/orders/vendor-orders` - Fetch vendor orders
- `PUT /api/orders/update-status` - Update order status

**Order Cycle**:
```
pending (approve) → approved (mark in-use) → in-use (complete) → completed
```

---

### 7. **Admin Dashboard** (`/admin`)
**Protected**: ✅ Admin only

**Purpose**: Platform analytics and statistics

**Features**:
- 📊 Statistics Cards:
  - Total users
  - Total vendors
  - Total customers
  - Total products
  - Active rentals
  - Completed orders
  - Total orders
  - Total revenue
- 💹 Animated stat counters
- 🔄 Rotating icons
- 📈 Summary cards with:
  - Platform overview
  - Avg users per day
  - Vendor to customer ratio
  - Completion rate
  - Quick insights
- 💰 Revenue tracking
- Color-coded metrics
- Hover animations

**API Call**: `GET /api/admin/dashboard`

**Metrics Shown**:
- User breakdown by role
- Active rental count
- Revenue generated
- Platform health indicators
- Performance ratios

---

### 8. **Wishlist Page** (`/wishlist`)
**Purpose**: Save favorite items for later

**Features**:
- ❤️ Wishlist display
- 📦 Product cards with:
  - Product info
  - Pricing details
  - Rent button
  - Remove from wishlist button
- 🗑️ Delete functionality
- 📄 Responsive grid
- Empty state message
- Loading state
- Mobile responsive

**API Calls**:
- `GET /api/wishlist` - Fetch wishlist
- `DELETE /api/wishlist/:id` - Remove item
- `POST /api/wishlist` - Add item (from home/product card)

---

## 🧭 Navigation Flow

```
Start
  ↓
┌─────────────────────┐
│  Check if logged in │
└────────┬────────────┘
         │
    Yes  │  No
         │
    ┌────┴────┐
    ↓         ↓
  Home    Login/Register
    ↓         ↓
    │    ┌─────┘
    │    ↓
    └──→ Home
         ↓
    ┌────────────┬──────────────┬─────────────┐
    ↓            ↓              ↓             ↓
Customer       Vendor        Admin         Public
    ↓            ↓              ↓             ↓
My Orders   My Products   Dashboard    Wishlist
    ↓       Vendor Orders
  Return          ↓
Product       Update Status
```

---

## 🎨 UI/UX Features

### Components
1. **Navbar** - Sticky navigation with role-based menu
2. **ProductCard** - Reusable product display component
3. **ProtectedRoute** - Route guard for authenticated pages
4. **Loading Spinner** - Animated loader
5. **Status Badges** - Color-coded status indicators
6. **Modal Forms** - Overlay forms for actions

### Animations
- ✨ Page entrance animations
- 🎯 Button hover & click effects
- 📊 Stat counter animations
- 🔄 Loading spinner
- 📈 Card lift on hover
- ⚡ Smooth transitions

### Responsive Design
- Mobile-first approach
- Breakpoints: md (768px), lg (1024px)
- Touch-friendly buttons
- Hamburger menu on mobile
- Grid adjusts columns

### Colors & Theme
- Blue gradient primary
- Purple secondary
- Green for success
- Red for danger/delete
- Gray for neutral
- Glassmorphism effects
- Tailwind color palette

---

## 🔐 Security Features

### Authentication
- JWT token-based auth
- Token stored in localStorage
- Auto-logout on token expiry
- Protected routes with role checking
- Secure password hashing (bcrypt)

### API Security
- Bearer token in Authorization header
- CORS validation
- Input validation
- Error handling
- Auto-redirect on 401

### Data Protection
- No sensitive data in localStorage
- HTTPS recommended for production
- User role-based access control
- Vendor can only modify own products
- Customer can only modify own orders

---

## 📊 State Management

### Context API
- **AuthContext**: Global auth state
  - user object
  - token
  - loading state
  - login/logout functions

### Local State
- Form inputs (useState)
- Loading states (useState)
- Tab/filter selections (useState)
- Modal visibility (useState)

---

## 🔌 API Integration

### Axios Configuration
```javascript
// Base URL
http://localhost:5000/api

// Headers
Content-Type: application/json
Authorization: Bearer {token}

// Interceptors
- Auto-attach token
- Handle 401 errors
- Redirect on unauthorized
```

### Service Structure
```
services/
├── api.js           (Axios instance + interceptors)
└── index.js         (All API service functions)
    ├── authService
    ├── productService
    ├── orderService
    ├── reviewService
    ├── wishlistService
    └── adminService
```

---

## 🚀 Performance Optimizations

### Frontend
- Code splitting (React Router)
- Lazy loading
- Image optimization (icons)
- Minified CSS (Tailwind)
- Efficient animations (GPU accelerated)

### API
- Pagination (5 items per page)
- Query optimization
- Caching (local state)
- Debounced search

---

## 📝 Form Handling

### Validation
- Required fields
- Email format
- Number fields
- Confirmation dialogs
- Error messages

### User Feedback
- Loading states
- Success messages
- Error alerts
- Form reset after submit

---

## 🎯 Future Enhancements

- [ ] Product detail page
- [ ] Advanced search with multiple filters
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Chat between customers & vendors
- [ ] Reviews & ratings page
- [ ] User profile management
- [ ] PDF receipt download
- [ ] Email notifications
- [ ] Real-time notifications
- [ ] Dark mode toggle

---

## 📱 Mobile Responsiveness

All pages are fully responsive:
- **Mobile** (320px - 768px) - 1 column
- **Tablet** (768px - 1024px) - 2 columns
- **Desktop** (1024px+) - 3+ columns

---

## 🧪 Testing Scenarios

### Customer Flow
1. Register as customer
2. Login
3. Browse products (home)
4. Add to wishlist
5. Place order
6. View in "My Orders"
7. Return product
8. View completed order

### Vendor Flow
1. Register as vendor
2. Create products
3. View in "My Products"
4. Check "Vendor Orders"
5. Approve pending orders
6. Mark as in-use
7. Complete rental

### Admin Flow
1. Login as admin
2. View dashboard
3. Check all metrics
4. Monitor platform stats

---

## 📞 Support

For issues or questions about the frontend, check:
- Browser console for errors
- Network tab for API calls
- Component props validation
- API response formats

---

**Built with React, Vite, Tailwind, and Framer Motion ✨**

**For the Bandhu Rental Marketplace Platform** 🎯
