const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

const SECRET_KEY = "super_secret_key";

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) return res.status(400).json({ error: "Username sudah dipakai" });

    const newUser = await User.create({ username, password });
    res.json({ message: "User berhasil dibuat", user: newUser.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(400).json({ error: "Username atau password salah" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Username atau password salah" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.json({ message: "Logout berhasil" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};