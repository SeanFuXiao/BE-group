const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" }); // 409 for conflict
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching user" });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const updatedData = {};

    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error updating user" });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting user" });
  }
};

// Check Username Exists
exports.checkUsernameExists = async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(200).json({ id: user._id, username: user.username });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error checking username" });
  }
};
