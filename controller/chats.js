const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;

const User = db.collection("users");
const ChatRoom = db.collection("chatRooms")

const uploadImg_Chat = (req, res, next) => {
    console.log("upload img chat...")

    var url = req.file ? url = req.file.filebaseUrl : url = "rong"

    res.json(url)
}

const uploadImg_Chatcard = (req, res, next) => {
    console.log("upload img chat...")

    var url = req.file ? url = req.file.filebaseUrl : url = "rong"

    res.json(url)
}


module.exports = {
    uploadImg_Chat,
    uploadImg_Chatcard
}