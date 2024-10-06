import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
//import jsonwebtoken from "jsonwebtoken";
import { User } from "./models/user.js";

dotenv.config();

const secretKey = crypto.randomBytes(64).toString("hex");
// console.log(secretKey);

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/motivation";
//const accessToken = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to the Database successfully");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("welcome to motivational");
});

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

// USER LOGIN
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        response: {
          token: accessToken,
          user: {
            id: user._id,
            username: username.username,
          },
        },
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials didn't match",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error,
    });
  }
});

// middleware verifying JWT
const authenticateUser = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

// protected route 
app.get("/protected", authenticateUser, (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      message: "You have access to this protected route!",
      userId: req.user.userId,
    });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//const User = mongoose.model("User", UserSchema);
//const Schema = mongoose.Schema;
//import UserSchema from "./models/user";
