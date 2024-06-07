const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
    console.log(`token: ${token}`);
    if (!token) {
        return res.status(401).json({ message: "Authentication token missing" });
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decode) => {
        if (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
        const { id: userId } = decode;
        const user = await User.findById(userId);
        if (!user) return res.status(403).json({ message: "User not found!" });
        req.user = user;
        next();
    });
};

module.exports = authenticateToken;
