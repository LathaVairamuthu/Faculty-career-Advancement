const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    designation: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: { type: String, required: true },
    number: { type: String }, // New field
    achievements: { type: String }, // New field
    biodata: { type: String }, // New field
    experience: { type: String }, // New field
    profileImage: { type: String },
},
 { timestamps: true });


module.exports = mongoose.model('Faculty', facultySchema);
