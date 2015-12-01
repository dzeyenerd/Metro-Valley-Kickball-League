// app/routes.js
var express  = require('express');
var multer  =  require('multer');
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);
var moment = require('moment');
var upload = multer({ dest: './public/images/uploads/'});
connection.query('USE ' + dbconfig.database);

var exphbs  = require('express-handlebars');

module.exports = function(app, passport) {


	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {


      res.render('home', { 
      	layout: 'other', 
      	req:req.user
      });
	});





	// =====================================
	// schedule ===============================
	// =====================================
		app.get('/schedule', function(req, res) {

	      res.render('schedule', { req:req.user, title : 'Schedule'});

	});

	// =====================================
	// players ===============================
	// =====================================
		app.get('/players', function(req, res) {
	      connection.query('SELECT * FROM users',function(err,rows){
	      if(err) throw err;

	  
	      res.render('players', { data:rows, user : req.user, title : 'Players',


        helpers: {

            foo: function(a, b, opts){ 
			    if (a == b) {
			        return opts.fn(this);
			    } else {
			        return opts.inverse(this);
			    }
            }
        }




	      });

	      console.log('Data received from Db:\n');
	      console.log(rows);
	    });
	});	

	// =====================================
	// league ===============================
	// =====================================
		app.get('/league', function(req, res) {
	      connection.query('SELECT * FROM league',function(err,rows){
	      if(err) throw err;

	  
	      res.render('league', { data:rows, user : req.user, title: "Leagues" });

	      console.log('Data received from Db:\n');
	      console.log(rows);
	    });
	});		

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {
		console.log(connection)
		// render the page and pass in any flash data if it exists
		res.render('login', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
		app.get('/profile', isLoggedIn, function(req, res) {
	      connection.query('SELECT * FROM team',function(err,rows){
	      if(err) throw err;

	  
	      res.render('profile', { data:rows, user : req.user, title:'My Profile' });

	      console.log('Data received from Db:\n');
	      console.log(rows);
	    });
	});		

	// edit the form
	app.post('/profile', isLoggedIn, function(req, res){


        connection.query("UPDATE users SET name='"+req.body.name+"', bio='"+req.body.bio+"', position='"+req.body.position+"', dob='"+req.body.dob+"', username='"+req.body.username+"', team='"+req.body.team+"', gender='"+req.body.gender+"' WHERE id='"+req.body.userid+"'",function(err, rows){

        	if(err) throw err;
        	res.redirect('/profile');

        });
        console.log(req.body.gender)
	});





	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});







app.use(multer({ dest: './public/images/uploads/',
	rename: function (fieldname, filename) {
		var fieldname
		var filename=fieldname;
		return filename;
	},

	onFileUploadStart: function (file) {
		console.log(file.originalname + ' is starting ...');
	},
	onFileUploadComplete: function (file) {
		console.log(file.fieldname + ' uploaded to  ' + file.path)
	}



}));

app.post('/image',function(req,res) {

        connection.query("UPDATE users SET photo='1' WHERE id='"+req.body.id+"'",function(err, rows){

    	if(err) throw err;
    	res.redirect('/profile');

        });
});



};







// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

