// NodeJS imports
const mysql = require("mysql");
const crypto = require("crypto");
const globalConnection = mysql.createConnection({
  host: "{URL}",
  user: "{USER}",
  password: "{PASSWORD}",
  database: "{DATABASE}",
});
globalConnection.connect();

let secret_key =
  "{SECRET}";
const key = Buffer.from(secret_key, "hex");
const iv = "{IV}";
function encrypt(plainString, AesKey, AesIV) {
  const cipher = crypto.createCipheriv("aes-256-cbc", AesKey, AesIV);
  let encrypted = Buffer.concat([
    cipher.update(Buffer.from(plainString, "utf8")),
    cipher.final(),
  ]);
  return encrypted.toString("base64");
}

module.exports = {
  type: "credentials",
  users: async function (username) {
    // Do whatever work is needed to check username is a valid
    // user.
    valid = true;
    if (valid) {
      // Resolve with the user object. It must contain
      // properties 'username' and 'permissions'
      return { username, permissions: "*" };
    } else {
      // Resolve with null to indicate this user does not exist
      return null;
    }
  },
  authenticate: function (username, password) {
    return new Promise(async function (resolve) {
      // Do whatever work is needed to validate the username/password
      // combination.
      var encryptedData = encrypt(password, key, iv);
      globalConnection.query(
        `SELECT * from testusers where username="${username}" and password="${encryptedData}"`,
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            //console.log("The solution is: ", results)
            valid = true;
            if (valid) {
              // Resolve with the user object. Equivalent to having
              // called users(username);
              const user = { username: username, permissions: "*" };
              resolve(user);
            } else {
              // Resolve with null to indicate the username/password pair
              // were not valid.
              resolve(null);
            }
            // }
          } else {
            // Resolve with null to indicate the username/password pair
            // were not valid.
            resolve(null);
          }
        }
      );
    });
  },
};
