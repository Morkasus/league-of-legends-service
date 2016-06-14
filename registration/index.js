'use strict'

var mongoose = require('mongoose');
mongoose.connect("mongodb://admin:123456@ds019033.mlab.com:19033/league_of_legends");
var User = require('./user');
var Key = require('./key');

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = class Registration {
    
    login(userName, password, callback) {
        //mongoose.connect("mongodb://admin:123456@ds019033.mlab.com:19033/league_of_legends");
        //Open Connection !!
        var res = {};
        var status = "success";
        User.find({'userName': userName, 'password': password}, function(err, docs) {
            if (err) throw err;
            if(!docs || !Array.isArray(docs) || docs.length === 0) status = "failed";
            else {
                res["user"] = docs[0].userName;
                res["isAdmin"] = docs[0].isAdmin;
            }
            res["status"] = status;
            console.log("User " + res.status + " Found");
            callback(res);
        });
    }
    
    insertKey(key, callback) {
        var res = {};
        var status = "success";
        Key.find({'key': key}, function(err, docs) {
            if (err) throw err;
            console.log(docs.length);
            if(!docs || !Array.isArray(docs) || docs.length === 0) status = "failed";
            else {
                docs.forEach( function (doc) {
                    doc.remove();
                }); 
            }
            res["status"] = status;
            console.log("Key " + res.status + " to Removed");
            callback(res);
        });
    }
    
    createUser(userName, password, mail, firstName, lastName, callback) {
        var res = {};
        var status = "success";
        var newUser = new User({
            "userName": userName,
            "password": password,
            "email": mail,
            "firstName": firstName,
            "lastName": lastName,
            "img": "images/users/user1.jpeg",
            "gamesCounter": 0,
            "wins": 0,
            "loses": 0,
            "teamImg": "images/users/team1.jpeg",
            "isAdmin": false,
            "games": []
        });
        newUser.save(function(err, user) {
            if (err) status = "failed";
            res["status"] = status;
            console.log("Saved " + res + "\n");  
            callback(res);
        });
    }
    
    logout() {
        //Close Connection !!
        mongoose.disconnect();
        console.log("disconnect mLab")
    }
    
    openConnection() {}
    closeConnection() {}
}
