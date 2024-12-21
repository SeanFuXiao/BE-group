require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectMongoDB");

const app = express();

connectDB();

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/trips", require("./routes/tripRoutes"));
app.use("/api/bills", require("./routes/billRoutes"));
app.use("/api/participants", require("./routes/participantRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
