const config = require("../../../DATA/config.json");
const Mail = require("nodemailer");
const express = require("express");
const bcrypt = require("bcrypt");
const DB = require("bad.db");

module.exports = {
    name: "/password_reset",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        const db = await DB(__dirname + '/..//..//..//..//SRC/DATA/WebSite.json');

        let type = req.body.type;
        if (!type) type = 'rest';
        let Email = req.body.email;
        if (!Email) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

        if (type === 'rest') {

            let getDataR = await db("users").read({ email: Email, activated: true });
            if (!getDataR[0]) return res.json({ type: 'err', message: 'An error occurred, Please Try Again Later...!' });

            let Check = await db("password_reset").read({ email: Email });
            if (Check[0]) {

                let token_url = Check[0].token_url;
                let Message = `<p style="text-align:center;"><br><span style="color:#03c;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong>Thank You For Using</strong></span><span style="font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong> </strong></span><span style="color:#03f;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong><sup><u>${config.WebSite.name}</u></sup></strong></span></p>
                <p style="text-align:center;"><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;"><strong><u>${Email}</u></strong></span><span style="color:#222;font-family:Consolas,'Courier New',monospace;font-size:20px;"> </span><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;">Account Password Reset</span></p>
                <p style="text-align:center;">&nbsp;</p>
                <p style="text-align:center;"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:22px;"><strong><u>Link Reset Password</u></strong></span></p>
                <p style="text-align:center;"><a href="${config.express.url + `/password_reset?token=${token_url}&amp;email=${Email}`}"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:14px;"><strong>${config.express.url + `/password_reset?token=${token_url}&amp;email=${Email}`}</strong></span></a></p>
                <p style="text-align:center;">&nbsp;</p>
                <p style="text-align:center;"><span style="font-size:22px;"><strong><sup>⚠</sup></strong></span><span style="color:#999;font-family:Consolas,'Courier New',monospace;font-size:22px;"><strong>&nbsp;Note </strong></span><span style="font-size:22px;"><strong><sup>⚠</sup></strong></span></p>
                <p style="text-align:center;">&nbsp;</p>
                <p style="text-align:center;"><span style="color:#ba372a;"><strong>Do Not Give The </strong></span><span style="color:#ba372a;font-size:20px;"><strong><sub><u>Link</u></sub></strong></span><span style="color:#ba372a;"><strong> To Anyone You Do Not </strong></span><span style="color:#ba372a;font-size:20px;"><strong><sup><u>Trust</u></sup></strong></span></p>
                <p style="text-align:center;">&nbsp;</p>`

                async function xMail() {

                    const trans = Mail.createTransport({
                        host: config.WebSite.WebMail.host,
                        port: config.WebSite.WebMail.port,
                        secure: config.WebSite.WebMail.secure,
                        auth: {
                            user: config.WebSite.WebMail.auth.username,
                            pass: config.WebSite.WebMail.auth.password
                        }
                    });

                    const info = await trans.sendMail({
                        from: config.WebSite.WebMail.Send.Form,
                        to: Email,
                        subject: 'Account Password Reset',
                        html: Message
                    })

                    return info.messageId

                }

                return xMail().then(async (x) => {
                    return res.json({
                        type: 'suff',
                        message: 'The Password Reset Link Has Been Sent Again'
                    })
                }).catch((error) => {
                    console.log(error)
                    return res.json({ type: 'err', message: 'An Error occurred, please Try Again Later' })
                });

            }

            function randomElementInStrOrArr(arr) {
                return arr[Math.floor(Math.random() * arr.length)];
            }

            function generateOne(config) {
                let len =
                    (config === null || config === void 0 ? void 0 : config.length) || 8;
                let charset =
                    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                let code = "";
                if (config === null || config === void 0 ? void 0 : config.prefix) {
                    code += config.prefix;
                }
                for (let i = 0; i < len; i++) {
                    code += randomElementInStrOrArr(charset);
                }
                if (config === null || config === void 0 ? void 0 : config.postfix) {
                    code += config.postfix;
                }
                return code;
            }

            const token_url = generateOne({ length: 100 })
            let Message = `<p style="text-align:center;"><br><span style="color:#03c;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong>Thank You For Using</strong></span><span style="font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong> </strong></span><span style="color:#03f;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong><sup><u>${config.WebSite.name}</u></sup></strong></span></p>
            <p style="text-align:center;"><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;"><strong><u>${Email}</u></strong></span><span style="color:#222;font-family:Consolas,'Courier New',monospace;font-size:20px;"> </span><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;">Account Password Reset</span></p>
            <p style="text-align:center;">&nbsp;</p>
            <p style="text-align:center;"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:22px;"><strong><u>Link Reset Password</u></strong></span></p>
            <p style="text-align:center;"><a href="${config.express.url + `/password_reset?token=${token_url}&amp;email=${Email}`}"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:14px;"><strong>${config.express.url + `/password_reset?token=${token_url}&amp;email=${Email}`}</strong></span></a></p>
            <p style="text-align:center;">&nbsp;</p>
            <p style="text-align:center;"><span style="font-size:22px;"><strong><sup>⚠</sup></strong></span><span style="color:#999;font-family:Consolas,'Courier New',monospace;font-size:22px;"><strong>&nbsp;Note </strong></span><span style="font-size:22px;"><strong><sup>⚠</sup></strong></span></p>
            <p style="text-align:center;">&nbsp;</p>
            <p style="text-align:center;"><span style="color:#ba372a;"><strong>Do Not Give The </strong></span><span style="color:#ba372a;font-size:20px;"><strong><sub><u>Link</u></sub></strong></span><span style="color:#ba372a;"><strong> To Anyone You Do Not </strong></span><span style="color:#ba372a;font-size:20px;"><strong><sup><u>Trust</u></sup></strong></span></p>
            <p style="text-align:center;">&nbsp;</p>`

            async function xMail() {

                const trans = Mail.createTransport({
                    host: config.WebSite.WebMail.host,
                    port: config.WebSite.WebMail.port,
                    secure: config.WebSite.WebMail.secure,
                    auth: {
                        user: config.WebSite.WebMail.auth.username,
                        pass: config.WebSite.WebMail.auth.password
                    }
                });

                const info = await trans.sendMail({
                    from: config.WebSite.WebMail.Send.Form,
                    to: Email,
                    subject: 'Account Password Reset',
                    html: Message
                })

                return info.messageId

            }

            return xMail().then(async (x) => {
                await db("password_reset").create({
                    email: Email,
                    token_url: token_url
                }).then(async () => {
                    return res.json({
                        type: 'suff',
                        message: 'The Password Reset Link Has Been Sent Again'
                    })
                })
            }).catch((error) => {
                console.log(error)
                return res.json({ type: 'err', message: 'An Error occurred, please Try Again Later' })
            });

        } else if (type === 'check') {

            let token = req.body.token;
            if (!token) return res.json({ type: 'err', message: 'An error occurred, Please Try Again Later..' });
            let getData_token = await db("password_reset").read({ email: Email, token_url: token });
            if (!getData_token[0]) return res.json({ type: 'err', message: 'An error occurred, Please Try Again Later!' });
            if (getData_token[0].token_url) return res.json({ type: 'suff', message: 'done' })

        } else if (type === 'enter') {

            let token = req.body.token;
            if (!token) return res.json({ type: 'err', message: 'An error occurred, Please Try Again Later..' });

            let password = req.body.password;
            if (!password) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

            let getData = await db("password_reset").read({ email: Email, token_url: token });
            if (!getData[0]) return res.json({ type: 'err', message: 'An error occurred, Please Try Again Later' });

            const __password = await bcrypt.hash(password, 10);

            await db("users").update({ email: Email }, { password: __password })
                .then(async () => {
                    await db("password_reset").delete({ email: Email, token_url: token })
                        .then(async () => {
                            res.json({ type: 'suff', message: 'Password Changed Successfully!' })
                        })
                })

        }

    },
};