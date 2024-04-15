const express = require("express");

module.exports = {
  name: "/404",
  /**
   * @param {express.Request} req 
   * @param {express.Response} res 
   */
  run: async (req, res) => {
    delete require.cache[require.resolve("../404/index.ejs")];

    let message = req.query.message;

    let args = {
      data: require("../../DATA/config.json"),
      user: req.cookies.user,
      msg: message
    }

    res.render("./SRC/WebSite/404/index.ejs", args);
  },
};