const express = require("express");
const { adminAuth } = require("../middleware/auth");
const connectDB = require("../config/database");
const { UserModel } = require("../models/user");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middleware/auth");
const { validateSignUpData } = require("../utils/validation");

const app = express();
app.use(express.json());
app.use(cookieparser());
const PORT = 3000;

connectDB()
  .then(() => {
    console.log("Connected to DataBase SuccessFully");
  })
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is Running on  PORT ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error Occured " + err);
  });

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const data = new UserModel({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await data.save();
    res.send("Data Saved SuccessFully");
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      throw new Error("User Not Found");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await jwt.sign({ id: user.id }, "MysecretToken789", {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      });
      res.send("Login SuccessFull");
    } else {
      res.status(401).send("Please Enter Valid Password");
    }
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.get("/user", userAuth, async (req, res) => {
  const user = req.user;
  res.send("Logged-In User Is :" + user);
});
