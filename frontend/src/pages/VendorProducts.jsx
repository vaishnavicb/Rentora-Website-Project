import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
void motion;
import { productService } from "../services/index";
import { useAuth } from "../hooks/useAuth";

export const VendorProducts = () => {
  const formRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  // -------- CATEGORY STATES --------
  const defaultCategories = useMemo(
    () => ["Sports Equipment", "Electronics", "Books", "Furniture", "Clothing"],
    [],
  );

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    rentalPricePerDay: "",
    depositAmount: "",
    lateFeePerDay: "",
    availableQuantity: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "vendor") {
      navigate("/");
    } else {
      fetchVendorProducts();
    }
  }, [navigate, user?.role]);

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem("categories", JSON.stringify(defaultCategories));
    }
  }, [defaultCategories]);

  const fetchVendorProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getVendorProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("title", formData.title);
      formDataPayload.append("category", formData.category);
      formDataPayload.append("description", formData.description);
      formDataPayload.append("rentalPricePerDay", formData.rentalPricePerDay);
      formDataPayload.append("depositAmount", formData.depositAmount);
      formDataPayload.append("lateFeePerDay", formData.lateFeePerDay || 200);
      formDataPayload.append("availableQuantity", formData.availableQuantity);

      if (imageFile) {
        formDataPayload.append("image", imageFile);
      }

      if (editingProductId) {
        await productService.updateProduct(editingProductId, formDataPayload);
      } else {
        await productService.createProduct(formDataPayload);
      }

      setFormData({
        title: "",
        category: "",
        description: "",
        rentalPricePerDay: "",
        depositAmount: "",
        lateFeePerDay: "",
        availableQuantity: "",
      });
      setImageFile(null);
      setImagePreview("");
      setEditingProductId(null);
      setShowForm(false);
      fetchVendorProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productService.deleteProduct(productId);
        fetchVendorProducts();
      } catch (err) {
        console.error("Failed to delete product:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Products</h1>
            <p className="text-gray-600 mt-2">Manage your rental inventory</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingProductId(null); // reset edit mode
              setFormData({
                title: "",
                category: "",
                description: "",
                rentalPricePerDay: "",
                depositAmount: "",
                availableQuantity: "",
              });
              setImageFile(null);
              setImagePreview("");
              setShowForm(true); // always open form properly
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition"
          >
            <FiPlus size={20} /> Add Product
          </motion.button>
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white rounded-lg shadow-lg p-6 border border-gray-200"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingProductId ? "Edit Product" : "Create New Product"}
            </h2>{" "}
            <form
              onSubmit={handleCreateProduct}
              className="grid md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <select
                value={formData.category}
                onChange={(e) => {
                  if (e.target.value === "add_new") {
                    setShowNewCategoryInput(true);
                  } else {
                    setFormData({ ...formData, category: e.target.value });
                    setShowNewCategoryInput(false);
                  }
                }}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>

                {categories.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}

                <option value="add_new">+ Add New Category</option>
              </select>
              {showNewCategoryInput && (
                <div className="col-span-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (!newCategory) return;

                      const updatedCategories = [...categories, newCategory];

                      setCategories(updatedCategories);
                      localStorage.setItem(
                        "categories",
                        JSON.stringify(updatedCategories),
                      );

                      setFormData({ ...formData, category: newCategory });
                      setNewCategory("");
                      setShowNewCategoryInput(false);
                    }}
                    className="bg-green-600 text-white px-4 rounded-lg"
                  >
                    Add
                  </button>
                </div>
              )}

              {/*  */}
              <input
                type="number"
                name="availableQuantity"
                placeholder="Quantity"
                value={formData.availableQuantity}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-600"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-3 h-40 w-full object-contain rounded-lg border border-gray-200"
                  />
                )}
              </div>
              <input
                type="number"
                name="rentalPricePerDay"
                placeholder="Rental Price/Day"
                value={formData.rentalPricePerDay}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                name="depositAmount"
                placeholder="Deposit Amount"
                value={formData.depositAmount}
                onChange={handleInputChange}
                required
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                name="lateFeePerDay"
                placeholder="Late Fee/Day (₹)"
                value={formData.lateFeePerDay}
                onChange={handleInputChange}
                min="0"
                className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="col-span-2 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none h-24"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
              >
                {editingProductId ? "Update Product" : "Create Product"}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center">
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
                className="text-center py-16 bg-white rounded-lg"
              >
                <p className="text-2xl text-gray-600 mb-4">No products yet</p>
                <p className="text-gray-500">
                  Create your first product to get started
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition"
                  >
                    <img
                      src={
                        product.imageUrl || "No Image Available"
                      }
                      alt={product.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Price/Day</p>
                        <p className="font-bold text-blue-600">
                          ₹{product.rentalPricePerDay}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded">
                        <p className="text-gray-600 text-xs">Deposit</p>
                        <p className="font-bold text-purple-600">
                          ₹{product.depositAmount}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 text-sm text-slate-700">
                      <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 border border-slate-200">
                        <span className="font-semibold">
                          {product.wishlistedCount || 0}
                        </span>
                        <span>
                          {product.wishlistedCount === 1
                            ? "customer added"
                            : "customers added"}{" "}
                          this product
                        </span>
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-4">
                      Stock:{" "}
                      {product.availableQuantity === 0
                        ? "Out of Stock"
                        : product.availableQuantity === 1
                          ? "1 item left"
                          : `${product.availableQuantity} items`}
                    </p>

                    <motion.div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setFormData({
                            title: product.title,
                            category: product.category,
                            description: product.description,
                            rentalPricePerDay: product.rentalPricePerDay,
                            depositAmount: product.depositAmount,
                            availableQuantity: product.availableQuantity,
                          });
                          setImageFile(null);
                          setImagePreview(product.imageUrl || "");
                          setEditingProductId(product._id);
                          setShowForm(true);
                          setTimeout(() => {
                            formRef.current?.scrollIntoView({
                              behavior: "smooth",
                            });
                          }, 100);
                        }}
                        className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition border border-blue-300"
                      >
                        <FiEdit size={16} /> Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition border border-red-300"
                      >
                        <FiTrash2 size={16} /> Delete
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
