const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Routes = require("./routes/route.js");

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(express.json());
app.use(cors(corsOptions));
app.get('/', (req, res) => {
    res.send('Shopsphere Backend is Running!');
  });
app.use("/", Routes);

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
