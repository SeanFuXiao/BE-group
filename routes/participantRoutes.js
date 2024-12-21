const express = require("express");
const {
  addParticipant,
  getParticipantsByTrip,
  updateParticipantPayment,
  deleteParticipant,
} = require("../controllers/participantController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protected Routes
router.post("/", authMiddleware, addParticipant);
router.get("/trip/:trip_id", authMiddleware, getParticipantsByTrip);
router.put("/:id", authMiddleware, updateParticipantPayment);
router.delete("/:id", authMiddleware, deleteParticipant);

module.exports = router;
