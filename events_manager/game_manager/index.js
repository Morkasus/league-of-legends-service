'use strict'

module.exports = class GameManager {
    
    constructor() {
        var gameCounter = 0;
    }
    
    startGame(players, eventId, callback) {
        var teams = splitTeams(randomPlayers(players));
        var scores = randomScore();
        console.log("Winnres: " + teams.winTeam);
        console.log("loses: " + teams.loseTeam);
        console.log("winScore: " + scores.winScore);
        console.log("loseScore: " + scores.loseScore);
        callback(sendResult(eventId, teams, scores));
    }
    
}


function splitTeams(players) {
    return {'winTeam': players.splice(0, Math.floor(players.length/2)),
        'loseTeam': players}
}

function randomPlayers(players) {
    for (var i = players.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * i);
        var temp = players[i];
        players[i] = players[j];
        players[j] = temp;
    }
    return players;
}

function randomScore() {
    var score1, score2;
    var scores = {};
    score1 = Math.floor((Math.random() * 1000) + 1);
    score2 = Math.floor((Math.random() * 1000) + 1);
    if (score1 == score2) score1++;
    if(score1 > score2) {
        scores["winScore"] = score1;
        scores["loseScore"] = score2;
    } else {
        scores["winScore"] = score2;
        scores["loseScore"] = score1;
    }
    return scores
}

function sendResult(eventId, teams, scores) {
    var newGame = {
        "eventId" : Number(eventId),
        "winScore" : scores.winScore,
        "loseScore" : scores.loseScore,
        "winTeam" : teams.winTeam,
        "loseTeam" : teams.loseTeam
    };
    return newGame;
} 