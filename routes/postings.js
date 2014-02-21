var model = require('../model');
var helpers = require('../helpers');

exports.view = helpers.verifyLogin(function(req, res, user) {
    var query_str = req.query.query || "";
    var params = {
        query_str: query_str
    };
    model.findPostings(params, function(e, postings) {
        res.json({
            "postings": postings,
            "user": user
        });
    });
});

exports.add = helpers.verifyLogin(function(req, res, user) {
    model.addPosting(user, req.body, function(e, postings) {
        res.json(e ? "Error" : "Success");
    });
});

exports.claim = helpers.verifyLogin(function(req, res, user) {
    model.claimPosting(user, req.params.id);
    res.json("Success");
});

exports.unclaim = helpers.verifyLogin(function(req, res, user) {
    model.unclaimPosting(user, req.params.id);
    res.json("Success");
});

exports.complete = helpers.verifyLogin(function(req, res, user) {
    model.completePosting(user, req.params.id);
    res.json("Success");
});

exports.comment = helpers.verifyLogin(function(req, res, user) {
    model.commentPosting(user, req.params.id, req.body.comment);
    res.json("Success");
});
