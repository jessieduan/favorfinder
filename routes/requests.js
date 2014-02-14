
// Get all of our friend data
//var data = require('../data.json');

exports.view = function(req, res){
	res.render('requests', { title: 'My Requests' , page: 'requests'});
};