import multer from 'multer';
import path from 'path';

// Storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    );
  }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Images only'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter
});
