const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./model/user');

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({email: username});
    if(!user) {
        return done(null, false);
    }
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) {
        return done(null, false);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).lean();
    delete user.password;
    done(null, user);
});

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    authHandler: passport.authenticate('local', {
        successRedirect: '/getalltasks',
        failureRedirect: '/auth?error=true',
    }),
    checkAuthenticated: (req, res, next) => {
        if(req.user) {
            return next();
        }

        res.redirect('/auth');
    }
};