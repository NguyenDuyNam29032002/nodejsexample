const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validateRequest } = require("../middleware/validate.middleware");
const { body } = require("express-validator");

router.post(
  "/post",
  [
    body("title").notEmpty().withMessage("title là bắt buộc"),
    body("content").notEmpty().withMessage("content là bắt buộc"),
  ],
  validateRequest,
  authenticate,
  postController.createPost
);
router.get("/posts", authenticate, postController.getAllPosts);
router.get("/post/:id", authenticate, postController.getPostById);
router.patch("/post/:id", authenticate, postController.updatePostById);
router.delete("/post/:id", authenticate, postController.deletePostById);

module.exports = router;
