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
        column: 0
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

const getProject = async (req, res, next) => {
    const { id } = req.params
    const snapshot = await Project.where("id", "==", id).get()
    const listUser = await User.get()
    const user = listUser.docs.map(doc => {
        const { id, displayName, avatar } = doc.data()
        return {
            id, displayName, avatar
        }
    }
    )
    const data = snapshot.docs.map((doc) => {
        const newManager = doc.data().memberManager.map(item => {
            return _.find(user, ["id", item])
        })
        const newNomarl = doc.data().memberNomarl.map(item => {
            return _.find(user, ["id", item])
        })

        return {
            ...doc.data(),
            memberNomarl: newNomarl,
            memberManager: newManager
        }
    })
    res.json(data[0])
}

const addProcess = async (req, res, next) => {
    const { id, name } = req.body
    const idcolumn = uuid.v4()
    const data = await Project.where("id", "==", id).get()
    const idProject = data.docs.map(doc => {
        return {
            id: doc.id,
            stt: doc.data().column
        }
    })
    const newProcess = {
        [idcolumn]: {
            name: name,
            item: [],
            stt: idProject[0].stt
        }
    }
    const update = await Project.doc(idProject[0].id).update(newProcess, { merge: true })
    const update2 = await Project.doc(idProject[0].id).update({
        column: FielValue.increment(1)
    })
    res.json(newProcess)
}

const deleteProcess = async (req, res, next) => {
    const { id, idproject } = req.body
    const snapshot = await Project.where("id", "==", idproject).get()

    const idProject = snapshot.docs.map(doc => {
        return {
            id: doc.id,
            dataDelete: {
                [id]: doc.data()[id]
            }
        }
    })

    const update = await Project.doc(idProject[0].id).update({
        [id]: FielValue.delete()
    })
    res.json(idProject[0].dataDelete)
}

module.exports = {
    createProject,
    findProject,
    getProject,
    addProcess,
    deleteProcess
}