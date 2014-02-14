var model = require('../model');
var helpers = require('../helpers');

exports.view = function(req, res, user){
    res.render('index', { 
        title: 'Favor Finder'
    });
};

