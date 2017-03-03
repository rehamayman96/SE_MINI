var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var uniqueValidator = require('mongoose-unique-validator');

// work Schema
var WorkSchema = mongoose.Schema({
	kind: {
		type: Boolean
	},
	link: {
		type: String
	}
	
});

// Portfolio Schema
var PortfSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		unique: true
	},
	name: {
		type: String
	},
	work: [WorkSchema]

});

PortfSchema.plugin(uniqueValidator);
var Portfolio = module.exports = mongoose.model('Portfolio', PortfSchema);

//create new Portfolio
module.exports.createPortfolio = function(newPortfolio, callback){
	newPortfolio.save(callback);
}

//find all Portfolios
module.exports.findAllPortfolios = function(callback){
	Portfolio.find(callback);
}

//find a user projects
module.exports.findmyPortfolio = function(username,callback){
	Portfolio.findOne({username: username},callback);
}	

//create project
module.exports.createProject = function(username,link,kind,callback){
	Portfolio.findOne({username: username},function (err,portfolio) {
		if(err)
		 return;
		else{
		portfolio.work.push({kind: kind,link: link});
		portfolio.save(callback);
		}
	});
}