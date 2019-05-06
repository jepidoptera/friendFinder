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

    app.get("/api/match", function (req, res) {
        res.send("You don't match with anyone.  You will always be lonely.");
    });
};