var model = require('../model');
var helpers = require('../helpers');

exports.login_super = function(req, res) {
    model.findAllUsers(function(e, users) {
        res.render('login', {
            users: users
        });
    });
};

exports.login = function(req, res) {
    res.render('login_guest'); 
}

exports.add_user = function(req, res) {
    var name = req.query.name;
    var email = req.query.email;

    var params = {
        name: name,
        email: email
    };

    model.addUser(params, function(e, docs) {
        res.json(docs);
    });
};

exports.post_login = function(req, res){
    // default user and redirect address
    var redirect_url = req.query.url || "/";
    var user_id = req.query.user || "52f40f941b77fc44b9000001";

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

exports.logout = function(req, res){
    res.clearCookie('user');
    res.redirect('login');
};

exports.reset = function(req, res) {
    res.clearCookie("user");
    model.reloadData();
    res.json("Data reloaded. You need to re-login.");
}

exports.view_users = helpers.verifyLogin(function(req, res, me) {
    model.findAllUsers(function(e, users) {
        res.json({
            "me": me,
            "users": users
        });
    });
});
