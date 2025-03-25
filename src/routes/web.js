const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {
    title: "Voting App",
    message: "Selamat datang di Voting App!",
  });
});

router.get("/login", (req, res) => {
  res.render("login", { error: null });
});


router.get("/register", (req, res) => {
  res.render("register", { error: null });
});

module.exports = router;
