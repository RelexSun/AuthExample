const express = require("express");
const authController = require("../controller/authController");
const userController = require("../controller/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.get("/", authController.protect, userController.getUser);
router.delete(
  "/:id",
  authController.protect,
  authController.restricTo("admin"),
  userController.deleteUser
);

module.exports = router;
