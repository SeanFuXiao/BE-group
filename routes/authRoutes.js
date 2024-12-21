const express = require("express");
const {
  registerUser,
  loginUser,
  getUserById,
  updateUser,
  deleteUser,
  checkUsernameExists,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/exists/:username", checkUsernameExists);

// Protected Routes
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

module.exports = router;
