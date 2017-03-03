var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var multer = require('multer');
var upload = multer({dest: '/home/reham/Desktop/se_mini/uploads' });

var Student = require('../models/student');

// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', upload.single("pic"),function(req, res){
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var img;
	if(req.file){
		img = req.file.originalname;
		console.log(req.file.originalname);

	}

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newStudent = new Student({
			name: name,
			username: username,
			password: password,
			img: img
				
		});
		
		Student.createStudent(newStudent, function(err, student){
			if(err) {
			req.flash('error_msg', 'Username is already used');
			res.redirect('/users/register');
			console.log(student);
			}
			else{
				req.flash('success_msg', 'You are registered and can now login');
				res.redirect('/users/login');
				console.log(student);

			}
		});

			
			
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   Student.getStudentByUsername(username, function(err, student){
   	if(err) throw err;
   	if(!student){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	Student.comparePassword(password, student.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, student);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(student, done) {
  done(null, student.id);
});

passport.deserializeUser(function(id, done) {
  Student.getStudentById(id, function(err, student) {
    done(err, student);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.session.destroy(function(err) {
  if(err) {
    console.log(err);
  } else {
    res.redirect('/users/login');
  }
});

});

	


module.exports = router;