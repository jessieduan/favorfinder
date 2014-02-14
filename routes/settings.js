/*exports.view = function(db) {
	function(req, res){
		var collection = db.get('usercollection');
		collection.find({},{},function(e,docs){
		res.render('settings', {
			"friendlist": docs
		});
	});
	res.render('settings', { title: 'Express' });
};*/

var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user){
	res.render('settings', { title: 'Express' });
});

