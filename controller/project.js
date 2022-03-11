const db = require('../firebase-config/connectFirebase');
var FielValue = require("firebase-admin").firestore.FieldValue;
var uuid = require('uuid');
const _ = require("lodash")
const Project = db.collection("projects")
const Cards = db.collection("cards")
const Columns = db.collection("columns")
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
        backGround: backGround[getRandomInt()],
        columns: 0,
        cards: 0,
    }
    Project
        .add(newProject)
        .then(rs => {
            Project.doc(rs.id).update({
                id: rs.id,
            })
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
    const snapshot = await Project.doc(id).get()
    const listUser = await User.get()
    const Columndata = await Columns.where("idProject", "==", id).get()

    const user = listUser.docs.map(doc => {
        const { id, displayName, avatar } = doc.data()
        return {
            id, displayName, avatar
        }
    }
    )
    const newManager = snapshot.data().memberManager.map(item => {
        return _.find(user, ["id", item])
    })
    const newNomarl = snapshot.data().memberNomarl.map(item => {
        return _.find(user, ["id", item])
    })

    const rs = {
        ...snapshot.data(),
        memberNomarl: newNomarl,
        memberManager: newManager
    }
    const cards = await Cards.get()
    const listCards = cards.docs.map(doc => doc.data())

    const newlistCard = listCards.map(item => {
        const newMaker = item.maker.map(m => {
            return _.find(user, ["id", m])
        })
        return {
            ...item,
            maker: newMaker
        }

    })

    const obj = {}
    const listProcess = Columndata.forEach(doc => {
        return obj[doc.id] = doc.data()
    })
    var sortable = [];

    for (var vehicle in obj) {
        const cardItem = newlistCard.filter(item => item.idProcess === vehicle)
        obj[vehicle].item = cardItem
        sortable.push([vehicle, obj[vehicle]]);
    }

    sortable.sort(function (a, b) {
        return a[1].stt - b[1].stt;
    });
    const obj1 = Object.fromEntries(sortable);

    res.json({
        infor: rs,
        columns: obj1
    })

}

const addProcess = async (req, res, next) => {
    const { id, name } = req.body
    const snapshot = await Project.doc(id).get()
    const add = await Columns.add({
        idProject: id,
        name: name,
        item: [],
        stt: snapshot.data().columns
    })
    Project.doc(id).update({
        columns: FielValue.increment(1)
    })
    const dataAdd = await Columns.doc(add.id).get()
    res.json({
        [add.id]: dataAdd.data()
    })
}

const deleteProcess = async (req, res, next) => {
    const { id } = req.body

    Columns.doc(id).delete()

    res.json("delete success")

}

const createCard = async (req, res, next) => {
    const data = req.body
    const newMaker = data.maker.map(user => user.id)
    data.maker = newMaker
    const card = await Cards.add(data)
    const updatecard = Cards.doc(card.id).update({
        id: card.id
    })

    res.json(card.id)

}

const updateCardlocation = async (req, res, next) => {
    const { source, des, item } = req.body
    const updateCard = await Cards.doc(item.id).update({
        idProcess: des
    })
    res.json("ok")
}

module.exports = {
    createProject,
    findProject,
    getProject,
    addProcess,
    deleteProcess,
    createCard,
    updateCardlocation
}