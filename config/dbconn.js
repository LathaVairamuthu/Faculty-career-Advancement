const mongoose = require('mongoose');

const connectDB = async () => {
    console.log('MongoDB URL:', process.env.MONGO_URL);

    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connection is Established");
    } catch (error) {
        console.error("Error While Connecting to DB:", error.message);
        process.exit(1); // Exit the process with a failure code
    }
};

module.exports = connectDB;
