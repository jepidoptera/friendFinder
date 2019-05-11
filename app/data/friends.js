// jshint esversion: 6
var md5 = require('md5');

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
            messagingSenderId: "905946912811",
            appId: "1:905946912811:web:8f9f5d823d251630"
        };
        // Initialize Firebase
        firebase.initializeApp(config);
        var dataRef = firebase.database().ref();
        
        dataRef.on('child_added', (user) => {
            // add user.val().username as a key in our "friends" object
            user = user.val();
            // add all the data about this person
            friends[user.username] = user;
            console.log("found user " + user.username);
            // add tracking for this user
            firebase.database().ref(user.username).on('value', (snap) => {
                var user = snap.val();
                // update value
                friends[user.username] = user;
                console.log("new info on user: " + user.username);
            });
        });        
    },

    uploadSurveyData: (username, authtoken, question, answer) => {
        // upload the answer to this question
        if (authorize(username, authtoken)) {
            console.log("new answer data");
            firebase.database().ref(username + "/answersData/" + question).set(answer);
        }

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
        // hash the password
        var password = newUser.password;
        newUser.password = md5(password);
        // scrub the "confirm password" (which would expose the password in plaintext)
        newUser.confirmPassword = null;
        // upload the new user to firebase
        // which also automatically adds them to the local object container
        firebase.database().ref(newUser.username).set(newUser).then(() => {
            // after which we can officially log them in
            this.login(newUser, password);
        });
        return true;
    },

    editUser: (username, authtoken, password, oldPassword, confirmPassword, gender, age, bio, location, imgURL) => {
        if (!authorize(username, authtoken)) {
            return "!error: bad auth data.";
        }
        if (password) {
            if (md5(oldPassword) != friends[username].password) {
                return "!current password is incorrect.";
            }
            if (password !== confirmPassword) {
                return "!passwords do not match.";
            }
            // update password
            firebase.database().ref(username + "/password").set(md5(password));
        }
        // set new user info
        firebase.database().ref(username + "/gender").set(gender);
        firebase.database().ref(username + "/age").set(age);
        firebase.database().ref(username + "/location").set(location);
        firebase.database().ref(username + "/imgURL").set(imgURL);
        firebase.database().ref(username + "/bio").set(bio);
        return "success";
    },

    login: (username, password) => {
        // find the user
        thisUser = friends[username];
        if (!thisUser) {
            return "!user " + username + " not found.";
        }
        else if (thisUser.password != md5(password)) {
            return "!password for user " + username + " is incorrect.";
        }
        // passed checks
        // assign an auth token
        thisUser.authtoken = randomHexNumber(8);
        firebase.database().ref(username + "/authtoken").set(thisUser.authtoken);
        return thisUser.authtoken;
    },

    getMatches(username, authtoken) {
        // make sure they're properly logged in
        if (!authorize(username, authtoken)) {
            return "!error: bad auth data.";
        }
        //
        var sortedList = [];
        Object.keys(friends).forEach((key, i) => {
            var friend = friends[key];
            if (friend.username != username) {
                // calculate a match percentage for each possible "friend"
                // store only username and match percent - the rest can be looked up as needed
                sortedList[i] = { username: friend.username };
                sortedList[i].matchPercent = getMatchPercent(friend.username, username);
            }
        });

        // sort them according to how well matched they are
        sortedList = sortedList.sort((a, b) => { return b.matchPercent - a.matchPercent; });

        // upload these to firebase for later
        firebase.database().ref(username + "/matches").set(sortedList);

        return sortedList;
    },

    getMatchPercent(user1, user2) {
        return getMatchPercent(user1, user2);
    },

    user: (name) => { return friends[name]; },

    all: () => {return friends; },
};

function randomHexNumber(length) {
    // get a random hexadecimal number of the specified length
    var returnVal = "";
    for (i = 0; i < length; i++) {
        returnVal += "1234567890abcdef"[Math.floor(Math.random() * 16)];
    }
    return returnVal;
}    

function getMatchPercent(user1, user2) {
    var answersInCommon = 0;
    return friends[user1].answersData ?
        Object.keys(friends[user1].answersData).reduce((sum, key) => {
            // no match possible without answering some questions
            if (!friends[user2].answersData) return 0;
            // add up all the answers they have in common with this user
            if (friends[user1].answersData[key] && friends[user2].answersData[key])
                answersInCommon++;
            // add one if they have the same answer, none if not
            return friends[user1].answersData[key] == friends[user2].answersData[key]
                ? sum + 1 : sum;
        }, 0)
        // divided by the number of questions they have both answered, to give a percentage
        * 100 / (answersInCommon ? answersInCommon : 1)
        // or, if there is no answersData for this person...
        : 0;
}

function authorize(username, authtoken) {
    console.log("authorizing user " + username + " with token : " + authtoken);
    // just check if the auth token matches
    if (!friends[username]) {
        console.log("nonexistent user.");
        return false;
    }
    if (friends[username].authtoken !== authtoken) {
        console.log("bad auth token.");
        return false;
    }
    // passed checks
    return true;
}

