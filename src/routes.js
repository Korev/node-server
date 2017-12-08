var db = require('./db.js');

module.exports = function(app, passport) {
        app.get('/', function(req, res) {
            res.render('index.ejs');
        });

        app.get('/register', function(req, res) {
            res.render('register.ejs', {message: req.flash('registerMessage')});
        });

        app.post('/register', passport.authenticate('register', {
            successRedirect : '/successregister',
            failureRedirect : '/register',
            failureFlash : true
        }));

        app.get('/successregister', function(req, res) {
            res.render('successregister.ejs');
        });

        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage')}); 
        });

        app.post('/login', passport.authenticate('login', {
            successRedirect : '/successlogin',
            failureRedirect : '/login',
            failureFlash : true
        }));

        app.get('/successlogin',  isLoggedIn, function(req, res) {
            db.getLast5Timestamps(req.user, function (err, timestamps) {
                if (err)
                    res.render('successlogin.ejs', {message: "Failed to get timestamps." }); 
    
                res.render('successlogin.ejs', {timestamps: timestamps}); 
            })
        });

        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }
