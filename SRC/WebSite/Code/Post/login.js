const express = require("express");
const bcrypt = require("bcrypt");
const DB = require("bad.db");

module.exports = {
    name: "/login",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        const db = await DB(__dirname + '/..//..//..//..//SRC/DATA/WebSite.json');

        let _email = req.body.email;
        if (!_email) return res.json({ type: 'err', message: 'Please Fill In The Fields First' })

        let _password = req.body.password;
        if (!_password) return res.json({ type: 'err', message: 'Please Fill In The Fields First' })

        if (req.cookies.token) {
            let _getToken = await db("users").read({ token: req.cookies.token });
            if (_getToken[0]) return res.json({ type: 'err', message: 'The Procedure Cannot be Performed, There Is An Account Registered!' });
        }

        let data = await db("users").read({ email: _email });
        if (!data[0]) return res.json({ type: 'err', message: 'There Is No Account With This Email' })

        let password = await bcrypt.compare(_password, data[0].password)
        if (password === false || password === "false") return res.json({ type: 'err', message: 'There Is An \'ERROR\' In The Data, Please Try Agnin' })

        if (data[0].activated === false) return res.json({ type: 'err', message: 'This Account Is Not Activated. Please Check Your E-mail To Activate The Account or Register Again' })

        res.cookie('token', data[0].token);
        return res.json({ type: 'suff', message: 'You Have Been \'logged\' In Successfully', data: data[0] })

    },
};