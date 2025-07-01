const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { body } = require("express-validator");
const { validateRequest } = require("../middleware/validate.middleware");
const userModel = require("../models/user.model");
const checkExist = require("../validators/exists.validator");

router.post(
  "/register",
  [
    body("username")
      .isString()
      .withMessage("username phải là một chuỗi")
      .notEmpty()
      .withMessage("username là bắt buộc")
      .custom(checkExist(userModel, "username"))
      .isLength({ min: 6 }),
    body("email")
      .isEmail()
      .withMessage("Email không hợp lệ")
      .notEmpty()
      .withMessage("Email là bắt buộc")
      .custom(checkExist(userModel, "email")),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password phải có ít nhất 6 ký tự"),
    body("firstName").notEmpty().withMessage("firstName là bắt buộc"),
    body("lastName").notEmpty().withMessage("lastName là bắt buộc"),
    body("role").notEmpty().withMessage("role là bắt buộc"),
  ],
  validateRequest,
  authController.register
);
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("username là bắt buộc"),
    body("password").notEmpty().withMessage("Mật khẩu là bắt buộc"),
  ],
  validateRequest,
  authController.login
);
router.post("/logout", authenticate, authController.logout);

module.exports = router;
