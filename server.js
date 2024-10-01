const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
//const bcrypt = require("bcrypt");

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/motivation";
mongoose.connect(mongoUrl).then(() => {
  console.log("Connected to the Database successfully");
});
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// APP LISTEN
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.get("/", (req, res) => {
  res.send("welcome to motivational");
});