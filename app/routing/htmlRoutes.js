// jshint esversion: 6
path = require("path");

module.exports = function htmlRoutes() {
    app.get("/login", function(req, res) {
        console.log("login page");
        res.sendFile(path.join(__dirname, "..", "public", "login.html"));
    });
    
    app.get("/register", function(req, res) {
        console.log("register page");
        res.sendFile(path.join(__dirname, "..", "public", "register.html"));
    });
    
    app.get("/", function (req, res) {
        console.log("home page");
        res.sendFile(path.join(__dirname, "..", "public", "home.html"));
    });
    
    app.get("/survey-basic", function (req, res) {
        console.log("basic survey requested");
        res.redirect("/survey-basic.html" + 
            "?username=" + req.query.username +
            "&authtoken=" + req.query.authtoken);
    });

    // app.get("/survey-advanced", function (req, res) {
    //     console.log("extra survey requested");
    //     res.sendFile(path.join(__dirname, "..", "public", "survey-advanced.html"));
    // });

    app.get("/welcome", function (req, res) {
        console.log("welcome to friendFinder!");
        res.redirect("/welcome.html" +
            "?username=" + req.query.username +
            "&authtoken=" + req.query.authtoken);
        // res.sendFile(path.join(__dirname, "..", "public", "welcome.html"));
    });

    // send message page
    app.get("/message", function (req, res) {
        console.log("message page");
        res.sendfile(path.join(__dirname, "..", "public", "message.html"));
    });

    app.get("/friends", function (req, res) {
        res.send("Everyone is your friend.");
    });
};
