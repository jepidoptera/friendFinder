// jshint esversion: 6
// friends data module
module.exports = function apiRoutes() {
    var friends = require('../data/friends');
    var authToken = "";
    friends.init();
    
    app.post("/api/login", function(req, res) {
        var password= req.body.password;
        console.log("login attempt");
        console.log('password = ' + password);
        var attempt = friends.login(req.body.username, password);
        if (attempt[0] == "!") {
            // error message
            message = attempt.slice(1);
            res.redirect("/login?message="+message);
        }
        else {
            res.redirect("/welcome");
        }        
    });
    
    app.get("/api/friends", function(req, res) {
        res.send("everyone is your friend.");
    });

    app.post("/api/answer", function(req, res) {
        // received an answer to a survey question
        console.log('answered: ' + req.body.answer);
        res.send('ok');
    });

    app.post("/api/register", function(req, res) {
        console.log("registering new user...");
        var success = friends.newUser(req.body);
        var message = "";
        if (success[0] == "!") {
            // fail message
            message = success.slice(1);
            success = false;
        }
        console.log("success? " + success);
        // send to welcome page
        if (success) res.redirect("/welcome");
        else {
            // failed, show problem
            // alert (message);
            res.redirect("/register?message="+message);
        }
    });

    app.post("/api/match", function (req, res) {
        res.send("You don't match with anyone.  You will always be lonely.");
    });
};