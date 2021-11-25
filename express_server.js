
/** TODO:
 * [] handle unknown short url requests
 *
*/
const express = require('express');
const morgan = require('morgan');
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
app.use(morgan('dev'));

// URLs index page
// ====================================================
app.get('/urls', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path
  const templateVars = {
    urls: URL_DATABASE
  };
  // views, pass variables
  res.render('urls_index', templateVars);
});

// new URL shortener Form:
// ====================================================
app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

// FIXME: the urls conditional can be more truthy
// Post Route <-- listening for a post req to /urls
// ====================================================
app.post('/urls', (req, res) => {
  const serial = generateRandomString();
  const postInput = `http://${req.body.longURL}`;
  const urlsList = Object.values(URL_DATABASE);
  
  // checks if URL is already in database & update
  if (!urlsList.includes(postInput)) {
    URL_DATABASE[serial] = postInput;
  }
  
  // redirect to /urls/:shortURL
  res.redirect(`/urls/${serial}`);
});


// DELETE POST
app.post('/urls/:shortURL/delete', (req, res) => {

  delete URL_DATABASE[req.params.shortURL];
  res.redirect('/urls');
  
});


// FIXME: needs to handle unknown shortURL
// Redirect to longURL - shortened for internal purposes -> out in the wild
// ====================================================
app.get('/u/:shortURL', (req, res) => {
  const longURL = URL_DATABASE[req.params.shortURL];

  res.redirect(longURL);
});

// Route Param :shortURL <-- setting the param | SHOWs the current tinyURL from the param gievn by browser
// ====================================================
app.get('/urls/:shortURL', (req, res) => {
    const urls = Object.keys(URL_DATABASE)
    const templateVars = {
      shortURL: req.params.shortURL,
      longURL: URL_DATABASE[req.params.shortURL],
    };
    if (!urls.includes(templateVars.shortURL)){
      return res.redirect('/urls')
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
