const Post = require("../models/post.model");
const { authId } = require("../utils/auth");
const mongoose = require("mongoose");
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const post = await Post.create({
      title,
      content,
      created_by: authId(req),
    });
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "created_at",
      sortOrder = "desc",
      title,
      created_by,
      with: withParam,
    } = req.query;

    // ----- Filter -----
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // tìm mờ, không phân biệt hoa thường
    }

    if (created_by) {
      if (mongoose.Types.ObjectId.isValid(created_by)) {
        filter.created_by = new mongoose.Types.ObjectId(created_by);
      } else {
        return res.status(400).json({ message: "created_by không hợp lệ" });
      }
    }

    // ----- Pagination -----
    const currentPage = Math.max(parseInt(page), 1);
    const parsedLimit = Math.max(parseInt(limit), 1);
    const skip = (currentPage - 1) * parsedLimit;

    // ----- Tổng số bản ghi phù hợp -----
    const total = await Post.countDocuments(filter);

    // ----- Query chính -----
    let query = Post.find(filter)
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .skip(skip)
      .limit(parsedLimit);

    // ----- Populate động -----
    if (withParam) {
      const fieldsToPopulate = withParam
        .split(",")
        .map((field) => field.trim());

      fieldsToPopulate.forEach((field) => {
        // Có thể tùy chỉnh sâu hơn cho từng field
        if (field === "created_by") {
          query = query.populate({
            path: "created_by",
            select: "username email firstName lastName",
          });
        } else {
          query = query.populate(field);
        }
      });
    }

    const posts = await query.exec();

    res.status(200).json({
      message: "Lấy danh sách bài viết thành công",
      total,
      currentPage,
      totalPages: Math.ceil(total / parsedLimit),
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách bài viết",
      error: error.message,
    });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(200).json({
      message: "Lấy bài viết thành công",
      data: post,
    });
  } catch (error) {}
};
exports.updatePostById = async (req, res) => {
  try {
    const postId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }

    const updateData = {};
    const allowedFields = ["title", "content"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "Không có dữ liệu để cập nhật" });
    }

    updateData.updated_at = new Date();

    const post = await Post.findByIdAndUpdate(postId, updateData, {
      new: true,
    });

    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    res.status(200).json({
      message: "Cập nhật bài viết thành công",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi cập nhật bài viết",
      error: error.message,
    });
  }
};
exports.deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "ID không hợp lệ" });
    }
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
    res.status(204);
  } catch (error) {
    res.status(500).json({
      message: "Đã xảy ra lỗi khi xóa bài viết",
      error: error.message,
    });
  }
};
