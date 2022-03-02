var FielValue = require("firebase-admin").firestore.FieldValue;


const getData_Byid = async (colection, id) => {
    const doc = await colection.doc(id).get()

    return doc.data()
}

const addFriend_Byid = async (colection, idUserAdd, idUser) => {
    console.log()
    // Cap nhat danh sach ban be
    const upDateUser1 = await colection.doc(idUser).update({
        friends: FielValue.arrayUnion(idUserAdd)
    })
    // Cap nhat danh sach ban be nguoi add
    const upDateUser2 = await colection.doc(idUserAdd).update({
        friends: FielValue.arrayUnion(idUser)
    })
}

const findUser_Online = async (colection, idUser) => {
    const data = await colection.where("id", "==", idUser).get()
    const isUser = data.docs.map(doc => doc.id)
    if (isUser[0]) {
        const doc = await colection.doc(isUser[0]).get()
        const socketId = doc.data().idSocket
        return socketId

    } else {
        return "user offline"

    }
}

const getListIdUserOnline = async (colection, listUser) => {
    const listFriend = [];

    const listUserOnline = await colection.get()

    listUserOnline.forEach(doc => {

        if (listUser.includes(doc.data().id)) {
            listFriend.push(doc.data().id)
        }
    });
    return listFriend
}

module.exports = {
    getData_Byid,
    addFriend_Byid,
    findUser_Online,
    getListIdUserOnline
}