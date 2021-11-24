const express = require('express');
const app = express(); // instance of express class -> returns your application framework
const PORT = 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set('view engine', 'ejs');

// Index page
app.get('/', (req, res) => { // handles the response with a callback of the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path

  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birthYear: 2012},
    { name: 'Tux', organization: "Linux", birthYear: 1996},
    { name: 'Moby Dock', organization: "Docker", birthYear: 2013}
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";

  // views, pass variables
  res.render('pages/index', {
    mascots: mascots,
    tagline: tagline
  });
});

//about page
app.get('/about', (req, res) => {
  res.render("pages/about"); // views
});

// API req -> JSON res
app.get('/urls.json', (req, res) => {
  res.json(urlDatabase); // sends our existing object as a json file format // which can then be parsed by the client
});



// get the server listening as soon as possible
app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
});

// ====================================================
