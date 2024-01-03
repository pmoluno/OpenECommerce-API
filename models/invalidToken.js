const mongoose = require('mongoose');

// Invalid Token Schema
const invalidTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
});

const InvalidToken = mongoose.model('InvalidToken', invalidTokenSchema);

module.exports = InvalidToken;
