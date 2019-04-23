express = require("express");
app = express();
path = require("path");

// set port
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("app/public"));


app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "app", "public", "home.html"));
});

app.get("/quiz", function(req, res) {
    console.log("quiz requested");
    res.sendFile(path.join(__dirname, "app", "public", "survey.html"));
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});
