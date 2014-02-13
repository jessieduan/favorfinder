var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user) {
    var query_str = req.query.query || "";
    var params = {
        query_str: query_str
    };
    model.findPostings(params, function(e, postings) {
        res.json(postings);
    });
});

exports.add = helpers.verifyLogin(function(req, res, user) {
    model.addPosting(user, req.body, function(e, postings) {
        res.json(e ? "Error" : "Success");
    });
});
