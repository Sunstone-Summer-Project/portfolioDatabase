const express = require('express');
const connectDB = require('./db');
const User = require('./models/User');
const cors = require('cors');
const bodyParser = require('body-parser'); 
const bcrypt = require('bcrypt'); 

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'https://portfolio-frontend-rho-puce.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json()); 

// Routes
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.post('/register', async (req, res) => {
  const { firstName, lastName, phoneNumber, email, password, message } = req.body; 

  try {
    // Check if the user already exists
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user with the message field
    let user = new User({
      firstName,
      lastName,
      phoneNumber,
      email,
      password, // Store plain password for hashing later
      message
    });

    // Validate user data
    await user.validate(); // Triggers validation

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).send('User registered');
  } catch (err) {
    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: err.message });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
