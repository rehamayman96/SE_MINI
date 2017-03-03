var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: '/home/reham/Desktop/se_mini/public/uploads' });
var Portfolio = require('../models/portfolio');

// Go to Portfolio
router.get('/portfolio', function(req, res){
	res.render('portfolio');
});

//Create Portfolio
router.post('/portfolio',upload.single('sc'),function(req, res){
	var name = req.body.name;
	var username = req.session.user.username;
	var link = req.body.link;
	var w;
	var kind = false;
	console.log(req.file);
	if(req.file){
		w = req.file.filename;
		kind= true;
	}
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	var errors = req.validationErrors();

	if(errors){
		res.render('portfolio',{
			errors:errors
		});
	} else {
		var newPortfolio = new Portfolio({
			username: username,
			name: name
		});
		if(kind && link){
			newPortfolio.work.push({kind:false, link: link});
			newPortfolio.work.push({kind:true,link: w});
	}
		else if (kind){
			newPortfolio.work.push({kind:true,link: w});
		}
		else if(link){
			newPortfolio.work.push({kind:false,link: link});
		}
		else{
			req.flash('error_msg', 'You must submit at least one work to create a portfolio');
			res.redirect('/port/portfolio');
			return;
		}
		
		Portfolio.createPortfolio(newPortfolio, function(err, portfolio){
			if(err) {
			req.flash('error_msg', 'You already have a portfolio');
			res.redirect('/port/portfolio');
			console.log(portfolio);
			}
			else{
				req.flash('success_msg', 'Your portfolio has been created successfully');
				res.redirect('/');
				console.log(portfolio);

			}
		});

			
			
	}
});

// GET addproject
router.get('/addproject', function(req, res){
	res.render('addproject');
});

//POST new Project
router.post('/addproject',upload.single("pic"),function(req, res){
	var username = req.session.user.username;
	var link = req.body.name;
	var img;
	var kind=false;
	if(req.file && link){
		req.flash('error_msg', 'You can only add one work at a time!');
		res.redirect('/port/addproject');
		return;

	}
	else if(req.file){
		img = req.file.filename;
		kind =true;
	}else if(link){
		kind=false;
	}
	else{
		req.flash('error_msg', 'You have to add a project!');
		res.redirect('/port/addproject');
		return;
	}
	var errors = req.validationErrors();

	if(errors){
		res.render('addproject',{
			errors:errors
		});
    }
	else if(kind){

		Portfolio.findOne({username: username},function (err,portfolio) {
		if(err)
		 {
		 	req.flash('error_msg', 'You must create a portfolio before adding a project!');
		    res.redirect('/port/addproject');
		    return;
		 }
		else{
		portfolio.work.push({kind:true,link:img});

		req.flash('success_msg', 'Your project has been submitted successfully');
		res.redirect('/port/addproject');
		portfolio.save();
		console.log(portfolio);
		}
	});
	} else{

		Portfolio.findOne({username: username},function (err,portfolio) {
		if(err)
		 {
		 	req.flash('error_msg', 'You must create a portfolio before adding a project!');
		    res.redirect('/port/addproject');
		    return;
		 }
		else{
			portfolio.work.push({kind:false,link:link});
			portfolio.save();
		    req.flash('success_msg', 'Your project has been submitted successfully');
		    res.redirect('/port/addproject');
		    console.log(portfolio);
		}
		});
   }
});
// GET My Projects
router.get('/myportfolio', function(req, res){
	var username = req.session.user.username;
	Portfolio.findmyPortfolio(username,function(err,portfolio){
		 if(err)
                res.send(err.message);
            else
            	var projects = portfolio.work;
                res.render('myportfolio', {projects});
        });
	});



module.exports = router;