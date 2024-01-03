const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  displayName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  profilePhoto: {
    type: String,
  },
  password: {
    type: String,
  },
  facebookId: String,
  googleId: String,
  tokens: [String],
});

// Hash the user's password before saving it to the database
userSchema.pre('save', async function (next) {
  try {
    // Only hash the password if it's modified or a new user
    if (!this.isModified('password')) return next();

    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Replace the plain password with the hashed password
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});



module.exports = mongoose.model('User', userSchema);