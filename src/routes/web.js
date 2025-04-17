const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

const {
  getAllPolls,
  createPoll,
  myPoll,
  getPollById,
  deletePoll,
} = require("../controllers/pollController");
const { castVote } = require("../controllers/voteController");

router.get("/", getAllPolls);
router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});
router.get("/register", (req, res) => {
  res.render("register", { title: "Register" });
});
router.get("/new_poll", authMiddleware, (req, res) => {
  res.render("newPoll", { title: "New Poll" });
});
router.post("/new_poll", authMiddleware, createPoll);
router.get("/myPolls", authMiddleware, myPoll);
router.get("/poll/:id", getPollById);
router.post("/poll/:id/delete", authMiddleware, deletePoll);
router.post("/vote", castVote);

module.exports = router;
