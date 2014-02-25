var model = require('../model');
var helpers = require('../helpers');


exports.view = function(req, res){
	user_id = req.params.id || req.cookies.user;
    model.findUser(user_id, function(e, user) {
        if (user) {
        	console.log(user);
            res.render('requests', { 
            	title: 'Favors', 
            	page: 'requests',
            	user: user
            });
        }
    });
};