const Bill = require("../models/BillModel");
const Trip = require("../models/TripModel");

const mongoose = require("mongoose");

// Create Bill
// Create Bill

const Participant = require("../models/ParticipantModel");

exports.createBill = async (req, res) => {
  try {
    const { trip_id, payer_id, amount, description } = req.body;

    if (!trip_id || !payer_id || !amount) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const trip = await Trip.findById(trip_id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    const bill = new Bill({ trip_id, payer_id, amount, description });
    await bill.save();

    trip.total_cost += amount;
    await trip.save();

    const participants = await Participant.find({ trip_id }).populate(
      "user_id",
      "username"
    );

    if (!participants || participants.length === 0) {
      return res
        .status(404)
        .json({ error: "No participants found for this trip" });
    }

    const splitAmount = amount / participants.length;

    for (const participant of participants) {
      if (participant.user_id._id.toString() === payer_id) {
        participant.amount_paid += amount;
      }
      participant.amount_owed += splitAmount;
      participant.balance = participant.amount_paid - participant.amount_owed;
      await participant.save();
    }

    res.status(201).json({ message: "Bill created and amounts updated", bill });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error creating bill" });
  }
};
// Get all Bills
// Get all Bills

exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("trip_id", "name total_cost")
      .populate("payer_id", "username");
    res.json(bills);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Get Bill by ID
// Get Bill by ID

exports.getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("trip_id", "name total_cost")
      .populate("payer_id", "username");
    if (!bill) return res.json({ error: "Bill not found" });
    res.json(bill);
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Update Bill
// Update Bill

exports.updateBill = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const bill = await Bill.findById(req.params.id);

    if (!bill) return res.json({ error: "Bill not found" });

    const trip = await Trip.findById(bill.trip_id);
    if (!trip) return res.json({ error: "Trip not found" });

    const participants = await Participant.find({ trip_id: bill.trip_id });

    const originalSplitAmount = bill.amount / participants.length;

    for (const participant of participants) {
      if (participant.user_id.toString() === bill.payer_id.toString()) {
        participant.amount_paid -= bill.amount;
      }
      participant.amount_owed -= originalSplitAmount;
      participant.balance = participant.amount_paid - participant.amount_owed;
      await participant.save();
    }

    trip.total_cost -= bill.amount;

    bill.amount = amount || bill.amount;
    bill.description = description || bill.description;
    await bill.save();

    const updatedSplitAmount = bill.amount / participants.length;

    for (const participant of participants) {
      if (participant.user_id.toString() === bill.payer_id.toString()) {
        participant.amount_paid += bill.amount;
      }
      participant.amount_owed += updatedSplitAmount;
      participant.balance = participant.amount_paid - participant.amount_owed;
      await participant.save();
    }

    trip.total_cost += bill.amount;
    await trip.save();

    res.json({ message: "Bill updated and amounts recalculated", bill });
  } catch (err) {
    res.json({ error: err.message });
  }
};

// Delete Bill
// Delete Bill

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ error: "Bill not found" });

    const trip = await Trip.findById(bill.trip_id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const participants = await Participant.find({ trip_id: bill.trip_id });

    const splitAmount = bill.amount / participants.length;

    for (const participant of participants) {
      if (participant.user_id.toString() === bill.payer_id.toString()) {
        participant.amount_paid -= bill.amount;
      }
      participant.amount_owed -= splitAmount;
      participant.balance = participant.amount_paid - participant.amount_owed;
      await participant.save();
    }

    trip.total_cost -= bill.amount;
    await trip.save();

    await bill.deleteOne();

    const updatedBalances = await Participant.find({ trip_id: trip._id })
      .populate("user_id", "username")
      .select("user_id amount_paid amount_owed balance");

    res.json({
      message: "Bill deleted and amounts updated",
      balances: updatedBalances,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
