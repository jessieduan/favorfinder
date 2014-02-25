var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, me){
    user_id = req.params.id || req.cookies.user;
    model.findUser(user_id, function(e, user) {
        if (user) {
            console.log("rendering");
            console.log(user);
            console.log(me);
            console.log(me._id);
            console.log(user._id);
            res.render('profile', { 
                title: user.name,
                page: 'profile',
                user: user,
                show_buttons: (me._id != user._id)
            });
        }
    });
});
