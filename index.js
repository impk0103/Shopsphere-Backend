const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("express-async-errors"); // Handles async errors automatically
const Routes = require("./routes/route.js");

dotenv.config(); // Load environment variables

// Check if essential environment variables are set
if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    console.error("❌ Missing Airtable API Key or Base ID in .env file!");
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" }));

// Improved CORS: Restrict to specific origins for security
const corsOptions = {
    origin: process.env.FRONTEND_URL, // Allow frontend domain or fallback to all
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

// Airtable setup
const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Middleware to add Airtable base to requests
app.use((req, res, next) => {
    req.base = base;
    next();
});

// Routes
app.use("/", Routes);

// 404 Handler for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("🔥 Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
