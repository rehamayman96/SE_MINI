var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
mongoose.Promise = global.Promise;
var uniqueValidator = require('mongoose-unique-validator');


//image Schema
/*var Img = mongoose.Schema({
    img: { 
    	data: Buffer, 
    	contentType: String }
});

//Portfolio Schema
var Portof = mongoose.Schema({
	name: {
		type: String
	},
	link: {
		type: String
	},
	ss:{
		type: Img
	},
	pp: { type: Img
	}
});	*/

// Student Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index:true,
		unique: true
	},
	password: {
		type: String
	},
	name: {
		type: String
	},
	img: {
		type: String
	}


});

UserSchema.plugin(uniqueValidator);



var Student = module.exports = mongoose.model('Student', UserSchema);

module.exports.createStudent = function(newStudent, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newStudent.password, salt, function(err, hash) {
	        newStudent.password = hash;
	        newStudent.save(callback);
	    });
	});
}

module.exports.getStudentByUsername = function(username, callback){
	var query = {username: username};
	Student.findOne(query, callback);
}

module.exports.getStudentById = function(id, callback){
	Student.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

module.exports.compareUsername = function(username,callback){
	Student.findOne({username: username},callback)

}