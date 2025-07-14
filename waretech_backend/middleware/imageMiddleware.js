const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const UPLOAD_BASE_DIR =
  process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ensureDirExists = async (dir) => {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const dir = path.join(UPLOAD_BASE_DIR, "product-images");
      await ensureDirExists(dir);
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Chỉ cho phép file ${ALLOWED_MIME_TYPES.join(", ")}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
});

const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? `File quá lớn. Tối đa ${MAX_FILE_SIZE / 1024 / 1024}MB`
        : err.message;
    return res.status(400).json({ message });
  }
  if (err) {
    return res.status(500).json({ message: "Lỗi upload file" });
  }
  next();
};

module.exports = {
  singleUpload: upload.single("image"),
  multipleUpload: upload.array("images", 10),
  handleUploadErrors,
};
