import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// import { MongoClient, ServerApiVersion } from "mongodb";
import { User } from "./models/user.js";

dotenv.config();
const uri = process.env.MONGO_URL;
const port = process.env.PORT || 8080;
const app = express();

mongoose.connect(uri)
  .then(() => console.log("connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Motivation API!");
});

// USER REGISTRATION
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync();
    if (password.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 3 characters long",
      });
    }

    const newUser = await new User({
      username,
      password: bcrypt.hashSync(password, salt),
    }).save();

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        username: newUser.username,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed",
    });
  }
});

// USER LOGIN - without token
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Credentials didn't match",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



// //const { MongoClient, ServerApiVersion } = require('mongodb');
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);


// const secretKey = crypto.randomBytes(64).toString("hex");

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/motivation";
// console.log(process.env.MONGO_URL)


// mongoose
//   .connect(mongoUrl)
//   .then(() => {
//     console.log("Connected to the Database successfully");
//   })
//   .catch((err) => {
//     console.error("Database connection error:", err);
//   });
// mongoose.Promise = Promise;

// const port = process.env.PORT || 8080;
// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("welcome to motivational");
// });

// // USER REGISTRATION
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const salt = bcrypt.genSaltSync();
//     if (password.length < 3) {
//       res.status(400).json({
//         success: false,
//         response: "Password must be at least 3 characters long",
//       });
//     } else {
//       const newUser = await new User({
//         username: username,
//         password: bcrypt.hashSync(password, salt),
//       }).save();
//       res.status(201).json({
//         success: true,
//         response: {
//           username: newUser.username,
//         },
//       });
//     }
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//     });
//   }
// });

// //USER LOGIN - whitout token
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (user && bcrypt.compareSync(password, user.password)) {
//       res.status(200).json({
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user._id,
//           username: user.username,
//         },
//       });
//     } else {
//       res.status(400).json({
//         success: false,
//         message: "Credentials didn't match",
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// });

// // // USER LOGIN with token
// // app.post("/login", async (req, res) => {
// //   const { username, password } = req.body;
// //   try {
// //     const user = await User.findOne({ username });
// //     if (user && bcrypt.compareSync(password, user.password)) {
// //       const accessToken = jwt.sign(
// //         { userId: user._id },
// //         process.env.JWT_SECRET,
// //         { expiresIn: "1h" }
// //       );

// //       res.status(200).json({
// //         success: true,
// //           token: accessToken,
// //         //   user: {
// //         //     id: user._id,
// //         //     username: username.username,
// //         // },
// //       });
// //     } else {
// //       res.status(400).json({
// //         success: false,
// //         response: "Credentials didn't match",
// //       });
// //     }
// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       response: error,
// //     });
// //   }
// // });


// // middleware verifying JWT
// const authenticateUser = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({
//       success: false,
//       message: "Access denied. No token provided.",
//     });
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Invalid token.",
//     });
//   }
// };

// // protected route 
// app.get("/protected", authenticateUser, (req, res) => {
//   res
//     .status(200)
//     .json({
//       success: true,
//       message: "You have access to this protected route!",
//       userId: req.user.userId,
//     });
// });


// //const User = mongoose.model("User", UserSchema);
// //const Schema = mongoose.Schema;
// //import UserSchema from "./models/user";
// //import jsonwebtoken from "jsonwebtoken";
// //const accessToken = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
