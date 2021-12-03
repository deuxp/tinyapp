const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { getUserByEmail, generateRandomString } = require('../helpers');

const registerRouter = users => {

  router.get('/', (req, res) => {
    const { userID } = req.session;
    const templateVars = { users, userID };
    res.render('register', templateVars);
  });

  router.post('/', (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      res.status(400);
      return res.send(`you must enter a valid email`);
    }
    if (!password) {
      res.status(400);
      return res.send(`you must enter a valid password`);
    }
    if (getUserByEmail(users, email)) {
      res.status(400);
      return res.send(`User already exists`);
    }
    const userID = generateRandomString();
    const hashPasswd = bcrypt.hashSync(password, saltRounds);
    
    users[userID] = {
      userID,
      email,
      password: hashPasswd
    };
    req.session.userID = userID; // sets cookie
    res.redirect('/urls');
  });

  return router
};


module.exports = registerRouter;