const axios = require("axios");

const apiUrl = "https://api.twitch.tv/helix";

const axiosInstance = axios.create({
  baseURL: apiUrl
});

async function getUser(access_token) {
  const {
    data: { data }
  } = await axiosInstance.get("/users", {
    headers: {
      Authorization: `Bearer ${access_token}`
    }
  });
  return data[0] || null;
}

function getName() {
  return "name";
}
/**
 * GetName function
 * @param {string} access_token
 * @property {function} getUser
 */
var api = (module.export = {
  getUser,
  getName
});

module.exports = {
  getUser
};
