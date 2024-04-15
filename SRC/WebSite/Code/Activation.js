const express = require("express");
const DB = require("bad.db");

module.exports = {
    name: "/activation",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        if (req.cookies.token) {
            let _getToken = await db("users").read({ token: req.cookies.token });
            if (_getToken[0]) return res.redirect("/404?message=You%20Cannot%20Use%20This%20Page%20When%20Logged-in")
        }

        let token = req.query.token;
        if (!token) return res.redirect("/404?message=Token%20Is%20Not%20Find");
        let email = req.query.email;
        if (!email) return res.redirect("/404?message=E-mail%20Is%20Not%20Find");

        const db = await DB(__dirname + '/..//..//..//SRC/DATA/WebSite.json');

        let Check_Activation = await db("activation").read({ token_url: token, email: email });
        if (!Check_Activation[0]) return res.redirect("/404?message=There%20Is%20An%20Error%20In%20The%20Data.%20Please%20Check%20And%20Try%20Again");
        if (Check_Activation[0].token_url !== token || Check_Activation[0].email !== email) return res.redirect("/404?message=There%20Is%20An%20Error%20In%20The%20Data.%20Please%20Check%20And%20Try%20Again!");

            await db("activation").delete({ token_url: token, email: email }).then(async () => {
                await db("users").update({ email: email, activated: false }, { activated: true }).then(async () => {

                    delete require.cache[require.resolve("../Activation/index.ejs")];

                    let args = {
                        data: require("../../DATA/config.json"),
                        user: req.cookies.user
                    }

                    res.render("./SRC/WebSite/Activation/index.ejs", args);

                });
            });

    },
};