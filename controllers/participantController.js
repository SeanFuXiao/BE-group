const Trip = require("../models/TripModel");
const User = require("../models/UserModel");

// Create Participant
// Create Participant

exports.addParticipant = async (req, res) => {
  try {
    const { trip_id, username } = req.body;


    if (!trip_id || !username) {
      return res
        .status(400)
        .json({ error: "Trip ID and username are required" });
    }


    const trip = await Trip.findById(trip_id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    // 确认 User 是否存在
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)

        .json({ error: "Participant username does not exist" });
    }


    const existingParticipant = await Participant.findOne({
      trip_id,
      user_id: user._id,
    });
    if (existingParticipant) {

      return res
        .status(409)
        .json({ error: "Participant already exists for this trip" });

    }

    const participant = new Participant({
      trip_id,
      user_id: user._id,
      amount_paid: 0,
      amount_owed: 0,
      balance: 0,
    });
    await participant.save();

    if (!trip.participants.includes(user._id)) {
      trip.participants.push(user._id);
      await trip.save();
    }

    res
      .status(201)
      .json({ message: "Participant added successfully", participant });
  } catch (err) {
    console.error("Error in addParticipant:", err.message);

    res.status(500).json({ error: "Server error adding participant" });

  }
};
// Get all Partocoant bt Trip
// Get all Partocoant bt Trip

exports.getParticipantsByTrip = async (req, res) => {
  try {
    const participants = await Participant.find({
      trip_id: req.params.trip_id,
    }).populate("user_id", "username");
    res.json(participants);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update
// Update

exports.updateParticipantPayment = async (req, res) => {
  try {
    const { amount_paid } = req.body;
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.json({ error: "Participant not found" });

    participant.amount_paid = amount_paid;
    participant.balance = amount_paid - participant.amount_owed;
    await participant.save();

    res.json({ message: "Participant payment updated", participant });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete
// Delete

exports.deleteParticipant = async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) return res.json({ error: "Participant not found" });

    await participant.deleteOne();

    const trip = await Trip.findById(participant.trip_id);
    if (trip) {
      trip.participants = trip.participants.filter(
        (p) => p.toString() !== participant.user_id.toString()
      );
      await trip.save();
    }

    res.json({ message: "Participant deleted" });
  } catch (err) {
    res.json({ error: err.message });
  }
};
