const express = require("express");
const app = express();

const adminAuth = app.use("/admin", (req, res, next) => {
  const token = "xyz";

  const isAdminAuthorized = token === "xyz";

  if (isAdminAuthorized) {
    next();
  } else {
    res.status(401).send("Un-Authorized- Please Log-In Again");
  }
});

module.exports = {
  adminAuth,
};
