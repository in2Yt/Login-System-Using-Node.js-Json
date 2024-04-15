const express = require("express");
const DB = require("bad.db");

module.exports = {
  name: "/login",
  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  run: async (req, res) => {
    delete require.cache[require.resolve("../Login/index.ejs")];

    const db = await DB(__dirname + '/..//..//..//SRC/DATA/WebSite.json');

    if (req.cookies.token) {
      let _getToken = await db("users").read({ token: req.cookies.token });
      if (_getToken[0]) return res.redirect("/404?message=You%20Cannot%20Use%20This%20Page%20When%20Logged-in")
    }

    let type = req.query.type;
    if (type === 'login') type = 'login'
    else if (type === 'sign-up') type = 'register'
    else if (type !== 'login' || type !== 'sign-up') type = 'login'

    let args = {
      data: require("../../DATA/config.json"),
      user: req.cookies.user,
      type: type
    }

    res.render("./SRC/WebSite/Login/index.ejs", args);
  },
};