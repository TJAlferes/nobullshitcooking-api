const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');  // or bcryptjs?

const User = require('../../models/user');
const isLoggedIn = require('../../lib/utils/isLoggedIn');

const SALT_ROUNDS = 10;

app.post(
  '/login',
  (req, res) => {
    const { username, password } = req.body;
    // TO DO: VALIDATE THOSE TWO ^
    const user = await User.findOne({username});
    if (user) {
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (isCorrectPassword) {
        req.session.userId = user.id;
        return res.redirect('/welcome');  // /dashboard /user/dashboard
      }
    }
    res.redirect('/401');
  }
);

app.post(
  '/register',
  async (req, res) => {
    const { username, password } = req.body;
    // TO DO: VALIDATE THOSE TWO ^
    // TO DO: CHECK IF USERNAME ALREADY EXISTS IN MYSQL DB
    const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = new User({username, password: encryptedPassword});
    await user.save();
    res.redirect('/login');  // /auth/login? /user/login?
  }
);

module.exports;