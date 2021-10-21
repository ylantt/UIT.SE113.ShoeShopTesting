const localStrategy = require("passport-local").Strategy;
const bcrypt = require('bcryptjs');

const { User } = require('../../models/userModel');

module.exports = function (passport) {
    passport.use(
        new localStrategy({ usernameField: 'name', passwordField: 'password' }, (username, password, done) => {
            User.findOne((username.includes("@")) ? { email: username } : { userName: username })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'User is not exists' });
                    }
                    else {
                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if (isMatch) {
                                return done(null, user);
                            }
                            else {
                                return done(null, false, { message: 'Incorrect Password' });
                            }
                        });
                    }
                })
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

