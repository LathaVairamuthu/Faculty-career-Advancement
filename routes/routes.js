const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Faculty = require('../models/faculty');
const jwt = require('jsonwebtoken');
const path = require('path');
const filePath = path.join(__dirname, 'data', 'facsignin.json');

// Health Check Route
router.get('/', (req, res) => {
    res.json({ message: 'Faculty API is working!' });
});

// Faculty Signup
router.post('/signup', async (req, res) => {
    const { name, email, designation, password } = req.body;

    try {
        // Check if email is already registered
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ success: false, message: 'Email already registered. Please log in.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save faculty
        const newFaculty = new Faculty({
            name,
            email,
            designation,
            password: hashedPassword
        });

        await newFaculty.save();
        res.status(201).json({ success: true, message: 'Faculty registered successfully!' });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ success: false, message: 'Signup failed. Please try again later.' });
    }
});

// Faculty Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if faculty exists
        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: faculty._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Login failed. Please try again later.' });
    }
});

router.post('/profile', async (req, res) => {
    const { name, number, email, achievements, biodata, experience, certificates, profileImage } = req.body;

    try {
        const faculty = await Faculty.findOne({ email });
        console.log('Faculty Found:', faculty);

        if (!faculty) {
            return res.status(404).json({ success: false, message: 'Faculty not found!' });
        }

        faculty.name = name || faculty.name;
        faculty.number = number || faculty.number;
        faculty.achievements = achievements || faculty.achievements;
        faculty.biodata = biodata || faculty.biodata;
        faculty.experience = experience || faculty.experience;
        faculty.profileImage = profileImage || faculty.profileImage;

        await faculty.save();

        res.status(200).json({ success: true, message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Profile Update Error:', error);
        res.status(500).json({ success: false, message: 'Profile update failed. Please try again later.' });
    }
});
router.get('/profile', (req, res) => {
    console.log('Fetching profile data...'); // Log the request
    fs.readFile(dataFilePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error fetching profile:', err); // Log any errors
            return res.status(500).json({ message: 'Failed to fetch profile data.' });
        }

        console.log('Raw data from file:', data); // Log raw file data

        try {
            const profileData = JSON.parse(data);
            console.log('Parsed profile data:', profileData); // Log parsed JSON data

            if (Object.keys(profileData).length === 0) {
                console.log('No profile data found.');
                return res.status(404).json({ message: 'No profile data found.' });
            }

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(profileData);
        } catch (error) {
            console.error('Error parsing profile data:', error); // Log parsing errors
            return res.status(500).json({ message: 'Failed to parse profile data.' });
        }
    });
});


router.post('/profile', (req, res) => {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(req.body, null, 2));
        res.status(200).json({ message: 'Profile saved successfully.' });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ message: 'Failed to save profile data.' });
    }
});


module.exports = router;
