const Vote = require("../../models/Vote");
const Option = require("../../models/Option");
const Poll = require("../../models/Poll");

exports.castVote = async (req, res) => {
  try {
    const { pollId, optionId, customOption } = req.body;
    const userId = req.session.user ? req.session.user.id : null;
    const sessionId = req.session.id;

    if (!pollId) {
      req.session.message = { type: "danger", text: "Polling tidak ditemukan." };
      return res.redirect("/");
    }

    let selectedOptionId;

    if (customOption && customOption.trim() !== "") {
      if (!userId) {
        req.session.message = {
          type: "danger",
          text: "Anda harus login untuk menambahkan opsi baru."
        };
        return res.redirect(`/poll/${pollId}`);
      }

      const newOption = await Option.create({
        text: customOption.trim(),
        pollId,
      });
      selectedOptionId = newOption.id;
    } else if (optionId) {
      const option = await Option.findOne({
        where: { id: optionId, pollId },
      });

      if (!option) {
        req.session.message = { type: "danger", text: "Pilihan tidak valid." };
        return res.redirect(`/poll/${pollId}`);
      }

      selectedOptionId = option.id;
    } else {
      req.session.message = { type: "danger", text: "Silakan pilih atau masukkan opsi." };
      return res.redirect(`/poll/${pollId}`);
    }

    const existingVote = await Vote.findOne({
      where: userId
        ? { userId, pollId }
        : { sessionId, pollId },
    });

    if (existingVote) {
      req.session.message = { type: "danger", text: "Anda sudah memberikan suara!" };
      return res.redirect(`/poll/${pollId}`);
    }

    await Vote.create({
      userId,
      sessionId,
      optionId: selectedOptionId,
      pollId,
    });

    req.session.message = { type: "success", text: "Vote berhasil dikirim!" };
    res.redirect(`/poll/${pollId}`);
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal melakukan vote." };
    res.redirect("/");
  }
};

// unused controller

// exports.getPollResults = async (req, res) => {
//   try {
//     const pollId = req.params.id;

//     const poll = await Poll.findOne({
//       where: { id: pollId },
//       include: [{ model: Option, include: [Vote] }],
//     });

//     if (!poll) {
//       req.session.message = { type: "danger", text: "Polling tidak ditemukan." };
//       return res.redirect("/");
//     }

//     res.render("pollResults", { title: `Hasil Polling: ${poll.title}`, poll });
//   } catch (error) {
//     console.error(error);
//     req.session.message = { type: "danger", text: "Gagal mengambil hasil polling." };
//     res.redirect("/");
//   }
// };
