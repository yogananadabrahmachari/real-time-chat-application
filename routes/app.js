const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Mongoose User model

// =======================
// Signup Route
// =======================
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("📥 Signup data received:", { name, email, password });

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send("<script>alert('❌ User already exists'); window.location='/register';</script>");
    }

    // Save new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    console.log("✅ User saved:", newUser);

    res.send("<script>alert('✅ Signup successful! Please log in.'); window.location='/';</script>");
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).send("<script>alert('Server error. Please try again.'); window.location='/register';</script>");
  }
});

// =======================
// Login Route
// =======================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("🔐 Login attempt:", { email });

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.send("<script>alert('❌ Invalid email or password'); window.location='/';</script>");
    }

    // Store user session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email
    };

    console.log("✅ Login successful for:", user.email);

    res.redirect("/select-room"); // ✅ Redirect to room selection
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).send("<script>alert('Server error. Please try again.'); window.location='/';</script>");
  }
});

// =======================
// Logout Route
// =======================
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("❌ Logout error:", err.message);
    }
    res.redirect("/");
  });
});

module.exports = router;
