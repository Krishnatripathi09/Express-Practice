const express = require("express");
const { adminAuth } = require("../middleware/auth");
const connectDB = require("../config/database");
const app = express();

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

app.get("/user", (req, res) => {
  res.send("Get rooute is Responding");
});

app.get("/admin/data", adminAuth, (req, res) => {
  throw new Error("Error occured");
  res.send("Got all the Admin Data");
});

app.use("/", (err, req, res, next) => {
  res.status(400).send("something went  wrong " + err);
});
