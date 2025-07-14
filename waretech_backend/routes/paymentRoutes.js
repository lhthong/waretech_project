const express = require("express");
const router = express.Router();
const {
  paymentController,
  momoController,
  codController,
  paypalController,
} = require("../controllers/paymentController");
const { isAuth, authorizeRoles } = require("../middleware/authMiddleware");

const onlyAdminOrStaffOrClient = [
  isAuth,
  authorizeRoles("admin", "staff", "client"),
];
const logIPN = (req, res, next) => {
  console.log("MoMo IPN request:", {
    body: req.body,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
  next();
};
router.post("/momo", onlyAdminOrStaffOrClient, momoController.createPayment);
router.get("/momo-return", momoController.handleReturn);
router.post("/momo-ipn", logIPN, momoController.handleIPN);

router.post("/cod", onlyAdminOrStaffOrClient, codController.createPayment);
router.patch(
  "/cod/:paymentId",
  onlyAdminOrStaffOrClient,
  codController.updatePaymentStatus
);

router.get(
  "/order/:orderId",
  onlyAdminOrStaffOrClient,
  paymentController.getPaymentByOrderId
);

router.post(
  "/paypal",
  onlyAdminOrStaffOrClient,
  paypalController.createPayment
);
router.get("/paypal-capture", paypalController.capturePayment);

module.exports = router;
