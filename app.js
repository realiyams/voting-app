const express = require("express");
const sequelize = require("./config/database");

const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./src/routes/web");
const authRoutes = require("./src/routes/auth");
const protectedRoutes = require("./src/routes/protected");

// const Vote = require("../models/Vote");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use("/", routes);
app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.get("/test-db", async (req, res) => {
  try {
    await sequelize.sync(); 
    res.json({ message: "Database connected & synced!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

sequelize.sync().then(() => console.log("Database ready!"));

module.exports = app;
