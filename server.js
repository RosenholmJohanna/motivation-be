import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import bcrypt from "bcrypt"
//const Schema = mongoose.Schema;
//import UserSchema from "./models/user";
import { User } from "./models/user.js";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/motivation";

//const User = mongoose.model("User", UserSchema); 

mongoose.connect(mongoUrl).then(() => {
  console.log("Connected to the Database successfully");
}).catch(err => {
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
  const { username, password} = req.body;
  try {
    const user = await User.findOne({username});
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({
        success: true,
        response: {
          // username: user.username,
          // id: user._id,
          user: user
        }
      });
    } else {
      res.status(400).json({
        success: false,
        response: "Credentials didn't match"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      response: error
    });
  }
});



  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });