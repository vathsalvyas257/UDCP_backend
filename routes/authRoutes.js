const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("../config/passport");
const User = require("../models/userModel");
const multer = require("multer");
const authController=require("../controllers/authController");
const authenticate=require("../middlewares/authenticate");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";


const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({ storage: storage }); 
router.post("/auth/register", upload.single("image"),authController.apiAuthRegister);

// 📌 Login Route
router.post("/auth/login", authController.login_post);

// 📌 Google OAuth Route
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 📌 Google OAuth Callback (Ensure Leading Slash `/auth/...`)
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleAuthCallback
);
router.post('/auth/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'None', secure: true });
  res.status(200).json({ message: 'Logout successful' });
});

router.post("/auth/sendOTP",authController.sendOtp);

router.post("/auth/verifyOTP",authController.verifyOtp);


// Logout API - Remove cookies (JWT)
router.post('/auth/logout', authController.logout);

router.get("/user", authenticate, authController.fetchUser);
module.exports = router;
