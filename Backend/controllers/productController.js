const Product = require("../models/Product");
const Wishlist = require("../models/Wishlist");
const { cloudinary, isCloudinaryConfigured } = require("../utils/cloudinary");
const streamifier = require("streamifier");

const uploadImageToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured) {
      console.log('Cloudinary not configured, skipping upload');
      return resolve(null);
    }

    console.log('Uploading image to Cloudinary...');
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "rentora_products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        console.log('Cloudinary upload success:', result.secure_url);
        resolve(result);
      },
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

exports.createProduct = async (req, res) => {
  try {
    let imageData = {};

    if (req.file) {
      try {
        const uploadResult = await uploadImageToCloudinary(req.file);
        if (uploadResult) {
          imageData = {
            imageUrl: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
          };
        }
      } catch (uploadError) {
        console.error('Image upload failed, continuing without image:', uploadError);
        // Continue without image if upload fails
      }
    }

    const product = await Product.create({
      title: req.body.title,
      category: req.body.category,
      description: req.body.description,
      rentalPricePerDay: Number(req.body.rentalPricePerDay),
      depositAmount: Number(req.body.depositAmount),
      lateFeePerDay: Number(req.body.lateFeePerDay) || 200,
      availableQuantity: Number(req.body.availableQuantity),
      vendor: req.user._id,
      ...imageData,
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { keyword, category, offset = 0, limit = 10, sort = 'latest' } = req.query;

    let query = {
      isDeleted: { $ne: true }
    };

    if (keyword) {
      query.title = { $regex: keyword, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const offsetNum = Number(offset) || 0;
    const limitNum = Number(limit) || 10;

    let sortOption = { createdAt: -1, _id: -1 };
    if (sort === 'oldest') {
      sortOption = { createdAt: 1, _id: 1 };
    } else if (sort === 'most-rented') {
      sortOption = { rentCount: -1, createdAt: -1, _id: -1 };
    }

    const products = await Product.find(query)
      .populate("vendor", "name")
      .sort(sortOption)
      .skip(offsetNum)
      .limit(limitNum);

    const total = await Product.countDocuments(query);
    const hasMore = offsetNum + limitNum < total;

    res.json({
      products,
      totalProducts: total,
      hasMore,
      offset: offsetNum + products.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVendorProducts = async (req, res) => {
  const products = await Product.find({
    vendor: req.user._id,
    isDeleted: { $ne: true }
  });

  const productIds = products.map((product) => product._id);
  const wishlistCounts = await Wishlist.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: "$product", count: { $sum: 1 } } }
  ]);

  const countMap = wishlistCounts.reduce((map, item) => {
    map[item._id.toString()] = item.count;
    return map;
  }, {});

  const productsWithCounts = products.map((product) => ({
    ...product.toObject(),
    wishlistedCount: countMap[product._id.toString()] || 0,
  }));

  res.json(productsWithCounts);
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name");

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check vendor ownership
    if (product.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file);
      if (uploadResult) {
        if (product.imagePublicId && isCloudinaryConfigured) {
          await cloudinary.uploader.destroy(product.imagePublicId);
        }
        product.imageUrl = uploadResult.secure_url;
        product.imagePublicId = uploadResult.public_id;
      }
    }

    product.title = req.body.title || product.title;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.rentalPricePerDay = req.body.rentalPricePerDay
      ? Number(req.body.rentalPricePerDay)
      : product.rentalPricePerDay;
    product.depositAmount = req.body.depositAmount
      ? Number(req.body.depositAmount)
      : product.depositAmount;
    product.lateFeePerDay = req.body.lateFeePerDay
      ? Number(req.body.lateFeePerDay)
      : product.lateFeePerDay;
    product.availableQuantity = req.body.availableQuantity
      ? Number(req.body.availableQuantity)
      : product.availableQuantity;

    await product.save();

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.deleteProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.vendor.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  product.isDeleted = true;
  await product.save();

  res.json({ message: "Product deleted (soft delete)" });
};