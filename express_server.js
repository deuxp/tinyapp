const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const loginRouter = require('./routers/loginRouter')
const urlRouter = require('./routers/urlRouter')
const registerRouter = require('./routers/registerRouter')

const port = 8080;
const app = express();
const urlDatabase = {};
const users = {};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
app.use(cookieSession({
  name: 'session',
  keys: ['amethyst', 'pineapple']
}));

////////////////////
// Route Handlers //
////////////////////

app.use('/register', registerRouter(users))
app.use('/login', loginRouter(users))
app.use('/urls', urlRouter(urlDatabase, users))

// //////////////////////////////////////
// // GET: redirect to queried website //
// //////////////////////////////////////

app.get('/u/:shortURL', (req, res) => {
  const { longURL } = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(port, () => {
  console.log(`Tiny App listening on port: ${port}`);
});
