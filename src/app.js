const express = require("express");
const mongo = require("mongoose");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

mongo
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.use("/auth", authRoutes);

app.get("/", (req, res) => res.send("Welcome to Node.js Auth API"));

module.exports = app;
