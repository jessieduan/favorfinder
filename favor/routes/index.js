var model = require('../model');
var helpers = require('../helpers');

exports.view = function(req, res){
    res.render('index', { title: 'Express' });
};

