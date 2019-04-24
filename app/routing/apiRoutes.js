// jshint esversion: 6
// friends data module
module.exports = function apiRoutes() {
    var friends = require('../data/friends');
    var authToken = "";
    friends.init();
    
    app.post("/login", function(req, res) {
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
    
    app.get("/survey-basic", function (req, res) {
        
    });

    app.get("/friends", function(req, res) {
        res.send("everyone is your friend.");
    });

    app.post("/register", function(req, res) {
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

};