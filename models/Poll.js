const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const Poll = sequelize.define("Poll", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
});

module.exports = Poll;
