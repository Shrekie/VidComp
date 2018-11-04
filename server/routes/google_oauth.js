const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const User = require('./../model/user');

// passportjs initialization and strategy call.
router.use(passport.initialize());
router.use(passport.session());

passport.use(new GoogleStrategy({
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret,
	callbackURL: "/auth/google/callback"
},
	function(accessToken, refreshToken, profile, done) {

	    var searchQuery = {
	    	profileID: profile.id
	    };

	    var updates = {
			name: profile.displayName,
			profileID: profile.id,
			accessToken: accessToken
	    };

	    var options = {
	    	upsert: true,
	    	new: true
	    };

	    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
			if(err) {
				return done(null, err);
			} else {
				return done(null, user);
			}
	    });
	  
	}
));

// Authentication routes
router.get('/auth/google', 
	passport.authenticate('google', 
		{ scope: ['https://www.googleapis.com/auth/plus.login'], prompt : "select_account" }));


router.get('/auth/google/callback', 
passport.authenticate('google', { 
	failureRedirect: '/error',
	successRedirect: '/authStatus'
}));

//Check authentication
router.get('/checkLogin', (req, res)=>{
	res.json(req.isAuthenticated());
});

router.get('/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.json({data:req.isAuthenticated()});
});

// Serialize user information <->
passport.serializeUser(function(user, done) {
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

module.exports = router;