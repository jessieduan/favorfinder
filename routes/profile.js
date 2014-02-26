var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, me){
    user_id = req.cookies.user;
    prof_user_id = req.params.id || user_id;
    var user;
    model.findUser(user_id, function(e, found_user) {
        if(found_user){
            user = found_user;
        }
    });
    model.findUser(prof_user_id, function(e, prof_user) {
        if (prof_user) {
            res.render('profile', { 
                title: prof_user.name,
                page: 'profile',
                user: user,
                prof_user: prof_user,
                show_buttons: (me.name !== prof_user.name)
            });
        }
    });
});
