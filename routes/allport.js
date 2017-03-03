var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: '/home/reham/Desktop/se_mini/public/uploads' });
var Portfolio = require('../models/portfolio');

// Go to Portfolio
router.get('/allportfolios', function(req, res){
	Portfolio.findAllPortfolios(function(err,portfolios){
		if(err)
			res.send(err.message);
		else
			//res.render('allportfolios', { pagination: { totalRows: 10 }},{portfolios});
			res.render('allportfolios',{portfolios});
			console.log(portfolios);
	});
});
module.exports = router;