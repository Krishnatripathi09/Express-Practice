const express = require("express");
const { adminAuth } = require("../middleware/auth");
const connectDB = require("../config/database");
const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

const app = express();
app.use(express.json());
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
      res.cookie("token", "weruiomnbvcxsw3456789098765432mbvcdsdtyuikjhg");
      res.send("Login SuccessFull");
    } else {
      res.status(401).send("Please Enter Valid Password");
    }
  } catch (err) {
    res.status(400).send("Error Occured " + err);
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.id;
  // const name = req.body.firstName;
  const user = await UserModel.findOneAndDelete(id);

  res.send("User Data Found " + user);
});
