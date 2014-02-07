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
    var name = req.query.name + " this";
    var description = req.query.description + " descr";
    var notifiers = [];
    var helpOthers = true;

    var params = {
        user: user,
        name: name,
        description: description,
        notifiers: notifiers,
        helpOthers: helpOthers
    };

    model.addPosting(user, params, function(e, postings) {
        res.json(e);
    });
});
