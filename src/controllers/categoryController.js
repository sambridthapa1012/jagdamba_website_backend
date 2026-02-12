import Category from "../models/Category.js";

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Fetch all categories from DB
    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: err.message,
    });
  }
};

// POST /api/categories
export const createCategory = async (req, res) => {
  try {
    console.log(req.body, req.file);

    const { name, nameNepali, icon, subcategories } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const category = await Category.create({
      name,
      nameNepali,
      icon,
      image: req.file
        ? {
            url: req.file.path,
            public_id: req.file.filename,
          }
        : null,
      subcategories: JSON.parse(req.body.subcategories || "[]")

    });

    res.status(201).json({
      success: true,
      data: { category },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// GET /api/categories/:id
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });
    res.status(200).json({ success: true, data: { category } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/categories/:id
export const updateCategoryById = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // 🔥 FIX: Parse subcategories properly
    if (req.body.subcategories) {
      updateData.subcategories = JSON.parse(req.body.subcategories);
    }

    if (req.file) {
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { category },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// DELETE /admin/categories/:id
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: err.message,
    });
  }
};


