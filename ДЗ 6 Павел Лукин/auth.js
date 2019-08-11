const Login = require('./models/login');
const passport = require('passport');    
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function(user, done){    
    done(null, user._id); 
});

passport.deserializeUser(function(id, done){    
    Login.findById(id, function(err, user){        
        if(err || !user) return done(err, null);        
        done(null, user);    
    }); 
})


module.exports = function(app, options){
	if(!options.successRedirect)
		options.successRedirect = '/account';
	if(!options.failureRedirect)
		options.failureRedirect = '/login';

	return {
		init: function() {
			const env = app.get('env');
			const config = options.providers;

			passport.use(new FacebookStrategy({
				clientID: config.facebook[env].appId,
				clientSecret: config.facebook[env].appSecret,
				callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
			}, function(accessToken, refreshToken, profile, done){
				const authId = 'facebook:' + profile.id;
				User.findOne({ authId: authId }, function(err, user){
					if(err) return done(err, null);
					if(user) return done(null, user);
					user = new User({
						authId: authId,
						name: profile.displayName,
						created: Date.now(),
						role: 'customer',
					});
					user.save(function(err){
						if(err) return done(err, null);
						done(null, user);

					});
				});
			}));

			passport.use(new GoogleStrategy({
				clientID: config.google[env].clientID,
				clientSecret: config.google[env].clientSecret,
				callbackURL: (options.baseUrl || '') + '/auth/google/callback',
			}, function(token, tokenSecret, profile, done){
				const authId = 'google:' + profile.id;
				User.findOne({ authId: authId }, function(err, user){
					if(err) return done(err, null);
					if(user) return done(null, user);
					user = new User({
						authId: authId,
						name: profile.displayName,
						created: Date.now(),
						role: 'customer',
					});
					user.save(function(err){
						if(err) return done(err, null);
						done(null, user);
					});
				});
			}));

			app.use(passport.initialize());
			app.use(passport.session());
		},

		registerRoutes: function(){
			app.get('/auth/facebook', function(req, res, next){
				if(req.query.redirect) req.session.authRedirect = req.query.redirect;
				passport.authenticate('facebook')(req, res, next);

			});

			app.get('/auth/facebook/callback', passport.authenticate('facebook', 
				{ failureRedirect: options.failureRedirect }),
				function(req, res){
					const redirect = req.session.authRedirect;
					if(redirect) delete req.session.authRedirect;
					res.redirect(303, redirect || options.successRedirect);
				}
			);

			app.get('/auth/google', function(req, res, next){
				if(req.query.redirect) req.session.authRedirect = req.query.redirect;
				passport.authenticate('google', { scope: 'profile' })(req, res, next);
			});

			app.get('/auth/google/callback', passport.authenticate('google', 
				{ failureRedirect: options.failureRedirect }),
				function(req, res){
					const redirect = req.session.authRedirect;
					if(redirect) delete req.session.authRedirect;
					res.redirect(303, req.query.redirect || options.successRedirect);
				}
			);
		},
	};
};