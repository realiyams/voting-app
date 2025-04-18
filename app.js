const express = require("express");
const session = require("express-session");
const engine = require("ejs-locals");

const sequelize = require("./config/database");
const { initModels } = require("./models");

const cors = require("cors");
const path = require("path");
require("dotenv").config();

const routes = require("./src/routes/web");
const authRoutes = require("./src/routes/auth");
// const protectedRoutes = require("./src/routes/protected");

const app = express();

app.use(
  session({
    secret: "super_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use((req, res, next) => {
  res.locals.session = req.session;
  if (req.session.message) {
    delete req.session.message;
  }
  next();
});

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("ejs", engine);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/auth", authRoutes);
// app.use("/protected", protectedRoutes);

app.get("/test-db", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ message: "Database connected!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

initModels();

module.exports = app;
