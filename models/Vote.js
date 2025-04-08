const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Option = require("./Option");

const Vote = sequelize.define("Vote", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true, // Bisa null untuk vote anonim
    references: {
      model: User,
      key: "id",
    },
  },
  sessionId: {
    type: DataTypes.STRING, // Simpan ID sesi untuk vote anonim
    allowNull: true,
  },
  optionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Option,
      key: "id",
    },
  },
});

module.exports = Vote;
