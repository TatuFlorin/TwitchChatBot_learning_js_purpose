const express = require("express");
const axios = require("axios");
const router = express.Router();

const axiosInstance = axios.create({
  baseUrl: "https://api.twitch.tv/helix/users"
});

router.get("/", (req, res) => {
  //const response = axiosInstance.get(baseUrl, Headers={
  //  'Authorization': `Bearer ${}`
  //});
  res.json("req");
});

module.exports = router;
