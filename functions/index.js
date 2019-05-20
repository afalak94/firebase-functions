const functions = require('firebase-functions');

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

// The Firebase Admin SDK to access the Firebase Realtime Database.
//const express = require('express');
const admin = require('firebase-admin');
// CORS Express middleware to enable CORS Requests.
const cors = require('cors')({
  origin: true
});
admin.initializeApp();

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.getUserByUid = functions.https.onRequest((req, res) => {
  // Get the user record
  return cors(req, res, () => {
    // Grab the uid text parameter.
    const UserUid = req.query.text;
    console.log(UserUid);

    admin
      .auth()
      .getUser(UserUid)
      .then(userRecord => {
        return res.status(200).send(userRecord.toJSON());
      })
      .catch(error => {
        return res.send('Error fetching user data:', error);
      });
  });
});

exports.getAllUsers = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    var allUsers = [];

    admin
      .auth()
      .listUsers()
      .then(function(listUsersResult) {
        listUsersResult.users.forEach(function(userRecord) {
          // For each user
          var userData = userRecord.toJSON();
          allUsers.push(userData);
        });
        res.status(200).send(JSON.stringify(allUsers));
      })
      .catch(function(error) {
        console.log('Error listing users:', error);
        res.status(500).send(error);
      });
  });
});

exports.deleteUser = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    const UserUid = req.query.text;
    admin
      .auth()
      .deleteUser(UserUid)
      .then(() => {
        res.status(200).send('Successfully deleted user');
        console.log('Successfully deleted user');
      })
      .catch(error => {
        console.log('Error deleting user:', error);
      });
  });
});
