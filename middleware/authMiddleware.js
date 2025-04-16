const jwt = require("jsonwebtoken");
const SECRET_KEY = "super_secret_key";

// SESSION BASED
const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    req.session.message = { type: "danger", text: "Anda harus login terlebih dahulu!" };
    return res.redirect("/login");
  }
  next();
};

// JWT BASED
// const authMiddleware = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ error: "Akses ditolak, token tidak ada" });

//   try {
//     const decoded = jwt.verify(token.replace("Bearer ", ""), SECRET_KEY);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(400).json({ error: "Token tidak valid" });
//   }
// };

module.exports = authMiddleware;
