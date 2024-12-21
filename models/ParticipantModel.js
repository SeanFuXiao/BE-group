const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  trip_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount_paid: { type: Number, default: 0 },
  amount_owed: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
