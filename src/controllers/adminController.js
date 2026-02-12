import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

/* ==========================
   📦 PRODUCTS
========================== */

/**
 * GET ALL PRODUCTS (ADMIN)
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { products },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET SINGLE PRODUCT (ADMIN)
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    let images = [];

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
      category: req.body.category,
      description: req.body.description,
      featured:req.body.featured || false,
      bestdeals:req.body.bestdeals || false,
      images,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product },
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * UPDATE PRODUCT (ADMIN)
 * No re-upload to Cloudinary
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 CLEAN BROKEN IMAGES FIRST
    product.images = product.images.filter(
      (img) => img?.url && img?.public_id
    );

    // 📸 Add new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));

      product.images.push(...newImages);
    }

    product.name = req.body.name ?? product.name;
    product.price = req.body.price ?? product.price;
    product.stock = req.body.stock ?? product.stock;
    product.category = req.body.category ?? product.category;
    product.description = req.body.description ?? product.description;

    await product.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product },
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE PRODUCT IMAGE (Cloudinary + DB)
 * DELETE /api/admin/products/:productId/images/:publicId
 */
export const deleteProductImage = async (req, res) => {
  try {
    const { productId, publicId } = req.params;
    const decodedPublicId = decodeURIComponent(publicId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 🔥 REMOVE BROKEN IMAGES FIRST
    product.images = product.images.filter(
      (img) => img?.url && img?.public_id
    );

    // 🗑 Delete from Cloudinary
    await cloudinary.uploader.destroy(decodedPublicId);

    // 🧹 Remove requested image
    product.images = product.images.filter(
      (img) => img.public_id !== decodedPublicId
    );

    await product.save({ validateBeforeSave: true });

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: { images: product.images },
    });
  } catch (error) {
    console.error("DELETE IMAGE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/**
 * DELETE PRODUCT (SOFT DELETE)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.isActive === false) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================
   📦 ORDERS
========================== */

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { orders },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    if (orderStatus === "delivered") {
      order.deliveredAt = new Date();
      order.paymentStatus = "completed";
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: { order },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/* ==========================
   📊 DASHBOARD
========================== */

// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments({ isActive: true });
//     const totalOrders = await Order.countDocuments();

//     const revenue = await Order.aggregate([
//       { $match: { paymentStatus: "completed" } },
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } },
//     ]);

//     res.status(200).json({
//       success: true,
//       data: {
//         totalUsers,
//         totalProducts,
//         totalOrders,
//         revenue: revenue[0]?.total || 0,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// adminController.js
export const deleteOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  await order.deleteOne();

  res.status(200).json({
    success: true,
    message: "Order deleted permanently",
  });
};
export const createUserByAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role = "user",
      phone
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      phone
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        user: {
          _id: user._id,
          firstName,
          lastName,
          email,
          role,
          phone
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
export const updateUserByAdmin = async (req, res) => {
  try {
    const updates = req.body;

    // ❌ Never allow password update here
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
