const express = require('express');
const router = express.Router(); // router object called on every endpoint

const {
  myShortUrls,
  myLongUrls,
  myDatabase,
  shortFromLong,
  generateRandomString
} = require('../helpers');

const urlRouter = (urlDatabase, users) => {

  ////////////////////
  // GET: Main page //
  ////////////////////

  router.get('/', (req, res) => {
    const { userID } = req.session;
    const userUrls = myDatabase(urlDatabase, myShortUrls, userID);
    const templateVars = {
      userUrls,
      users,
      userID
    };
    console.log(templateVars);
    const userList = Object.keys(users);

    if (userList.includes(userID)) return res.render('urls_index', templateVars);
    res.redirect('/login');
  });

  //////////////////
  // GET: new URL //
  //////////////////

  router.get('/new', (req, res) => {
    const { userID } = req.session;
    const templateVars = { users, userID };

    if (userID) return res.render('urls_new', templateVars);
    res.redirect('/login');
  });

  ///////////////////
  // POST: new URL //
  ///////////////////

  router.post('/', (req, res) => {
    const { longURL } = req.body;
    const { userID } = req.session;
    const userUrls = myLongUrls(urlDatabase, myShortUrls, userID);
    
    // Update database
    if (!userUrls.includes(longURL)) {
      const serial = generateRandomString();
      urlDatabase[serial] = { longURL, userID };
      return res.redirect(`/urls/${serial}`);
    }
    // if long url exists; redirect edit page
    const shortList = myDatabase(urlDatabase, myShortUrls, userID);
    const short = shortFromLong(shortList, longURL);
    res.redirect(`/urls/${short}`);
  });

  //////////////////
  // POST: delete //
  //////////////////

  router.post('/:shortURL/delete', (req, res) => {
    const { userID } = req.session;
    const { shortURL } = req.params;

    const userUrls = myShortUrls(urlDatabase, userID);
    
    // personal database key list
    if (userUrls.includes(shortURL)) {
      delete urlDatabase[shortURL];
    }
    res.redirect('/urls');
  });

  ////////////////
  // POST: edit //
  ////////////////

  router.post('/:shortURL/edit', (req, res) => {
    const { userID } = req.session;
    const { shortURL } = req.params;
    const { newLongURL } = req.body;
    const userUrls = myShortUrls(urlDatabase, userID); // personal database keys
    if (userUrls.includes(shortURL)) {
      urlDatabase[shortURL].longURL = newLongURL;
      return res.redirect(`/urls/${shortURL}`);
    }
    res.redirect('/urls');
  });

  router.get('/:shortURL', (req, res) => {
    const { userID } = req.session;
    const { shortURL } = req.params;
    const { longURL } = urlDatabase[shortURL];
    const userUrls = myShortUrls(urlDatabase, userID);
    const templateVars = {
      shortURL,
      longURL,
      users,
      userID
    };
    if (!userUrls.includes(shortURL)) return res.redirect('/urls');
    res.render('urls_show', templateVars);
  });
  
  return router;
};


module.exports = urlRouter;