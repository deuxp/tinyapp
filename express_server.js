const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const {
  myShortUrls,
  myLongUrls,
  myDatabase,
  shortFromLong,
  getUserByEmail,
  generateRandomString
} = require('./helpers');
const app = express();
const PORT = 8080;
const urlDatabase = {};
const users = {};

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['amethyst', 'key2']
}));


// --------------------------------------------------
//                 ROUTE HANDLERS
// --------------------------------------------------

// Main page:
app.get('/urls', (req, res) => {
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


// GET URL shortener Form:
app.get('/urls/new', (req, res) => {
  const { userID } = req.session;
  const templateVars = { users, userID };

  if (userID) return res.render('urls_new', templateVars);
  res.redirect('/login');
});


// POST NEW URL to database:
app.post('/urls', (req, res) => {
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


// GET /register
app.get('/register', (req, res) => {
  const { userID } = req.session;
  const templateVars = { users, userID };
  res.render('register', templateVars);
});


app.post('/register', (req, res) => {
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
  const hashPasswd = bcrypt.hashSync(password, 10);
  
  users[userID] = {
    userID,
    email,
    password: hashPasswd
  };
  req.session.userID = userID; // sets cookie
  res.redirect('urls');
});


app.get('/login', (req,res) => {
  const { userID } = req.session;
  const templateVars = {
    users,
    userID
  };
  res.render('login', templateVars);
});


app.post('/login', (req,res) => {
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
    return res.redirect('urls');
  }
  res.status(403).send('password not correct');
});


// CLEAR COOKIE
app.post('/logout', (req, res) => {
  req.session.userID = null;
  res.redirect('urls');
});


// DELETE POST
app.post('/urls/:shortURL/delete', (req, res) => {
  const { userID } = req.session;
  const { shortURL } = req.params;

  const userUrls = myShortUrls(urlDatabase, userID);
  
  // personal database key list
  if (userUrls.includes(shortURL)) {
    delete urlDatabase[shortURL];
  }
  res.redirect('/urls');
});


// EDIT POST
app.post('/urls/:shortURL/edit', (req, res) => {
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


// REDIRECT to queried website
app.get('/u/:shortURL', (req, res) => {
  const { longURL } = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get('/urls/:shortURL', (req, res) => {
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


app.listen(PORT, () => {
  console.log(`Tiny App listening on port: ${PORT}`);
});
