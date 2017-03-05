var express = require('express');
var passport = require('passport');
var app = express();

app.use(require('cookie-parser')());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log('serialize');
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserialie');
  done(null, user);
});

var StrategyGoogle = require('passport-google-openidconnect').Strategy;
passport.use(new StrategyGoogle({
    clientID: 'YOUR GOOGLE CLIENT ID',
    clientSecret: 'YOUR GOOGLE CLIENT SECRET',
    callbackURL: 'http://localhost:3000/callback',
  },
  function(iss, sub, profile, accessToken, refreshToken, done) {
  			console.log('iss = ' + iss);
  			console.log('sub = ' + sub);
            console.log('profile.id = ' + profile.id);
            console.log('token = ' + accessToken);
            console.log('profile.displayName = ' + profile.displayName);
            return done(null, profile.displayName);
  	}	
));
function ensureAuthenticated(req, res, next){
	console.log('ensureAuthenticated..');
	if(req.isAuthenticated()){
		return next();
	}else{

	}
}
app.get('/login', function(req, res){
	res.send('login please');
})
app.get('/', function(req, res){
	res.send("hello world! " + req.user);
})
app.get('/login_success', ensureAuthenticated, function(req, res, next){
	res.redirect('/account');
})
app.get('/account', function(req, res){
	res.render('account', {
		title: 'Account',
		name: req.user.profile.displayName,
		//user: JSON.stringify(req.user)
	});
})
app.get('/login/idp', 
	    passport.authenticate('google-openidconnect')
);

app.get('/callback',
	passport.authenticate('google-openidconnect', { failureRedirect: '/login' }),
  		function(req, res, next) {
    	// Successful authentication, redirect home.
    	console.log(req.user);
    	//res.redirect('/login_success');
    	res.redirect('/login_success');
  	}
);
app.listen(3000);
