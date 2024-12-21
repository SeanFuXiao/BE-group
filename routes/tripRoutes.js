const express = require("express");
const {
  createTrip,
  getAllTrips,
  getTripDetails,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected routes
router.post("/", authMiddleware, createTrip);
router.get("/", authMiddleware, getAllTrips);
router.get("/:id", authMiddleware, getTripDetails);
router.put("/:id", authMiddleware, updateTrip);
router.delete("/:id", authMiddleware, deleteTrip);

module.exports = router;
