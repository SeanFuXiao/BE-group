const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  total_cost: { type: Number, default: 0 },
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
});

module.exports = mongoose.model("Trip", TripSchema);
