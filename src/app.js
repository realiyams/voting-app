const express = require("express");
const sequelize = require("../config/database");

const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./routes/web");
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");

// const Vote = require("../models/Vote");

const app = express();

app.use(cors());
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

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
