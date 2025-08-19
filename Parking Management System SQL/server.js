// Import required modules
const recognizePlate = require('./recognize');
const path = require('path');

const express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Create an instance of an Express application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.get('/recognize', async (req, res) => {
    const imagePath = path.join(__dirname, 'uploads', 'car.jpg'); // Image file path
  
    const plateNumber = await recognizePlate(imagePath);
  
    if (!plateNumber) {
      return res.status(400).json({ error: 'License plate could not be recognized' });
    }
  
    res.json({ message: 'Plate recognized successfully', plateNumber });
  });
  
app.use(bodyParser.urlencoded({ extended: true })); // To parse URL-encoded data

// Middleware to serve static files from the root directory
app.use(express.static(path.join(__dirname))); // Serve static files from the root directory

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/parking_management', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

// Define a User schema
const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, unique: true },
    password: String,
});

// Create a User model
const User = mongoose.model('User', userSchema); // Note the change here: 'User' instead of 'Users '

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html from the root directory
});

// Sign-up route
app.post('/signup', async (req, res) => {
    const { fullname, email, password } = req.body;
    
    try {
        const newUser  = new User({ fullname, email, password });
        await newUser .save();
        res.status(200).json({ message: 'Signup successful!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error during signup. Please try again.' });
    }
});

// Sign-in route
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.status(200).json({ message: 'Login successful!' });
        } else {
            res.status(401).json({ message: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Error during signin. Please try again.' });
    }
});


// Start the server and listen on the specified PORT
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
}); 