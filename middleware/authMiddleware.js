const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.body.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired, please log in again" });
        }
        return res.status(403).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
