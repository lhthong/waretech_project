const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const upload = require("../middleware/uploadAvatar");
const { isAuth } = require("../middleware/authMiddleware");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/logout", isAuth, authController.logoutUser);
router.put("/change_password", isAuth, authController.changePassword);
router.get("/me", isAuth, authController.getCurrentUser);
router.put(
  "/update_user",
  isAuth,
  upload.single("avatar"),
  authController.updateUser
);

module.exports = router;
