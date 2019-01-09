const UserModel = require("./userService/UserModel");
const UserService = require("./userService/UserService");

const userService = new UserService(UserModel);

module.exports = {
  userService
};