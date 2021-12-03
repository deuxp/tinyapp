const {
  myShortUrls,
  myLongUrls,
  myDatabase,
  shortFromLong,
  getUserByEmail,
  generateRandomString
} = require('../helpers');
const { assert, expect } = require("chai");

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
// --------------------------------------------------


describe('#myShortUrls', () => {
  it('returns []', () => {

  });
});