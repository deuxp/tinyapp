
/** TODO:
 * 
*/
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const crypto = require("crypto"); // random strings
const app = express(); // instance of express class -> returns your application framework
const PORT = 8080;

const URL_DATABASE = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

const generateRandomString = () => {
  return crypto.randomBytes(3).toString('hex');
};

const emailChecker = email => {
  if (email) {
    for (const user in users) {
      if (Object.hasOwnProperty.call(users, user)) {
        const existing = users[user].email;
        if (email === existing) {
          return true
        }
      }
    }
  }
  return false
}

app.set('view engine', 'ejs');

// Must be before all routes: parses the form buffer
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));

// URLs index page
// ====================================================
app.get('/urls', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path
  const templateVars = {
    urls: URL_DATABASE,
    // username: req.cookies.username
    user: users,
    id: req.cookies.userID
  };
  // views, pass variables
  res.render('urls_index', templateVars);
});

// new URL shortener Form:
// ====================================================
app.get('/urls/new', (req, res) => {
  const templateVars = {
    // username: req.cookies.username
    user: users,
    id: req.cookies.userID
  };
  res.render('urls_new', templateVars);
});

// FIXME: the urls conditional can be more truthy
// Post Route <-- listening for a post req to /urls -- from urls_new.ejs
// ====================================================
app.post('/urls', (req, res) => {
  const serial = generateRandomString();
  const postInput = `http://${req.body.longURL}`;
  const urlsList = Object.values(URL_DATABASE);

  // Update database
  if (!urlsList.includes(postInput)) {
    URL_DATABASE[serial] = postInput;
  }
  res.redirect(`/urls/${serial}`);
});

// register Handler
app.get('/register', (req, res) => {
  const templateVars = {
    // username: req.cookies.username
    user: users,
    id: req.cookies.userID
  };
  res.render('register', templateVars)

})


 
app.post('/register', (req, res) => {
  console.log(users);
  
  if (!req.body.email) {
    res.status(400);
    return res.send(`you must enter a valid email`)
  }
  if (!req.body.password) {
    res.status(400);
    return res.send(`you must enter a valid password`)
  }
  if (emailChecker(req.body.email)) {
    res.status(400);
    return res.send(`User already exists`)
  }

  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  console.log(users);
  res.cookie('userID', userID)
  res.redirect('urls')
})


app.get('/login', (req,res) => {
  const templateVars = {
    user: users,
    id: req.cookies.userID
  };
  res.render('login', templateVars)
})


// !!! DEPRICATED
// Login handler: no passwd WIll be changed
app.post('/login', (req,res) => {
  // res.cookie('username', req.body.username);
  res.redirect('urls');
});


app.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('urls');
});


// DELETE POST
app.post('/urls/:shortURL/delete', (req, res) => {
  delete URL_DATABASE[req.params.shortURL];
  res.redirect('/urls');
});


// Update an existing short url with a new long url
app.post('/urls/:id/edit', (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.newLongURL;
  if (URL_DATABASE[shortURL]) {
    URL_DATABASE[shortURL] = newLongURL;
  }
  res.redirect(`/urls/${shortURL}`);
});


// FIXME: needs to handle unknown shortURL
// Redirect to longURL - shortened for internal purposes -> out in the wild
// ====================================================
app.get('/u/:shortURL', (req, res) => {
  const longURL = URL_DATABASE[req.params.shortURL];

  res.redirect(longURL); // used on the show page.. hyperlink
});


// Route Param :shortURL <-- setting the param | SHOWs the current tinyURL from the param gievn by browser
// ====================================================
app.get('/urls/:shortURL', (req, res) => {
  const urls = Object.keys(URL_DATABASE);
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: URL_DATABASE[req.params.shortURL],
    username: req.cookies.username
  };
  if (!urls.includes(templateVars.shortURL)) {
    return res.redirect('/urls');
  }
  res.render('urls_show', templateVars);
});


// API route handler -> JSON res
// ====================================================
app.get('/urls.json', (req, res) => {
  res.json(URL_DATABASE); // sends our existing object as a json file format // which can then be parsed by the client
});


// get the server listening as soon as possible
// ====================================================
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});
