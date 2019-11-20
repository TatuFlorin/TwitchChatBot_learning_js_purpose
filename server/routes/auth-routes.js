const express = require("express");
const axios = require("axios");
require("dotenv").config({ path: "./../.env" });

const router = express.Router();

const baseURL = "https://id.twitch.tv/oauth2";
const redirectLocalPage = `${process.env.REDIRECT_HOST}/auth/callback`;

const axiosInstance = axios.create({
  baseURL: baseURL
});

router.get("/twitch", (req, res) => {
  const sp = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    redirect_uri: redirectLocalPage,
    response_type: "code",
    scope: req.query.scope
  });
  const redirectURL = `${baseURL}/authorize?${sp}`;
  res.redirect(redirectURL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const sp = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectLocalPage
  });
  try {
    const response = await axiosInstance.post(`/token?${sp}`);
    const redirectURL = `${baseURL}/token?${sp}`;
    res.json(response.data);
  } catch (err) {
    res.json(err);
  }
});

module.exports = router;
