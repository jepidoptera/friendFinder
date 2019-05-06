// jshint esversion: 6

class Friend {
    constructor(username, password, email, location, gender, age, answersData) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.location = location;
        this.gender = gender;
        this.age = age;
        this.answersData = answersData;
    }
}

var firebase = require('firebase');
var friends = {};
var thisUser = {};

module.exports = {
    init: () => {
        // let's use firebase to track users and their answers
        // Initialize Firebase
        let config = {
            apikey: process.env.apikey,
            // yes, I repurposed the click-counter app
            authDomain: "click-counter-15423.firebaseapp.com",
            databaseURL: "https://click-counter-15423.firebaseio.com",
            projectId: "click-counter-15423",
            storageBucket: "click-counter-15423.appspot.com",
            messagingSenderId: "905946912811"
        };

        firebase.initializeApp(config);
        var dataRef = firebase.database().ref();
        
        dataRef.on('child_added', (user) => {
            // add user.val().username as a key in our "friends" object
            user = user.val();
            // add all the data about this person
            friends[user.username] = user;
            console.log("found user " + user.username);
        });        
    },

    uploadSurveyData: (username, data) => {
        firebase.database().ref(username + "/answersData").set(data);
    },

    newUser: (newUser) => {
        // fail if this user already exists
        if (friends[newUser.username]) {
            return "!user exists already.";
        }
        // passwords must match
        else if (newUser.password != newUser.confirmPassword) {
            return "!passwords do not match.";
        }
        // no re-using email addresses
        else if (Object.keys(friends).reduce((truth, key) => 
        {return truth || friends[key].email == newUser.email;}, false)) {
            return "!email address is already registered.";
        }
        else if (newUser.location.toLowerCase() != "minneapolis") {
            return "!this service is currently only available in minneapolis.";
        }
        console.log(newUser.username);
        // upload the new user to firebase
        // which also automatically adds them to the local object container
        firebase.database().ref(newUser.username).set(newUser).then(() => {
            // after which we can officially log them in
            this.login(newUser, newUser.password);
        });
        return true;
    },

    login: (username, password) => {
        // find the user
        thisUser = friends[username];
        if (!thisUser) {
            return "!user " + username + " not found.";
        }
        else if (thisUser.password != password) {
            return "!password for user " + username + " is incorrect.";
        }
        // passed checks
        // assign an auth token
        var authToken = randomHexNumber(8);
        firebase.database().ref(username + "/authToken").set(authToken);
        return authToken;
    },

    authorize: (authToken) => {
        // just check if the auth token matches
        if (thisUser.authToken == authToken) return true;
        return false;
    },
};

function randomHexNumber(length) {
    // get a random hexadecimal number of the specified length
    var returnVal = "";
    for (i = 0; i < length; i++) {
        returnVal += "1234567890abcdef"[Math.floor(Math.random() * 16)];
    }
    return returnVal;
}    


 