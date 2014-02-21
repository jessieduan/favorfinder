var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user){
    user_id = req.cookies.user
	model.findUser(user_id, function(e, user) {
        if (user) {
            res.render('index', { 
	        	title: 'Favor Finder',
	        	page: 'index',
	        	user: user
	    	});
        }
    });

});

