const express = require('express');
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
}



app.set('view engine', 'ejs');

// before all routes
app.use(bodyParser.urlencoded({extended: true}));

// URLs index page
// ====================================================
app.get('/urls', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path
  const templateVars = {
    urls: URL_DATABASE
  }
  // views, pass variables
  res.render('urls_index', templateVars);
});


// new URL shortener Form:
// ====================================================
app.get('/urls/new', (req, res) => {
  res.render('urls_new')
})


// Post Route <-- listening for a post req to /urls
// ====================================================
app.post('/urls', (req, res) => {
  console.log(req.body);
  URL_DATABASE[generateRandomString()] = `http://${req.body.longURL}`;
  res.send(`this is what you want??? ->> ${req.body.longURL}`)
  console.log(`the following is the updated database`);
  console.log(URL_DATABASE);
})




// API route handler -> JSON res
// ====================================================
app.get('/urls.json', (req, res) => {
  res.json(URL_DATABASE); // sends our existing object as a json file format // which can then be parsed by the client
});

// Route Param :shortURL <-- setting the param
// ====================================================
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: URL_DATABASE[req.params.shortURL],
  }
  res.render('urls_show', templateVars)
})

// get the server listening as soon as possible
// ====================================================
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});

