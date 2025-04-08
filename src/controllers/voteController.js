const Vote = require("../../models/Vote");
const Option = require("../../models/Option");
const Poll = require("../../models/Poll");

exports.castVote = async (req, res) => {
  try {
    const { pollId, optionId } = req.body;
    const userId = req.session.user ? req.session.user.id : null;
    const sessionId = req.session.id; // Gunakan session ID untuk vote anonim

    // Cek apakah polling & opsi valid
    const option = await Option.findOne({
      where: { id: optionId, pollId },
    });

    if (!option) {
      req.session.message = { type: "danger", text: "Pilihan tidak valid." };
      return res.redirect(`/poll/${pollId}`);
    }

    // Cek apakah user/session sudah memilih opsi dalam polling ini
    const existingVote = await Vote.findOne({
      where: userId
        ? { userId, optionId }
        : { sessionId, optionId }, // Cek berdasarkan user ID atau session ID
    });

    if (existingVote) {
      req.session.message = { type: "danger", text: "Anda sudah memberikan suara!" };
      return res.redirect(`/poll/${pollId}`);
    }

    // Simpan vote
    await Vote.create({ userId, sessionId, optionId });

    req.session.message = { type: "success", text: "Vote berhasil dikirim!" };
    res.redirect(`/poll/${pollId}`);
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal melakukan vote." };
    res.redirect("/");
  }
};

// 🔹 Menampilkan hasil vote untuk sebuah polling
exports.getPollResults = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await Poll.findOne({
      where: { id: pollId },
      include: [{ model: Option, include: [Vote] }],
    });

    if (!poll) {
      req.session.message = { type: "danger", text: "Polling tidak ditemukan." };
      return res.redirect("/");
    }

    res.render("pollResults", { title: `Hasil Polling: ${poll.title}`, poll });
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal mengambil hasil polling." };
    res.redirect("/");
  }
};
