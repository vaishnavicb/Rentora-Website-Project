# 🎯 Bandhu Frontend

A modern React + Vite + Tailwind CSS rental marketplace frontend application.

## Features

✨ **Complete Features:**
- 🔐 User Authentication (Register/Login)
- 🛒 Product Browsing with Search & Filter
- 📦 Order Management (Create, Track, Cancel)
- ❤️ Wishlist System
- 👨‍💼 Vendor Dashboard (Create & Manage Products)
- 📊 Admin Dashboard (Analytics & Stats)
- 📱 Fully Responsive Design
- ✨ Smooth Animations with Framer Motion
- 🎨 Beautiful UI with Tailwind CSS

## Tech Stack

- **React 19** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - HTTP Client
- **React Icons** - Icon Library

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Route pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Home.jsx
│   │   ├── MyOrders.jsx
│   │   ├── VendorProducts.jsx
│   │   ├── VendorOrders.jsx
│   │   ├── AdminDashboard.jsx
│   │   └── Wishlist.jsx
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/        # API calls
│   │   ├── api.js       # Axios instance
│   │   └── index.js     # Service functions
│   ├── context/         # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/           # Custom hooks
│   │   └── useAuth.js
│   ├── App.jsx          # Main App
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure API Base URL:**
   Update the API base URL in `src/services/api.js` if needed:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:5173`

## API Integration

All API calls are centralized in `src/services/index.js`:

### Auth Services
- `authService.register()` - User registration
- `authService.login()` - User login
- `authService.logout()` - User logout

### Product Services
- `productService.getAllProducts()` - List products with pagination
- `productService.createProduct()` - Create new product (vendor)
- `productService.getVendorProducts()` - Get vendor's products
- `productService.deleteProduct()` - Delete product

### Order Services
- `orderService.createOrder()` - Create rental order
- `orderService.getMyOrders()` - Get customer orders
- `orderService.getVendorOrders()` - Get vendor orders
- `orderService.updateOrderStatus()` - Update order status
- `orderService.returnProduct()` - Return rented item
- `orderService.cancelOrder()` - Cancel order

### Review Services
- `reviewService.addReview()` - Add product review
- `reviewService.getProductReviews()` - Get product reviews
- `reviewService.deleteReview()` - Delete review

### Wishlist Services
- `wishlistService.addToWishlist()` - Save item
- `wishlistService.getWishlist()` - Get saved items
- `wishlistService.removeFromWishlist()` - Remove item

### Admin Services
- `adminService.getDashboardStats()` - Get platform statistics

## Pages & Flows

### 1. Authentication Pages
- **Login** (`/login`) - User login
- **Register** (`/register`) - New user registration

### 2. Public Pages
- **Home** (`/`) - Browse all products with search & filter
- **Wishlist** (`/wishlist`) - View saved items

### 3. Customer Pages
- **My Orders** (`/my-orders`) - Track rentals, return items, cancel orders

### 4. Vendor Pages
- **My Products** (`/my-products`) - Create, edit, delete products
- **Vendor Orders** (`/vendor-orders`) - Manage customer orders

### 5. Admin Pages
- **Dashboard** (`/admin`) - View platform analytics

## Authentication Flow

1. **Register**: User creates account with name, email, password, and role
2. **Login**: User receives JWT token + user info
3. **Token Storage**: Token stored in localStorage
4. **Protected Routes**: Routes require valid token & role
5. **Auto-Redirect**: Unauthorized users redirected to login
6. **Logout**: Clears token and redirects to login

## Component Highlights

### Navbar
- Dynamic menu based on user role
- Mobile-responsive
- Smooth animations

### ProductCard
- Display product details
- Rating display
- Add to wishlist
- Rent button (links to order)

### ProtectedRoute
- Wraps protected pages
- Validates token
- Checks user role
- Redirects unauthorized users

### Animations
- Page transitions with Framer Motion
- Hover effects on buttons & cards
- Loading spinners
- Smooth scrolling

## Styling

Using **Tailwind CSS** with custom utilities:
- Gradient backgrounds
- Responsive grid layouts
- Shadow & border effects
- Smooth transitions

## Build & Deploy

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Environment Variables

Create `.env` file if needed:
```
VITE_API_URL=http://localhost:5000/api
```

## Future Enhancements

- [ ] Product detail page
- [ ] Advanced search filters
- [ ] Payment gateway integration
- [ ] Ratings & reviews page
- [ ] User profile management
- [ ] Order tracking with status updates
- [ ] Chat system for customers & vendors
- [ ] Mobile app version

## Support

For issues or questions, contact the development team.

---

**Built with ❤️ for Bandhu Rental Marketplace**

