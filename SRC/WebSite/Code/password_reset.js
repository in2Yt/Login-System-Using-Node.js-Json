const express = require("express");
const DB = require("bad.db");

module.exports = {
    name: "/password_reset",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        const db = await DB(__dirname + '/..//..//..//SRC/DATA/WebSite.json');

        if (req.cookies.token) {
            let _getToken = await db("users").read({ token: req.cookies.token });
            if (_getToken[0]) return res.redirect("/404?message=You%20Cannot%20Use%20This%20Page%20When%20Logged-in")
        }

        let value = req.query.value

        if (req.query.email && req.query.token) {

            async function data() {
                let getData_token = await db("password_reset").read({ email: req.query.email, token_url: req.query.token });
                if (!getData_token[0]) return {type: 'err'}
                if (getData_token[0].token_url) return {type: 'suff'}
            }

            let _Data = await data()
            if (_Data.type === 'suff') {

                delete require.cache[require.resolve("../Password/reset/index.ejs")];

                let args = {
                    data: require("../../DATA/config.json"),
                    user: req.cookies.user,
                    email: req.query.email,
                    token: req.query.token
                }

                res.render("./SRC/WebSite/Password/reset/index.ejs", args);

            } else if (_Data.type === 'err') {

                delete require.cache[require.resolve("../Password/index.ejs")];

                let args = {
                    data: require("../../DATA/config.json"),
                    value: value,
                    user: req.cookies.user
                }

                res.render("./SRC/WebSite/Password/index.ejs", args);

            }

        } else {

            delete require.cache[require.resolve("../Password/index.ejs")];

            let args = {
                data: require("../../DATA/config.json"),
                value: value,
                user: req.cookies.user
            }

            res.render("./SRC/WebSite/Password/index.ejs", args);

        }

    },
};