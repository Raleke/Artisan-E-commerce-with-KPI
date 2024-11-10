require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); 


const userRegistrationPost = async (req, res) => {
  const { username, email, password, role, confirmPassword } = req.body;

  let errors = [];

  if (!username || !email || !password || !role || !confirmPassword) {
    errors.push({ msg: "Please fill in all fields" });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 8) {
    errors.push({ msg: "Password should be at least 8 characters" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, username, email, role });
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      errors.push({ msg: "Email already exists" });
      return res.status(400).json({ errors, username, email, role });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(201).json({
      msg: "Registration successful. You can now log in.",
      token,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
};

const userLoginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "This email does not exist" });
    }

    const isVerified = await bcrypt.compare(password, user.password);
    if (!isVerified) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } 
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "There was a problem selecting from DB" });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
     
      if (req.user.role !== 'customer') {
          return res.status(403).json({ message: 'Access denied: Only customers can view their purchase history' });
      }


      const user = await User.findById(req.user._id).populate('purchaseHistory.transactionId');


      if (!user.purchaseHistory || user.purchaseHistory.length === 0) {
          return res.status(404).json({ message: 'No purchase history found' });
      }
      res.status(200).json(user.purchaseHistory);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch purchase history', details: error.message });
  }
};

  

module.exports = { userRegistrationPost,userLoginPost,getPurchaseHistory };
