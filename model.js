
// database stuff
var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;
var TimeStamp = mongo.Timestamp;

var monk = require('monk');

var db_addr = process.env.MONGOHQ_URL || "localhost:27017/favor";
var db = monk(db_addr);

var users = db.get('users');
var postings = db.get('postings');

STATUS = {UNCLAIMED: "unclaimed", CLAIMED: "claimed", COMPLETE: "complete"};

// USERS

exports.reloadData = function(func) {
    users.remove();
    postings.remove();

    users.insert([
        {name: "Yongxing Deng", email: "yxdeng@stanford.edu", pic: "https://www.google.com/images/srpr/logo11w.png"},
        {name: "Jessie Duan", email: "jduan1@stanford.edu", pic: "https://www.google.com/images/srpr/logo11w.png"},
        {name: "Ben McKenzie", email: "bmckenzie@stanford.edu", pic: "https://www.google.com/images/srpr/logo11w.png"}
    ]);
    
    users.find({}, function(e, docs) {
        var user1 = docs[0];
        var user2 = docs[1];
        var user3 = docs[2];

        postings.insert([
            {user: user1, name: "Boba", description: "Can someone get me some boba?",
                isPrivate: true, status: CONSTANTS.STATUS.UNCLAIMED},
            {user: user3, name: "More colored pants", description: "Can't live without them",
                isPrivate: false, status: CONSTANTS.STATUS.UNCLAIMED}
        ]);
    });
}

exports.addUser = function(params, callback) {
    var name = params.name;
    var email = params.email;
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
    params.status = "Unclaimed";
    postings.insert(params, function(e, docs) {
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


