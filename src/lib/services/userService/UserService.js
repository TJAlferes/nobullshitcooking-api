/*
const bcrypt = require("bcrypt");
const StatusError = require("../../utils/StatusError");

const SALT_ROUNDS = 10;

class UserService {
  constructor(UserModel) {  // ?
    this.UserModel = UserModel;  // ?
    this.getUserByEmail = this.getUserByEmail.bind(this);
    this.createUser = this.createUser.bind(this);
    this.registerUser = this.registerUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.login = this.login.bind(this);
  }

  createUser(email, password) {
    return new this.UserModel({ email, password }).save();  // you'll need to write SQL
  }

  getUser(userId) {
    return this.UserModel.findById(userId);  // you'll need to write SQL
  }

  getUserByEmail(email) {
    return this.UserModel.findOne({ email });  // you'll need to write SQL
  }

  async listUsers(offset = 0, limit = 0, fields = []) {
    const user = await this.UserModel.find({deleted: false}, null, {skip: offset, limit});  // you'll need to write SQL
    if (fields.length < 1) return users;
    return Array.from(users).map(user => this._extractFields(user, fields));  // ... what..?
  }

  async updateUser(userId, username) {
    const user = await this.UserModel.findById(userId);  // you'll need to write SQL
    if (username) user.username = username;
    return user.save();  // you'll need to write SQL
  }

  async deleteUser(userId) {
    const user = await this.UserModel.findById(userId);  // you'll need to write SQL
    user.deleted = true;
    return user.save();  // you'll need to write SQL
  }

  async registerUser(username, password) {
    const emailToSave = username + "@fmail.se";
    const maybeUser = await this.getUserByEmail(emailToSave);
    if (maybeUser) throw new StatusError("There is already a user with that email", 400);
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return this.createUser(emailToSave, hash);
  }

  async login(email, password) {
    const maybeUser = await this.getUserByEmail(email);
    if (!maybeUser) throw new StatusError("Invalid username or password", 401);
    const passwordMatch = await bcrypt.compare(password, maybeUser.password);
    if (!passwordMatch) throw new StatusError("Invalid username or password", 401);
    return maybeUser;
  }

  _extractFields(user, fields) {  // ... what..?
    if (fields.length < 1) return user;
    const result = fields.reduce((acc, field) => {
      acc[field] = user[field];
      return acc;
    });
    return result;
  }
}

module.exports = UserService;
*/