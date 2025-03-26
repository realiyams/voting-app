const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Poll = require("./Poll");

const Option = sequelize.define("Option", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pollId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Poll,
      key: "id",
    },
  },
});

module.exports = Option;
