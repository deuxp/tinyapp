
/** TODO:
 * [] handle unknown short url requests
 *
*/
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const crypto = require("crypto"); // random strings
const app = express(); // instance of express class -> returns your application framework
const PORT = 8080;

const URL_DATABASE = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const generateRandomString = () => {
  return crypto.randomBytes(3).toString('hex');
};

app.set('view engine', 'ejs');

// Must be before all routes: parses the form buffer
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.use(morgan('dev'));

// URLs index page
// ====================================================
app.get('/urls', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path
  const templateVars = {
    urls: URL_DATABASE,
    username: req.cookies.username
  };
  // views, pass variables
  res.render('urls_index', templateVars);
});

// new URL shortener Form:
// ====================================================
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies.username
  }
  res.render('urls_new');
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


// Login handler: no passwd
app.post('/login', (req,res) => {
  res.cookie('username', req.body.username)
  res.redirect('urls')
})


app.post('/logout', (req, res) => {
  res.clearCookie('username')
  res.redirect('urls')
})



// DELETE POST
app.post('/urls/:shortURL/delete', (req, res) => {
  
  delete URL_DATABASE[req.params.shortURL];
  res.redirect('/urls');
  
});



// EDIT
app.post('/urls/:id/edit', (req, res) => {
  const shortURL = req.params.id;
  const newLongURL = req.body.newLongURL;
  
  // [] ---> implment the logic, update longURL witth the key id
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
