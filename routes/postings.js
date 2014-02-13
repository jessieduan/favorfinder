var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user) {
    var query_str = req.query.query || "";
    var params = {
        query_str: query_str
    };
    model.findPostings(params, function(e, postings) {
        res.render('postings', {
            postings: postings
        });
    });
});

exports.add = helpers.verifyLogin(function(req, res, user) {
    console.log(req.query);
    var name = req.query.name + " this";
    var description = req.query.description + " descr";
    var notifiers = req.query.notifiers;
    var isPrivate = (req.query.private == "on") ? true: false
    var helpOthers = true;

    var params = {
        user: user,
        name: name,
        description: description,
        notifiers: notifiers,
        isPrivate: isPrivate,
        helpOthers: helpOthers
    };

    model.addPosting(user, params, function(e, postings) {
        res.json(e);
    });
});
