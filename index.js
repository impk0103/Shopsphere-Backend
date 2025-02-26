const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("express-async-errors"); // Handles async errors automatically
const Routes = require("./routes/route.js");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL, 
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
};

const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);


app.use((req, res, next) => {
    req.base = base;
    next();
});
app.use(cors(corsOptions));
app.use(express.json();
app.get('', (req, res) => {
  res.send('Shopsphere Backend is Running!');
});
app.use("/", Routes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
