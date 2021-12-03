const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../helpers');

const loginRouter = users => {
  
  router.get('/', (req,res) => {
    const { userID } = req.session;
    const templateVars = { users, userID };
    res.render('login', templateVars);
  });

  router.post('/', (req,res) => {
    const { email, password } = req.body;
    const userID = getUserByEmail(users, email);
    
    // if email not found
    if (!userID) {
      return res.status(403).send('Please Register');
    }
    // Password Check
    const verified = bcrypt.compareSync(password, users[userID].password);
    if (verified) {
      req.session.userID = userID;
      return res.redirect('/urls');
    }
    res.status(403).send('password not correct');
  });

  // CLEAR COOKIE
  router.post('/logout', (req, res) => {
    req.session.userID = null;
    res.redirect('/urls');
  });
  
  return router;
};


module.exports = loginRouter;