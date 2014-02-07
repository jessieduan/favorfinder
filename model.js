// database stuff
var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;
var TimeStamp = mongo.Timestamp;

var monk = require('monk');
var db = monk('localhost:27017/favor');

var users = db.get('users');
var postings = db.get('postings');
var favors = db.get('favors');

// USERS

exports.findUser = function(user_id, callback) {
    users.findOne({
        _id: new ObjectId(user_id)
    }, function(e, docs) {
        callback(e, docs)
    });
}

exports.findAllUsers = function(callback) {
    users.find({}, function(e, docs) {
        callback(e, docs);
    });
}

//POSTINGS

exports.addPosting = function(user, params, callback) {
    var name = params.name || "" ; 
    var description = params.description || "";
    var notifiers = params.notifiers || [];
    var helpOthers = params.helpOthers;

    if (!user || !name) {
        callback("Error!");
    }

    postings.insert({
        user: user,
        name: name,
        description: description,
        notifiers: notifiers,
        helpOthers: helpOthers
    }, function(e, docs) {
        callback(e, docs);
    });
}

exports.findPostings = function(params, callback) {
    query_str = params.uery_str || "";
    num = params.num || 10;

    query = {};
    if (query_str) {
        query[$or] = {
            name: /.*query.*/,
            description: /.*query.*/
        };
    }
    
    postings.find(query, {
        sort: {_id: -1}, 
        limit: num
    }, function(e, docs) {
        callback(e, docs)
    });
};


