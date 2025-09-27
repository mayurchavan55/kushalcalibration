const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// Function to decode and verify the JWT token
const decodeToken = (req) => {
  try {
    const token = req.cookies['access_token'];
    // Verify and decode the token
    const user = jwt.verify(token, ACCESS_TOKEN_SECRET);
    return user; // Return the decoded user object
  } catch (err) {
    console.error("Token verification failed:", err);
    return null; // Return null if token is invalid or expired
  }
};

module.exports = decodeToken;