const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/dbconn');
const facultyRoutes = require('./routes/routes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Faculty Routes
app.use('/api/faculty', facultyRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('Server is running...');
});

app.get('/api/faculty/profile', (req, res) => {
    const profileData = {
        name: "John Doe",
        number: "1234567890",
        email: "johndoe@example.com",
        achievements: "Best Teacher Award 2024",
        biodata: "Experienced educator in Computer Science.",
        experience: "10 years",
        profileImage: "https://example.com/profile.jpg",
        certificateImage: "https://example.com/certificate.jpg"
    };
    res.json(profileData);
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

