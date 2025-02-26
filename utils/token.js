const jwt = require("jsonwebtoken");

const createNewToken = (user) => {
    if (!process.env.SECRET_KEY) {
        throw new Error("❌ Missing SECRET_KEY in environment variables.");
    }

    return jwt.sign(
        { 
            userId: user.id, 
            role: user.role // Useful for access control
        }, 
        process.env.SECRET_KEY, 
        { expiresIn: process.env.TOKEN_EXPIRY || "10d" } // Default: 10 days
    );
}

module.exports = { createNewToken };
