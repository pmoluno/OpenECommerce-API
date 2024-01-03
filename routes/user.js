const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const { getUserProfile, updateUserProfile } = require("../controllers/user");




// Get user profile details
router.get("/profile", authMiddleware, getUserProfile);

// Update user profile (protected route)
router.put("/profile", authMiddleware, updateUserProfile);



module.exports = router;
