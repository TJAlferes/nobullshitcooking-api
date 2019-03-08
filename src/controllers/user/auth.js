const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');  // or bcryptjs?

//const User = require('../../models/user'); ?

const SALT_ROUNDS = 10;

exports.logout = async (req, res) => {
  await req.session.destroy();
  res.end();  // ??? redirect?
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  // TO DO: VALIDATE THOSE TWO ^
  const user = await User.findOne({username});
  if (user) {
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (isCorrectPassword) {
      req.session.userId = user.id;
      return res.redirect('/user/dashboard');
    }
  }
  res.redirect('/401');
};

exports.register = async (req, res) => {
  const { username, password } = req.body;
  // TO DO: VALIDATE THOSE TWO ^
  // TO DO: CHECK IF USERNAME ALREADY EXISTS IN MYSQL DB
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = new User({username, password: encryptedPassword});
  await user.save();
  res.redirect('/user/login');
};