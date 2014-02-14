var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user){
    res.render('index', { 
        title: 'Express'
    });
});

