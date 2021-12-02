const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt'); // password hash
const crypto = require("crypto"); // random strings
const cookieSession = require('cookie-session')
const app = express();
const PORT = 8080;

const URL_DATABASE = {};
const users = {};


const generateRandomString = () => {
  return crypto.randomBytes(3).toString('hex');
};

// Returns user ID or undefined
const emailChecker = email => {
  if (email) {
    for (const user in users) {
      if (Object.hasOwnProperty.call(users, user)) {
        const existing = users[user].email;
        if (email === existing) {
          return user
        }
      }
    }
  }
};

// Returns a prime list of every long url stored in the database
const urlsList = obj => {
  let list = []
  for (const short in obj) {
    if (Object.hasOwnProperty.call(obj, short)) {
      const long = obj[short].longURL;
      list.push(long)
    }
  }
  return list
}

// Returns a list of shorURLs or [keys] that match the user `id` param
const urlsForUserID = (obj, id) => {
  let list = []
  for (const short in obj) {
    if (Object.hasOwnProperty.call(obj, short)) {
      const ownedBy = obj[short].userID;
      const owner = id;

      if (ownedBy === owner) {
        list.push(short)
      }
    }
  }
  return list
};


app.set('view engine', 'ejs');

// Must be before all routes: parses the buffer from req.body
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(morgan('dev'));


// URLs index page
// ====================================================
app.get('/urls', (req, res) => {
  const displayDatabase = {};
  const templateVars = {
    urls: displayDatabase,
    user: users,
    id: req.session.userID
  };
  const myUrls = urlsForUserID(URL_DATABASE, templateVars.id)
  const userList = Object.keys(users);
  
  myUrls.forEach(url => {
    displayDatabase[url] = URL_DATABASE[url]
  });

  if (userList.includes(templateVars.id)) return res.render('urls_index', templateVars);
  res.redirect('/login')
});


// GET URL shortener Form:
// ====================================================
app.get('/urls/new', (req, res) => {
  const templateVars = {
    user: users,
    id: req.session.userID
  };
  if (templateVars.id) {
    return res.render('urls_new', templateVars);
  }
  res.redirect('/login');
});


// POST NEW URL to database
// ====================================================
app.post('/urls', (req, res) => {
  const serial = generateRandomString();
  const postInput = `http://${req.body.longURL}`;
  const urList = urlsList(URL_DATABASE);

  // Update database
  if (!urList.includes(postInput)) {
    URL_DATABASE[serial] = {
      longURL: postInput,
      userID: req.session.userID
    }
  }
  res.redirect(`/urls/${serial}`);
});


// GET /register
app.get('/register', (req, res) => {
  const templateVars = {
    user: users,
    id: req.session.userID
  };
  res.render('register', templateVars)

})


// ====================================================
app.post('/register', (req, res) => {
  
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
  const hashPasswd = bcrypt.hashSync(req.body.password, 10);
  
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: hashPasswd
  }
  req.session.userID = userID;
  res.redirect('urls')
})


app.get('/login', (req,res) => {
  const templateVars = {
    user: users,
    id: req.session.userID
  };
  res.render('login', templateVars)
})


app.post('/login', (req,res) => {
  const emailInput = req.body.email
  const passwd = req.body.password
  const id = emailChecker(emailInput)
  
  // email not found 
  if (!id) {
    return res.status(403).send('email not found')
  }
  // email found, but password not verified
  const verified = bcrypt.compareSync(passwd, users[id].password);

  if (verified) {
    req.session.userID = id;
    return res.redirect('urls');
  }
  res.status(403).send('password not correct')
});


// CLEAR COOKIE
app.post('/logout', (req, res) => {
  req.session.userID = null;
  res.redirect('urls');
});


// DELETE POST
app.post('/urls/:shortURL/delete', (req, res) => {
  const id = req.session.userID;
  const url = req.params.shortURL;

  // personal database key list
  const myUrls = urlsForUserID(URL_DATABASE, id);

  if (myUrls.includes(url)) {
    delete URL_DATABASE[url];
  }
  res.redirect('/urls');
});


// EDIT POST
app.post('/urls/:id/edit', (req, res) => {
  const user = req.session.userID;
  const shortURL = req.params.id;
  const newLongURL = req.body.newLongURL;
  const myUrls = urlsForUserID(URL_DATABASE, user); // personal database keys

  if (myUrls.includes(shortURL)) {
    URL_DATABASE[shortURL].longURL = newLongURL;
    return res.redirect(`/urls/${shortURL}`);
  }
  res.redirect('/urls');
});


// REDIRECT for show page
// ====================================================
app.get('/u/:shortURL', (req, res) => {
  const longURL = URL_DATABASE[req.params.shortURL].longURL;

  res.redirect(longURL); // used on the show page.. hyperlink
});


// ====================================================
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    shortURL: req.params.shortURL,
    longUrl: URL_DATABASE[req.params.shortURL].longURL,
    user: users,
    id: req.session.userID
  };
  const myUrls = urlsForUserID(URL_DATABASE, templateVars.id)

  if (!myUrls.includes(templateVars.shortURL)) {
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
  console.log(`Tiny App listening on port: ${PORT}`);
});
