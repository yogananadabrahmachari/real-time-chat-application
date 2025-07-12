const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const loginPath = path.join(__dirname, "../public/"); 

router.get("/", function (req, res) {
  res.sendFile(path.join(loginPath, "login.html"));
});

router.get("/select-room", function (req, res) {
  res.sendFile(path.join(loginPath, "index.html")); // serves index.html
});


router.get("/register", function (req, res) {
  res.sendFile(path.join(loginPath, "sign.html"));
});


module.exports = router;
