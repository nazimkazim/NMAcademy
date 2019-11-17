const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const firebase = require("firebase");

//require("firebase/auth");
//require("firebase/database");
//require("firebase/firestore");
//require("firebase/messaging");
//require("firebase/functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//var serviceAccount = require("./credKey.json");

var firebaseConfig = {
  apiKey: "AIzaSyBMz-NYCPoc_vD2n4vUDl7_zlvDXam6slE",
  authDomain: "social-apes-7db9c.firebaseapp.com",
  databaseURL: "https://social-apes-7db9c.firebaseio.com",
  projectId: "social-apes-7db9c",
  storageBucket: "social-apes-7db9c.appspot.com",
  messagingSenderId: "887458792299",
  appId: "1:887458792299:web:1c594f3cb981e5d74e022e",
  measurementId: "G-RNB7M63CT9"
};

firebase.initializeApp(firebaseConfig);

// Initialize the app with a service account, granting admin privileges
/*admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://<database name>.firebaseio.com"
});*/

app.get("/screams", (req, res) => {
  admin
    .firestore()
    .collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandler: doc.data().userHandler,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(screams);
    })
    .catch(err => console.error(err));
});

app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandler: req.body.userHandler,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});

exports.api = functions.https.onRequest(app);
