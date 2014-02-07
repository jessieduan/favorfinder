// database stuff
var mongo = require('mongodb');
var ObjectId = mongo.ObjectID;

var monk = require('monk');
var db = monk('localhost:27017/favorfinder');

var users = db.get('users');
var postings = db.get('postings');
var favors = db.get('favors');

exports.findUser = function(user_id, callback) {
    users.findOne({
        _id: new ObjectId(user_id)
    }, function(e, docs) {
        callback(e, docs)
    });
}
