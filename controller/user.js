const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;

let User = db.collection("users");

const addFriend = (req, res, next) => {
    const { idUser } = req.body

    User.doc(idUser).update({
        friendPending: FielValue.arrayUnion(req.session.user)
    })
        .then(rs => {
            res.json("add friend")

        })
        .catch(err => console.log(err));
}

const unFriend = (req, res, next) => {
    // console.log(req.body)
    // User.doc("f1AMNy2dfgof6ObERZ9F").update({
    //     friend: FielValue.delete(db.doc('users/FBD7WHzQ6rhQR85kOHpU'))
    // })
    res.json("un friend")
}

const uploadAvatar = async (req, res, next) => {
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

const findUser = async (req, res, next) => {
    const { phone } = req.params
    const snapshot = await User.where("phone", "==", phone).get()
    if (snapshot.empty) {
        res.json(["skip"])
    } else {
        const result = snapshot.docs.map(doc => {
            if (doc.id != req.session.user) {
                const { id, avatar, username, displayName } = doc.data()
                return {
                    id, avatar, username, displayName
                }
            } else {
                return "skip"
            }
        });
        res.json(result)

    }
}

const getMessUser = async (req, res, next) => {
    console.log(req.session.user)
    const snapshot = await User.doc(req.session.user).get()
    const data = snapshot.data().Message
    res.json(data)
}

module.exports = {
    addFriend,
    unFriend,
    uploadAvatar,
    updateInfor,
    findUser,
    getMessUser
}