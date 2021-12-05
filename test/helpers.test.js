const {
  myShortUrls,
  myLongUrls,
  myDatabase,
  shortFromLong,
  getUserByEmail,
} = require('../helpers');
const { assert, expect, should } = require("chai");

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
// ----------------------------------------------------------------

const userUrls = {
  '16ed93': { longURL: 'http://www.wikipedia.org', userID: 'ff0f9d' },
  '4d38ba': { longURL: 'http://www.expressjs.com', userID: 'ff0f9d' },
  f3f2a9: { longURL: 'http://www.github.io', userID: 'ff0f9d' },
  kj34gd: { longURL: 'http://www.myspace.com', userID: 'ee89gd' }
};

// ----------------------------------------------------------------

describe('#getUserBy Email', () => {
  it('returns "userRandomID"', () => {
    const user = getUserByEmail(testUsers, "user2@example.com");
    assert.equal(user, "user2RandomID");
  });
  it('returns "user2RandomID"', () => {
    const user = getUserByEmail(testUsers, "user@example.com");
    assert.equal(user, "userRandomID");
  });
  it('returns "undefined"', () => {
    const user = getUserByEmail(testUsers, "user@example");
    assert.isUndefined(user);
  });
});

describe('#myShortUrls', () => {
  it('should return ["16ed93", "4d38ba", "f3f2a9"]', () => {
    const urls = myShortUrls(userUrls, 'ff0f9d');
    assert.deepEqual(urls, ["16ed93", "4d38ba", "f3f2a9"]);
  });
  it('should return ["kj34gd"]', () => {
    const urls = myShortUrls(userUrls, 'ee89gd');
    assert.deepEqual(urls, ["kj34gd"]);
  });
  it('should return ["16ed93", "4d38ba", "f3f2a9"]', () => {
    const urls = myShortUrls(userUrls, 'ff0f9d');
    assert.isArray(urls);
  });
});

describe('#myLongUrls', () => {
  it('should return ["http://www.wikipedia.org", "http://www.expressjs.com", "http://www.github.io"]', () => {
    const urls = myLongUrls(userUrls, myShortUrls, 'ff0f9d');
    assert.deepEqual(urls, ["http://www.wikipedia.org", "http://www.expressjs.com", "http://www.github.io"]);
  });
});

describe('#myDatabase', () => {
  it('should have a propery "16ed93"', () => {
    const db = myDatabase(userUrls, myShortUrls, 'ff0f9d');
    // db.should.have.property('16ed93');
    expect(db).to.have.property('16ed93');
  });
  it('should not have a propery "kj34gd"', () => {
    const db = myDatabase(userUrls, myShortUrls, 'ff0f9d');
    expect(db).to.not.have.property('kj34gd');
  });

});

describe('#shortFromLong', () => {
  it('should return "f3f2a9"', () => {
    const short = shortFromLong(userUrls, 'http://www.github.io');
    expect(short).to.equal('f3f2a9');
  });
  it('should return "kj34gd"', () => {
    const short = shortFromLong(userUrls, 'http://www.myspace.com');
    expect(short).to.equal('kj34gd');
  });
  it('should not return "4d38ba"', () => {
    const short = shortFromLong(userUrls, 'http://www.wikipedia.org');
    expect(short).to.not.equal('4d38ba');
  });

});

