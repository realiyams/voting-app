const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const SECRET_KEY = "super_secret_key";

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      req.session.message = { type: "danger", text: "Username sudah dipakai" };
      return res.redirect("/register");
    }

    const newUser = await User.create({ username, password: password });

    req.session.message = {
      type: "success",
      text: "User berhasil dibuat, silakan login!",
    };
    res.redirect("/login");
  } catch (error) {
    req.session.message = {
      type: "danger",
      text: "Terjadi kesalahan, coba lagi!",
    };
    res.redirect("/register");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      req.session.message = {
        type: "danger",
        text: "Username atau password salah",
      };
      return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.message = {
        type: "danger",
        text: "Username atau password salah",
      };
      return res.redirect("/login");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    req.session.user = { id: user.id, username: user.username };
    req.session.message = { type: "success", text: "Login berhasil!" };
    res.redirect("/");
  } catch (error) {
    req.session.message = {
      type: "danger",
      text: "Terjadi kesalahan, coba lagi!",
    };
    res.redirect("/login");
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    req.session.message = { type: "danger", text: "Gagal logout" };
    res.redirect("/");
  }
};
