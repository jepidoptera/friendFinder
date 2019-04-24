// jshint esversion: 6
path = require("path");

module.exports = function htmlRoutes() {
    app.get("/login", function(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "login.html"));
    });
    
    app.get("/register", function(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "register.html"));
    });
    
    app.get("/", function(req, res) {
        res.sendFile(path.join(__dirname, "..", "public", "home.html"));
    });
    
    app.get("/survey-basic", function(req, res) {
        console.log("basic survey requested");
        res.sendFile(path.join(__dirname, "..", "public", "survey-basic.html"));
    });

    app.get("/survey-advanced", function(req, res) {
        console.log("extra survey requested");
        res.sendFile(path.join(__dirname, "..", "public", "survey-advanced.html"));
    });

    app.get("/welcome", function(req, res) {
        console.log("welcome to friendFinder!");
        res.sendFile(path.join(__dirname, "..", "public", "welcome.html"));
    });
};
