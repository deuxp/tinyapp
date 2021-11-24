const express = require('express');
const app = express(); // instance of express class -> returns your application framework
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

// URLs index page
app.get('/urls', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path

  
  // views, pass variables
  res.render('urls_index', {
    urls: urlDatabase
  });
});

//about page
// app.get('/about', (req, res) => {
//   res.render("pages/about"); // views
// });

// API route handler -> JSON res
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); // sends our existing object as a json file format // which can then be parsed by the client
});



// get the server listening as soon as possible
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});

// ====================================================
