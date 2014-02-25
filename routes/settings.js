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
	user_id = req.params.id || req.cookies.user;
    model.findUser(user_id, function(e, user) {
        if (user) {
        	console.log(user);
            res.render('settings', { 
            	title: 'Settings', 
            	page: 'settings',
            	user: user
            });
        }
    });
});
