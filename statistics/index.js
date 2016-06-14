'use strict'

var mongoose = require('mongoose');
mongoose.connect("mongodb://admin:123456@ds019033.mlab.com:19033/league_of_legends");
var User = require('../registration/user.js');
var Game = require('../events_manager/game.js');

module.exports = class Statistics {
    showAchievements(userName,callback) {
    	User.findOne({ 'userName': userName}, function (err, user) {
            console.log(user);
  			if (err) callback({});
  			//contain win count. 
  			var userWin = user.wins;
  			//contain losses count.
  			var userLoses = user.loses;
  			//getting all user games.
  			Game.find(({'eventId':{$in: user.games}}),function(err, games) {
  				//sorting games with eventId.
  				games = sortArray(games);
  				//last game after sorting.
                var lastGame;
                if(games.length > 0) 
  		            lastGame = games[games.length-1];
                else lastGame = false;
  				//getting last victory (runing on all games from last to first).
  				var lastVictory = getLastVictory(games,userName),
  					//getting last defet (runing on all games from last to first).
  					lastDefet = getLastDefet(games,userName),
  					//getting all friends from last macth.
  					friendsFromLastMacth = getFriends(lastGame,userName);
  				console.log("lastVictory" + lastVictory);
  				console.log("lastDefet" + lastDefet);	
  				var showAchievementsJson = {};
  				showAchievementsJson["userWin"]              = 	userWin;
  				showAchievementsJson["userLoses"]            =  userLoses;
  				showAchievementsJson["lastVictory"]          = 	lastVictory;
  				showAchievementsJson["lastDefet"]            = 	lastDefet;
  				 showAchievementsJson["lastGame"]            = lastGame;
  				showAchievementsJson["friendsFromLastMacth"] = 	friendsFromLastMacth;
  				callback(showAchievementsJson);
			})
		})
    }
}
    //Helpers methods
    function getFriends(lastGame,userName) {
    	var friendsArray = [];
    	//runing on winTeam array to take friends
        console.log(userName);
        if(lastGame.winTeam == undefined) return false;
    	for (var i = 0; i < lastGame.winTeam.length ; i++){
 			//if found user continue
 			if (lastGame.winTeam[i] == userName) continue;
 			friendsArray.push(lastGame.winTeam[i]);
    	}
    	//runing on loseTeam array to take friends
    	for (var i = 0; i < lastGame.loseTeam.length ; i++){
 			//if found user continue
 			if (lastGame.loseTeam[i] == userName) continue;
 			friendsArray.push(lastGame.loseTeam[i]);
    	}
        if(friendsArray == []) return false;
    	return friendsArray;		
    }

    function getLastVictory(games,userName) {
        if(games == undefined) return false;
    	//runing on games (sorted) from the last game down
    	for (var i = games.length-1 ; i >= 0 ; i--){
    		if(games[i].winTeam.indexOf(userName) > -1){
    			//found last win and returning it
    			return games[i]; 
    		}
    	}
    	//user don't have any wins.
    	return false;
    }
    function getLastDefet(games,userName) {
        if(games == undefined) return false;
    	//runing on games (sorted) from the last game down
    	for (var i = games.length-1 ; i >= 0 ; i--){
    		if(games[i].loseTeam.indexOf(userName) > -1){
    			//found last loss and returning it
    			return games[i]; 
    		}
    	}
    	//user don't have any losses.
    	return false;
    }
    //prepare json file. 
    function sendResult() {


    }

    //git sort game function
    function sortArray(array){
    	array.sort(function (a, b) {
		  if (a.eventId > b.eventId) {
		    return 1;
		  }
		  if (a.eventId < b.eventId) {
		    return -1;
		  }
		  return 0;
		});
		return array;
    }