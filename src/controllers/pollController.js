const Poll = require("../../models/Poll");
const Option = require("../../models/Option");
const Vote = require("../../models/Vote");
const User = require("../../models/User")

exports.getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.findAll({
      include: [
        {
          model: Option,
          include: [
            {
              model: Vote,
              attributes: ['id']
            }
          ]
        },
        {
          model: User,
          attributes: ["username"]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [Option, 'id', 'ASC']
      ]
    });

    polls.forEach(poll => {
      poll.Options.forEach(option => {
        option.dataValues.voteCount = option.Votes.length;
      });
    });

    const message = req.session.message;
    req.session.message = null;

    res.render("index", { title: "Halaman Utama", message, polls });
  } catch (error) {
    console.error(error);
    res.status(500).send("Terjadi kesalahan saat mengambil polling.");
  }
};

exports.createPoll = async (req, res) => {
  try {
    const { title, options } = req.body;

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

exports.myPoll = async (req, res) => {
  try {
    const userId = req.session.user.id;

    const polls = await Poll.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: Option,
          include: [
            {
              model: Vote,
              attributes: ['id'],
            }
          ]
        }
      ],
      order: [
        ['createdAt', 'DESC'],
        [Option, 'id', 'ASC']
      ]
    });

    polls.forEach(poll => {
      poll.Options.forEach(option => {
        option.dataValues.voteCount = option.Votes.length;
      });
    });

    res.render("myPoll", { title: "Polling Saya", polls });
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal mengambil polling Anda." };
    res.redirect("/");
  }
};

exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;

    const poll = await Poll.findOne({
      where: { id: pollId },
      include: [
        {
          model: Option,
          include: [{ model: Vote }]
        }
      ],
      order: [[Option, 'id', 'ASC']]
    });

    if (!poll) {
      req.session.message = { type: "danger", text: "Polling tidak ditemukan." };
      return res.redirect("/");
    }

    poll.Options.forEach(option => {
      option.dataValues.voteCount = option.Votes.length;
    });

    res.render("pollDetail", { title: poll.title, poll });
  } catch (error) {
    console.error(error);
    req.session.message = { type: "danger", text: "Gagal mengambil polling." };
    res.redirect("/");
  }
};

exports.deletePoll = async (req, res) => {
  const pollId = req.params.id;

  try {
    await Option.destroy({ where: { pollId } });

    await Poll.destroy({ where: { id: pollId } });

    req.session.message = {
      type: 'success',
      text: 'Polling berhasil dihapus.'
    };

    res.redirect('/mypolls');
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: 'danger',
      text: 'Gagal menghapus polling.'
    };

    res.redirect('/mypolls');
  }
};

