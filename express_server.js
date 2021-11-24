const express = require('express')
const app = express(); // instance of express class -> returns your application framework
const PORT = 8000

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get('/', (req, res) => { // handle the response from the callback from the get method of the app obj // first arg is the page requested -> url/PATH -> '/' is the root of path
  res.send('<h1>Hey Folks</h1>')
})

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase) // sends our existing object as a json file format // which can then be parsed by the client
})

app.get('/hello', (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n") // $ curl -i // will show the whold thing + the header information
})

app.listen(PORT, () => {
  console.log(`Example app listening on port: ${PORT}`);
})

