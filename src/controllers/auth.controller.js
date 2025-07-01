const User = require("../models/user.model");
const { signToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { username, password, firstName, lastName, email, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "username already exists" });
    }
    const user = await User.create({
      username,
      firstName,
      lastName,
      email,
      password,
      role,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        deletedAt: user.deleted_at,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = signToken({ id: user._id, email: user.email });
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Logged out (client must delete token)" });
};
