import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiFilter } from "react-icons/fi";
import { productService, wishlistService } from "../services/index";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../hooks/useAuth";
import likeGif from "../assets/like.gif";

export const Home = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [wishlistedIds, setWishlistedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [categories, setCategories] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const defaultCategories = [
    "Sports Equipment",
    "Electronics",
    "Books",
    "Furniture",
    "Clothing",
    "Tools",
    "Toys",
    "Vehicles",
    "Musical Instruments",
    "Outdoor Gear",
    "Power Tools",
    "Camping Equipment",
    "Party Supplies",
    "Costumes",
    "Kitchen Appliances",
    "Art Supplies",
    "Cleaning Products",
    "Office Equipment",
    "Pet Supplies",
    "Health & Beauty",
    "OTHER",
  ];

  const limit = 10; // Load 10 products at a time

  // Initial load and search reset
  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
    fetchProducts(0, true);
  }, [keyword, category, sortType]);

  // Load categories
  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories);
        setCategories(Array.isArray(parsed) ? parsed : defaultCategories);
      } catch {
        setCategories(defaultCategories);
        localStorage.setItem("categories", JSON.stringify(defaultCategories));
      }
    } else {
      setCategories(defaultCategories);
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
    }
  }, []);

  const fetchProducts = async (currentOffset, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await productService.getProductsInfinite(
        currentOffset,
        limit,
        keyword,
        category,
        sortType,
      );
      const newProducts = response.data.products;

      if (reset) {
        setProducts(newProducts);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setHasMore(response.data.hasMore);
      setOffset(response.data.offset);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loadingMore || !hasMore) return;

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when user is 200px from bottom
    if (scrollTop + windowHeight >= documentHeight - 200) {
      fetchProducts(offset, false);
    }
  }, [loadingMore, hasMore, offset]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchWishlistedIds = async () => {
      if (!user) {
        setWishlistedIds([]);
        return;
      }

      try {
        const response = await wishlistService.getWishlist();
        const ids = (response.data || [])
          .map((item) => item.product?._id)
          .filter(Boolean);
        setWishlistedIds(ids);
      } catch (err) {
        console.error("Failed to fetch wishlist ids:", err);
      }
    };

    fetchWishlistedIds();
  }, [user]);

  // Debounced search
  const handleSearchChange = (value) => {
    setKeyword(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    setSearchTimeout(
      setTimeout(() => {
        // Search will trigger useEffect above
      }, 500),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16"
      >
        <div className="max-w-6xl mx-auto px-4">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-5xl font-bold mb-4"
          >
            Welcome to Rentora
            <img
              src={likeGif}
              alt="like"
              className="inline-block w-20 h-15 ml-3 mix-blend-multiply"
            />{" "}
          </motion.h1>
          <p className="text-xl opacity-90">Rent anything, anytime, anywhere</p>
        </div>
      </motion.div>

      {/* Search & Filter Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid md:grid-cols-3 gap-4 mb-8"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={keyword}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="relative">
            <FiFilter className="absolute left-3 top-3.5 text-gray-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <FiFilter className="absolute left-3 top-3.5 text-gray-400" />
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
            >
              <option value="latest">Latest Products</option>
              <option value="oldest">Oldest Products</option>
              <option value="most-rented">Most Rented</option>
              <option value="highest-rated">Highest Rated</option>
            </select>
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            {products.length} products loaded
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-2xl text-gray-600">No products found</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % limit) * 0.1 }}
                  >
                    <ProductCard
                      product={product}
                      isWishlisted={wishlistedIds.includes(product._id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-gray-600">
                  Loading more products...
                </span>
              </div>
            )}

            {/* End of Results */}
            {!loadingMore && !hasMore && products.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  You've seen all available products!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
