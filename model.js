// database stuff
var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;
var TimeStamp = mongo.Timestamp;

var monk = require('monk');

var db_addr = process.env.MONGOHQ_URL || "localhost:27017/favor";
var db = monk(db_addr);

var users = db.get('users');
var postings = db.get('postings');
var favors = db.get('favors');

// USERS

exports.addUser = function(params, callback) {
    var name = params.name || "BEN";
    var email = params.email || "stupid@stupid.com";
    users.insert({
        name: name,
        email: email
    }, function(e, docs) {
        callback(e, docs);
    });
}
        

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
    var helpOthers = params.helpOthers || false;

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
            name: {$regex: /.*query.*/},
            description: {$regex: /.*query.*/}
        };
    }
    
    postings.find(query, {
        sort: {_id: -1}, 
        limit: num
    }, function(e, docs) {
        callback(e, docs)
    });
};


