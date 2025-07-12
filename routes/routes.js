const express = require("express");
const path = require("path");

const router = express.Router();
const loginPath = path.join(__dirname, "../public/");

router.get("/", (req, res) => {
  res.sendFile(path.join(loginPath, "login.html"));
});

router.get("/register", (req, res) => {
  res.sendFile(path.join(loginPath, "sign.html"));
});

router.get("/select-room", (req, res) => {
  if (!req.session.user) return res.redirect('/');
  res.sendFile(path.join(loginPath, "index.html"));
});

module.exports = router;
