const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const { createPoll, myPoll, getPollById, deletePoll } = require("../controllers/pollController");
const Poll = require("../../models/Poll");
const Option = require("../../models/Option");
const User = require("../../models/User")

router.get("/", async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        { model: Option },
        { model: User, attributes: ["username"] } // Ambil hanya username dari User
      ]
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

router.get("/myPolls", authMiddleware, myPoll);

router.get("/poll/:id", getPollById);

router.post('/poll/:id/delete', authMiddleware, deletePoll);

module.exports = router;
