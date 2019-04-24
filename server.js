// jshint esversion: 6
express = require("express");
app = express();

// set port
var PORT = process.env.PORT || 8080;

// set express parameters
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("app/public"));

// get our routes
require('./app/routing/htmlRoutes')();
require('./app/routing/apiRoutes')();

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});

