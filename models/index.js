const sequelize = require('../config/database')
const User = require("./User");
const Poll = require("./Poll");
const Option = require("./Option");
const Vote = require("./Vote");

User.hasMany(Poll, { foreignKey: "createdBy" });
Poll.belongsTo(User, { foreignKey: "createdBy" });

Poll.hasMany(Option, { foreignKey: "pollId" });
Option.belongsTo(Poll, { foreignKey: "pollId" });

Option.hasMany(Vote, { foreignKey: "optionId" });
Vote.belongsTo(Option, { foreignKey: "optionId" });

User.hasMany(Vote, { foreignKey: "userId" });
Vote.belongsTo(User, { foreignKey: "userId" });

const initModels = async () => {
  await sequelize.sync();
  console.log("Database synced with all models!");
};

module.exports = { sequelize, initModels, User, Poll, Option, Vote };
