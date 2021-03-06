// jshint esversion: 6
// friends data module
var md5 = require('md5');

module.exports = function apiRoutes() {
    var friends = require('../data/friends');
    var authToken = "";
    friends.init();
    
    app.post("/api/login", function(req, res) {
        var password= req.body.password;
        console.log("login attempt");
        console.log('username = ' + req.body.username + ', password = ' + password);
        var authtoken = friends.login(req.body.username, password);
        if (authtoken[0] == "!") {
            // error message
            message = authtoken.slice(1);
            res.redirect("/login?message="+message);
        }
        else {
            res.redirect("/welcome" +
                "?username=" + req.body.username +
                "&authtoken=" + authtoken);
        }        
    });
    
    app.get("/api/friends", function(req, res) {
        res.send("everyone is your friend.");
    });

    app.post("/api/answer", function(req, res) {
        // received an answer to a survey question
        console.log('question: ' + req.body.question);
        console.log('answered: ' + req.body.answer);
        // hash the question text so 
        friends.uploadSurveyData(req.body.username, req.body.authtoken, md5(req.body.question), req.body.answer);
        res.send('ok');
    });

    app.post("/api/register", function(req, res) {
        console.log("registering new user...");
        var message = friends.newUser(req.body);
        if (message[0] == "!") {
            // fail message
            console.log(message);
            message = message.slice(1);  // -"!"
            // redirect to register page and try again
            // the query parameter will be displayed as an error message
            res.redirect("/register?message="+message);
        }
        else {
            // send to welcome page
            console.log("registered.");
            res.redirect("/welcome");
        }
        console.log("success? " + message);
    });

    app.get("/api/user/:username", function (req, res) {
        // send back info on this user
        res.json(friends.user(req.params.username));
    });

    app.post("/api/edit", function (req, res) {
        // get the user object
        console.log(req.body.authtoken);
        var thisUser = friends.user(req.body.username);
        var message = friends.editUser(
            req.body.username || thisUser.username,
            req.body.authtoken,
            req.body.password,
            req.body.oldPassword,
            req.body.confirmPassword,
            req.body.gender || thisUser.gender,
            req.body.age || thisUser.age,
            req.body.bio || thisUser.bio,
            req.body.location || thisUser.location,
            req.body.imgURL || thisUser.imgURL
        );
        if (message[0] == "!") {
            // fail message
            console.log(message);
            message = message.slice(1);  // -"!"
            // redirect to register page and try again
            // the query parameter will be displayed as an error message
            res.redirect("/edit" +
                "?username=" + req.body.username +
                "&authtoken=" + req.body.authtoken +
                "&message=" + req.body.message
            );
        }
        else {
            // send to welcome page
            console.log("edited.");
            res.redirect("/welcome" +
                "?username=" + req.body.username +
                "&authtoken=" + req.body.authtoken
            );
        }
        console.log("success? " + message);
    });

    app.get("/api/match", function (req, res) {
        // get all previous survey results, see who matches most closely
        // var allFriends = friends.all();
        // Object.keys(allFriends).forEach(key => {
        //     console.log(allFriends[key].username);
        // });
        var matches;
        if (!req.query.index) {
            // compile best matches from the database
            matches = friends.getMatches(req.query.username, req.query.authtoken);
            // give them the top match
            req.query.index = 0;
        }
        else {
            matches = friends.user(req.query.username).matches;
        }
        // if we are out of users, go back to zero again
        if (req.query.index >= matches.length) req.query.index = 0;
        // or if we're below zero, go back to the end
        if (req.query.index < 0) req.query.index = matches.length - 1;
        
        // send them to the 'match' page
        res.redirect("/html/match.html" +
            "?username=" + req.query.username +
            "&authtoken=" + req.query.authtoken +
            "&match=" + matches[req.query.index].username +
            "&index=" + req.query.index);
        // res.send("You don't match with anyone.  You will always be lonely.");
    });

    app.get("/api/:user/profilepic", function (req, res) {
        res.send(friends.user(req.params.user).imgURL);
    });

    app.get("/api/matchstatic", function (req, res) {
        console.log("matching " + req.query.user1 + " with " + req.query.user2 + ".");
        // find the match percentage between these two users and send it back
        var matchPercent = friends.getMatchPercent(req.query.user1, req.query.user2);
        console.log(matchPercent + "%.");
        res.send(matchPercent.toString() + "% match.");
    });
};