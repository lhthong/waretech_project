const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

const onlyAdminOrStaff = [isAuth, authorizeRoles("admin", "staff")];

router.post("/", isAuth, authorizeRoles("admin"), userController.createUser);
router.get("/", isAuth, onlyAdminOrStaff, userController.getAllUsers);
router.get("/:id", isAuth, onlyAdminOrStaff, userController.getUserById);
router.put("/:id", isAuth, authorizeRoles("admin"), userController.updateUser);
router.delete(
  "/:id",
  isAuth,
  authorizeRoles("admin"),
  userController.deleteUser
);

module.exports = router;
