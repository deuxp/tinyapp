const crypto = require("crypto"); // random strings

const generateRandomString = () => {
  return crypto.randomBytes(3).toString('hex');
};


/**
 * ------------------------------------------------------------
 * @param {object} obj - the main/prime database of URLs
 * @param {string} id - userID - from session-cookie
 * @returns An Array of short URLs/keys that belong to the specified user
 * ------------------------------------------------------------
 */
const myShortUrls = (obj, id) => {
  let list = [];
  for (const short in obj) {
    if (Object.hasOwnProperty.call(obj, short)) {
      const ownedBy = obj[short].userID;
      const owner = id;

      if (ownedBy === owner) {
        list.push(short);
      }
    }
  }
  return list;
};


/**
 * ------------------------------------------------------------
 * @param {object} obj - the main/prime database of URLs
 * @param {Function} cb - use myShortUrls as the callback, return: short URL keys list - user specific
 * @param {string} id - userID - from session-cookie
 * @returns An Array of the long URLs that belong to a specified user
 * ------------------------------------------------------------
 */
const myLongUrls = (obj, cb, id) => {
  const result = [];
  cb(obj, id).forEach(key => {
    result.push(obj[key].longURL);
  });
  return result;
};


/** ------------------------------------------------------------
 * @param {object} obj - the main/prime database of URLs
 * @param {Function} cb - use myShortUrls as the callback, return: short URL keys list - user specific
 * @param {string} id - userID - from session-cookie
 * @returns An Object of short and long urls that belong to the specified user
 * ------------------------------------------------------------
 */
const myDatabase = (obj, cb, id) => {
  const result = {};
  cb(obj, id).forEach(key => {
    result[key] = obj[key];
  });
  return result;
};


/**
 * ------------------------------------------------------------
 * @param {object} obj - user specific URLs database from the function: [myDatabase]
 * @param {string} longA - full web address
 * @returns short URL associated with the long URL [key from value]
 * ------------------------------------------------------------
 */
const shortFromLong = (obj, longA) => {
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const longB = obj[key].longURL;
      if (longA === longB) return key;
    }
  }
};


/**
 * ------------------------------------------------------------
 * @param {object} database - the full database of users
 * @param {string} email - a user's login email address
 * @returns An Object: the user profile associated with the email.
 * Returns `undefined` if email is not in the database
 * ------------------------------------------------------------
 */
const getUserByEmail = (database, email) => {
  if (email) {
    for (const user in database) {
      if (Object.hasOwnProperty.call(database, user)) {
        const existing = database[user].email;
        if (email === existing) {
          return user;
        }
      }
    }
  }
};


module.exports = {
  myShortUrls,
  myLongUrls,
  myDatabase,
  shortFromLong,
  getUserByEmail,
  generateRandomString
};