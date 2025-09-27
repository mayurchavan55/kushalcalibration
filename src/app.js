const path = require('path')
const express = require("express");
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session');
var csrf = require('csurf');

// const radis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client  = radis.createClient();

const app = express();
const pageMapping=require("./routes/pageMapping");
const auth=require("./routes/auth");

// const lien=require("./routes/lien");
const ejs = require('ejs');
// Define paths for Express config
const pubDirPath=path.join(__dirname, '../public')
const viewsbasePath=path.join(__dirname, '../views')
const viewsPath=path.join(__dirname, '../views/pages')
const partialsPath=path.join(__dirname, '../views/partials')
// Setup handlebars engine and views location
app.set('view engine', 'ejs')
app.set('views', viewsPath)

// Setup static directory to serve
app.use(express.static(pubDirPath))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // initialize cookie-parser to allow us access the cookies stored in the browser. 
    app.use(cookieParser());
    var hour = 3600000;

    // initialize express-session to allow us track the logged-in user across sessions.
    app.use(session({
        key: 'user_sid',
        secret: 'somerandonstuffs',
        // store: new redisStore({host: 'localhost', port:6379, client: client, ttl: 260}),
        resave: false,
        saveUninitialized: false,
        cookie: {
            //domain: 'localhost',
            expires: new Date(Date.now() + hour),
            maxAge:100 * hour
        }
    }));

    var csrfProtection = csrf();
    app.use(function(err, req, res, next) {
        console.log("handle csrf errors specifically");
        if (err.code !== 'EBADCSRFTOKEN') return next(err);
        res.status(403).json({"error": "session has expired or tampered with"});
    });



    app.use(function(req, res, next){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });



app.use(pageMapping);
app.use(auth)
app.use((req, res, next) => {
    res.status(404).render("404", { message: "Page Not Found" });
});

module.exports = app;
