const axios = require("axios");
require("dotenv").config({ path: __dirname + "./../.env" });

const apiUrl = "https://api.twitch.tv/helix";

const axiosInstance = axios.create({
  baseURL: apiUrl
});

async function getUser(access_token) {
  try {
    const {
      data: { data }
    } = await axiosInstance.get("/users", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    return data[0] || null;
  } catch (error) {
    console.log(error.message);
  }
}

async function getAccessToken(refresh_token_db) {
  try {
    const qs = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token_db,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    });
    const { data } = await axios.post(
      `https://id.twitch.tv/oauth2/token?${qs}`
    );
    return data;
  } catch (error) {
    throw new Error(`message: ${error.message}`);
  }
}

module.exports = {
  getUser,
  getAccessToken
};
