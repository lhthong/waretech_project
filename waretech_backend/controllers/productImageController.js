const fs = require("fs").promises;
const path = require("path");
const ProductImage = require("../models/productImagesModel");
const prisma = require("../utils/prismaClient");

// ✅ Chuyển absolute -> relative
const toRelativeUrl = (filepath) => {
  return filepath.replace(process.cwd(), "").replace(/\\/g, "/");
};

// ✅ Chuyển relative -> absolute
const toAbsolutePath = (relativePath) => {
  return path.join(process.cwd(), relativePath.replace(/^\//, ""));
};

// ✅ Xóa file an toàn
const deleteFile = async (relativePath) => {
  try {
    const absolutePath = toAbsolutePath(relativePath);
    await fs.unlink(absolutePath);
  } catch (err) {
    console.error(`[Cleanup] Không thể xóa file: ${relativePath}`, err);
  }
};

const validateProduct = async (product_id) => {
  return await prisma.products.findUnique({
    where: { id: Number(product_id) },
  });
};

const productImageController = {
  createProductImage: async (req, res) => {
    const { product_id, is_main } = req.body;
    if (!req.file)
      return res.status(400).json({ message: "Thiếu file hình ảnh" });
    if (!product_id) {
      await deleteFile(req.file.path);
      return res.status(400).json({ message: "Thiếu product_id" });
    }

    try {
      const product = await validateProduct(product_id);
      if (!product) {
        await deleteFile(req.file.path);
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      if (is_main === "true" || is_main === true) {
        await prisma.product_images.updateMany({
          where: { product_id: Number(product_id), is_main: true },
          data: { is_main: false },
        });
      }

      const relativePath = toRelativeUrl(req.file.path);
      const productImage = await ProductImage.create({
        product_id: Number(product_id),
        image_url: relativePath,
        is_main: is_main === "true" || is_main === true,
      });

      res.status(201).json({
        message: "Tạo hình ảnh thành công",
        product_image: {
          ...productImage,
          image_url: relativePath,
        },
      });
    } catch (err) {
      console.error(err);
      await deleteFile(req.file?.path);
      res.status(500).json({ message: "Lỗi khi tạo hình ảnh" });
    }
  },

  createManyProductImages: async (req, res) => {
    const { product_id, is_main } = req.body;
    if (!Array.isArray(req.files) || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách hình ảnh không hợp lệ" });
    }
    if (!product_id) {
      await Promise.all(req.files.map((file) => deleteFile(file.path)));
      return res.status(400).json({ message: "Thiếu product_id" });
    }

    try {
      const product = await validateProduct(product_id);
      if (!product) {
        await Promise.all(req.files.map((file) => deleteFile(file.path)));
        return res.status(404).json({ message: "Sản phẩm không tồn tại" });
      }

      const isMain = is_main === "true" || is_main === true;

      const result = await prisma.$transaction(async (prisma) => {
        if (isMain) {
          await prisma.product_images.updateMany({
            where: { product_id: Number(product_id), is_main: true },
            data: { is_main: false },
          });
        }

        return await Promise.all(
          req.files.map((file, index) =>
            prisma.product_images.create({
              data: {
                product_id: Number(product_id),
                image_url: toRelativeUrl(file.path),
                is_main: isMain && index === 0,
              },
            })
          )
        );
      });

      const converted = result.map((img) => ({
        ...img,
        image_url: toRelativeUrl(img.image_url),
      }));

      res.status(201).json({
        message: `Tạo ${converted.length} hình ảnh thành công`,
        product_images: converted,
      });
    } catch (err) {
      console.error(err);
      await Promise.all(req.files.map((file) => deleteFile(file.path)));
      res.status(500).json({ message: "Lỗi khi tạo nhiều hình ảnh" });
    }
  },

  getAllProductImage: async (req, res) => {
    try {
      const images = await ProductImage.findAll();
      const converted = images.map((img) => ({
        ...img,
        image_url: toRelativeUrl(img.image_url),
      }));
      res.status(200).json(converted);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi lấy hình ảnh" });
    }
  },

  setAsMainProductImage: async (req, res) => {
    const id = Number(req.params.id);
    const { is_main } = req.body;

    try {
      const currentImage = await ProductImage.findById(id);
      if (!currentImage)
        return res.status(404).json({ message: "Hình ảnh không tồn tại" });

      if (is_main === "true" || is_main === true) {
        await prisma.product_images.updateMany({
          where: { product_id: currentImage.product_id, is_main: true },
          data: { is_main: false },
        });
      }

      const updatedImage = await ProductImage.update(id, {
        is_main: is_main === "true" || is_main === true,
      });

      updatedImage.image_url = toRelativeUrl(updatedImage.image_url);

      res.status(200).json({
        message: "Cập nhật thành công",
        product_image: updatedImage,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi cập nhật hình ảnh" });
    }
  },

  deleteProductImage: async (req, res) => {
    const id = Number(req.params.id);

    try {
      const image = await ProductImage.findById(id);
      if (!image)
        return res.status(404).json({ message: "Hình ảnh không tồn tại" });

      await prisma.$transaction(async (prisma) => {
        await deleteFile(image.image_url);
        await prisma.product_images.delete({ where: { id } });
      });

      res.status(200).json({ message: "Xóa hình ảnh thành công" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi khi xóa hình ảnh" });
    }
  },

  deleteManyProductImages: async (req, res) => {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Danh sách ID không hợp lệ" });
      }

      const images = await prisma.product_images.findMany({
        where: {
          id: { in: ids.map(Number) },
        },
      });

      if (images.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy hình ảnh tương ứng để xóa",
          failed_ids: ids,
        });
      }

      await prisma.$transaction(async (prisma) => {
        const mainImage = images.find((img) => img.is_main);
        if (mainImage) {
          await prisma.product_images.update({
            where: { id: mainImage.id },
            data: { is_main: false },
          });
        }

        await Promise.all(
          images.map((img) => {
            const absolutePath = toAbsolutePath(img.image_url);
            return fs.unlink(absolutePath).catch((e) => {
              console.error(`[Cleanup] Lỗi xóa file ${img.image_url}:`, e);
            });
          })
        );

        await prisma.product_images.deleteMany({
          where: { id: { in: images.map((img) => img.id) } },
        });
      });

      return res.status(200).json({
        message: `Đã xóa ${images.length}/${ids.length} ảnh`,
        deleted_ids: images.map((img) => img.id),
        failed_ids: ids.filter((id) => !images.some((img) => img.id === id)),
      });
    } catch (err) {
      console.error("[API] Lỗi xóa nhiều ảnh:", err);
      return res.status(500).json({
        message: "Lỗi hệ thống khi xóa ảnh",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },
};

module.exports = productImageController;
