/*exports.view = function(db) {
	function(req, res){
		var collection = db.get('usercollection');
		collection.find({},{},function(e,docs){
		res.render('settings', {
			"friendlist": docs
		});
	});
	res.render('settings', { title: 'Express' });
};*/

exports.view = function(req, res){
	res.render('settings', { title: 'Settings' });
};

