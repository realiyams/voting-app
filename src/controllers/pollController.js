const Poll = require("../../models/Poll");
const Option = require("../../models/Option");

exports.createPoll = async (req, res) => {
  try {
    const { title, options } = req.body;

    // Validasi input
    if (!title || !options) {
      req.session.message = { type: "danger", text: "Semua field harus diisi!" };
      console.log("Semua field harus diisi!");
      return res.redirect("/new_poll");
    }

    const optionsArray = options.split(",").map(option => option.trim());

    if (optionsArray.length < 2) {
      req.session.message = { type: "danger", text: "Minimal harus ada 2 pilihan!" };
      console.log("Minimal harus ada 2 pilihan!");
      return res.redirect("/new_poll");
    }

    const poll = await Poll.create({
      title,
      createdBy: req.session.user.id, 
    });

    const optionPromises = optionsArray.map(text => Option.create({ text, pollId: poll.id }));
    await Promise.all(optionPromises);

    req.session.message = { type: "success", text: "Polling berhasil dibuat!" };
    console.log("Polling berhasil dibuat!");
    res.redirect("/");
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal membuat polling." };
    res.redirect("/new_poll");
  }
};

// 🔹 Menampilkan polling yang dibuat oleh user yang sedang login
exports.myPoll = async (req, res) => {
  try {
    const userId = req.session.user.id; // Mengambil ID user dari session

    const polls = await Poll.findAll({
      where: { createdBy: userId },
      include: [{ model: Option }],
    });

    res.render("myPoll", { title: "Polling Saya", polls });
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal mengambil polling Anda." };
    res.redirect("/");
  }
};

// 🔹 Menampilkan polling berdasarkan ID
exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await Poll.findOne({
      where: { id: pollId },
      include: [{ model: Option }],
    });

    if (!poll) {
      req.session.message = { type: "danger", text: "Polling tidak ditemukan." };
      return res.redirect("/");
    }

    res.render("pollDetail", { title: poll.title, poll });
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal mengambil polling." };
    res.redirect("/");
  }
};
