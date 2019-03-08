const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');  // or bcryptjs?

//const Staff = require('../../models/staff'); ?

const SALT_ROUNDS = 10;

exports.logout = async (req, res) => {
  await req.session.destroy();
  res.end();  // ??? redirect?
};

exports.login = async (req, res) => {
  const { staffname, password } = req.body;
  // TO DO: VALIDATE THOSE TWO ^
  const staff = await Staff.findOne({staffname});
  if (staff) {
    const isCorrectPassword = await bcrypt.compare(password, staff.password);
    if (isCorrectPassword) {
      req.session.staffId = staff.id;
      return res.redirect('/staff/dashboard');
    }
  }
  res.redirect('/401');
};

exports.register = async (req, res) => {
  const { staffname, password } = req.body;
  // TO DO: VALIDATE THOSE TWO ^
  // TO DO: CHECK IF STAFFNAME ALREADY EXISTS IN MYSQL DB
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const staff = new Staff({staffname, password: encryptedPassword});
  await staff.save();
  res.redirect('/staff/login');
};