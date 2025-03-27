const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const { createPoll } = require("../controllers/pollController");
const Poll = require("../../models/Poll");
const Option = require("../../models/Option");

router.get("/", async (req, res) => {
  try {
    // Ambil semua polling beserta opsi-opsinya
    const polls = await Poll.findAll({
      include: Option, // Menghubungkan polling dengan opsi
    });

    const message = req.session.message;
    req.session.message = null;
    res.render("index", { title: "Halaman Utama", message, polls });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil polling.");
  }
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login", error: null, message: null });
});

router.get("/register", (req, res) => {
  res.render("register", { title: "Register", error: null, message: null });
});

router.get("/new_poll", authMiddleware, (req, res) => {
  res.render("newPoll", { title: "New Poll", error: null, message: null });
});

router.post("/new_poll", authMiddleware, createPoll);

module.exports = router;
