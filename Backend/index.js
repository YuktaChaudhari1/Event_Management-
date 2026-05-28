const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const dns = require("dns");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/events");
const bookingRoutes = require("./routes/booking");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/booking", bookingRoutes);

//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Eventora Backend API Running 🚀");
});


module.exports = app;
