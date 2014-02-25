
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

function generateComment(user, comment) {
    return {
        "user": user,
        "comment": comment
    };
}

exports.reloadData = function(func) {
    users.remove();
    postings.remove();

    users.insert([
        {name: "Yongxing Deng", email: "yxdeng@stanford.edu", pic: "/images/yongxing_profile.jpg",
            resources: ["SanGuoSha", "A car"]},
        {name: "Jessie Duan", email: "jduan1@stanford.edu", pic: "/images/jessie_profile.jpg",
            resources: ["Awesomeness", "RCC"]},
        {name: "Ben McKenzie", email: "bmckenzie@stanford.edu", pic: "/images/ben_profile.jpg",
            resources: ["Bike", "A car", "Hulu Plus", "Guitar"]}
    ]);
    
    users.find({}, function(e, docs) {
        var yongxing = docs[0];
        var jessie = docs[1];
        var ben = docs[2];

        postings.insert([
            {user: yongxing, name: "Boba", description: "Can someone get me some boba?",
                isPrivate: true, status: STATUS.UNCLAIMED, comments: [], is_offer: false},
            {user: ben, name: "More colored pants", description: "Can't live without them",
                isPrivate: false, status: STATUS.UNCLAIMED, comments: [], is_offer: false},
            {user: yongxing, name: "Longboard", description: "I want to learn how to longboard!",
                isPrivate: false, status: STATUS.CLAIMED, claimer: ben, is_offer: false,
                comments: [generateComment(ben, "I got you dude!")]},
            {user: ben, name: "Identity Parade", description: "Would someone listen to our latest album and give us some feedback?", 
                isPrivate: false, status: STATUS.COMPLETE, is_offer: false,
                claimer: jessie, comments: [generateComment(jessie, "It sounds really good! You are a rock star, Ben!")]}
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

exports.addResource = function(user, resource, callback) {
    postings.update(
        {"_id": user._id},
        {$push: {"resources": resource}}
    );
}
        
//POSTINGS

exports.addPosting = function(user, params, callback) {
    params.status = STATUS.UNCLAIMED;
    params.user = user;
    params.comments = [];
    params.isPrivate = params.isPrivate || false;
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

exports.claimPosting = function(user, id, callback) {
    postings.update(
        {"_id": id},
        {$set: {"status": STATUS.CLAIMED,
                "claimer": user}}
    );
}


exports.unclaimPosting = function(user, id, callback) {
    postings.update(
        {"_id": id},
        {$set: {"status": STATUS.UNCLAIMED},
         $unset: {"claimer": ""}}
    );
}

exports.completePosting = function(user, id, callback) {
    postings.update(
        {"_id": id},
        {$set: {"status": STATUS.COMPLETE}}
    );
}

exports.commentPosting = function(user, id, comment, callback) {
    postings.update(
        {"_id": id},
        {$push: {"comments": generateComment(user, comment)}}
    );
}
        
