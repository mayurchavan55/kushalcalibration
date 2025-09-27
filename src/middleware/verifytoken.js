const path = require('path');
const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY;

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies['access_token'];
  const refreshToken = req.cookies['refresh_token'];

  if (!accessToken) {
    return res.status(401).render("401", { message: "Unauthorized Access" });
  }

  jwt.verify(accessToken, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError' && refreshToken) {
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
          if (err) return res.status(403).render("403", { message: "Forbidden Access" });

          var userObj = {
            tu_id: user.tu_id,
            tu_name: user.tu_name,
            tu_middle_name: user.tu_middle_name,
            tu_last_name: user.tu_last_name,
            tu_email: user.tu_email,
            tu_mobile: user.tu_mobile,
            tu_is_active: user.tu_is_active,
            role_id: user.role_id,
            role_name: user.role_name
          };

          const newAccessToken = jwt.sign(userObj, ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRY,
          });

          res.cookie('access_token', newAccessToken, { httpOnly: true, secure: true });

          req.user = user;
          next();
        });
      } else {
        return res.status(403).render("403", { message: "Forbidden Access" });
      }
    } else {
      req.user = user;
      next();
    }
  });
};

module.exports = authenticateToken;