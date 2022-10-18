const functions = require("firebase-functions");

const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require("express");
const cors = require("cors");
const { error } = require("firebase-functions/logger");

// Main App

const app = express();
app.use(cors({origin: true}));

// Main database reference
const db = admin.firestore();

// Routes
app.get("/", (req, res) => {
    return res.status(200).send("Hello What up");
});

// create -> post for auth
app.post("/api/signin", (req, res) => {
  (async () => {
    try {
      await db.collection('authentication').doc("/"+req.body.id+"/").create({
        username: req.body.username,
        password: req.body.password,
      });
      return res.status(200).send({status: "Success", msg: "Data Saved"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// Create -> post()
app.post("/api/create", (req, res) => {
  (async () => {
    try {
      await db.collection('students').doc("/"+req.body.id+"/").create({
        // userid: req.body.userid,
        Title: req.body.Title,
        Faculty: req.body.Faculty,
        Campus: req.body.Campus,
        Name: req.body.Name,
        Major: req.body.Major,
        Status: req.body.Status,
        Study_level: req.body.Study_level,
      });
      return res.status(200).send({status: "Success", msg: "Data Saved"});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

// get -> get()
app.get("/api/get/:id", (req, res) => {
  (async () => {
    try {
      // auth doc = student doc?

      const reqDoc = db.collection("students").doc(req.params.id);
      let students = await reqDoc.get();
      let response = students.data();
      
      console.log(response);
      return res.status(200).send({status: "Success", data: response});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

app.get("/api/getAll", (req, res) => {
  (async () => {
    try {
      const query = db.collection("students");
      let response = [];

      await query.get().then((data) => {
        let docs = data.docs;

        docs.map((doc) => {
          const selectedItem = {
            Title: doc.data().Title,
            Faculty: doc.data().Faculty,
            Campus: doc.data().Campus,
            Name: doc.data().Name,
            Major: doc.data().Major,
            Status: doc.data().Status,
            Study_level: doc.data().Study_level,
          };
          response.push(selectedItem);
        });
        return response;
      });
      return res.status(200).send({status: "Success", data: response});
    } catch (error) {
      console.log(error);
      return res.status(500).send({status: "Failed", msg: error});
    }
  })();
});

//  Update -> put()

// Delete -> delete()

// export the api to firebase cloud functions

exports.auth = functions.https.onRequest(app);
