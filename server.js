const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
// import express from "express"
// import cors from "cors"
// import mongoose from "mongoose"

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


const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlenght: 3,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
    },
  });
  
  const User = mongoose.model("User", UserSchema);


  // USER REGISTRATION
app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
      const salt = bcrypt.genSaltSync();
      if (password.length < 3) {
        res.status(400).json({
          success: false,
          response: "Password must be at least 3 characters long",
        });
      } else {
        const newUser = await new User({
          username: username,
          password: bcrypt.hashSync(password, salt),
        }).save();
        res.status(201).json({
          success: true,
          response: {
            username: newUser.username,
            //accessToken: newUser.accessToken,
          },
        });
      }
    } catch (error) {
      res.status(400).json({
        success: false,
      });
    }
  });