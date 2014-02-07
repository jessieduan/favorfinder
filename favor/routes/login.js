var model = require('../model');

exports.view = function(req, res) {
    res.json('login');
};
var helpers = require('../helpers');

exports.login = function(req, res){
    // default user and redirect address
    var redirect_url = req.param.url || "/";
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
};
