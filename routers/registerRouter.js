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
      return res.status(400).send(`<h1>Status ${res.statusCode}: you must enter a valid email<h1>`);
    }
    if (!password) {
      return res.status(400).send(`<h1>Status ${res.statusCode}: you must enter a valid password<h1>`);
    }
    if (getUserByEmail(users, email)) {
      return res.status(400).send(`<h1>Status ${res.statusCode}: User already exists<h1>`);
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

  return router;
};


module.exports = registerRouter;