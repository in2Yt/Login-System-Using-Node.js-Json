const JSON = require("./SRC/DATA/config.json");
const cookieParser = require("cookie-parser");
const engine = require("consolidate");
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const app = express();
require("colors")
require("ejs")
ejs.delimiter = '?';
ejs.openDelimiter = '[';
ejs.closeDelimiter = ']';

// Clear Console & Create Line
console.clear();
console.log("—————————————————————————————————".gray);

app.use(express.static(__dirname + '/SRC/WebSite'));
app.use(express.static(__dirname + '/SRC/Public'));
app.use(express.urlencoded({ extended: true }));
app.engine('html', engine.mustache);
app.set('view enging', 'ejs');
app.set('views', __dirname);
app.set('trust proxy', true);
app.use(express.json());
app.use(cookieParser());
app.set("etag", false);
// Deploymant Access & Compression data
const cors = require("cors");
app.use(cors());
// Compress All Responses
const compression = require('compression');
app.use(compression());
// Express Session
const session = require('express-session');
app.use(session({
    cookie: { maxAge: 86400000 },
    secret: JSON.express.secret,
    saveUninitialized: true,
    resave: false
}))

fs.readdirSync("./SRC/WebSite/Code")
    .filter(x => x.endsWith('.js'))
    .forEach(async x3 => {
        const file = require(`./SRC/WebSite/Code/${x3}`);

        if (file && file.name) {
            app.get(file.name, file.run);
            console.log(
                '['.red,
                '[ GET ] - ',
                `${file.name}`.green.bold,
                ']'.red,
            )
        } else;
    });

console.log('—————————————————————————————————'.gray.bold)

fs.readdirSync("./SRC/WebSite/Code/API")
    .filter(x => x.endsWith(".js"))
    .forEach(async x3 => {
        const file = require(`./SRC/WebSite/Code/API/${x3}`);
        if (file && file.name) {
            app.get("/api" + file.name, file.run);
            console.log(
                '['.red,
                '[ API ] - ',
                `${file.name}`.green.bold,
                ']'.red,
            )
        }
    })

console.log('—————————————————————————————————'.gray.bold)

fs.readdirSync("./SRC/WebSite/Code/Post")
    .filter(x => x.endsWith(".js"))
    .forEach(async x3 => {
        const file = require(`./SRC/WebSite/Code/Post/${x3}`);
        if (file && file.name) {
            app.post("/post" + file.name, file.run);
            console.log(
                '['.red,
                '[ POST ] - ',
                `${file.name}`.green.bold,
                ']'.red,
            )
        }
    })

console.log('—————————————————————————————————'.gray.bold)
console.log('WebSite Is Ready'.green.bold)
console.log('—————————————————————————————————'.gray.bold)

app.listen(JSON.express.port,
    console.log(`WebSite Is Ready, In Port ${JSON.express.port}`.blue.bold)
);