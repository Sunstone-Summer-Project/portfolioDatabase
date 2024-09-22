const mongoose = require('mongoose');

// Regex patterns for validating email and phone numbers
const phoneRegex = /^[0-9]{10}$/; // 10-digit phone number validation
const emailRegex = /.+\@.+\..+/; // Basic email format validation

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { 
    type: String, 
    required: true, 
    validate: {
      validator: (v) => phoneRegex.test(v),
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v) => emailRegex.test(v),
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: { type: String, required: true },
  message: { type: String },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
