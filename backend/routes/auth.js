const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET,
      { expiresIn: "3d" }
    );

    const { password, ...info } = user._doc;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ⬅️ dynamic
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    }).status(200).json(info);
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Something went wrong during login" });
  }
});

// Logout
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    }).status(200).send("User logged out successfully");
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
});

// Refetch user
router.get("/refetch", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    res.status(200).json(data);
  });
});

module.exports = router;
