const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const message = req.session.message;
  req.session.message = null; // Hapus setelah ditampilkan
  res.render("index", { title: "Halaman Utama", message });
});

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});


router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

module.exports = router;
