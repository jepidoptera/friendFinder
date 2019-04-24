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

module.exports = {
    init: () => {
        // let's use firebase to track users and their answers
        // Initialize Firebase
        let config = {
            apiKey: "AIzaSyA-IJ49_1bVdnZ01x8HI_7B2Xqoj5xavKE",
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

    newUser: (userObject) => {
        // fail if this user already exists
        if (friends[userObject.username]) {
            return "!user exists already.";
        }
        else if (friends[userObject.password != friends[userObject].confirmPassword]) {
            return "!passwords do not match.";
        }
        console.log(userObject.username);
        firebase.database().ref(userObject.username).set(userObject);
        return true;
    },

    login: (username, password) => {
        if (!friends[username]) {
            return "!user " + username + " not found.";
        }
        if (friends[username].password != password) {
            return "!password for user " + username + " is incorrect.";
        }
        // passed checks
        // assign an auth token
        var authToken = randomHexNumber(8);
        firebase.database().ref(username + "/authToken").set(authToken);
        return authToken;
    },

    authorize: (username, authToken) => {
        // just check if the auth token matches
        if (friends[username].authToken == authToken) return true;
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


 