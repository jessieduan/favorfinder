
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
            resources: ["Bike", "A car", "Hulu Plus", "Guitar"]},
        {name: "Heidi Wang", email: "heidiw@stanford.edu", pic: "/images/heidi_profile.jpg",
            resources: ["CS147!", "A car", "Hulu Plus"]}
    ]);
    
    users.find({}, function(e, docs) {
        var yongxing = docs[0];
        var jessie = docs[1];
        var ben = docs[2];
        var heidi = docs[3];

        postings.insert([
            {user: yongxing, name: "Boba", description: "Can someone get me some boba?",
                isPrivate: true, status: STATUS.UNCLAIMED, comments: [], isOffer: false,
                target: jessie},
            {user: ben, name: "Colored Pants", description: "I need more colored pants!",
                isPrivate: false, status: STATUS.UNCLAIMED, comments: [], isOffer: false,
                target: yongxing},
            {user: yongxing, name: "Longboard", description: "I want to learn how to longboard!",
                isPrivate: false, status: STATUS.CLAIMED, claimer: ben, isOffer: false,
                comments: [generateComment(ben, "I got you dude!")]},
            {user: ben, name: "Identity Parade", description: "Would someone listen to our latest album and give us some feedback?", 
                isPrivate: false, status: STATUS.COMPLETE, isOffer: false,
                claimer: heidi, comments: [generateComment(heidi, "It sounds really good! You are a rock star, Ben!")]},
            {user: jessie, name: "Ice Blocking", description: "Anyone have giant blocks of ice?",
                isPrivate: false, status: STATUS.UNCLAIMED, comments: [], isOffer: false},
            {user: ben, name: "Hug", description: "Heidi, can you give me a hug please?",
                isPrivate: true, status: STATUS.UNCLAIMED, comments: [], isOffer: false,
                target: heidi},
            {user: heidi, name: "Grade assignments", description: "Can someone help me grade all these CS147 assignments?",
                isPrivate: false, status: STATUS.CLAIMED, comments: [], isOffer: false,
                claimer: jessie},
            {user: jessie, name: "GTGTC", description: "Spam the high schoolers!",
                isPrivate: false, status: STATUS.CLAIMED, comments: [], isOffer: false,
                claimer: heidi},
            {user: heidi, name: "Donuts!", description: "I have a dozen Happy Donuts! Come get it :)",
                isPrivate: false, status: STATUS.UNCLAIMED, comments: [], isOffer: true}
        ]);
    });
}

exports.addUser = function(params, callback) {
    function randomString() {
        return Math.floor((Math.random() * 10000) + 1);
    }
    var name = params.name || ("No Name " + randomString());
    var email = params.email || (randomString() + "@gmail.com");
    var resources = [];
    var pic = "/images/icons/icon_" + Math.floor(Math.random() * 13 + 1) + ".png";
    users.insert({
        name: name,
        email: email,
        resources: resources,
        pic: pic
    }, function(e, docs) {
        callback(e, docs);
    });
}

exports.addOrFindUser = function(params, callback) {
    function randomString() {
        return Math.floor((Math.random() * 10000) + 1);
    }
    var name = params.name || ("No Name " + randomString());
    users.findOne({
        name: name
    }, function(e, docs) {
        if (docs)
            callback(e, docs);
        else
            exports.addUser(params, callback); 
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
    query_str = params.query_str || "";
    num = params.num || 30;

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

exports.findPostingById = function(params, callback) {
    query_str = params.query_str || "";
    postings.find({_id: query_str}, {}, function(e, docs) {
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

exports.removePosting = function(user, id, callback) {
    postings.remove(
        {"_id": id}
    );
}
        
exports.removeUser = function(user, id, callback) {
    users.remove(
        {"_id": id}
    );
}
        
