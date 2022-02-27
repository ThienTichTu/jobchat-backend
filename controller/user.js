const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;

let User = db.collection("users");

const addFriend = (req, res, next) => {
    const { myid, idref } = req.body;
    User.doc(myid).update({
        friend: FielValue.add(db.doc(`users/${idref}`))
    })
    res.json("add friend")
}

const unFriend = (req, res, next) => {
    // console.log(req.body)
    // User.doc("f1AMNy2dfgof6ObERZ9F").update({
    //     friend: FielValue.delete(db.doc('users/FBD7WHzQ6rhQR85kOHpU'))
    // })
    res.json("un friend")
}

const uploadAvatar = (req, res, next) => {
    console.log("upload avatar...")
    var url = req.file ? url = req.file.filebaseUrl : url = "rong"

    res.json(url)
}

const updateInfor = (req, res, next) => {
    console.log("upload ....")
    const { password, avatar, id, friendPending, friends, ...data } = req.body

    User.doc(id).update(data)
        .then(rs => {
            return res.json("update succesfuly")
        })
        .catch(err => next(err))


}

module.exports = {
    addFriend,
    unFriend,
    uploadAvatar,
    updateInfor
}