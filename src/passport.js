var bcrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./db.js');

module.exports = function(passport) {

    passport.use('register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            db.getUserByName({username: username}, function(err, user) {
                if (err)
                    return done(err);

                if (user)
                    return done(null, false, req.flash('registerMessage', 'User already exists ' + username));

                var newUser = {username: username, password: passwordHash(password)};

                db.createUser(newUser, function(err, id) {
                    if (err)
                        return done(err);

                    return done(null, {id: id});
                })
            });
        })
    }));

    passport.use('login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true,
        session: true
    }, function(req, username, password, done) {
        process.nextTick(function() {
            db.getUserByName({username: username}, function(err, user) {
                if (err)
                    return done(err);

                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user with name ' + username));

                if (!passwordValidate(password, user.password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password'));

                db.createTimestamp(user, function() {});

                return done(null, user);
            })
        });
    }));

    passport.serializeUser(function(req, user, done) {
        return done(null, user.id);
    });

    passport.deserializeUser(function(req, id, done) {
        db.getUserById(id, function(err, user) {
            return done(err, user);
        });
    });
};

function passwordHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

function passwordValidate(origin, hashed) {
    return bcrypt.compareSync(origin, hashed);
}
