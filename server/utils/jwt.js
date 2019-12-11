const jwt = require("jsonwebtoken");
require("dotenv").config({ path: __dirname + "./../.env" });

function getToken({ data: data }) {
  const accessToken = jwt.sign(data, process.env.SECRET_KEY_JWT);
  return accessToken;
}

//TODO: implement refresh token function
function refreshToken() {}

function verifyToken(token) {
  let userid;
  jwt.verify(token, process.env.SECRET_KEY_JWT, (err, userId) => {
    userid = userId;
  });
  return userid;
}

module.exports = {
  getToken,
  refreshToken,
  verifyToken
};
