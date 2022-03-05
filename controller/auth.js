
const db = require('../firebase-config/connectFirebase');

let User = db.collection("users");

const bcrypt = require('bcrypt');
const saltRounds = 10;
const getAuth = async (req, res, next) => {
    const doc = await User.doc(req.session.user).get();

    const { password, ...user } = doc.data()

    res.json(user)


}

const registerUser = async (req, res, next) => {
    const { username, password, displayName } = req.body;
    let passhash = await bcrypt.hash(password, saltRounds);
    const imgPhoto = "https://storage.googleapis.com/jobchat-35964.appspot.com/1645963594823.png"
    const newUser = {
        userName: username,
        password: passhash,
        displayName: displayName,
        friends: [],
        Message: [],
        decriptions: "",
        company: "",
        address: "",
        phone: "",
        avatar: imgPhoto,
        face: "",
        twitter: "",
        telegram: ""
    }
    User
        .add(newUser)
        .then(user => {
            User.doc(user.id).update({ id: user.id })

            res.json("create success")
        })
        .catch(err => next(err))


}

const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
    const snapshot = await User.where('userName', '==', username).get();
    if (snapshot.empty) {
        res.json("mat khau khong dung")
    }

    let user = snapshot.docs.map(doc => doc.data())
    const match = await bcrypt.compare(password, user[0].password);
    if (match) {
        req.session.user = user[0].id
        const doc = await User.doc(user[0].id).get();

        const { password, ...userInfor } = doc.data()

        res.json(userInfor)

    } else {
        res.json("mat khau khong dung")
    }

}

const logoutUser = (req, res, next) => {
    req.session.destroy();
    res.json("logout ok")
}

module.exports = {
    getAuth,
    registerUser,
    loginUser,
    logoutUser
}