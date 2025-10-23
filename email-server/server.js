require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allows requests from your website
app.use(express.json()); // Allows the server to parse JSON data

// Create a Nodemailer transporter
// This is the object that will actually send the email
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use Gmail as the service
    auth: {
        user: process.env.EMAIL_USER, // Your email from the .env file
        pass: process.env.EMAIL_PASS, // Your App Password from the .env file
    },
});

// Create an API endpoint to handle form submissions
app.post('/send-email', (req, res) => {
    // Get the data from the request body sent by the frontend
    const { name, contact, email, message, projects } = req.body;

    // Basic validation
    if (!name || !email || !contact) {
        return res.status(400).json({ message: 'Please fill out all required fields.' });
    }

    // Configure the email content
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`, // Sender's name and your email
        to: 'akashmandal6297@gmail.com', // The email address that will receive the form submission
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Message from Website Contact Form</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact No:</strong> ${contact}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <p><strong>Interested in Projects:</strong> ${projects.length > 0 ? projects.join(', ') : 'None selected'}</p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Something went wrong. Please try again.' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Thank you! Your message has been sent.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});