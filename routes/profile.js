var model = require('../model');
var helpers = require('../helpers');

exports.view = function(req, res){
    // default user and redirect address

    user_id = req.cookies.user
    model.findUser(user_id, function(e, user) {
        if (user) {
            res.render('profile', { 
                title: user.name,
                page: 'profile',
                user: user
            });
        }
    });

/*
    var redirect_url = req.param.url || "/profile";
    var user_id = req.param.user || "52f40f941b77fc44b9000001";

    model.findUser(user_id, function(e, docs) {
        if (docs) {
            res.cookie('user', docs._id, {
                maxAge: 900000,
                httpOnly: true
            });
        }
        res.redirect(redirect_url);

    });
*/
};
