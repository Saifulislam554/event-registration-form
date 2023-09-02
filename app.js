const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

// Configure MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/event-registration', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a schema and model for registration data
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String,
    payment: String,
});
const Registration = mongoose.model('Registration', registrationSchema);

// Configure Nodemailer for sending confirmation emails
const transporter = nodemailer.createTransport({
    service: 'your-email-service',
    auth: {
        user: 'your-email@example.com',
        pass: 'your-email-password',
    },
});

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Serve the registration form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/registration.html');
});

// Handle form submission
// ...
// Handle form submission
app.post('/register', async (req, res) => {
    const { name, email, event, payment } = req.body;

    try {
        // Save registration data to MongoDB
        const registration = new Registration({ name, email, event, payment });
        await registration.save();

        // Send confirmation email
        const mailOptions = {
            from: 'your-email@example.com',
            to: email,
            subject: 'Event Registration Confirmation',
            text: `Thank you for registering for ${event}. Your payment method: ${payment}.`,
        };

        await transporter.sendMail(mailOptions);
        res.send('Registration successful. Confirmation email sent.');
    } catch (error) {
        console.error(error);
        res.send('Registration failed.');
    }
});
// ...


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
