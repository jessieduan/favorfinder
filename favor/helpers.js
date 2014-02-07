var model = require('./model');

exports.verifyLogin = function(func) {
    return function(req, res) {
        var user_id = req.cookies.user;
        var url = req.url;
        model.findUser(user_id, function(e, docs) {
            if (!docs) {
                res.redirect('/login');
            } else {
                var user = docs;
                func(req, res, user);
            }
        });
    };
};
