const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secret_key";

// SESSION BASED
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.session.message = { type: "danger", text: "You must be logged in first!" };
    return res.redirect("/login");
  }
  next();
};

// JWT BASED
// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ error: "Access denied, token not provided" });

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).json({ error: "Invalid token" });
//   }
// };

module.exports = authMiddleware;
