var app = require('express')();
var session = require('express-session');
var passport = require('passport');
var connectFlash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var process = require('process');
var db = require('./db.js');

db.connect();
db.createTables();

app.use(morgan('dev')); 
app.use(connectFlash());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({
    secret: 'thisisabigsercet',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('views', './views');
app.set('view engine', 'ejs');

require('./passport.js')(passport);
require('./routes.js')(app, passport);

var server = app.listen(process.env.PORT);
console.log('Server started on port ' + process.env.PORT);

process.on('SIGTERM', function () {
    server.close(function () {
      db.close();
      process.exit();
    });
 });