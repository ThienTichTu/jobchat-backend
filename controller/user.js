const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;

const User = db.collection("users");
const ChatRoom = db.collection("chatRooms")
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
const getFriend = async (req, res, next) => {
    const snapshot = await User.doc(req.session.user).get()
    const listUser = await User.get()
    const friendArray = snapshot.data().friends
    const listFriend = [];

    listUser.forEach(doc => {

        if (friendArray.includes(doc.id)) {
            listFriend.push({
                displayName: doc.data().displayName,
                id: doc.data().id,
                avatar: doc.data().avatar,
            })
        }
    });
    res.json(listFriend)
}

const getChatRoom = async (req, res, next) => {
    const { idFriend, idUser } = req.body
    const snapshot = await ChatRoom.get()

    let dataChat = [];
    const docs = snapshot.forEach(doc => {
        const data = doc.data();
        if (data.state == "P2P" && data.member.includes(idFriend) && data.member.includes(idUser)) {

            dataChat = [...data.data]
        }
    })


    res.json(dataChat)


}

module.exports = {
    addFriend,
    unFriend,
    uploadAvatar,
    updateInfor,
    findUser,
    getMessUser,
    getFriend,
    getChatRoom
}