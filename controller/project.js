const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;
var uuid = require('uuid');
const _ = require("lodash")
const Project = db.collection("projects")
const User = db.collection("users")
const backGround = [
    "https://storage.googleapis.com/jobchat-35964.appspot.com/1646710434922.jpg",
    "https://storage.googleapis.com/jobchat-35964.appspot.com/1646710485299.jpg",
    "https://storage.googleapis.com/jobchat-35964.appspot.com/1646710501787.jpg",
    "https://storage.googleapis.com/jobchat-35964.appspot.com/1646710518364.jpg"
]

function getRandomInt() {
    return Math.floor(Math.random() * backGround.length);
}

const createProject = (req, res, next) => {
    const { name, member } = req.body
    var date = new Date();
    const minute = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const time = `${date.getHours()}:${minute} ${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`

    const memberManager = _.filter(member, (user) => user.role == "Quản trị viên").map(data => data.id)
    const memberNomarl = _.filter(member, (user) => user.role == "Thành viên").map(data => data.id)

    const newProject = {
        name: name,
        memberManager: memberManager,
        memberNomarl: memberNomarl,
        date_create: time,
        id: uuid.v4(),
        backGround: backGround[getRandomInt()],
    }
    Project
        .add(newProject)
        .then(rs => {
            res.json("create success")
        })
        .catch(err => console.log(err))

}

const findProject = async (req, res, next) => {
    const id = req.session.user
    try {
        const snapshot = await Project.get()

        const listProject = snapshot.docs.map(doc => doc.data())

        const data = _.filter(listProject, function (p) {
            if (p.memberManager.includes(id) || p.memberNomarl.includes(id)) {
                return p.name
            } else {
                return false
            }
        });
        const listUser = await User.get()
        const user = listUser.docs.map(doc => {
            const { id, displayName, avatar } = doc.data()
            return {
                id, displayName, avatar
            }
        }
        )
        const newData = data.map((doc) => {
            const newManager = doc.memberManager.map(item => {
                return _.find(user, ["id", item])
            })
            const newNomarl = doc.memberNomarl.map(item => {
                return _.find(user, ["id", item])
            })
            return {
                ...doc,
                memberNomarl: newNomarl,
                memberManager: newManager
            }
        })
        res.json(newData)

    }
    catch (err) {
        console.log(err)
    }
}

module.exports = {
    createProject,
    findProject
}