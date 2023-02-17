// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const hbs = require('handlebars');
const exphbs = require('express-handlebars');
const cors = require("cors")
const bodyParser = require('body-parser');
const multer = require('multer');
const moment = require('moment');
const { envPort, dbURL, sessionKey } = require('./config/config');
const MongoStore = require('connect-mongo')(session);
const app = express();
app.use(cors());
require('./config/passport')(passport);

// Statics
app.use(express.static('assets'));
app.use(express.static(__dirname + '/public'));
app.enable('strict routing');
app.all('/admin', function(req, res) { res.redirect('/admin/'); });
app.use('/admin/',express.static(__dirname+'/public'));
app.use('/admin/',express.static('assets'));



//Database Connection 
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("Database Connected"))
.catch(err => console.log(err));



// Handlebars
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.engine('hbs', exphbs({
    extname: 'hbs',
    //defaultview: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
    handlebars: allowInsecurePrototypeAccess(hbs)
}))

app.set('view engine', 'hbs');

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());
app.use( (req, res, next) => {
    res.locals.msg = req.flash("msg");
    res.locals.error = req.flash('error');
    next();
})


app.use((req, res, next) => {
    res.locals.loggedIn = req.isAuthenticated();
    next();
});

// Routes
app.use('/', require('./routes/login'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/account'));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/mytasks'));
app.use('/', require('./routes/notifications'));
app.use('/admin', require('./routes/notificationsadmin'));
app.use('/admin', require('./routes/adminpage'));
app.use('/admin', require('./routes/manageUsers'));
app.use('/admin', require('./routes/manageTasks'));
app.use('/admin', require('./routes/adminProf'));

// Port
const port = envPort || 8000;

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});

