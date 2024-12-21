const express = require("express");
const {
  createBill,
  getAllBills,
  getBillById,
  updateBill,
  deleteBill,
} = require("../controllers/billController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected
router.post("/", authMiddleware, createBill);
router.get("/", authMiddleware, getAllBills);
router.get("/:id", authMiddleware, getBillById);
router.put("/:id", authMiddleware, updateBill);
router.delete("/:id", authMiddleware, deleteBill);

module.exports = router;
