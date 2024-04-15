const config = require("../../../DATA/config.json");
const Mail = require("nodemailer");
const express = require("express");
const bcrypt = require("bcrypt");
const DB = require("bad.db");

module.exports = {
    name: "/sign-up",
    /**
     * @param {express.Request} req 
     * @param {express.Response} res 
     */
    run: async (req, res) => {

        const db = await DB(__dirname + '/..//..//..//..//SRC/DATA/WebSite.json');

        let Name = req.body.name;
        if (!Name) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

        let Username = req.body.username
        if (!Username) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

        let Email = req.body.email;
        if (!Email) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

        let Password = req.body.password;
        if (!Password) return res.json({ type: 'err', message: 'Please Fill In The Fields First' });

        let Data = await db("users").read({ email: Email, activated: true });
        if (Data[0]) return res.json({ type: 'err', message: 'This Email Is Already Registered !' });

        if (req.cookies.token) {
            let _getToken = await db("users").read({ token: req.cookies.token });
            if (_getToken[0]) return res.json({ type: 'err', message: 'The Procedure Cannot be Performed, There Is An Account Registered!' });
        }

        Letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        Cap_Letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        Numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        All_Chars = Letters + Cap_Letters + Numbers + ['_', '-'];
        Good_Username = true;

        for (let i of Username) {
            if (!All_Chars.includes(i)) {
                Good_Username = false;
            }
        }

        let Check_Activation = await db("activation").read({ email: Email });
        if (Check_Activation[0]) {

            let token_url = Check_Activation[0].token_url;
            let Message = `<p style="text-align:center;"><br><span style="color:#03c;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong>Thank You For Using</strong></span><span style="font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong> </strong></span><span style="color:#03f;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong><sup><u>${config.WebSite.name}</u></sup></strong></span></p>
            <p style="text-align:center;"><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;"><strong><u>${Email}</u></strong></span><span style="color:#222;font-family:Consolas,'Courier New',monospace;font-size:20px;"> </span><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;">Account Activation Link</span></p>
            <p style="text-align:center;">&nbsp;</p>
            <p style="text-align:center;"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:22px;"><strong><u>Link activate account</u></strong></span></p>
            <p style="text-align:center;"><a href="${config.express.url + `/activation?token=${token_url}&amp;email=${Email}`}"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:14px;"><strong>${config.express.url + `/activation?token=${token_url}&amp;email=${Email}`}</strong></span></a></p>
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
                    subject: 'Account Activation Code',
                    html: Message
                })

                return info.messageId

            }

            return xMail().then(async (x) => {
                return res.json({ 
                    type: 'suff', 
                    message: 'The Activation Link Has Been Sent Again'
                })
            }).catch((error) => {
                console.log(error)
                return res.json({ type: 'err', message: 'An Error occurred, please Try Again Later' })
            });

        }

        let Check_Username = await db("users").read({ username: Username });
        if (Check_Username[0]) return res.json({ type: 'err', message: 'This Username Already Exists !' })
        if (!Good_Username) return res.json({ type: 'err', message: 'Username Can only Contain Alphanumeric Characters And underscores !' });

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

        const ___token = generateOne({ length: 300 })
        const __password = await bcrypt.hash(Password, 10)

        let month = [
            'January',
            'Februery',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'Nobember',
            'December'
        ]

        const token_url = generateOne({ length: 100 })
        let Message = `<p style="text-align:center;"><br><span style="color:#03c;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong>Thank You For Using</strong></span><span style="font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong> </strong></span><span style="color:#03f;font-family:Consolas,'Courier New',monospace;font-size:36px;"><strong><sup><u>${config.WebSite.name}</u></sup></strong></span></p>
        <p style="text-align:center;"><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;"><strong><u>${Email}</u></strong></span><span style="color:#222;font-family:Consolas,'Courier New',monospace;font-size:20px;"> </span><span style="color:#38761d;font-family:Consolas,'Courier New',monospace;font-size:20px;">Account Activation Link</span></p>
        <p style="text-align:center;">&nbsp;</p>
        <p style="text-align:center;"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:22px;"><strong><u>Link activate account</u></strong></span></p>
        <p style="text-align:center;"><a href="${config.express.url + `/activation?token=${token_url}&amp;email=${Email}`}"><span style="color:#1abc9c;font-family:Consolas,Courier New,monospace;font-size:14px;"><strong>${config.express.url + `/activation?token=${token_url}&amp;email=${Email}`}</strong></span></a></p>
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
                subject: 'Account Activation Code',
                html: Message
            })

            return info.messageId

        }

        xMail().then(async (x) => {

            await db("users").create({
                activated: false,
                token: ___token,
                name: Name,
                username: Username,
                email: Email,
                password: __password,
                createAt: {
                    hours: new Date().getHours(),
                    minutes: new Date().getMinutes(),
                    seconds: new Date().getSeconds(),
                    day: new Date().getDate(),
                    month: month[new Date().getMonth()],
                    year: new Date().getFullYear(),
                }
            }).then(async () => {
                
                await db("activation").create({
                    email: Email,
                    token_url: token_url
                }).then(() => {
                    return res.json({ 
                        type: 'suff', 
                        message: 'An Account Activation Link has Been Sent To Your E-mail' 
                    });
                })
            })

        }).catch((error) => {
            console.log(error)
            return res.json({ type: 'err', message: 'An Error occurred, please Try Again Later' })
        })

    },
};