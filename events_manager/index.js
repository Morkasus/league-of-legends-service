'use strict'

//modules
var mongoose = require('mongoose');
var GameManager = require('./game_manager');

//models
var Event = require('./event.js');
var Game = require('./game.js');
var User = require('../registration/user.js');
var gameManager = new GameManager();

mongoose.connect("mongodb://admin:123456@ds019033.mlab.com:19033/league_of_legends");

var _eventID;
function getEventId(callback) {
    Event.findOne({}).sort('-eventId').exec( function(err, doc) {
        if (err) throw err;
        callback(doc.eventId);
    });
}


module.exports = class EventsManager {
    
    constructor() {
        getEventId(function(id) {
            _eventID = id;
        });
    }
    
    showEvents(callback) {
        //that hide=false
        Event.find({"hide":false},{'_id': false, 'hide':false},function(err, events) {
            if (err) throw err;
            console.log(events);
            callback(events);
        });
    }
    
    
    
    startEvent(eventId, callback) {
        var gameRes = {};
        var status = "success", msg = "ok";
        
        Event.findOne({"eventId":eventId},function(err, event) {
            if (err) {
                    status = "failed";
                    msg = "failed: can't find event number ";
                }
            User.find({"userName": {$in:event.players}}, function(err, users) {
                var i;
                if (err) {
                    status = "failed";
                    msg = "failed: can't find the users";
                }
                console.log(users);
                console.log(users[0].games.length);
                gameManager.startGame(event.players, eventId, function(result) {
                    var newGameResult = new Game(result);
                    newGameResult.save(function(err, game) {
                        if (err) {
                            status = "failed";
                            msg = "failed: can't save the game result";
                        } else {
                            for(var i=0; i<users.length; i++) {
                                if(result.winTeam.indexOf(users[i].userName) > -1) {
                                    users[i].wins++;
                                } else  users[i].loses++;
                                if(users[i].games.indexOf(eventId) == -1) users[i].games.push(eventId);
                                users[i].save();
                            }
                        }
                        gameRes["status"] = status;
                        gameRes["message"] = msg;
                        callback(gameRes);
                    });
                });
            });
        });
    }
    
    
    createEvent(eventName, location, description, callback) {
        _eventID++;
        var res = {};
        var status = "success";
        var newEvent = new Event({
            "eventId": _eventID,
            "eventName": eventName,
            "playerCounter": 0,
            "location": location,
            "eventImg": "images/events/event1.jpeg",
            "description": description,
            "players": [],
            "hide": false,
            "started": false
        });
        newEvent.save(function(err, user) {
            if (err) {
                status = "failed";
                _eventID--;
            }
            res["status"] = status;
            console.log("Saved " + res + "\n");  
            callback(res);
        });
    }
    
    
    hideEvent(eventId, callback) {
        var res = {};
        var status = "success";
        Event.findOne().where("eventId",eventId).exec(function(err,docs){
            if(docs.length === 0) status = "failed";
            else{
                var updateQuery = docs.update({$set:{hide : true}}).exec(function(err,doc){
                    if(err) status = "failed";
                });
            }
            res["status"] = status;
            console.log("update hide: " + res + "\n");  
            callback(res);
        });
    }
    
    
    joinEvent(eventId, userName, callback) {
        var res = {};
        var status, msg, players, playerCounter;
        status = "success";
        msg = "ok";
        players = [];
        playerCounter = 0;
        Event.findOne().where("eventId", eventId).exec(function(err, doc){
            console.log(doc);
            if(!doc) {
                status = "failed";
                msg = "Event not exist";
            } else if(doc.players.indexOf(userName) > -1) {
                status = "failed";
                msg = "User already joined to this event";
                players = doc.players;
                playerCounter = doc.playerCounter;
            } else if(doc.playerCounter == 6) {
                status = "failed";
                msg = "There is no place to join";
                players = doc.players;
                playerCounter = doc.playerCounter;
            }
            else{
                doc.players.push(userName);
                doc.playerCounter++;
                doc.save();
                players = doc.players;
                playerCounter = doc.playerCounter;
            }
            res["status"] = status;
            res["msg"] = msg;
            res["players"] = players;
            res["playerCounter"] = playerCounter;
            console.log("update hide: " + res + "\n");  
            callback(res);
        });
    }
    
    
    
    leaveEvent(eventId, userName, callback) {
        var res = {};
        var status, msg, players, playerCounter;
        status = "success";
        msg = "ok";
        players = [];
        playerCounter = 0;
        Event.findOne().where("eventId", eventId).exec(function(err, doc){
            if(!doc) {
                status = "failed";
                msg = "Event not exist";
            } else if(doc.playerCounter == 0) {
                status = "failed";
                msg = "the player list is empty";
                players = doc.players;
                playerCounter = doc.playerCounter;
            }
            else{
                var index = doc.players.indexOf(userName);
                if(index != -1){
                    doc.players.splice(index, 1);
                    doc.playerCounter--;
                    doc.save();
                } else {
                    status = "failed";
                    msg = userName + " not include in the player list";
                }
                players = doc.players;
                playerCounter = doc.playerCounter;
            }
            res["status"] = status;
            res["msg"] = msg;
            res["players"] = players;
            res["playerCounter"] = playerCounter;
            console.log("update hide: " + res + "\n");  
            callback(res);
        });    
    }
    
}