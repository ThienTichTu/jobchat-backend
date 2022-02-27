var admin = require("firebase-admin");
// const functions = require('firebase-functions');
var serviceAccount = require("../firebase-config/serviceAcoutKey.json");
const BUCKET = "jobchat-35964.appspot.com"
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET
});




const db = admin.firestore();
module.exports = db;